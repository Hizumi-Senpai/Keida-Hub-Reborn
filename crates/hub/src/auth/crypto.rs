#![forbid(unsafe_code)]

use argon2::{Algorithm, Argon2, Params, PasswordHash, PasswordHasher, PasswordVerifier, Version};
use hmac::{Hmac, KeyInit, Mac};
use sha2::{Digest, Sha256};
use std::{
    fs::{self, File, OpenOptions},
    io::{Read, Write},
    os::{
        fd::AsRawFd,
        unix::fs::{MetadataExt, OpenOptionsExt, PermissionsExt},
    },
    path::{Component, Path, PathBuf},
    sync::Arc,
};
use subtle::ConstantTimeEq;
use tokio::sync::Semaphore;
use zeroize::Zeroizing;

const FORM_TTL: u64 = 600;
const COOKIE_DOMAIN: &[u8] = b"reborn/form-cookie/v1\0";
const FORM_CSRF_DOMAIN: &[u8] = b"reborn/form-csrf/v1\0";
const SESSION_CSRF_DOMAIN: &[u8] = b"reborn/session-csrf/v1\0";
const BUCKET_DOMAIN: &[u8] = b"reborn/login-bucket/v1\0";
const KEY_DOMAIN: &[u8] = b"reborn/instance-key/v1\0";
const PHC_PREFIX: &str = "$argon2id$v=19$m=19456,t=2,p=1$";
static PASSWORD_JOBS: Semaphore = Semaphore::const_new(2);

// Generic error values deliberately contain no paths, credentials or payloads.
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum CryptoError {
    Invalid,
    Busy,
    Unavailable,
}

// Deliberately no Debug: this owns the instance key and a password verifier.
pub struct Secrets {
    key: Zeroizing<[u8; 32]>,
    dummy_phc: Zeroizing<String>,
}

impl Secrets {
    /// A fresh256-bit subkey salt per envelope makes each derived AEAD key a
    /// single-encryption key. A random96-bit nonce provides a second boundary.
    pub fn seal_connection(&self, revision: i64, plaintext: &[u8]) -> Result<Vec<u8>, CryptoError> {
        use ring::aead::{Aad, CHACHA20_POLY1305, LessSafeKey, Nonce, UnboundKey};
        if revision <= 0 || plaintext.is_empty() || plaintext.len() > 30000 {
            return Err(CryptoError::Invalid);
        }
        let mut salt = [0u8; 32];
        let mut nonce = [0u8; 12];
        getrandom::fill(&mut salt).map_err(|_| CryptoError::Unavailable)?;
        getrandom::fill(&mut nonce).map_err(|_| CryptoError::Unavailable)?;
        let key = Zeroizing::new(self.mac(b"reborn/crafty/encryption-key/v1\0", &salt));
        let cipher = LessSafeKey::new(
            UnboundKey::new(&CHACHA20_POLY1305, key.as_ref())
                .map_err(|_| CryptoError::Unavailable)?,
        );
        let aad = connection_aad(revision);
        let mut body = plaintext.to_vec();
        cipher
            .seal_in_place_append_tag(
                Nonce::assume_unique_for_key(nonce),
                Aad::from(aad),
                &mut body,
            )
            .map_err(|_| CryptoError::Unavailable)?;
        let mut out = Vec::with_capacity(45 + body.len());
        out.push(1);
        out.extend_from_slice(&salt);
        out.extend_from_slice(&nonce);
        out.extend(body);
        Ok(out)
    }

    pub fn open_connection(
        &self,
        revision: i64,
        sealed: &[u8],
    ) -> Result<Zeroizing<Vec<u8>>, CryptoError> {
        use ring::aead::{Aad, CHACHA20_POLY1305, LessSafeKey, Nonce, UnboundKey};
        if revision <= 0 || !(62..=30100).contains(&sealed.len()) || sealed[0] != 1 {
            return Err(CryptoError::Invalid);
        }
        let key = Zeroizing::new(self.mac(b"reborn/crafty/encryption-key/v1\0", &sealed[1..33]));
        let cipher = LessSafeKey::new(
            UnboundKey::new(&CHACHA20_POLY1305, key.as_ref())
                .map_err(|_| CryptoError::Unavailable)?,
        );
        let nonce: [u8; 12] = sealed[33..45]
            .try_into()
            .map_err(|_| CryptoError::Invalid)?;
        let mut body = Zeroizing::new(sealed[45..].to_vec());
        let size = cipher
            .open_in_place(
                Nonce::assume_unique_for_key(nonce),
                Aad::from(connection_aad(revision)),
                &mut body,
            )
            .map_err(|_| CryptoError::Invalid)?
            .len();
        body.truncate(size);
        Ok(body)
    }
    pub fn from_file(path: &Path) -> Result<Arc<Self>, CryptoError> {
        let key = read_key(path)?;
        // Construction occurs before listening. It also observes the same
        // process-wide work limit if called while password jobs already exist.
        let _permit = PASSWORD_JOBS.try_acquire().map_err(|_| CryptoError::Busy)?;
        let dummy_phc = Zeroizing::new(hash_sync(b"reborn-unknown-user-not-a-credential")?);
        Ok(Arc::new(Self { key, dummy_phc }))
    }

    pub fn init_key(path: &Path) -> Result<(), CryptoError> {
        let mut key = Zeroizing::new([0u8; 32]);
        getrandom::fill(key.as_mut()).map_err(|_| CryptoError::Unavailable)?;
        create_private(path, key.as_ref())
    }

    pub fn write_private_token(path: &Path, token: &str) -> Result<(), CryptoError> {
        canonical_token(token)?;
        create_private(path, token.as_bytes())
    }

    pub fn fingerprint(&self) -> Vec<u8> {
        let mut hash = Sha256::new();
        hash.update(KEY_DOMAIN);
        hash.update(self.key.as_ref());
        hash.finalize().to_vec()
    }

    pub fn token() -> Result<String, CryptoError> {
        let mut bytes = Zeroizing::new([0u8; 32]);
        getrandom::fill(bytes.as_mut()).map_err(|_| CryptoError::Unavailable)?;
        Ok(hex(bytes.as_ref()))
    }

    pub fn token_hash(token: &str) -> Result<Vec<u8>, CryptoError> {
        canonical_token(token)?;
        Ok(Sha256::digest(token.as_bytes()).to_vec())
    }

    pub fn constant_equal(left: &[u8], right: &[u8]) -> bool {
        bool::from(left.ct_eq(right))
    }

    pub fn new_form(&self, now: u64) -> Result<(String, String), CryptoError> {
        let unsigned = format!("v1.{now}.{}", Self::token()?);
        let cookie = format!(
            "{unsigned}.{}",
            hex(&self.mac(COOKIE_DOMAIN, unsigned.as_bytes()))
        );
        let csrf = hex(&self.mac(FORM_CSRF_DOMAIN, cookie.as_bytes()));
        Ok((cookie, csrf))
    }

    pub fn verify_form(&self, cookie: &str, csrf: &str, now: u64) -> bool {
        if cookie.len() > 153 || canonical_token(csrf).is_err() {
            return false;
        }
        let mut fields = cookie.split('.');
        let (Some("v1"), Some(issued), Some(nonce), Some(signature), None) = (
            fields.next(),
            fields.next(),
            fields.next(),
            fields.next(),
            fields.next(),
        ) else {
            return false;
        };
        if issued.is_empty()
            || issued.len() > 20
            || !issued.bytes().all(|b| b.is_ascii_digit())
            || (issued.len() > 1 && issued.starts_with('0'))
            || canonical_token(nonce).is_err()
            || canonical_token(signature).is_err()
        {
            return false;
        }
        let Ok(issued_time) = issued.parse::<u64>() else {
            return false;
        };
        if issued_time > now || now - issued_time >= FORM_TTL {
            return false;
        }
        let Some((unsigned, _)) = cookie.rsplit_once('.') else {
            return false;
        };
        let expected_signature = hex(&self.mac(COOKIE_DOMAIN, unsigned.as_bytes()));
        let expected_csrf = hex(&self.mac(FORM_CSRF_DOMAIN, cookie.as_bytes()));
        Self::constant_equal(signature.as_bytes(), expected_signature.as_bytes())
            & Self::constant_equal(csrf.as_bytes(), expected_csrf.as_bytes())
    }

    pub fn session_csrf(&self, token: &str) -> Result<String, CryptoError> {
        canonical_token(token)?;
        Ok(hex(&self.mac(SESSION_CSRF_DOMAIN, token.as_bytes())))
    }

    pub fn verify_session_csrf(&self, token: &str, csrf: &str) -> bool {
        if canonical_token(csrf).is_err() {
            return false;
        }
        self.session_csrf(token)
            .is_ok_and(|expected| Self::constant_equal(expected.as_bytes(), csrf.as_bytes()))
    }

    pub fn login_bucket(&self, username: &str) -> u8 {
        self.mac(BUCKET_DOMAIN, username.as_bytes())[0] % 64 + 1
    }

    pub async fn hash_password(&self, password: String) -> Result<String, CryptoError> {
        let password = Zeroizing::new(password);
        valid_password(&password)?;
        password_job(move || hash_sync(password.as_bytes())).await
    }

    pub async fn verify_password(
        &self,
        password: String,
        phc: Option<String>,
    ) -> Result<bool, CryptoError> {
        let password = Zeroizing::new(password);
        valid_password(&password)?;
        let supplied = phc.map(Zeroizing::new);
        let dummy = self.dummy_phc.clone();
        password_job(move || {
            let supplied_valid = supplied
                .as_ref()
                .is_some_and(|phc| validate_phc(phc).is_ok());
            if supplied_valid {
                verify_sync(
                    password.as_bytes(),
                    supplied.as_ref().ok_or(CryptoError::Unavailable)?,
                )
            } else {
                // Unknown users and malformed persisted hashes incur the same
                // bounded Argon2 cost. A corrupt hash is never attempted.
                let _ = verify_sync(password.as_bytes(), &dummy)?;
                if supplied.is_some() {
                    Err(CryptoError::Unavailable)
                } else {
                    Ok(false)
                }
            }
        })
        .await
    }

    fn mac(&self, domain: &[u8], value: &[u8]) -> [u8; 32] {
        // HMAC-SHA256 accepts every key length, including this fixed32-byte key.
        let mut mac =
            Hmac::<Sha256>::new_from_slice(self.key.as_ref()).expect("fixed HMAC key length");
        mac.update(domain);
        mac.update(value);
        mac.finalize().into_bytes().into()
    }
}

fn connection_aad(revision: i64) -> Vec<u8> {
    let mut aad = b"keida-hub-reborn/crafty/connection/v1\0".to_vec();
    aad.extend_from_slice(&revision.to_be_bytes());
    aad
}

async fn password_job<T: Send + 'static>(
    work: impl FnOnce() -> Result<T, CryptoError> + Send + 'static,
) -> Result<T, CryptoError> {
    let permit = PASSWORD_JOBS.try_acquire().map_err(|_| CryptoError::Busy)?;
    tokio::task::spawn_blocking(move || {
        // The blocking task owns this permit. Dropping/cancelling the awaiting
        // HTTP future cannot release it while the work continues.
        let _permit = permit;
        work()
    })
    .await
    .map_err(|_| CryptoError::Unavailable)?
}

fn valid_password(password: &str) -> Result<(), CryptoError> {
    if password.len() <= 512 && (15..=128).contains(&password.chars().count()) {
        Ok(())
    } else {
        Err(CryptoError::Invalid)
    }
}

fn argon() -> Result<Argon2<'static>, CryptoError> {
    let params = Params::new(19456, 2, 1, Some(32)).map_err(|_| CryptoError::Unavailable)?;
    Ok(Argon2::new(Algorithm::Argon2id, Version::V0x13, params))
}

fn hash_sync(password: &[u8]) -> Result<String, CryptoError> {
    let mut salt = Zeroizing::new([0u8; 16]);
    getrandom::fill(salt.as_mut()).map_err(|_| CryptoError::Unavailable)?;
    let encoded = argon()?
        .hash_password_with_salt(password, salt.as_ref())
        .map_err(|_| CryptoError::Unavailable)?
        .to_string();
    validate_phc(&encoded)?;
    Ok(encoded)
}

fn validate_phc(phc: &str) -> Result<PasswordHash, CryptoError> {
    if phc.len() > 128 || !phc.starts_with(PHC_PREFIX) {
        return Err(CryptoError::Unavailable);
    }
    let remainder = &phc[PHC_PREFIX.len()..];
    let Some((salt, hash)) = remainder.split_once('$') else {
        return Err(CryptoError::Unavailable);
    };
    if salt.len() != 22
        || hash.len() != 43
        || !salt
            .bytes()
            .chain(hash.bytes())
            .all(|b| b.is_ascii_alphanumeric() || b == b'+' || b == b'/')
    {
        return Err(CryptoError::Unavailable);
    }
    let parsed = PasswordHash::new(phc).map_err(|_| CryptoError::Unavailable)?;
    if parsed.salt.as_ref().map(|salt| salt.len()) != Some(16)
        || parsed.hash.as_ref().map(|hash| hash.len()) != Some(32)
        || parsed.to_string() != phc
    {
        return Err(CryptoError::Unavailable);
    }
    Ok(parsed)
}

fn verify_sync(password: &[u8], phc: &str) -> Result<bool, CryptoError> {
    let parsed = validate_phc(phc)?;
    match argon()?.verify_password(password, &parsed) {
        Ok(()) => Ok(true),
        Err(argon2::password_hash::Error::PasswordInvalid) => Ok(false),
        Err(_) => Err(CryptoError::Unavailable),
    }
}

fn canonical_token(token: &str) -> Result<(), CryptoError> {
    if token.len() == 64
        && token
            .bytes()
            .all(|b| b.is_ascii_digit() || (b'a'..=b'f').contains(&b))
    {
        Ok(())
    } else {
        Err(CryptoError::Invalid)
    }
}

fn hex(bytes: &[u8]) -> String {
    const HEX: &[u8; 16] = b"0123456789abcdef";
    let mut output = String::with_capacity(bytes.len() * 2);
    for byte in bytes {
        output.push(HEX[usize::from(byte >> 4)] as char);
        output.push(HEX[usize::from(byte & 15)] as char);
    }
    output
}

fn current_uid() -> Result<u32, CryptoError> {
    // Linux proc metadata supplies the current process owner without unsafe FFI.
    fs::metadata("/proc/self")
        .map(|meta| meta.uid())
        .map_err(|_| CryptoError::Unavailable)
}

fn private_parent(path: &Path) -> Result<(File, PathBuf, u32), CryptoError> {
    if !path.is_absolute()
        || path
            .components()
            .any(|part| matches!(part, Component::ParentDir | Component::CurDir))
    {
        return Err(CryptoError::Invalid);
    }
    let parent = path.parent().ok_or(CryptoError::Invalid)?;
    let name = path.file_name().ok_or(CryptoError::Invalid)?;
    if parent.join(name).as_os_str() != path.as_os_str()
        || fs::canonicalize(parent)
            .map_err(|_| CryptoError::Unavailable)?
            .as_os_str()
            != parent.as_os_str()
    {
        return Err(CryptoError::Invalid);
    }
    let directory = OpenOptions::new()
        .read(true)
        .custom_flags(libc::O_DIRECTORY | libc::O_NOFOLLOW | libc::O_CLOEXEC)
        .open(parent)
        .map_err(|_| CryptoError::Unavailable)?;
    let uid = current_uid()?;
    let metadata = directory.metadata().map_err(|_| CryptoError::Unavailable)?;
    if !metadata.is_dir() || metadata.uid() != uid || metadata.mode() & 0o7777 != 0o700 {
        return Err(CryptoError::Invalid);
    }
    let anchored = PathBuf::from(format!("/proc/self/fd/{}", directory.as_raw_fd())).join(name);
    Ok((directory, anchored, uid))
}

fn private_regular(file: &File, uid: u32, size: u64) -> Result<(), CryptoError> {
    let meta = file.metadata().map_err(|_| CryptoError::Unavailable)?;
    if !meta.is_file()
        || meta.uid() != uid
        || meta.mode() & 0o7777 != 0o600
        || meta.nlink() != 1
        || meta.len() != size
    {
        return Err(CryptoError::Invalid);
    }
    Ok(())
}

fn read_key(path: &Path) -> Result<Zeroizing<[u8; 32]>, CryptoError> {
    let (_directory, anchored, uid) = private_parent(path)?;
    let mut file = OpenOptions::new()
        .read(true)
        .custom_flags(libc::O_NOFOLLOW | libc::O_CLOEXEC | libc::O_NONBLOCK)
        .open(anchored)
        .map_err(|_| CryptoError::Unavailable)?;
    private_regular(&file, uid, 32)?;
    let mut key = Zeroizing::new([0u8; 32]);
    file.read_exact(key.as_mut())
        .map_err(|_| CryptoError::Unavailable)?;
    let mut extra = [0u8; 1];
    if file
        .read(&mut extra)
        .map_err(|_| CryptoError::Unavailable)?
        != 0
    {
        return Err(CryptoError::Invalid);
    }
    private_regular(&file, uid, 32)?;
    Ok(key)
}

fn create_private(path: &Path, bytes: &[u8]) -> Result<(), CryptoError> {
    let (directory, anchored, uid) = private_parent(path)?;
    let mut file = OpenOptions::new()
        .write(true)
        .create_new(true)
        .mode(0o600)
        .custom_flags(libc::O_NOFOLLOW | libc::O_CLOEXEC | libc::O_NONBLOCK)
        .open(anchored)
        .map_err(|_| CryptoError::Unavailable)?;
    // A restrictive inherited umask may remove owner bits; the new file is never
    // broader than0600, and fchmod affects this already-open descriptor only.
    file.set_permissions(fs::Permissions::from_mode(0o600))
        .map_err(|_| CryptoError::Unavailable)?;
    private_regular(&file, uid, 0)?;
    file.write_all(bytes)
        .map_err(|_| CryptoError::Unavailable)?;
    file.sync_all().map_err(|_| CryptoError::Unavailable)?;
    private_regular(&file, uid, bytes.len() as u64)?;
    directory.sync_all().map_err(|_| CryptoError::Unavailable)?;
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::{
        collections::BTreeSet,
        os::unix::fs::symlink,
        sync::atomic::{AtomicU64, Ordering},
    };

    static NEXT: AtomicU64 = AtomicU64::new(0);
    static HASH_TESTS: tokio::sync::Mutex<()> = tokio::sync::Mutex::const_new(());

    struct PrivateDir(PathBuf);

    impl PrivateDir {
        fn new() -> Self {
            let path = std::env::temp_dir().join(format!(
                "reborn-crypto-{}-{}",
                std::process::id(),
                NEXT.fetch_add(1, Ordering::Relaxed)
            ));
            fs::create_dir(&path).unwrap();
            fs::set_permissions(&path, fs::Permissions::from_mode(0o700)).unwrap();
            Self(path)
        }
        fn file(&self, name: &str) -> PathBuf {
            self.0.join(name)
        }
    }

    impl Drop for PrivateDir {
        fn drop(&mut self) {
            let _ = fs::remove_dir_all(&self.0);
        }
    }

    fn form_secrets() -> Secrets {
        Secrets {
            key: Zeroizing::new([1u8; 32]),
            dummy_phc: Zeroizing::new(String::new()),
        }
    }

    #[test]
    fn dedicated_envelopes_authenticate_revision_key_format_and_every_ciphertext_byte() {
        let first = form_secrets();
        let second = Secrets {
            key: Zeroizing::new([2; 32]),
            dummy_phc: Zeroizing::new(String::new()),
        };
        let private = b"{\"token\":\"deliberately-fake-native-token\"}";
        let a = first.seal_connection(7, private).unwrap();
        let b = first.seal_connection(7, private).unwrap();
        assert_ne!(a, b);
        assert_ne!(&a[1..33], &b[1..33]);
        assert!(!a.windows(private.len()).any(|w| w == private));
        assert_eq!(first.open_connection(7, &a).unwrap().as_slice(), private);
        assert!(first.open_connection(8, &a).is_err());
        assert!(second.open_connection(7, &a).is_err());
        for position in 0..a.len() {
            let mut bad = a.clone();
            bad[position] ^= 1;
            assert!(first.open_connection(7, &bad).is_err());
        }
        for length in 0..a.len() {
            assert!(first.open_connection(7, &a[..length]).is_err());
        }
        assert!(first.seal_connection(0, private).is_err());
    }

    #[test]
    fn canonical_tokens_have_full_entropy_bytes_and_sha256_verifiers() {
        let mut seen = BTreeSet::new();
        for _ in 0..64 {
            let token = Secrets::token().unwrap();
            assert_eq!(token.len(), 64);
            assert_eq!(
                Secrets::token_hash(&token).unwrap(),
                Sha256::digest(token.as_bytes()).to_vec()
            );
            assert!(seen.insert(token));
        }
        for invalid in [
            "",
            "abc",
            &"A".repeat(64),
            &"f".repeat(63),
            &format!("{}\n", "a".repeat(64)),
            &"é".repeat(32),
        ] {
            assert_eq!(Secrets::token_hash(invalid), Err(CryptoError::Invalid));
        }
        assert!(Secrets::constant_equal(b"same", b"same"));
        assert!(!Secrets::constant_equal(b"same", b"samp"));
        assert!(!Secrets::constant_equal(b"same", b"same\0"));
    }

    #[test]
    fn frozen_wire_domains_expiry_and_cross_form_session_isolation() {
        let secrets = form_secrets();
        let nonce = "ab".repeat(32);
        // Literal independent HMAC-SHA256 vectors for the frozen wire contract.
        let cookie = "v1.100.abababababababababababababababababababababababababababababababab.989f7563ed100defe723b6229a73d962ad8d27e1f43ff694fd44438641bb6663";
        let csrf = "0ebdc904f2d874a540aab1a5b6cb150cd22f6b11b1fa0947668bcd047d8bf1c7";
        let session_csrf = "a0bc3e72d8cca993b4c8925c4227a495ab5c884c1be0a6d81ede723482777b9e";
        assert!(secrets.verify_form(cookie, csrf, 100));
        assert!(secrets.verify_form(cookie, csrf, 699));
        assert!(!secrets.verify_form(cookie, csrf, 99));
        assert!(!secrets.verify_form(cookie, csrf, 700));
        assert_eq!(secrets.session_csrf(&nonce).unwrap(), session_csrf);
        assert!(!secrets.verify_session_csrf(&nonce, csrf));
        assert!(!secrets.verify_form(cookie, session_csrf, 100));
        assert_eq!(secrets.login_bucket("fixture_user"), 51);
        assert_eq!(
            hex(&secrets.fingerprint()),
            "2577d327ba134f44b68a273f9ba6c2289788b2fb0a1eb6b5e2a142238bc20504"
        );
        let (fresh, fresh_csrf) = secrets.new_form(100).unwrap();
        assert!(secrets.verify_form(&fresh, &fresh_csrf, 100));
        assert!(!secrets.verify_form(&fresh, csrf, 100));
        assert!(!secrets.verify_form(cookie, &fresh_csrf, 100));
        let other_key = Secrets {
            key: Zeroizing::new([2u8; 32]),
            dummy_phc: Zeroizing::new(String::new()),
        };
        assert!(!other_key.verify_form(cookie, csrf, 100));
        assert!(!other_key.verify_session_csrf(&nonce, session_csrf));
        assert!(!secrets.verify_session_csrf(&"cd".repeat(32), session_csrf));
        for malformed in [
            cookie.replace("v1.100.", "v1.0100."),
            cookie.replace("v1.100.", "v1.+100."),
            cookie.replace("v1.100.", "v2.100."),
            format!("{cookie}.extra"),
            cookie.replace("abab", "ABAB"),
        ] {
            assert!(!secrets.verify_form(&malformed, csrf, 100));
        }
        for username in ["a", "unknown", "fixture_user", "owner"] {
            assert!((1..=64).contains(&secrets.login_bucket(username)));
        }
    }

    #[test]
    fn key_and_token_files_are_private_create_once_and_failure_never_rotates() {
        let _guard = HASH_TESTS.blocking_lock();
        let dir = PrivateDir::new();
        let key_path = dir.file("instance-key");
        assert!(Secrets::from_file(&key_path).is_err());
        assert!(!key_path.exists());
        Secrets::init_key(&key_path).unwrap();
        let original = fs::read(&key_path).unwrap();
        assert_eq!(original.len(), 32);
        let meta = fs::metadata(&key_path).unwrap();
        assert_eq!(meta.mode() & 0o7777, 0o600);
        assert_eq!(meta.nlink(), 1);
        assert_eq!(meta.uid(), current_uid().unwrap());
        assert!(Secrets::init_key(&key_path).is_err());
        assert_eq!(fs::read(&key_path).unwrap(), original);
        let secrets = Secrets::from_file(&key_path).unwrap();
        let mut independent = Sha256::new();
        independent.update(KEY_DOMAIN);
        independent.update(&original);
        assert_eq!(secrets.fingerprint(), independent.finalize().to_vec());
        let token_path = dir.file("setup-token");
        let token = Secrets::token().unwrap();
        Secrets::write_private_token(&token_path, &token).unwrap();
        assert_eq!(fs::read(&token_path).unwrap(), token.as_bytes());
        assert_eq!(fs::metadata(&token_path).unwrap().mode() & 0o7777, 0o600);
        assert!(Secrets::write_private_token(&token_path, &Secrets::token().unwrap()).is_err());
        assert_eq!(fs::read(&token_path).unwrap(), token.as_bytes());
        assert_eq!(
            Secrets::write_private_token(&dir.file("invalid-token"), "bad"),
            Err(CryptoError::Invalid)
        );
        assert!(!dir.file("invalid-token").exists());
    }

    #[test]
    fn unsafe_file_metadata_and_links_are_rejected() {
        let dir = PrivateDir::new();
        let key = dir.file("key");
        Secrets::init_key(&key).unwrap();
        let linked = dir.file("hardlink");
        fs::hard_link(&key, &linked).unwrap();
        assert!(read_key(&key).is_err());
        assert!(read_key(&linked).is_err());
        fs::remove_file(linked).unwrap();
        let symbolic = dir.file("symlink");
        symlink(&key, &symbolic).unwrap();
        assert!(read_key(&symbolic).is_err());
        assert!(Secrets::init_key(&symbolic).is_err());
        let parent_link = dir.file("linked-parent");
        symlink(&dir.0, &parent_link).unwrap();
        assert!(read_key(&parent_link.join("key")).is_err());
        assert!(Secrets::init_key(&parent_link.join("new-key")).is_err());
        let file = File::open(&key).unwrap();
        assert!(private_regular(&file, current_uid().unwrap().wrapping_add(1), 32).is_err());
        fs::set_permissions(&key, fs::Permissions::from_mode(0o640)).unwrap();
        assert!(read_key(&key).is_err());
        fs::set_permissions(&key, fs::Permissions::from_mode(0o600)).unwrap();
        fs::write(&key, [0u8; 31]).unwrap();
        assert!(read_key(&key).is_err());
        fs::write(&key, [0u8; 33]).unwrap();
        assert!(read_key(&key).is_err());
        assert!(Secrets::init_key(Path::new("relative-key")).is_err());
        fs::set_permissions(&dir.0, fs::Permissions::from_mode(0o750)).unwrap();
        assert!(read_key(&key).is_err());
        assert!(Secrets::init_key(&dir.file("unsafe-parent-key")).is_err());
    }

    #[tokio::test]
    async fn exact_argon_cost_unknown_corrupt_and_wrong_password_behavior() {
        let _guard = HASH_TESTS.lock().await;
        let dummy = hash_sync(b"only-a-dummy-noncredential").unwrap();
        let secrets = Secrets {
            key: Zeroizing::new([3u8; 32]),
            dummy_phc: Zeroizing::new(dummy),
        };
        let password = "fixture password 123".to_owned();
        let first = secrets.hash_password(password.clone()).await.unwrap();
        let second = secrets.hash_password(password.clone()).await.unwrap();
        assert!(first.starts_with(PHC_PREFIX));
        assert_ne!(first, second);
        assert!(
            secrets
                .verify_password(password.clone(), Some(first.clone()))
                .await
                .unwrap()
        );
        assert!(
            !secrets
                .verify_password("wrong fixture password".into(), Some(first.clone()))
                .await
                .unwrap()
        );
        assert!(
            !secrets
                .verify_password("only-a-dummy-noncredential".into(), None)
                .await
                .unwrap()
        );
        for malformed in [
            first.replace("m=19456", "m=4294967295"),
            first.replace("v=19", "v=16"),
            first.replace("argon2id", "argon2i"),
            first.replace("t=2", "t=20"),
            first.replace("p=1", "p=2"),
            first.replace("m=19456,t=2,p=1", "m=19456,t=2,p=1,keyid=AA"),
            format!("{first}$extra"),
        ] {
            assert!(validate_phc(&malformed).is_err());
            assert_eq!(
                secrets
                    .verify_password(password.clone(), Some(malformed))
                    .await,
                Err(CryptoError::Unavailable)
            );
        }
        assert_eq!(
            secrets.hash_password("short".into()).await,
            Err(CryptoError::Invalid)
        );
        assert_eq!(
            secrets.hash_password("a".repeat(129)).await,
            Err(CryptoError::Invalid)
        );
        assert_eq!(
            secrets.verify_password("a".repeat(129), Some(first)).await,
            Err(CryptoError::Invalid)
        );
        assert_eq!(
            secrets.hash_password("é".repeat(6)).await,
            Err(CryptoError::Invalid)
        );
        let unicode = "é".repeat(15);
        let unicode_hash = secrets.hash_password(unicode.clone()).await.unwrap();
        assert!(
            secrets
                .verify_password(unicode, Some(unicode_hash.clone()))
                .await
                .unwrap()
        );
        // Canonically equivalent text is deliberately not normalized; the exact
        // password bytes chosen by the account remain authoritative.
        assert!(
            !secrets
                .verify_password("e\u{301}".repeat(15), Some(unicode_hash))
                .await
                .unwrap()
        );
        let maximum = "😀".repeat(128);
        assert_eq!(maximum.len(), 512);
        let maximum_hash = secrets.hash_password(maximum.clone()).await.unwrap();
        assert!(
            secrets
                .verify_password(maximum, Some(maximum_hash.clone()))
                .await
                .unwrap()
        );
        assert_eq!(
            secrets
                .verify_password("😀".repeat(129), Some(maximum_hash))
                .await,
            Err(CryptoError::Invalid)
        );
    }

    #[test]
    fn password_bounds_count_unicode_scalars_without_character_class_rules() {
        for rejected in [
            "a".repeat(14),
            "a".repeat(129),
            "é".repeat(6),
            "😀".repeat(129),
        ] {
            assert_eq!(valid_password(&rejected), Err(CryptoError::Invalid));
        }
        for accepted in [
            "a".repeat(15),
            "a".repeat(128),
            "é".repeat(15),
            "😀".repeat(128),
            " ".repeat(15),
        ] {
            assert_eq!(valid_password(&accepted), Ok(()));
        }
    }

    #[tokio::test]
    async fn cancelled_waiter_retains_blocking_permit_until_task_finishes() {
        let _guard = HASH_TESTS.lock().await;
        let held = PASSWORD_JOBS.try_acquire().unwrap();
        let (started, begun) = tokio::sync::oneshot::channel();
        let (release, wait) = std::sync::mpsc::channel();
        let parent = tokio::spawn(password_job(move || {
            let _ = started.send(());
            wait.recv().map_err(|_| CryptoError::Unavailable)?;
            Ok(())
        }));
        begun.await.unwrap();
        parent.abort();
        let _ = parent.await;
        assert_eq!(password_job(|| Ok(())).await, Err(CryptoError::Busy));
        assert_eq!(PASSWORD_JOBS.available_permits(), 0);
        release.send(()).unwrap();
        tokio::time::timeout(std::time::Duration::from_secs(2), async {
            while PASSWORD_JOBS.available_permits() == 0 {
                tokio::task::yield_now().await;
            }
        })
        .await
        .unwrap();
        assert_eq!(PASSWORD_JOBS.available_permits(), 1);
        drop(held);
        assert_eq!(PASSWORD_JOBS.available_permits(), 2);
    }
}

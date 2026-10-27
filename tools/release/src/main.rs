//! CORE-only manual release ledger. No daemon, host installer or game authority.
mod image;
mod recovery;
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::{
    fs::{self, File, OpenOptions},
    io::{Read, Write},
    os::unix::fs::{DirBuilderExt, MetadataExt, OpenOptionsExt, PermissionsExt},
    path::{Path, PathBuf},
    process::Command,
};
type Result<T> = std::result::Result<T, &'static str>;
#[derive(Clone, Deserialize, Serialize, PartialEq, Eq)]
#[serde(deny_unknown_fields)]
struct Manifest {
    format: u32,
    product: String,
    version: String,
    ordinal: u64,
    commit: String,
    tree: String,
    channel: String,
    contract: String,
    database_schema: u32,
    binary_sha256: String,
    image_id: String,
    archive_sha256: String,
    qualification_execution_sha256: String,
    ci_run: u64,
    assets: Vec<String>,
}
fn hex(bytes: &[u8]) -> String {
    bytes.iter().map(|v| format!("{v:02x}")).collect()
}
fn digest(value: &str, n: usize) -> bool {
    value.len() == n
        && value
            .bytes()
            .all(|b| b.is_ascii_digit() || (b'a'..=b'f').contains(&b))
}
impl Manifest {
    fn validate(&self) -> Result<()> {
        if self.format != 1
            || self.product != "keida-hub-reborn"
            || self.version != format!("0.1.{}", self.ordinal)
            || self.ordinal == 0
            || self.channel != "accepted"
            || self.contract != "reborn-workspace-v1"
            || !(4..=5).contains(&self.database_schema)
            || !digest(&self.commit, 40)
            || !digest(&self.tree, 40)
            || !digest(&self.binary_sha256, 64)
            || !self
                .image_id
                .strip_prefix("sha256:")
                .is_some_and(|v| digest(v, 64))
            || !digest(&self.archive_sha256, 64)
            || !digest(&self.qualification_execution_sha256, 64)
            || self.ci_run == 0
            || self.assets.is_empty()
            || self.assets.len() > 16
            || self.assets.iter().any(|v| !digest(v, 64))
        {
            return Err("invalid release manifest");
        }
        Ok(())
    }
}
#[derive(Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
struct Channel {
    format: u32,
    product: String,
    ordinal: u64,
    manifest_sha256: String,
}
fn uid() -> Result<u32> {
    fs::metadata("/proc/self")
        .map(|m| m.uid())
        .map_err(|_| "process identity unavailable")
}
fn directory(path: &Path) -> Result<()> {
    let m = fs::symlink_metadata(path).map_err(|_| "private directory unavailable")?;
    if !m.is_dir()
        || m.uid() != uid()?
        || m.mode() & 0o7777 != 0o700
        || fs::canonicalize(path).map_err(|_| "directory unavailable")? != path
    {
        return Err("private directory rejected");
    }
    Ok(())
}
fn file(path: &Path, max: u64) -> Result<File> {
    let f = OpenOptions::new()
        .read(true)
        .custom_flags(libc::O_NOFOLLOW | libc::O_CLOEXEC | libc::O_NONBLOCK)
        .open(path)
        .map_err(|_| "release file unavailable")?;
    let m = f.metadata().map_err(|_| "release file unavailable")?;
    if !m.is_file() || m.nlink() != 1 || m.len() > max {
        return Err("release file rejected");
    }
    Ok(f)
}
fn bytes(path: &Path, max: u64) -> Result<Vec<u8>> {
    let mut out = Vec::new();
    file(path, max)?
        .take(max + 1)
        .read_to_end(&mut out)
        .map_err(|_| "release read failed")?;
    if out.len() as u64 > max {
        return Err("release bound exceeded");
    }
    Ok(out)
}
fn hash(path: &Path) -> Result<String> {
    let mut f = file(path, 1024 * 1024 * 1024)?;
    let mut h = Sha256::new();
    let mut b = [0u8; 65536];
    loop {
        let n = f.read(&mut b).map_err(|_| "artifact read failed")?;
        if n == 0 {
            break;
        }
        h.update(&b[..n]);
    }
    Ok(hex(&h.finalize()))
}
fn write(path: &Path, value: &[u8], readonly: bool) -> Result<()> {
    let mut f = OpenOptions::new()
        .write(true)
        .create_new(true)
        .mode(0o600)
        .open(path)
        .map_err(|_| "create-once release file rejected")?;
    f.write_all(value).map_err(|_| "release write failed")?;
    f.sync_all().map_err(|_| "release fsync failed")?;
    if readonly {
        f.set_permissions(fs::Permissions::from_mode(0o400))
            .map_err(|_| "release permissions failed")?;
    }
    Ok(())
}
fn sync(path: &Path) -> Result<()> {
    File::open(path)
        .and_then(|f| f.sync_all())
        .map_err(|_| "directory fsync failed")
}
struct Lock(PathBuf);
impl Drop for Lock {
    fn drop(&mut self) {
        let _ = fs::remove_dir(&self.0);
    }
}
struct Stage(PathBuf);
impl Drop for Stage {
    fn drop(&mut self) {
        if self.0.exists() {
            let _ = fs::remove_dir_all(&self.0);
        }
    }
}
fn verified(root: &Path, ordinal: u64) -> Result<Manifest> {
    directory(root)?;
    let release = root.join("releases").join(ordinal.to_string());
    directory(&release)?;
    let manifest: Manifest = serde_json::from_slice(&bytes(&release.join("manifest.json"), 65536)?)
        .map_err(|_| "stored manifest rejected")?;
    manifest.validate()?;
    if manifest.ordinal != ordinal || hash(&release.join("image.tar"))? != manifest.archive_sha256 {
        return Err("stored artifact mismatch");
    }
    Ok(manifest)
}
fn publish_qualified(root: &Path, manifest: &Manifest, archive: &Path) -> Result<&'static str> {
    manifest.validate()?;
    directory(root)?;
    let lock = root.join("publication.lock");
    fs::DirBuilder::new()
        .mode(0o700)
        .create(&lock)
        .map_err(|_| "publication busy; inspect lock owner before retry")?;
    let _lock = Lock(lock);
    let releases = root.join("releases");
    if !releases.exists() {
        fs::DirBuilder::new()
            .mode(0o700)
            .create(&releases)
            .map_err(|_| "release directory creation failed")?;
    }
    directory(&releases)?;
    let slot = releases.join(manifest.ordinal.to_string());
    let encoded = serde_json::to_vec(manifest).map_err(|_| "manifest encoding failed")?;
    let result = if slot.exists() {
        if verified(root, manifest.ordinal)? != *manifest {
            return Err("immutable release conflict");
        }
        if hash(archive)? != manifest.archive_sha256 {
            return Err("retry artifact conflict");
        }
        "reused"
    } else {
        let mut nonce = [0u8; 16];
        getrandom::fill(&mut nonce).map_err(|_| "staging identity unavailable")?;
        let path = releases.join(format!("staging-{}", hex(&nonce)));
        fs::DirBuilder::new()
            .mode(0o700)
            .create(&path)
            .map_err(|_| "private stage failed")?;
        let stage = Stage(path);
        let target = stage.0.join("image.tar");
        let mut source = file(archive, 1024 * 1024 * 1024)?;
        let mut out = OpenOptions::new()
            .write(true)
            .create_new(true)
            .mode(0o600)
            .open(&target)
            .map_err(|_| "artifact creation failed")?;
        std::io::copy(&mut source, &mut out).map_err(|_| "artifact copy failed")?;
        out.sync_all().map_err(|_| "artifact fsync failed")?;
        if hash(&target)? != manifest.archive_sha256 {
            return Err("artifact checksum mismatch");
        }
        out.set_permissions(fs::Permissions::from_mode(0o400))
            .map_err(|_| "artifact permissions failed")?;
        write(&stage.0.join("manifest.json"), &encoded, true)?;
        sync(&stage.0)?;
        fs::rename(&stage.0, &slot).map_err(|_| "create-once publication failed")?;
        sync(&releases)?;
        "published"
    };
    let pointer = root.join("channel.json");
    let old = if pointer.exists() {
        let v: Channel =
            serde_json::from_slice(&bytes(&pointer, 4096)?).map_err(|_| "channel rejected")?;
        if v.format != 1 || v.product != "keida-hub-reborn" {
            return Err("channel rejected");
        }
        let prior = verified(root, v.ordinal)?;
        let prior_bytes =
            serde_json::to_vec(&prior).map_err(|_| "prior manifest encoding failed")?;
        if hex(&Sha256::digest(&prior_bytes)) != v.manifest_sha256 {
            return Err("channel manifest mismatch");
        }
        v.ordinal
    } else {
        0
    };
    if manifest.ordinal > old {
        let channel = Channel {
            format: 1,
            product: "keida-hub-reborn".into(),
            ordinal: manifest.ordinal,
            manifest_sha256: hex(&Sha256::digest(&encoded)),
        };
        let temporary = root.join("channel.new");
        write(
            &temporary,
            &serde_json::to_vec(&channel).map_err(|_| "channel encoding failed")?,
            false,
        )?;
        fs::rename(&temporary, &pointer).map_err(|_| "channel replacement failed")?;
        sync(root)?;
    }
    Ok(result)
}
async fn qualify(manifest: &Manifest, repo: &Path, expected_main: &str) -> Result<()> {
    if !digest(expected_main, 40) {
        return Err("qualified main SHA required");
    }
    let helper = std::env::current_exe()
        .map_err(|_| "publisher identity unavailable")?
        .parent()
        .ok_or("publisher directory unavailable")?
        .join("reborn-source-identity");
    let output = Command::new(helper)
        .args([
            "--repo",
            repo.to_str().ok_or("repository path rejected")?,
            "--candidate",
            &manifest.commit,
            "--channel",
            "accepted",
            "--main-ref",
            "refs/remotes/origin/main",
            "--main-sha",
            expected_main,
        ])
        .output()
        .map_err(|_| "source identity caller unavailable")?;
    if !output.status.success() {
        return Err("accepted source derivation rejected");
    }
    let identity: serde_json::Value =
        serde_json::from_slice(&output.stdout).map_err(|_| "source identity rejected")?;
    if identity["product"] != manifest.product
        || identity["version"] != manifest.version
        || identity["commit"] != manifest.commit
        || identity["tree"] != manifest.tree
        || identity["ordinal"] != manifest.ordinal
        || identity["channel"] != "accepted"
    {
        return Err("source/manifest mismatch");
    }
    let client = reqwest::Client::builder()
        .https_only(true)
        .no_proxy()
        .redirect(reqwest::redirect::Policy::none())
        .timeout(std::time::Duration::from_secs(8))
        .user_agent("Keida-Reborn-qualified-manual-publisher")
        .build()
        .map_err(|_| "qualification client unavailable")?;
    let base = "https://api.github.com/repos/Hizumi-Senpai/Keida-Hub-Reborn";
    let get = async |path: String| -> Result<serde_json::Value> {
        let mut r = client
            .get(format!("{base}/{path}"))
            .send()
            .await
            .map_err(|_| "GitHub qualification unavailable")?;
        if !r.status().is_success() {
            return Err("GitHub qualification rejected");
        }
        let mut b = Vec::new();
        while let Some(c) = r
            .chunk()
            .await
            .map_err(|_| "qualification response failed")?
        {
            if b.len() + c.len() > 262144 {
                return Err("qualification response bound");
            }
            b.extend_from_slice(&c);
        }
        serde_json::from_slice(&b).map_err(|_| "qualification response rejected")
    };
    let branch = get("branches/main".into()).await?;
    if branch["commit"]["sha"] != expected_main || branch["protected"] != true {
        return Err("main changed or unprotected");
    }
    let run = get(format!("actions/runs/{}", manifest.ci_run)).await?;
    if run["head_sha"] != manifest.commit
        || run["head_branch"] != "main"
        || run["event"] != "push"
        || run["status"] != "completed"
        || run["conclusion"] != "success"
        || run["path"] != ".github/workflows/foundation.yml"
        || run["repository"]["full_name"] != "Hizumi-Senpai/Keida-Hub-Reborn"
    {
        return Err("exact accepted-main CI rejected");
    }
    let jobs = get(format!(
        "actions/runs/{}/jobs?per_page=100",
        manifest.ci_run
    ))
    .await?;
    let job = jobs["jobs"]
        .as_array()
        .and_then(|jobs| {
            jobs.iter()
                .find(|j| j["name"] == "Rust 1.99.1 / PostgreSQL 16")
        })
        .ok_or("required job missing")?;
    if job["conclusion"] != "success"
        || !job["steps"]
            .as_array()
            .is_some_and(|s| !s.is_empty() && s.iter().all(|v| v["conclusion"] == "success"))
    {
        return Err("required step incomplete or skipped");
    }
    Ok(())
}
#[tokio::main]
async fn main() -> std::process::ExitCode {
    let a: Vec<_> = std::env::args().collect();
    let result=async {
        match a.get(1).map(String::as_str) {
            Some("rehearse-image") if a.len()==4 => recovery::rehearse(&a[2],Path::new(&a[3])).await,
            Some("inspect-image") if a.len()==8 => image::inspect(&a[2],&a[3],&a[4],&a[5],&a[6],Path::new(&a[7])),
            Some("publish") if a.len()==8 => {let manifest:Manifest=serde_json::from_slice(&bytes(Path::new(&a[3]),65536)?).map_err(|_|"candidate manifest rejected")?;
                manifest.validate()?;qualify(&manifest,Path::new(&a[5]),&a[6]).await?;
                if a[7].parse::<u64>().ok()!=Some(manifest.ci_run){return Err("CI receipt mismatch");}
                let outcome=publish_qualified(Path::new(&a[2]),&manifest,Path::new(&a[4]))?;println!("release {outcome}: {} {}",manifest.product,manifest.version);Ok(())},
            Some("verify") if a.len()==4 => {let ordinal=a[3].parse().map_err(|_|"ordinal rejected")?;let manifest=verified(Path::new(&a[2]),ordinal)?;println!("release verified: {} {}",manifest.product,manifest.version);Ok(())},
            _=>Err("usage: reborn-release publish ROOT MANIFEST ARCHIVE REPO EXPECTED_MAIN CI_RUN | verify ROOT ORDINAL"),
        }
    }.await;
    match result {
        Ok(()) => std::process::ExitCode::SUCCESS,
        Err(e) => {
            eprintln!("release refused: {e}");
            std::process::ExitCode::from(2)
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    struct Temp(PathBuf);
    impl Drop for Temp {
        fn drop(&mut self) {
            let _ = fs::remove_dir_all(&self.0);
        }
    }
    fn fixture() -> (Temp, PathBuf, Manifest) {
        let mut nonce = [0u8; 8];
        getrandom::fill(&mut nonce).unwrap();
        let root = std::env::temp_dir().join(format!("reborn-release-test-{}", hex(&nonce)));
        fs::DirBuilder::new().mode(0o700).create(&root).unwrap();
        let archive = root.join("fixture.tar");
        fs::write(
            &archive,
            b"non-image filesystem fixture; not package acceptance",
        )
        .unwrap();
        let manifest = Manifest {
            format: 1,
            product: "keida-hub-reborn".into(),
            version: "0.1.7".into(),
            ordinal: 7,
            commit: "a".repeat(40),
            tree: "b".repeat(40),
            channel: "accepted".into(),
            contract: "reborn-workspace-v1".into(),
            database_schema: 5,
            binary_sha256: "c".repeat(64),
            image_id: format!("sha256:{}", "d".repeat(64)),
            archive_sha256: hash(&archive).unwrap(),
            qualification_execution_sha256: "e".repeat(64),
            ci_run: 1,
            assets: vec!["f".repeat(64)],
        };
        (Temp(root), archive, manifest)
    }
    #[test]
    fn create_once_retries_conflicts_and_actual_archive_tamper() {
        let (root, archive, m) = fixture();
        assert_eq!(
            publish_qualified(&root.0, &m, &archive).unwrap(),
            "published"
        );
        assert_eq!(publish_qualified(&root.0, &m, &archive).unwrap(), "reused");
        let mut conflict = m.clone();
        conflict.binary_sha256 = "1".repeat(64);
        assert_eq!(
            publish_qualified(&root.0, &conflict, &archive),
            Err("immutable release conflict")
        );
        assert_eq!(verified(&root.0, 7).unwrap().commit, m.commit);
        fs::write(&archive, b"different bytes").unwrap();
        assert_eq!(
            publish_qualified(&root.0, &m, &archive),
            Err("retry artifact conflict")
        );
    }
    #[test]
    fn late_old_publisher_cannot_reverse_channel_and_installed_selection_is_separate() {
        let (root, archive, mut newer) = fixture();
        newer.ordinal = 8;
        newer.version = "0.1.8".into();
        publish_qualified(&root.0, &newer, &archive).unwrap();
        let mut older = newer.clone();
        older.ordinal = 7;
        older.version = "0.1.7".into();
        older.database_schema = 4;
        publish_qualified(&root.0, &older, &archive).unwrap();
        assert_eq!(verified(&root.0, 7).unwrap().database_schema, 4);
        let channel: Channel =
            serde_json::from_slice(&fs::read(root.0.join("channel.json")).unwrap()).unwrap();
        assert_eq!(channel.ordinal, 8);
        assert!(!root.0.join("installed.json").exists());
    }
    #[test]
    fn corrupted_channel_and_unowned_or_shared_directories_refuse() {
        let (root, archive, m) = fixture();
        fs::set_permissions(&root.0, fs::Permissions::from_mode(0o755)).unwrap();
        assert!(publish_qualified(&root.0, &m, &archive).is_err());
        fs::set_permissions(&root.0, fs::Permissions::from_mode(0o700)).unwrap();
        publish_qualified(&root.0, &m, &archive).unwrap();
        fs::write(root.0.join("channel.json"), b"{}").unwrap();
        assert!(publish_qualified(&root.0, &m, &archive).is_err());
    }
}

#[cfg(test)]
mod concurrent_publication {
    use super::*;
    #[test]
    fn actual_parallel_publishers_serialize_without_replacing_first_bytes_or_reversing_channel() {
        let mut random = [0u8; 12];
        getrandom::fill(&mut random).unwrap();
        let root = std::env::temp_dir().join(format!("reborn-publish-race-{}", hex(&random)));
        fs::DirBuilder::new().mode(0o700).create(&root).unwrap();
        let archive = root.join("fixture.tar");
        fs::write(&archive, b"explicitly non-image concurrency fixture").unwrap();
        let make = |n| Manifest {
            format: 1,
            product: "keida-hub-reborn".into(),
            version: format!("0.1.{n}"),
            ordinal: n,
            commit: "a".repeat(40),
            tree: "b".repeat(40),
            channel: "accepted".into(),
            contract: "reborn-workspace-v1".into(),
            database_schema: 5,
            binary_sha256: "c".repeat(64),
            image_id: format!("sha256:{}", "d".repeat(64)),
            archive_sha256: hash(&archive).unwrap(),
            qualification_execution_sha256: "e".repeat(64),
            ci_run: 1,
            assets: vec!["f".repeat(64)],
        };
        let left = make(7);
        let right = make(8);
        std::thread::scope(|scope| {
            let run = |manifest: &Manifest| {
                for _ in 0..100 {
                    match publish_qualified(&root, manifest, &archive) {
                        Ok(_) => return,
                        Err("publication busy; inspect lock owner before retry") => {
                            std::thread::sleep(std::time::Duration::from_millis(2))
                        }
                        Err(e) => panic!("unexpected publication failure: {e}"),
                    }
                }
                panic!("bounded publication race did not complete");
            };
            let l = &left;
            let r = &right;
            let a = scope.spawn(move || run(l));
            let b = scope.spawn(move || run(r));
            a.join().unwrap();
            b.join().unwrap();
        });
        let channel: Channel =
            serde_json::from_slice(&fs::read(root.join("channel.json")).unwrap()).unwrap();
        assert_eq!(channel.ordinal, 8);
        assert_eq!(
            verified(&root, 7).unwrap().archive_sha256,
            left.archive_sha256
        );
        assert_eq!(
            verified(&root, 8).unwrap().archive_sha256,
            right.archive_sha256
        );
        assert!(!root.join("publication.lock").exists());
        fs::remove_dir_all(root).unwrap();
    }
}

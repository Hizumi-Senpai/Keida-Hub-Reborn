//! Source identity from a clean, complete Git checkout. This does not authenticate
//! GitHub refs, approvals, CI, artifacts, or the installed server.

use std::{collections::BTreeMap, path::PathBuf, process::Command, str::FromStr};

pub const PRODUCT: &str = "keida-hub-reborn";
pub const ANCHOR: &str = "c06c3a03a3be17c4293e77b57fa3063ec65c8ad8";
pub const INTERFACE_CONTRACT: &str = "reborn-foundation-v1";

#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum Channel {
    Development,
    Preview,
    Accepted,
}

impl Channel {
    fn name(self) -> &'static str {
        match self {
            Self::Development => "development",
            Self::Preview => "preview",
            Self::Accepted => "accepted",
        }
    }
}

impl FromStr for Channel {
    type Err = String;

    fn from_str(value: &str) -> Result<Self, Self::Err> {
        match value {
            "development" => Ok(Self::Development),
            "preview" => Ok(Self::Preview),
            "accepted" => Ok(Self::Accepted),
            _ => Err("channel must be development, preview or accepted".into()),
        }
    }
}

#[derive(Clone, Debug)]
pub struct Options {
    pub repo: PathBuf,
    pub candidate: String,
    pub channel: Channel,
    /// The caller must authenticate this ref and its expected SHA independently.
    pub main_ref: Option<String>,
    pub main_sha: Option<String>,
    pub base: Option<String>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Identity {
    pub version: String,
    pub commit: String,
    pub tree: String,
    pub accepted_ordinal: Option<usize>,
    pub channel: Channel,
}

impl Identity {
    // All strings below are constants, validated hexadecimal, or composed from
    // those values and decimal integers. No arbitrary text enters either format.
    pub fn json(&self) -> String {
        let ordinal = self
            .accepted_ordinal
            .map_or("null".into(), |n| n.to_string());
        format!(
            "{{\"product\":\"{PRODUCT}\",\"version\":\"{}\",\"commit\":\"{}\",\"tree\":\"{}\",\"ordinal\":{ordinal},\"channel\":\"{}\",\"contract\":\"{INTERFACE_CONTRACT}\"}}",
            self.version,
            self.commit,
            self.tree,
            self.channel.name()
        )
    }

    /// Newline-delimited key=value records, not a shell program. Values use only
    /// a fixed safe alphabet. Consumers must reject missing/duplicate fields.
    pub fn env(&self) -> String {
        format!(
            "REBORN_BUILD_PRODUCT={PRODUCT}\nREBORN_BUILD_VERSION={}\nREBORN_BUILD_COMMIT={}\nREBORN_BUILD_TREE={}\nREBORN_BUILD_ORDINAL={}\nREBORN_BUILD_CHANNEL={}\nREBORN_BUILD_CONTRACT={INTERFACE_CONTRACT}",
            self.version,
            self.commit,
            self.tree,
            self.accepted_ordinal
                .map_or(String::new(), |n| n.to_string()),
            self.channel.name()
        )
    }
}

pub fn derive(options: &Options) -> Result<Identity, String> {
    derive_with_anchor(options, ANCHOR)
}

fn derive_with_anchor(options: &Options, anchor: &str) -> Result<Identity, String> {
    validate_sha(&options.candidate)?;
    let repo = Repo { options };
    if repo.git(&["rev-parse", "--is-shallow-repository"])? != "false" {
        return Err("complete non-shallow history is required".into());
    }
    repo.clean_candidate()?;
    validate_policy(
        &repo.git(&[
            "show",
            &format!("{}:version-policy.toml", options.candidate),
        ])?,
        anchor,
    )?;

    // Detect incomplete commit/tree/blob history, including side parents. Git
    // replacements are disabled below; a graft file is explicitly refused.
    let graft_path = repo.git(&["rev-parse", "--git-path", "info/grafts"])?;
    let graft_path = std::path::Path::new(&graft_path);
    let graft_path = if graft_path.is_absolute() {
        graft_path.to_owned()
    } else {
        options.repo.join(graft_path)
    };
    if graft_path.exists() {
        return Err("grafted history is not admitted".into());
    }
    let tree = repo.git(&[
        "rev-parse",
        "--verify",
        &format!("{}^{{tree}}", options.candidate),
    ])?;
    validate_sha(&tree)?;
    let (version, accepted_ordinal) = match options.channel {
        Channel::Development => {
            if options.main_ref.is_some() || options.main_sha.is_some() || options.base.is_some() {
                return Err("development identity does not accept main/base qualification".into());
            }
            repo.complete(&options.candidate)?;
            ordinal(
                &repo.first_parent(&options.candidate)?,
                &options.candidate,
                anchor,
            )?;
            (
                format!("0.1.0-development.{}", &options.candidate[..12]),
                None,
            )
        }
        Channel::Preview | Channel::Accepted => {
            let (main_ref, main_sha) = options
                .main_ref
                .as_deref()
                .zip(options.main_sha.as_deref())
                .ok_or("main-ref and independently verified main-sha are required")?;
            if !["refs/heads/main", "refs/remotes/origin/main"].contains(&main_ref) {
                return Err("main-ref must name main or origin/main explicitly".into());
            }
            validate_sha(main_sha)?;
            repo.verify_main(main_ref, main_sha)?;
            repo.complete(main_sha)?;
            repo.complete(&options.candidate)?;
            let main_history = repo.first_parent(main_sha)?;
            let result = if options.channel == Channel::Accepted {
                if options.base.is_some() {
                    return Err("accepted identity does not accept a preview base".into());
                }
                let n = ordinal(&main_history, &options.candidate, anchor)?;
                (format!("0.1.{n}"), Some(n))
            } else {
                let base = options
                    .base
                    .as_deref()
                    .ok_or("preview requires an explicit accepted base SHA")?;
                validate_sha(base)?;
                let base_n = ordinal(&main_history, base, anchor)?;
                if main_history.iter().any(|sha| sha == &options.candidate) {
                    return Err("preview candidate is already on main's first-parent path".into());
                }
                repo.git(&["merge-base", "--is-ancestor", base, &options.candidate])?;
                let n = base_n.checked_add(1).ok_or("identity ordinal overflow")?;
                (
                    format!("0.1.{n}-preview.{}", &options.candidate[..12]),
                    None,
                )
            };
            repo.verify_main(main_ref, main_sha)?;
            result
        }
    };
    repo.clean_candidate()?;
    Ok(Identity {
        version,
        commit: options.candidate.clone(),
        tree,
        accepted_ordinal,
        channel: options.channel,
    })
}

fn validate_sha(value: &str) -> Result<(), String> {
    if value.len() != 40
        || !value
            .bytes()
            .all(|b| b.is_ascii_digit() || (b'a'..=b'f').contains(&b))
    {
        return Err("a full lowercase SHA-1 object identity is required".into());
    }
    Ok(())
}

fn validate_policy(content: &str, anchor: &str) -> Result<(), String> {
    let mut entries = BTreeMap::new();
    for line in content
        .lines()
        .map(str::trim)
        .filter(|line| !line.is_empty() && !line.starts_with('#'))
    {
        let (key, value) = line.split_once('=').ok_or("malformed version policy")?;
        let key = key.trim();
        let value = value
            .trim()
            .strip_prefix('"')
            .and_then(|v| v.strip_suffix('"'))
            .ok_or("malformed version policy")?;
        if entries.insert(key, value).is_some() {
            return Err("duplicate version policy field".into());
        }
    }
    let expected = BTreeMap::from([
        ("product", PRODUCT),
        ("series", "0.1"),
        ("anchor", anchor),
        ("counter", "first-parent-distance"),
        ("main_ref", "refs/heads/main"),
    ]);
    if entries != expected {
        return Err(
            "version policy does not match the fixed Reborn product/anchor contract".into(),
        );
    }
    Ok(())
}

fn ordinal(history: &[String], candidate: &str, anchor: &str) -> Result<usize, String> {
    let anchor_index = history
        .iter()
        .position(|sha| sha == anchor)
        .ok_or("anchor is absent from main's first-parent path")?;
    let candidate_index = history
        .iter()
        .position(|sha| sha == candidate)
        .ok_or("candidate is not on main's first-parent path")?;
    anchor_index
        .checked_sub(candidate_index)
        .ok_or("candidate precedes the permanent anchor".into())
}

struct Repo<'a> {
    options: &'a Options,
}

impl Repo<'_> {
    fn git(&self, args: &[&str]) -> Result<String, String> {
        let mut command = Command::new("git");
        // An inherited alternate index/worktree must never make cleanliness
        // describe different files than the explicit --repo checkout.
        for name in [
            "GIT_DIR",
            "GIT_WORK_TREE",
            "GIT_COMMON_DIR",
            "GIT_INDEX_FILE",
            "GIT_OBJECT_DIRECTORY",
            "GIT_ALTERNATE_OBJECT_DIRECTORIES",
            "GIT_CONFIG",
            "GIT_CONFIG_COUNT",
            "GIT_CONFIG_PARAMETERS",
        ] {
            command.env_remove(name);
        }
        let output = command
            .args(["-c", "core.fsmonitor=false", "-c", "color.ui=false"])
            .args(args)
            .current_dir(&self.options.repo)
            .env("GIT_NO_REPLACE_OBJECTS", "1")
            .env("GIT_NO_LAZY_FETCH", "1")
            .env("GIT_TERMINAL_PROMPT", "0")
            .output()
            .map_err(|_| "could not execute git")?;
        if !output.status.success() {
            return Err(format!(
                "git {} refused the source/history",
                args.first().unwrap_or(&"operation")
            ));
        }
        String::from_utf8(output.stdout)
            .map(|s| s.trim_end_matches('\n').to_owned())
            .map_err(|_| "git returned non-UTF-8 metadata".into())
    }

    fn clean_candidate(&self) -> Result<(), String> {
        let requested_root = std::fs::canonicalize(&self.options.repo)
            .map_err(|_| "could not resolve repository root")?;
        let reported_root = std::fs::canonicalize(self.git(&["rev-parse", "--show-toplevel"])?)
            .map_err(|_| "could not resolve Git worktree root")?;
        if requested_root != reported_root {
            return Err("repo differs from the actual Git worktree root".into());
        }
        if !self.git(&["rev-parse", "--show-prefix"])?.is_empty() {
            return Err("repo must identify the repository root".into());
        }
        if self.git(&["rev-parse", "--verify", "HEAD"])? != self.options.candidate {
            return Err("checkout HEAD differs from the exact candidate".into());
        }
        if !self
            .git(&["status", "--porcelain=v1", "--untracked-files=all"])?
            .is_empty()
        {
            return Err("source checkout is dirty, including untracked files".into());
        }
        if self
            .git(&["ls-files", "-v", "-z"])?
            .split('\0')
            .filter(|entry| !entry.is_empty())
            .any(|entry| entry.as_bytes()[0] == b'S' || entry.as_bytes()[0].is_ascii_lowercase())
        {
            return Err("skip-worktree or assume-unchanged index entries are not admitted".into());
        }
        Ok(())
    }

    fn verify_main(&self, main_ref: &str, expected: &str) -> Result<(), String> {
        if self.git(&["rev-parse", "--verify", &format!("{main_ref}^{{commit}}")])? != expected {
            return Err("main ref differs from independently verified expected SHA".into());
        }
        Ok(())
    }

    fn first_parent(&self, sha: &str) -> Result<Vec<String>, String> {
        Ok(self
            .git(&["rev-list", "--first-parent", sha])?
            .lines()
            .map(str::to_owned)
            .collect())
    }

    fn complete(&self, sha: &str) -> Result<(), String> {
        self.git(&["rev-list", "--objects", "--missing=error", sha])
            .map(|_| ())
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::{
        fs,
        sync::atomic::{AtomicU64, Ordering},
    };

    static NEXT: AtomicU64 = AtomicU64::new(0);

    struct Fixture {
        dir: PathBuf,
        anchor: String,
        base: String,
    }

    impl Fixture {
        fn new() -> Self {
            let dir = std::env::temp_dir().join(format!(
                "reborn-identity-{}-{}",
                std::process::id(),
                NEXT.fetch_add(1, Ordering::Relaxed)
            ));
            fs::create_dir(&dir).unwrap();
            let mut fixture = Self {
                dir,
                anchor: String::new(),
                base: String::new(),
            };
            fixture.git(&["init", "--initial-branch=main"]);
            fixture.git(&["config", "user.name", "Identity fixture"]);
            fixture.git(&["config", "user.email", "identity@example.invalid"]);
            fixture.git(&["config", "commit.gpgsign", "false"]);
            fs::write(
                fixture.dir.join("README.md"),
                "Synthetic fixture; no deployment.\n",
            )
            .unwrap();
            fixture.anchor = fixture.commit("fixture root");
            fixture.write_policy(PRODUCT);
            fixture.base = fixture.commit("document identity policy");
            fixture
        }

        fn git(&self, args: &[&str]) -> String {
            let output = Command::new("git")
                .args(args)
                .current_dir(&self.dir)
                .env("GIT_CONFIG_NOSYSTEM", "1")
                .env("GIT_CONFIG_GLOBAL", "/dev/null")
                .env("GIT_TERMINAL_PROMPT", "0")
                .output()
                .unwrap();
            assert!(
                output.status.success(),
                "git {args:?}: {}",
                String::from_utf8_lossy(&output.stderr)
            );
            String::from_utf8(output.stdout).unwrap().trim().to_owned()
        }

        fn commit(&self, message: &str) -> String {
            self.git(&["add", "."]);
            self.git(&["commit", "-m", message]);
            self.git(&["rev-parse", "HEAD"])
        }

        fn write_policy(&self, product: &str) {
            fs::write(self.dir.join("version-policy.toml"), format!(
                "product = \"{product}\"\nseries = \"0.1\"\nanchor = \"{}\"\ncounter = \"first-parent-distance\"\nmain_ref = \"refs/heads/main\"\n", self.anchor
            )).unwrap();
        }

        fn options(&self, candidate: &str, channel: Channel) -> Options {
            Options {
                repo: self.dir.clone(),
                candidate: candidate.into(),
                channel,
                main_ref: Some("refs/heads/main".into()),
                main_sha: Some(self.git(&["rev-parse", "main"])),
                base: None,
            }
        }

        fn derive(&self, options: &Options) -> Result<Identity, String> {
            derive_with_anchor(options, &self.anchor)
        }
    }

    impl Drop for Fixture {
        fn drop(&mut self) {
            let _ = fs::remove_dir_all(&self.dir);
        }
    }

    #[test]
    fn real_concurrent_previews_merges_retries_and_late_source_keep_identity() {
        let fixture = Fixture::new();
        fixture.git(&["checkout", "-b", "feature-a"]);
        fs::write(fixture.dir.join("a.txt"), "A\n").unwrap();
        let a = fixture.commit("feature A");
        let mut options_a = fixture.options(&a, Channel::Preview);
        options_a.base = Some(fixture.base.clone());
        let preview_a = fixture.derive(&options_a).unwrap();
        assert_eq!(preview_a.version, format!("0.1.2-preview.{}", &a[..12]));
        assert_eq!(preview_a.accepted_ordinal, None);
        assert_eq!(preview_a, fixture.derive(&options_a).unwrap());
        assert!(
            fixture
                .derive(&fixture.options(&a, Channel::Accepted))
                .is_err()
        );

        fixture.git(&["checkout", "-b", "feature-b", &fixture.base]);
        fs::write(fixture.dir.join("b.txt"), "B\n").unwrap();
        let b = fixture.commit("feature B");
        let mut options_b = fixture.options(&b, Channel::Preview);
        options_b.base = Some(fixture.base.clone());
        let preview_b = fixture.derive(&options_b).unwrap();
        assert_eq!(preview_b.version, format!("0.1.2-preview.{}", &b[..12]));
        assert_ne!(preview_a.commit, preview_b.commit);

        fixture.git(&["checkout", "main"]);
        fixture.git(&["merge", "--no-ff", "feature-a", "-m", "accept A"]);
        let accepted_a = fixture.git(&["rev-parse", "HEAD"]);
        let identity_a = fixture
            .derive(&fixture.options(&accepted_a, Channel::Accepted))
            .unwrap();
        assert_eq!(identity_a.version, "0.1.2");
        assert_eq!(identity_a.accepted_ordinal, Some(2));
        assert_eq!(identity_a.tree, fixture.git(&["rev-parse", "HEAD^{tree}"]));

        fixture.git(&["merge", "--no-ff", "feature-b", "-m", "accept B"]);
        let accepted_b = fixture.git(&["rev-parse", "HEAD"]);
        let identity_b = fixture
            .derive(&fixture.options(&accepted_b, Channel::Accepted))
            .unwrap();
        assert_eq!(identity_b.version, "0.1.3");
        assert_eq!(identity_b.accepted_ordinal, Some(3));
        // A delayed older source job keeps the older identity. This tool does
        // not update a release channel; late-publisher admission is separate.
        fixture.git(&["checkout", "--detach", &accepted_a]);
        assert_eq!(
            identity_a,
            fixture
                .derive(&fixture.options(&accepted_a, Channel::Accepted))
                .unwrap()
        );
        // A merged feature is an ancestor but not an accepted first-parent node.
        fixture.git(&["checkout", "--detach", &a]);
        assert!(
            fixture
                .derive(&fixture.options(&a, Channel::Accepted))
                .is_err()
        );
        let mut stable_preview_a = fixture.options(&a, Channel::Preview);
        stable_preview_a.base = Some(fixture.base.clone());
        assert_eq!(preview_a, fixture.derive(&stable_preview_a).unwrap());
    }

    #[test]
    fn refuses_dirty_untracked_staged_and_unstaged_source() {
        let fixture = Fixture::new();
        let options = fixture.options(&fixture.base, Channel::Accepted);
        fs::write(
            fixture.dir.join("secret-not-printed.txt"),
            "not an actual secret",
        )
        .unwrap();
        let error = fixture.derive(&options).unwrap_err();
        assert!(error.contains("dirty"));
        assert!(!error.contains("secret-not-printed"));
        fixture.git(&["add", "."]);
        assert!(fixture.derive(&options).unwrap_err().contains("dirty"));
        fixture.git(&["reset", "--hard", "HEAD"]);
        fs::write(fixture.dir.join("README.md"), "changed\n").unwrap();
        assert!(fixture.derive(&options).unwrap_err().contains("dirty"));
    }

    #[test]
    fn index_flags_cannot_hide_modified_build_source() {
        let fixture = Fixture::new();
        let options = fixture.options(&fixture.base, Channel::Accepted);
        fixture.git(&["update-index", "--assume-unchanged", "README.md"]);
        fs::write(fixture.dir.join("README.md"), "hidden change\n").unwrap();
        assert!(fixture.git(&["status", "--porcelain=v1"]).is_empty());
        assert!(
            fixture
                .derive(&options)
                .unwrap_err()
                .contains("assume-unchanged")
        );
        fixture.git(&["update-index", "--no-assume-unchanged", "README.md"]);
        fixture.git(&["reset", "--hard", "HEAD"]);
        fixture.git(&["update-index", "--skip-worktree", "README.md"]);
        fs::write(fixture.dir.join("README.md"), "another hidden change\n").unwrap();
        assert!(fixture.git(&["status", "--porcelain=v1"]).is_empty());
        assert!(
            fixture
                .derive(&options)
                .unwrap_err()
                .contains("skip-worktree")
        );
    }

    #[test]
    fn refuses_shallow_history_missing_anchor_and_missing_side_parent() {
        let fixture = Fixture::new();
        let clone_dir = fixture.dir.with_extension("shallow");
        let output = Command::new("git")
            .args([
                "clone",
                "--depth=1",
                &format!("file://{}", fixture.dir.display()),
            ])
            .arg(&clone_dir)
            .output()
            .unwrap();
        assert!(output.status.success());
        let mut options = fixture.options(&fixture.base, Channel::Accepted);
        options.repo = clone_dir.clone();
        assert!(fixture.derive(&options).unwrap_err().contains("shallow"));
        fs::remove_dir_all(clone_dir).unwrap();
        let options = fixture.options(&fixture.base, Channel::Accepted);
        // A valid-looking but absent anchor cannot qualify source.
        assert!(derive_with_anchor(&options, "0000000000000000000000000000000000000000").is_err());

        fixture.git(&["checkout", "-b", "side"]);
        fs::write(fixture.dir.join("side.txt"), "side\n").unwrap();
        let side = fixture.commit("side parent");
        fixture.git(&["checkout", "main"]);
        fixture.git(&["merge", "--no-ff", "side", "-m", "accept side"]);
        let merged = fixture.git(&["rev-parse", "HEAD"]);
        fs::remove_file(
            fixture
                .dir
                .join(".git/objects")
                .join(&side[..2])
                .join(&side[2..]),
        )
        .unwrap();
        assert!(
            fixture
                .derive(&fixture.options(&merged, Channel::Accepted))
                .is_err()
        );
    }

    #[test]
    fn refuses_unqualified_refs_mismatched_head_and_product() {
        let fixture = Fixture::new();
        let mut options = fixture.options(&fixture.base, Channel::Accepted);
        options.main_sha = Some(fixture.anchor.clone());
        assert!(
            fixture
                .derive(&options)
                .unwrap_err()
                .contains("main ref differs")
        );
        options.main_sha = None;
        assert!(fixture.derive(&options).is_err());
        options = fixture.options(&fixture.base, Channel::Accepted);
        options.main_ref = Some("refs/heads/feature".into());
        assert!(fixture.derive(&options).is_err());
        options = fixture.options(&fixture.anchor, Channel::Accepted);
        assert!(
            fixture
                .derive(&options)
                .unwrap_err()
                .contains("HEAD differs")
        );
        fixture.write_policy("keida-hub-rewrite");
        let wrong = fixture.commit("wrong product");
        assert!(
            fixture
                .derive(&fixture.options(&wrong, Channel::Accepted))
                .unwrap_err()
                .contains("fixed Reborn")
        );
    }

    #[test]
    fn an_anchor_only_on_a_second_parent_never_qualifies_main() {
        let fixture = Fixture::new();
        fixture.git(&["checkout", "--orphan", "unrelated-main"]);
        fixture.git(&["rm", "-rf", "."]);
        fixture.write_policy(PRODUCT);
        fixture.commit("unrelated root with matching policy");
        fixture.git(&[
            "merge",
            "--allow-unrelated-histories",
            "-s",
            "ours",
            "main",
            "-m",
            "anchor only through second parent",
        ]);
        let head = fixture.git(&["rev-parse", "HEAD"]);
        fixture.git(&["branch", "-f", "main", &head]);
        fixture.git(&["merge-base", "--is-ancestor", &fixture.anchor, &head]);
        let error = fixture
            .derive(&fixture.options(&head, Channel::Accepted))
            .unwrap_err();
        assert!(error.contains("anchor is absent from main's first-parent path"));
    }

    #[test]
    fn explicit_development_cannot_masquerade_as_accepted() {
        let fixture = Fixture::new();
        let mut options = fixture.options(&fixture.base, Channel::Development);
        assert!(fixture.derive(&options).is_err());
        options.main_ref = None;
        options.main_sha = None;
        let identity = fixture.derive(&options).unwrap();
        assert_eq!(
            identity.version,
            format!("0.1.0-development.{}", &fixture.base[..12])
        );
        assert_eq!(identity.accepted_ordinal, None);
        assert!(identity.json().contains("\"ordinal\":null"));
        assert!(identity.env().contains("REBORN_BUILD_CHANNEL=development"));
        assert!(!identity.env().contains("REBORN_BUILD_CHANNEL=accepted"));
        assert!(validate_sha("HEAD").is_err());
        assert!(validate_sha("C06C3A03A3BE17C4293E77B57FA3063EC65C8AD8").is_err());
    }
}

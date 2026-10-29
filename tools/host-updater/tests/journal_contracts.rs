//! Independent M5.3 storage expectations frozen before implementation inspection.
//! The literals and phase expectations here describe private fixture journals;
//! they establish no host effect, installation or recovery acceptance.

use reborn_host_updater::journal::{Disposition, Event, Journal, Phase};
use sha2::{Digest, Sha256};
use std::{
    fs::{self, DirBuilder, OpenOptions},
    io::Write,
    os::unix::fs::{DirBuilderExt, MetadataExt, OpenOptionsExt, PermissionsExt, symlink},
    os::unix::net::UnixDatagram,
    path::{Path, PathBuf},
    process::{Child, Command, Stdio},
    sync::atomic::{AtomicU64, Ordering},
    thread,
    time::{Duration, Instant},
};

const ID: &str = "11111111111111111111111111111111";
const OTHER: &str = "22222222222222222222222222222222";
const APPLY: &str = r#"{"format":1,"product":"keida-hub-reborn","installation_id":"0123456789abcdef0123456789abcdef","command":"apply","operation_id":"11111111111111111111111111111111","expected_generation":7,"expected_installed_sha256":"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa","policy_sha256":"bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb","inventory_sha256":"cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc","prepared_receipt_sha256":"eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"}"#;
static NEXT: AtomicU64 = AtomicU64::new(0);

fn digest(bytes: &[u8]) -> String {
    Sha256::digest(bytes)
        .iter()
        .map(|byte| format!("{byte:02x}"))
        .collect()
}

struct Fixture {
    base: PathBuf,
    root: PathBuf,
    lock: PathBuf,
}
impl Fixture {
    fn new() -> Self {
        let base = std::env::temp_dir().join(format!(
            "reborn-updater-journal-contract-{}-{}",
            std::process::id(),
            NEXT.fetch_add(1, Ordering::Relaxed)
        ));
        private_directory(&base);
        let root = base.join("journal");
        private_directory(&root);
        let lock = base.join("operation.lock");
        private_file(&lock, b"", 0o600);
        Self { base, root, lock }
    }

    fn open(&self) -> Journal {
        Journal::open(&self.root, &self.lock).expect("open owned fixture journal")
    }

    fn operation(&self) -> PathBuf {
        self.root.join("operations").join(ID)
    }

    fn event(&self, sequence: u64) -> PathBuf {
        self.operation()
            .join("events")
            .join(format!("{sequence:020}.json"))
    }

    fn status(&self) -> PathBuf {
        self.operation().join("status.json")
    }
}
impl Drop for Fixture {
    fn drop(&mut self) {
        fs::remove_dir_all(&self.base).expect("remove only newly allocated fixture");
    }
}

fn private_directory(path: &Path) {
    DirBuilder::new().mode(0o700).create(path).expect("new fixture directory");
}

fn private_file(path: &Path, value: &[u8], mode: u32) {
    let mut file = OpenOptions::new()
        .write(true)
        .create_new(true)
        .mode(mode)
        .open(path)
        .expect("new fixture file");
    file.write_all(value).expect("fixture content");
    file.sync_all().expect("fixture fsync");
}

fn overwrite_fixture(path: &Path, value: &[u8]) {
    fs::set_permissions(path, fs::Permissions::from_mode(0o600)).expect("enable fixture corruption");
    fs::write(path, value).expect("mutate only fixture");
    fs::set_permissions(path, fs::Permissions::from_mode(0o400)).expect("reseal fixture mode");
}

fn admit(journal: &Journal) {
    let admission = journal.admit(APPLY.as_bytes(), &digest(APPLY.as_bytes())).expect("admit fixture");
    assert!(!admission.reused);
    assert_eq!(admission.operation_id, ID);
    assert_eq!(admission.request_sha256, digest(APPLY.as_bytes()));
    assert_eq!(admission.status.sequence, 0);
    assert_eq!(admission.status.phase, Phase::Accepted);
    assert_eq!(admission.status.disposition, None);
}

fn advance_to_checking(journal: &Journal) -> u64 {
    for (sequence, phase) in [
        Phase::Preparing,
        Phase::Prepared,
        Phase::Fencing,
        Phase::BackedUp,
        Phase::Replacing,
        Phase::Checking,
    ].into_iter().enumerate() {
        let status = journal.append(ID, sequence as u64, Event::Phase(phase)).expect("adjacent phase");
        assert_eq!(status.sequence, sequence as u64 + 1);
        assert_eq!(status.phase, phase);
        assert_eq!(status.disposition, None);
    }
    6
}

#[test]
fn first_admission_persists_exact_request_and_literal_chained_event() {
    let fixture = Fixture::new();
    let journal = fixture.open();
    admit(&journal);
    assert_eq!(fs::read(fixture.operation().join("request.json")).expect("request bytes"), APPLY.as_bytes());
    let initial = format!(
        "{{\"format\":1,\"operation_id\":\"{ID}\",\"request_sha256\":\"{}\",\"sequence\":0,\"previous_sha256\":\"{}\",\"event\":{{\"phase\":\"accepted\"}}}}",
        digest(APPLY.as_bytes()), "0".repeat(64)
    );
    assert_eq!(fs::read(fixture.event(0)).expect("first event"), initial.as_bytes());
    for path in [fixture.operation(), fixture.operation().join("events")] {
        assert_eq!(fs::symlink_metadata(path).expect("directory metadata").mode() & 0o777, 0o700);
    }
    for path in [fixture.operation().join("request.json"), fixture.event(0), fixture.status()] {
        let metadata = fs::symlink_metadata(path).expect("private file metadata");
        assert!(metadata.is_file());
        assert_eq!(metadata.nlink(), 1);
        assert_eq!(metadata.mode() & 0o777, 0o400);
    }
    let status_bytes = fs::read(fixture.status()).expect("status projection");
    let expected_status = format!(
        "{{\"format\":1,\"status\":{{\"operation_id\":\"{ID}\",\"request_sha256\":\"{}\",\"sequence\":0,\"phase\":\"accepted\",\"disposition\":null}},\"last_event_sha256\":\"{}\"}}",
        digest(APPLY.as_bytes()), digest(initial.as_bytes())
    );
    assert_eq!(status_bytes, expected_status.as_bytes());
    let next = journal.append(ID, 0, Event::Phase(Phase::Preparing)).expect("next event");
    assert_eq!(next.sequence, 1);
    let second = format!(
        "{{\"format\":1,\"operation_id\":\"{ID}\",\"request_sha256\":\"{}\",\"sequence\":1,\"previous_sha256\":\"{}\",\"event\":{{\"phase\":\"preparing\"}}}}",
        digest(APPLY.as_bytes()), digest(initial.as_bytes())
    );
    assert_eq!(fs::read(fixture.event(1)).expect("second event"), second.as_bytes());
    assert_eq!(fs::read(fixture.event(0)).expect("immutable first event"), initial.as_bytes());
}

#[test]
fn identical_request_reuses_even_unfinished_but_changed_or_competing_request_refuses() {
    let fixture = Fixture::new();
    let journal = fixture.open();
    admit(&journal);
    journal.append(ID, 0, Event::Phase(Phase::Preparing)).expect("phase");
    let duplicate = journal.admit(APPLY.as_bytes(), &digest(APPLY.as_bytes())).expect("deduplicated request");
    assert!(duplicate.reused);
    assert_eq!(duplicate.status.sequence, 1);
    assert_eq!(duplicate.status.phase, Phase::Preparing);
    for changed in [
        APPLY.replace("\"expected_generation\":7", "\"expected_generation\":8"),
        APPLY.replace("\"command\":\"apply\"", "\"command\":\"rollback\""),
        APPLY.replace(ID, OTHER),
    ] {
        assert!(journal.admit(changed.as_bytes(), &digest(changed.as_bytes())).is_err());
    }
    assert_eq!(fs::read_dir(fixture.root.join("operations")).expect("operations").count(), 1);
    assert_eq!(fs::read(fixture.operation().join("request.json")).expect("request retained"), APPLY.as_bytes());
    assert!(!fixture.root.join("operations").join(OTHER).exists());
}

#[test]
fn adjacent_phases_compare_sequence_and_terminal_records_are_immutable() {
    let fixture = Fixture::new();
    let journal = fixture.open();
    admit(&journal);
    for event in [Event::Phase(Phase::Prepared), Event::Phase(Phase::Accepted), Event::Terminal(Disposition::Succeeded)] {
        assert!(journal.append(ID, 0, event).is_err());
    }
    assert!(journal.append(ID, 1, Event::Phase(Phase::Preparing)).is_err());
    let sequence = advance_to_checking(&journal);
    assert!(journal.append(ID, sequence, Event::Phase(Phase::Preparing)).is_err());
    assert!(journal.append(ID, sequence, Event::Terminal(Disposition::Rejected)).is_err());
    assert!(journal.append(ID, sequence, Event::Terminal(Disposition::NoChange)).is_err());
    let terminal = journal.append(ID, sequence, Event::Terminal(Disposition::Succeeded)).expect("fixture terminal");
    assert_eq!(terminal.sequence, 7);
    assert_eq!(terminal.phase, Phase::Checking);
    assert_eq!(terminal.disposition, Some(Disposition::Succeeded));
    let retained = fs::read(fixture.event(7)).expect("terminal bytes");
    assert!(journal.append(ID, 7, Event::Terminal(Disposition::Succeeded)).is_err());
    assert!(journal.append(ID, 7, Event::Phase(Phase::Checking)).is_err());
    assert_eq!(fs::read(fixture.event(7)).expect("terminal unchanged"), retained);
    let duplicate = journal.admit(APPLY.as_bytes(), &digest(APPLY.as_bytes())).expect("reuse terminal");
    assert!(duplicate.reused);
    assert_eq!(duplicate.status.disposition, Some(Disposition::Succeeded));
    let other = APPLY.replace(ID, OTHER);
    assert!(!journal.admit(other.as_bytes(), &digest(other.as_bytes())).expect("new operation after proved terminal storage").reused);
}

#[test]
fn pre_fence_terminals_and_uncertainty_have_distinct_new_operation_admission() {
    for disposition in [Disposition::Rejected, Disposition::NoChange, Disposition::FailedSafe, Disposition::Uncertain] {
        let fixture = Fixture::new();
        let journal = fixture.open();
        admit(&journal);
        let result = journal.append(ID, 0, Event::Terminal(disposition)).expect("pre-fence terminal");
        assert_eq!(result.phase, Phase::Accepted);
        assert_eq!(result.disposition, Some(disposition));
        assert_eq!(result.sequence, 1);
        let duplicate = journal.admit(APPLY.as_bytes(), &digest(APPLY.as_bytes())).expect("same ID returns terminal");
        assert!(duplicate.reused);
        assert_eq!(duplicate.status.disposition, Some(disposition));
        let other = APPLY.replace(ID, OTHER);
        if disposition == Disposition::Uncertain {
            assert!(journal.admit(other.as_bytes(), &digest(other.as_bytes())).is_err());
        } else {
            assert!(journal.admit(other.as_bytes(), &digest(other.as_bytes())).is_ok());
        }
    }
    let fixture = Fixture::new();
    let journal = fixture.open();
    admit(&journal);
    let sequence = advance_to_checking(&journal);
    let status = journal.append(ID, sequence, Event::Terminal(Disposition::RolledBackCurrentData)).expect("fixture rollback terminal");
    assert_eq!(status.disposition, Some(Disposition::RolledBackCurrentData));
    assert_eq!(status.sequence, 7);
}

#[test]
fn status_projection_can_be_missing_or_an_older_valid_prefix_but_never_corrupt() {
    let fixture = Fixture::new();
    let journal = fixture.open();
    admit(&journal);
    let old = fs::read(fixture.status()).expect("old valid projection");
    journal.append(ID, 0, Event::Phase(Phase::Preparing)).expect("phase");
    let current = fs::read(fixture.status()).expect("current projection");
    fs::remove_file(fixture.status()).expect("simulate crash before projection publication");
    assert_eq!(journal.read_status(ID).expect("repair from committed chain").sequence, 1);
    assert_eq!(fs::read(fixture.status()).expect("repaired bytes"), current);
    overwrite_fixture(&fixture.status(), &old);
    assert_eq!(journal.read_status(ID).expect("repair valid older projection").sequence, 1);
    assert_eq!(fs::read(fixture.status()).expect("repaired prefix"), current);
    overwrite_fixture(&fixture.status(), b"{\"format\":1");
    assert!(journal.read_status(ID).is_err());
    assert_eq!(fs::read(fixture.status()).expect("corrupt evidence retained"), b"{\"format\":1");
}

#[test]
fn a_future_or_conflicting_projection_refuses_instead_of_rolling_history_back() {
    for (old, new) in [("\"sequence\":0", "\"sequence\":1"), ("\"phase\":\"accepted\"", "\"phase\":\"preparing\"")] {
        let fixture = Fixture::new();
        let journal = fixture.open();
        admit(&journal);
        let original = String::from_utf8(fs::read(fixture.status()).expect("projection")).expect("UTF8");
        assert!(original.contains(old));
        let corrupt = original.replacen(old, new, 1);
        overwrite_fixture(&fixture.status(), corrupt.as_bytes());
        assert!(journal.read_status(ID).is_err());
        assert_eq!(fs::read(fixture.status()).expect("projection evidence retained"), corrupt.as_bytes());
        assert_eq!(fs::read_dir(fixture.operation().join("events")).expect("unchanged events").count(), 1);
    }
}

#[test]
fn torn_missing_corrupt_reordered_or_unknown_events_preserve_evidence_and_refuse() {
    for corruption in 0..7 {
        let fixture = Fixture::new();
        let journal = fixture.open();
        admit(&journal);
        journal.append(ID, 0, Event::Phase(Phase::Preparing)).expect("phase");
        match corruption {
            0 => overwrite_fixture(&fixture.event(1), b"{"),
            1 => { fs::remove_file(fixture.event(0)).expect("missing first event"); },
            2 => { fs::remove_file(fixture.event(1)).expect("status ahead of journal"); },
            3 => { fs::rename(fixture.event(1), fixture.event(2)).expect("gap/out-of-order name"); },
            4 => { private_file(&fixture.operation().join("events").join("unexpected.json"), b"{}", 0o400); },
            5 => {
                let mut event = fs::read(fixture.event(1)).expect("event");
                let index = event.iter().position(|byte| *byte == b'1').expect("mutable fixture byte");
                event[index] = b'2';
                overwrite_fixture(&fixture.event(1), &event);
            },
            6 => {
                let event = fs::read(fixture.event(1)).expect("event");
                private_file(&fixture.event(2), &event, 0o400);
            },
            _ => unreachable!(),
        }
        let count_before = fs::read_dir(fixture.operation().join("events")).expect("event evidence").count();
        assert!(journal.read_status(ID).is_err(), "accepted corruption case {corruption}");
        assert!(journal.admit(APPLY.as_bytes(), &digest(APPLY.as_bytes())).is_err());
        assert_eq!(fs::read_dir(fixture.operation().join("events")).expect("evidence remains").count(), count_before);
    }
}

#[test]
fn pending_status_files_are_nonauthority_and_preserved_with_strict_names_and_bounds() {
    let fixture = Fixture::new();
    let journal = fixture.open();
    admit(&journal);
    let pending = fixture.operation().join("status-33333333333333333333333333333333.pending");
    private_file(&pending, b"{torn pending projection", 0o600);
    fs::remove_file(fixture.status()).expect("missing current projection");
    assert_eq!(journal.read_status(ID).expect("rebuild only from events").sequence, 0);
    assert_eq!(fs::read(&pending).expect("pending evidence retained"), b"{torn pending projection");
    let unknown = fixture.operation().join("not-an-admitted-status.tmp");
    private_file(&unknown, b"{}", 0o600);
    assert!(journal.read_status(ID).is_err());
    assert!(unknown.exists());
}

#[test]
fn append_preserves_the_global_barrier_when_an_older_terminal_journal_changes() {
    for corruption in 0..3 {
        let fixture = Fixture::new();
        let journal = fixture.open();
        admit(&journal);
        journal.append(ID, 0, Event::Terminal(Disposition::FailedSafe)).expect("terminal prior storage record");
        let second_request = APPLY.replace(ID, OTHER);
        journal.admit(second_request.as_bytes(), &digest(second_request.as_bytes())).expect("admit next fixture operation");
        match corruption {
            0 => overwrite_fixture(&fixture.event(1), b"{torn older event"),
            1 => overwrite_fixture(&fixture.operation().join("request.json"), b"{torn older request"),
            2 => {
                // A fully coherent older journal for another installation is
                // still a global policy conflict, not merely a torn-file case.
                let prior = APPLY.replace("0123456789abcdef0123456789abcdef", "fedcba9876543210fedcba9876543210");
                let hash = digest(prior.as_bytes());
                let first = format!("{{\"format\":1,\"operation_id\":\"{ID}\",\"request_sha256\":\"{hash}\",\"sequence\":0,\"previous_sha256\":\"{}\",\"event\":{{\"phase\":\"accepted\"}}}}", "0".repeat(64));
                let terminal = format!("{{\"format\":1,\"operation_id\":\"{ID}\",\"request_sha256\":\"{hash}\",\"sequence\":1,\"previous_sha256\":\"{}\",\"event\":{{\"terminal\":\"failed_safe\"}}}}", digest(first.as_bytes()));
                let projection = format!("{{\"format\":1,\"status\":{{\"operation_id\":\"{ID}\",\"request_sha256\":\"{hash}\",\"sequence\":1,\"phase\":\"accepted\",\"disposition\":\"failed_safe\"}},\"last_event_sha256\":\"{}\"}}", digest(terminal.as_bytes()));
                overwrite_fixture(&fixture.operation().join("request.json"), prior.as_bytes());
                overwrite_fixture(&fixture.event(0), first.as_bytes());
                overwrite_fixture(&fixture.event(1), terminal.as_bytes());
                overwrite_fixture(&fixture.status(), projection.as_bytes());
                assert_eq!(journal.read_status(ID).expect("coherent different-installation journal").disposition, Some(Disposition::FailedSafe));
            },
            _ => unreachable!(),
        }
        let second_events = fixture.root.join("operations").join(OTHER).join("events");
        let second_initial = second_events.join("00000000000000000000.json");
        let original_bytes = fs::read(&second_initial).expect("second initial event");
        assert!(journal.append(OTHER, 0, Event::Phase(Phase::Preparing)).is_err(), "older conflict case {corruption} bypassed global barrier");
        assert_eq!(fs::read_dir(&second_events).expect("second evidence").count(), 1);
        assert_eq!(fs::read(&second_initial).expect("second initial event retained"), original_bytes);
        assert_eq!(journal.read_status(OTHER).expect("second selected status remains readable").sequence, 0);
    }
}

#[test]
fn concurrent_threads_cannot_commit_the_same_expected_sequence_twice() {
    let fixture = Fixture::new();
    let journal = std::sync::Arc::new(fixture.open());
    admit(&journal);
    let gate = std::sync::Arc::new(std::sync::Barrier::new(3));
    let mut children = Vec::new();
    for _ in 0..2 {
        let journal = journal.clone();
        let gate = gate.clone();
        children.push(thread::spawn(move || {
            gate.wait();
            journal.append(ID, 0, Event::Phase(Phase::Preparing))
        }));
    }
    gate.wait();
    let outcomes: Vec<_> = children.into_iter().map(|child| child.join().expect("fixture worker")).collect();
    assert_eq!(outcomes.iter().filter(|result| result.is_ok()).count(), 1);
    assert_eq!(outcomes.iter().filter(|result| result.is_err()).count(), 1);
    assert_eq!(journal.read_status(ID).expect("single committed transition").sequence, 1);
    assert_eq!(fs::read_dir(fixture.operation().join("events")).expect("event count").count(), 2);
}

#[test]
fn pending_evidence_bound_never_requires_deleting_history_to_repair_status() {
    let fixture = Fixture::new();
    let journal = fixture.open();
    admit(&journal);
    for number in 0..16 {
        let name = format!("status-{number:032x}.pending");
        private_file(&fixture.operation().join(name), b"{interrupted pending status", 0o600);
    }
    assert_eq!(journal.read_status(ID).expect("current committed projection remains valid").sequence, 0);
    fs::remove_file(fixture.status()).expect("simulate missing status");
    assert!(journal.read_status(ID).is_err(), "must not create a seventeenth pending record");
    assert_eq!(fs::read_dir(fixture.operation()).expect("pending evidence count").count(), 18);
    for number in 0..16 {
        let name = format!("status-{number:032x}.pending");
        assert_eq!(fs::read(fixture.operation().join(name)).expect("each exact pending record retained"), b"{interrupted pending status");
    }
}

#[test]
fn permanent_lock_is_nonblocking_and_replaced_inode_blocks_all_mutations() {
    let fixture = Fixture::new();
    let journal = fixture.open();
    let identity = fs::metadata(&fixture.lock).expect("lock metadata");
    let began = Instant::now();
    assert!(Journal::open(&fixture.root, &fixture.lock).is_err());
    assert!(began.elapsed() < Duration::from_secs(2), "busy lock waited");
    assert_eq!(fs::metadata(&fixture.lock).expect("same lock").ino(), identity.ino());
    fs::rename(&fixture.lock, fixture.base.join("old-operation.lock")).expect("replace fixture lock");
    private_file(&fixture.lock, b"", 0o600);
    assert!(journal.admit(APPLY.as_bytes(), &digest(APPLY.as_bytes())).is_err());
    assert!(!fixture.operation().exists());
    drop(journal);
    assert!(fixture.base.join("old-operation.lock").exists());
    assert!(fixture.lock.exists());
}

#[test]
fn root_path_substitution_does_not_redirect_a_held_journal_into_new_content() {
    let fixture = Fixture::new();
    let journal = fixture.open();
    admit(&journal);
    let moved = fixture.base.join("original-journal");
    fs::rename(&fixture.root, &moved).expect("move only fixture root");
    private_directory(&fixture.root);
    assert!(journal.append(ID, 0, Event::Phase(Phase::Preparing)).is_err());
    assert!(!fixture.root.join("operations").exists());
    assert_eq!(fs::read_dir(moved.join("operations").join(ID).join("events")).expect("original evidence").count(), 1);
}

#[test]
fn unsafe_roots_locks_and_directory_ancestry_are_rejected() {
    let fixture = Fixture::new();
    let root_link = fixture.base.join("root-link");
    symlink(&fixture.root, &root_link).expect("root symlink");
    assert!(Journal::open(&root_link, &fixture.lock).is_err());
    let lock_link = fixture.base.join("lock-link");
    symlink(&fixture.lock, &lock_link).expect("lock symlink");
    assert!(Journal::open(&fixture.root, &lock_link).is_err());
    let hardlink = fixture.base.join("lock-hardlink");
    fs::hard_link(&fixture.lock, &hardlink).expect("hardlinked lock");
    assert!(Journal::open(&fixture.root, &fixture.lock).is_err());
    fs::remove_file(&hardlink).expect("owned hardlink");
    fs::set_permissions(&fixture.lock, fs::Permissions::from_mode(0o640)).expect("unsafe lock mode");
    assert!(Journal::open(&fixture.root, &fixture.lock).is_err());
    fs::set_permissions(&fixture.lock, fs::Permissions::from_mode(0o600)).expect("restore fixture lock mode");
    fs::set_permissions(&fixture.root, fs::Permissions::from_mode(0o755)).expect("unsafe root mode");
    assert!(Journal::open(&fixture.root, &fixture.lock).is_err());
    fs::set_permissions(&fixture.root, fs::Permissions::from_mode(0o700)).expect("restore fixture root mode");
    fs::set_permissions(&fixture.base, fs::Permissions::from_mode(0o777)).expect("unsafe ancestor mode");
    assert!(Journal::open(&fixture.root, &fixture.lock).is_err());
    fs::set_permissions(&fixture.base, fs::Permissions::from_mode(0o700)).expect("restore fixture ancestor mode");
}

#[test]
fn unsafe_or_redirected_operation_files_are_refused_without_touching_the_target() {
    for corruption in 0..5 {
        let fixture = Fixture::new();
        let journal = fixture.open();
        admit(&journal);
        let external = fixture.base.join("untouched-target");
        private_file(&external, b"unrelated fixture bytes", 0o400);
        match corruption {
            0 => {
                fs::remove_file(fixture.event(0)).expect("replace event");
                symlink(&external, fixture.event(0)).expect("event symlink");
            },
            1 => { fs::hard_link(fixture.event(0), fixture.base.join("event-hardlink")).expect("event hardlink"); },
            2 => { fs::set_permissions(fixture.event(0), fs::Permissions::from_mode(0o644)).expect("event wrong mode"); },
            3 => { fs::set_permissions(fixture.operation(), fs::Permissions::from_mode(0o755)).expect("opdir wrong mode"); },
            4 => { overwrite_fixture(&fixture.operation().join("request.json"), APPLY.replace("\"expected_generation\":7", "\"expected_generation\":8").as_bytes()); },
            _ => unreachable!(),
        }
        assert!(journal.read_status(ID).is_err());
        assert_eq!(fs::read(&external).expect("unrelated target retained"), b"unrelated fixture bytes");
    }
}

#[test]
fn malformed_operation_ids_and_incomplete_or_unknown_directories_fail_closed() {
    let fixture = Fixture::new();
    let journal = fixture.open();
    admit(&journal);
    for id in ["", "../operation.lock", "current", "1111111111111111111111111111111G"] {
        assert!(journal.read_status(id).is_err());
        assert!(journal.append(id, 0, Event::Phase(Phase::Preparing)).is_err());
    }
    let unknown = fixture.root.join("operations").join("unexpected");
    private_directory(&unknown);
    assert!(journal.admit(APPLY.as_bytes(), &digest(APPLY.as_bytes())).is_err());
    fs::remove_dir(&unknown).expect("only owned unknown fixture");
    let incomplete = fixture.root.join("operations").join(OTHER);
    private_directory(&incomplete);
    assert!(journal.admit(APPLY.as_bytes(), &digest(APPLY.as_bytes())).is_err());
    assert!(incomplete.exists());
}

struct ChildGuard(Child);
impl Drop for ChildGuard {
    fn drop(&mut self) {
        let _ = self.0.kill();
        let _ = self.0.wait();
    }
}

#[test]
fn killed_holder_releases_the_kernel_lock_but_does_not_erase_unfinished_admission() {
    const CHILD_ROOT: &str = "REBORN_UPDATER_JOURNAL_CONTRACT_CHILD_ROOT";
    if let Some(base) = std::env::var_os(CHILD_ROOT) {
        let base = PathBuf::from(base);
        let journal = Journal::open(&base.join("journal"), &base.join("operation.lock")).expect("child fixture lock");
        admit(&journal);
        let ready = UnixDatagram::unbound().expect("child readiness socket");
        ready.connect(base.join("ready.sock")).expect("owned parent readiness socket");
        ready.send(b"durable admission recorded").expect("bounded fixture handshake");
        loop {
            std::hint::black_box(&journal);
            thread::park();
        }
    }
    let fixture = Fixture::new();
    let ready = UnixDatagram::bind(fixture.base.join("ready.sock")).expect("owned readiness fixture");
    ready.set_read_timeout(Some(Duration::from_secs(8))).expect("bounded child handshake");
    let mut child = ChildGuard(Command::new(std::env::current_exe().expect("current test executable"))
        .args(["--exact", "killed_holder_releases_the_kernel_lock_but_does_not_erase_unfinished_admission", "--nocapture"])
        .env(CHILD_ROOT, &fixture.base)
        .stdin(Stdio::null())
        .stdout(Stdio::null())
        .stderr(Stdio::null())
        .spawn()
        .expect("spawn actual lock-owning fixture process"));
    let mut message = [0_u8; 64];
    let count = ready.recv(&mut message).expect("child must admit within bounded handshake");
    assert_eq!(&message[..count], b"durable admission recorded");
    assert!(Journal::open(&fixture.root, &fixture.lock).is_err());
    child.0.kill().expect("kill only the exact owned test child");
    child.0.wait().expect("reap exact child");
    let journal = fixture.open();
    let other = APPLY.replace(ID, OTHER);
    assert!(journal.admit(other.as_bytes(), &digest(other.as_bytes())).is_err());
    let existing = journal.admit(APPLY.as_bytes(), &digest(APPLY.as_bytes())).expect("recover original durable admission");
    assert!(existing.reused);
    assert_eq!(existing.status.sequence, 0);
    assert_eq!(existing.status.phase, Phase::Accepted);
    assert_eq!(existing.status.disposition, None);
    assert_eq!(fs::metadata(&fixture.lock).expect("permanent lock remains").nlink(), 1);
}

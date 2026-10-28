//! Current-authority and concurrency contracts for retained Discord links.
//! These exercise the actual PostgreSQL transactions, not a model of the store.
use super::{Fixture, OTHER_PHC, PHC, store, verifier};
use std::time::{Duration, Instant};
use store::discord::{self, Bases, Capture};

fn live_deadline() -> Instant {
    Instant::now() + Duration::from_secs(600)
}

fn bases(capture: &Capture) -> Bases {
    Bases {
        revision: capture.link.revision,
        flow_generation: capture.link.flow_generation,
        application_revision: capture.application_revision,
    }
}

async fn configure(fixture: &Fixture, owner: &[u8]) -> Capture {
    let current = discord::owner_capture(&fixture.pool, &fixture.key, owner)
        .await
        .unwrap();
    // Synthetic ciphertext is sufficient for these database-only contracts;
    // encryption/protocol tests exercise actual frame4 independently.
    discord::replace_application(
        &fixture.pool,
        &fixture.key,
        owner,
        current.application_revision,
        Some(&[0xab; 80]),
    )
    .await
    .unwrap()
}

async fn member(fixture: &Fixture, owner: &[u8]) -> (store::Account, Vec<u8>) {
    let member = store::create_member(
        &fixture.pool,
        &fixture.key,
        owner,
        "discord_member",
        OTHER_PHC,
    )
    .await
    .unwrap();
    let snapshot = store::reserve_login(&fixture.pool, &fixture.key, "discord_member", 2)
        .await
        .unwrap()
        .unwrap();
    let session = verifier(400);
    store::finish_login(&fixture.pool, &fixture.key, &snapshot, &session, None)
        .await
        .unwrap();
    (member, session)
}

#[tokio::test]
async fn verified_full_unsigned_identity_does_not_change_local_account_authority() {
    let (fixture, owner, session) = Fixture::owned().await;
    let configured = configure(&fixture, &session).await;
    assert_eq!(configured.link.revision, 0);
    assert_eq!(configured.link.flow_generation, 0);
    assert!(configured.link.identity.is_none());
    let pending = discord::start(&fixture.pool, &fixture.key, &session, bases(&configured))
        .await
        .unwrap();
    let linked = discord::confirm(
        &fixture.pool,
        &fixture.key,
        &session,
        bases(&pending),
        "18446744073709551615",
        "Discord fixture 🐈",
        live_deadline(),
    )
    .await
    .unwrap();
    assert_eq!(linked.link.revision, 1);
    assert_eq!(linked.link.flow_generation, 2);
    let identity = linked.link.identity.as_ref().unwrap();
    assert_eq!(identity.id, "18446744073709551615");
    assert_eq!(identity.display_name, "Discord fixture 🐈");
    assert!(identity.verified_at > 0);
    let authority: (String, String, i64, bool) =
        sqlx::query_as("SELECT password_phc, role, generation, active FROM users WHERE id = $1")
            .bind(owner.id)
            .fetch_one(&fixture.pool)
            .await
            .unwrap();
    assert_eq!(authority, (PHC.to_owned(), "owner".to_owned(), 0, true));
    assert!(
        store::session(&fixture.pool, &fixture.key, &session)
            .await
            .is_ok()
    );
    assert_eq!(
        discord::confirm(
            &fixture.pool,
            &fixture.key,
            &session,
            bases(&pending),
            "1",
            "replayed candidate",
            live_deadline(),
        )
        .await
        .err(),
        Some(store::Error::Conflict)
    );
    assert_eq!(
        discord::start(&fixture.pool, &fixture.key, &session, bases(&linked))
            .await
            .err(),
        Some(store::Error::Conflict),
        "an accepted link must not be implicitly replaced"
    );
}

#[tokio::test]
async fn cancel_and_unlink_retain_tombstone_and_reject_old_flow_after_new_start() {
    let (fixture, _, session) = Fixture::owned().await;
    let configured = configure(&fixture, &session).await;
    let first = discord::start(&fixture.pool, &fixture.key, &session, bases(&configured))
        .await
        .unwrap();
    let cancelled = discord::cancel(
        &fixture.pool,
        &fixture.key,
        &session,
        first.link.revision,
        first.link.flow_generation,
    )
    .await
    .unwrap();
    assert_eq!(cancelled.link.revision, 0);
    assert_eq!(cancelled.link.flow_generation, 2);
    let second = discord::start(&fixture.pool, &fixture.key, &session, bases(&cancelled))
        .await
        .unwrap();
    assert_eq!(
        discord::admit(&fixture.pool, &fixture.key, &session, bases(&first))
            .await
            .err(),
        Some(store::Error::Conflict)
    );
    let unlinked = discord::unlink(
        &fixture.pool,
        &fixture.key,
        &session,
        second.link.revision,
        second.link.flow_generation,
    )
    .await
    .unwrap();
    assert_eq!(unlinked.link.revision, 1);
    assert_eq!(unlinked.link.flow_generation, 4);
    assert_eq!(
        discord::confirm(
            &fixture.pool,
            &fixture.key,
            &session,
            bases(&second),
            "123",
            "stale candidate",
            live_deadline(),
        )
        .await
        .err(),
        Some(store::Error::Conflict)
    );
    let repeated = discord::unlink(
        &fixture.pool,
        &fixture.key,
        &session,
        unlinked.link.revision,
        unlinked.link.flow_generation,
    )
    .await
    .unwrap();
    assert_eq!(repeated.link.revision, 2);
    assert_eq!(repeated.link.flow_generation, 5);
    let count: i64 = sqlx::query_scalar("SELECT count(*) FROM discord_links")
        .fetch_one(&fixture.pool)
        .await
        .unwrap();
    assert_eq!(count, 1, "unlink erased the retained account tombstone");
}

#[tokio::test]
async fn application_changes_invalidate_pending_flows_and_keep_accepted_links() {
    let (fixture, _, session) = Fixture::owned().await;
    let configured = configure(&fixture, &session).await;
    let pending = discord::start(&fixture.pool, &fixture.key, &session, bases(&configured))
        .await
        .unwrap();
    let replaced = configure(&fixture, &session).await;
    assert_eq!(replaced.application_revision, 2);
    assert_eq!(
        discord::confirm(
            &fixture.pool,
            &fixture.key,
            &session,
            bases(&pending),
            "123",
            "old application",
            live_deadline(),
        )
        .await
        .err(),
        Some(store::Error::Conflict)
    );
    let new_pending = discord::start(&fixture.pool, &fixture.key, &session, bases(&replaced))
        .await
        .unwrap();
    let linked = discord::confirm(
        &fixture.pool,
        &fixture.key,
        &session,
        bases(&new_pending),
        "123",
        "accepted identity",
        live_deadline(),
    )
    .await
    .unwrap();
    let removed = discord::replace_application(
        &fixture.pool,
        &fixture.key,
        &session,
        linked.application_revision,
        None,
    )
    .await
    .unwrap();
    assert!(removed.sealed.is_none());
    assert_eq!(removed.link, linked.link);
    let unlinked = discord::unlink(
        &fixture.pool,
        &fixture.key,
        &session,
        removed.link.revision,
        removed.link.flow_generation,
    )
    .await
    .unwrap();
    assert!(unlinked.link.identity.is_none());
    assert_eq!(
        discord::start(&fixture.pool, &fixture.key, &session, bases(&unlinked))
            .await
            .err(),
        Some(store::Error::Conflict),
        "an unconfigured application cannot begin OAuth"
    );
}

#[tokio::test]
async fn member_links_only_itself_and_cannot_replace_or_read_owner_application_surface() {
    let (fixture, _, owner_session) = Fixture::owned().await;
    configure(&fixture, &owner_session).await;
    let (account, session) = member(&fixture, &owner_session).await;
    assert_eq!(
        discord::owner_capture(&fixture.pool, &fixture.key, &session)
            .await
            .err(),
        Some(store::Error::Forbidden)
    );
    assert_eq!(
        discord::replace_application(&fixture.pool, &fixture.key, &session, 1, None)
            .await
            .err(),
        Some(store::Error::Forbidden)
    );
    let current = discord::capture(&fixture.pool, &fixture.key, &session)
        .await
        .unwrap();
    assert_eq!(current.session.account.id, account.id);
    let pending = discord::start(&fixture.pool, &fixture.key, &session, bases(&current))
        .await
        .unwrap();
    let linked = discord::confirm(
        &fixture.pool,
        &fixture.key,
        &session,
        bases(&pending),
        "456",
        "member identity",
        live_deadline(),
    )
    .await
    .unwrap();
    assert_eq!(linked.session.account.role, "member");
    assert_eq!(linked.session.generation, 0);
    assert!(
        discord::capture(&fixture.pool, &fixture.key, &owner_session)
            .await
            .unwrap()
            .link
            .identity
            .is_none()
    );
}

#[tokio::test]
async fn simultaneous_identity_collision_commits_exactly_one_local_account() {
    let (fixture, _, owner_session) = Fixture::owned().await;
    let owner_current = configure(&fixture, &owner_session).await;
    let (_, member_session) = member(&fixture, &owner_session).await;
    let member_current = discord::capture(&fixture.pool, &fixture.key, &member_session)
        .await
        .unwrap();
    let owner_pending = discord::start(
        &fixture.pool,
        &fixture.key,
        &owner_session,
        bases(&owner_current),
    )
    .await
    .unwrap();
    let member_pending = discord::start(
        &fixture.pool,
        &fixture.key,
        &member_session,
        bases(&member_current),
    )
    .await
    .unwrap();
    let (owner, member) = tokio::join!(
        discord::confirm(
            &fixture.pool,
            &fixture.key,
            &owner_session,
            bases(&owner_pending),
            "9223372036854775808",
            "collision fixture",
            live_deadline(),
        ),
        discord::confirm(
            &fixture.pool,
            &fixture.key,
            &member_session,
            bases(&member_pending),
            "9223372036854775808",
            "collision fixture",
            live_deadline(),
        )
    );
    assert_eq!(usize::from(owner.is_ok()) + usize::from(member.is_ok()), 1);
    let error = if owner.is_err() {
        owner.err()
    } else {
        member.err()
    };
    assert_eq!(error, Some(store::Error::Conflict));
    let accepted: i64 =
        sqlx::query_scalar("SELECT count(*) FROM discord_links WHERE discord_id IS NOT NULL")
            .fetch_one(&fixture.pool)
            .await
            .unwrap();
    assert_eq!(accepted, 1);
    let unlinked: i64 = sqlx::query_scalar(
        "SELECT count(*) FROM discord_links WHERE discord_id IS NULL AND revision=0 AND flow_generation=1",
    )
    .fetch_one(&fixture.pool)
    .await
    .unwrap();
    assert_eq!(
        unlinked, 1,
        "a failed unique write changed the losing account"
    );
}

#[tokio::test]
async fn current_session_key_and_generation_are_rechecked_after_provider_io() {
    for change in ["logout", "expire", "generation", "inactive", "key"] {
        let (fixture, owner, session) = Fixture::owned().await;
        let configured = configure(&fixture, &session).await;
        let pending = discord::start(&fixture.pool, &fixture.key, &session, bases(&configured))
            .await
            .unwrap();
        let expected = match change {
            "logout" => {
                store::logout(&fixture.pool, &fixture.key, &session)
                    .await
                    .unwrap();
                store::Error::Unauthorized
            }
            "expire" => {
                sqlx::query("UPDATE sessions SET created_at=0,expires_at=1 WHERE verifier=$1")
                    .bind(&session)
                    .execute(&fixture.pool)
                    .await
                    .unwrap();
                store::Error::Unauthorized
            }
            "generation" => {
                store::revoke_all(&fixture.pool, &fixture.key, &session)
                    .await
                    .unwrap();
                store::Error::Unauthorized
            }
            "inactive" => {
                sqlx::query("UPDATE users SET active=FALSE WHERE id=$1")
                    .bind(owner.id)
                    .execute(&fixture.pool)
                    .await
                    .unwrap();
                store::Error::Unauthorized
            }
            "key" => {
                sqlx::query("UPDATE auth_state SET key_id=$1 WHERE singleton=TRUE")
                    .bind(vec![0x99_u8; 32])
                    .execute(&fixture.pool)
                    .await
                    .unwrap();
                store::Error::Unavailable
            }
            _ => unreachable!(),
        };
        assert_eq!(
            discord::admit(&fixture.pool, &fixture.key, &session, bases(&pending))
                .await
                .err(),
            Some(expected),
            "post-IO disclosure survived {change}"
        );
        assert_eq!(
            discord::confirm(
                &fixture.pool,
                &fixture.key,
                &session,
                bases(&pending),
                "789",
                "late candidate",
                live_deadline(),
            )
            .await
            .err(),
            Some(expected),
            "commit survived {change}"
        );
        let count: i64 =
            sqlx::query_scalar("SELECT count(*) FROM discord_links WHERE discord_id IS NOT NULL")
                .fetch_one(&fixture.pool)
                .await
                .unwrap();
        assert_eq!(count, 0);
    }
}

#[tokio::test]
async fn revision_exhaustion_and_bad_candidates_roll_back_without_consuming_flow() {
    let (fixture, owner, session) = Fixture::owned().await;
    let configured = configure(&fixture, &session).await;
    let pending = discord::start(&fixture.pool, &fixture.key, &session, bases(&configured))
        .await
        .unwrap();
    for (id, label) in [
        ("0", "fixture"),
        ("01", "fixture"),
        ("18446744073709551616", "fixture"),
        ("1", ""),
        ("1", " \u{a0}\u{3000}"),
        ("1", "line\nbreak"),
        ("1", "invisible\u{85}control"),
        ("1", "direction\u{202e}override"),
    ] {
        assert_eq!(
            discord::confirm(
                &fixture.pool,
                &fixture.key,
                &session,
                bases(&pending),
                id,
                label,
                live_deadline(),
            )
            .await
            .err(),
            Some(store::Error::Rejected)
        );
    }
    sqlx::query("UPDATE discord_links SET flow_generation=$1 WHERE account_id=$2")
        .bind(i64::MAX)
        .bind(owner.id)
        .execute(&fixture.pool)
        .await
        .unwrap();
    let exhausted = discord::capture(&fixture.pool, &fixture.key, &session)
        .await
        .unwrap();
    assert_eq!(
        discord::confirm(
            &fixture.pool,
            &fixture.key,
            &session,
            bases(&exhausted),
            "1",
            "fixture",
            live_deadline(),
        )
        .await
        .err(),
        Some(store::Error::Unavailable)
    );
    let after = discord::capture(&fixture.pool, &fixture.key, &session)
        .await
        .unwrap();
    assert_eq!(after.link, exhausted.link);
}

#[test]
fn discord_snowflakes_are_canonical_unsigned_strings() {
    for valid in ["1", "9223372036854775808", "18446744073709551615"] {
        assert!(discord::valid_id(valid));
    }
    for invalid in [
        "",
        "0",
        "01",
        "+1",
        "-1",
        "1.0",
        "1e3",
        " 1",
        "1\n",
        "١",
        "18446744073709551616",
    ] {
        assert!(!discord::valid_id(invalid), "accepted {invalid:?}");
    }
}

#[tokio::test]
async fn confirmation_deadline_is_rechecked_after_waiting_for_current_authority_lock() {
    let (fixture, _, session) = Fixture::owned().await;
    let configured = configure(&fixture, &session).await;
    let pending = discord::start(&fixture.pool, &fixture.key, &session, bases(&configured))
        .await
        .unwrap();
    assert_eq!(
        discord::confirm(
            &fixture.pool,
            &fixture.key,
            &session,
            bases(&pending),
            "123",
            "already expired candidate",
            Instant::now(),
        )
        .await
        .err(),
        Some(store::Error::Conflict)
    );
    let mut blocker = fixture.pool.begin().await.unwrap();
    sqlx::query("SELECT singleton FROM auth_state WHERE singleton=TRUE FOR UPDATE")
        .fetch_one(&mut *blocker)
        .await
        .unwrap();
    let pool = fixture.pool.clone();
    let key = fixture.key.clone();
    let verifier = session.clone();
    let base = bases(&pending);
    // This directly supplied short test deadline exercises the real lock wait;
    // production attempts retain the fixed600-second monotonic TTL.
    let deadline = Instant::now() + Duration::from_secs(1);
    let task = tokio::spawn(async move {
        discord::confirm(
            &pool,
            &key,
            &verifier,
            base,
            "123",
            "candidate blocked on authority",
            deadline,
        )
        .await
    });
    tokio::time::timeout(Duration::from_millis(800), async {
        loop {
            let waiting: i64 = sqlx::query_scalar(
                "SELECT count(*) FROM pg_stat_activity WHERE datname=current_database() AND wait_event_type='Lock' AND query LIKE '%FROM auth_state%FOR UPDATE%'",
            )
            .fetch_one(&fixture.pool)
            .await
            .unwrap();
            if waiting > 0 {
                assert!(Instant::now() < deadline);
                break;
            }
            tokio::time::sleep(Duration::from_millis(10)).await;
        }
    })
    .await
    .expect("actual confirm waited on the held authority row before expiry");
    tokio::time::sleep_until(tokio::time::Instant::from_std(
        deadline + Duration::from_millis(25),
    ))
    .await;
    blocker.commit().await.unwrap();
    assert_eq!(task.await.unwrap().err(), Some(store::Error::Conflict));
    let after = discord::capture(&fixture.pool, &fixture.key, &session)
        .await
        .unwrap();
    assert_eq!(
        after.link, pending.link,
        "expired confirm changed a durable link"
    );
}

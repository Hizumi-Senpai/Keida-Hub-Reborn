//! Real PostgreSQL authority contracts for private non-bearer session selectors.
use super::*;
use store::sessions as personal;

async fn reference(fixture: &Fixture, token: &[u8]) -> String {
    sqlx::query_scalar("SELECT public_ref::text FROM sessions WHERE verifier=$1")
        .bind(token)
        .fetch_one(&fixture.pool)
        .await
        .expect("read only this fixture's selector")
}
async fn session_state(fixture: &Fixture) -> String {
    sqlx::query_scalar("SELECT coalesce(jsonb_agg(to_jsonb(s) ORDER BY public_ref),'[]'::jsonb)::text FROM sessions s")
        .fetch_one(&fixture.pool).await.unwrap()
}
async fn other_authority(fixture: &Fixture) -> String {
    sqlx::query_scalar("SELECT jsonb_build_object('users',(SELECT jsonb_agg(u ORDER BY id) FROM users u),'auth',(SELECT jsonb_agg(a ORDER BY singleton) FROM auth_state a),'discord_app',(SELECT jsonb_agg(a ORDER BY singleton) FROM discord_application a),'discord_links',(SELECT jsonb_agg(l ORDER BY account_id) FROM discord_links l))::text")
        .fetch_one(&fixture.pool).await.unwrap()
}
async fn member(fixture: &Fixture, owner_token: &[u8]) -> (store::Account, Vec<u8>) {
    let who = store::create_member(
        &fixture.pool,
        &fixture.key,
        owner_token,
        "session_member",
        OTHER_PHC,
    )
    .await
    .unwrap();
    let snapshot = store::reserve_login(&fixture.pool, &fixture.key, "session_member", 2)
        .await
        .unwrap()
        .unwrap();
    let token = verifier(100);
    store::finish_login(&fixture.pool, &fixture.key, &snapshot, &token, None)
        .await
        .unwrap();
    (who, token)
}
async fn inactive_row(fixture: &Fixture, account: i64, index: u32, kind: &str) -> String {
    let token = verifier(index);
    sqlx::query("INSERT INTO sessions(verifier,account_id,generation,created_at,expires_at,revoked) VALUES($1,$2,$3,0,$4,$5)")
        .bind(&token).bind(account).bind(i64::from(kind == "old_generation"))
        .bind(if kind == "expired" { 1_i64 } else { i64::MAX })
        .bind(kind == "revoked").execute(&fixture.pool).await.unwrap();
    reference(fixture, &token).await
}

#[tokio::test]
async fn list_is_complete_scoped_ordered_and_never_exposes_inactive_sessions() {
    let (fixture, owner, current) = Fixture::owned().await;
    let others = fixture.seed_sessions(owner.id, 2).await;
    let (_, foreign) = member(&fixture, &current).await;
    let foreign_ref = reference(&fixture, &foreign).await;
    let excluded = [
        inactive_row(&fixture, owner.id, 200, "expired").await,
        inactive_row(&fixture, owner.id, 201, "revoked").await,
        inactive_row(&fixture, owner.id, 202, "old_generation").await,
    ];
    // Same-second creation is normal. Independent expected ordering uses the
    // canonical UUID strings, which have the same fixed-position byte order.
    sqlx::query("UPDATE sessions SET created_at=0 WHERE account_id=$1")
        .bind(owner.id)
        .execute(&fixture.pool)
        .await
        .unwrap();
    let mut expected = vec![reference(&fixture, &current).await];
    for other in &others {
        expected.push(reference(&fixture, other).await);
    }
    expected.sort_by(|left, right| right.cmp(left));
    let before = session_state(&fixture).await;
    let captured = personal::list(&fixture.pool, &fixture.key, &current)
        .await
        .unwrap();
    assert_eq!(captured.session.account.id, owner.id);
    assert_eq!(captured.session.generation, 0);
    assert_eq!(captured.sessions.len(), 3);
    assert_eq!(
        captured
            .sessions
            .iter()
            .map(|row| row.id.clone())
            .collect::<Vec<_>>(),
        expected
    );
    assert_eq!(
        captured.sessions.iter().filter(|row| row.current).count(),
        1
    );
    for row in &captured.sessions {
        assert!(personal::canonical_id(&row.id));
        assert!(row.expires_at > captured.checked_at);
        assert!(!excluded.contains(&row.id));
        assert_ne!(row.id, foreign_ref);
    }
    assert_eq!(
        session_state(&fixture).await,
        before,
        "list mutated durable authority"
    );
    let member_list = personal::list(&fixture.pool, &fixture.key, &foreign)
        .await
        .unwrap();
    assert_eq!(member_list.sessions.len(), 1);
    assert!(member_list.sessions[0].current);
    assert_eq!(member_list.sessions[0].id, foreign_ref);
}

#[tokio::test]
async fn targeted_revoke_changes_only_selected_revoked_bit_and_preserves_other_authority() {
    let (fixture, owner, current) = Fixture::owned().await;
    let others = fixture.seed_sessions(owner.id, 2).await;
    let (_, foreign) = member(&fixture, &current).await;
    // Opaque provider material must remain irrelevant to this local operation.
    sqlx::query("UPDATE discord_application SET revision=1,sealed=decode(repeat('a1',62),'hex')")
        .execute(&fixture.pool)
        .await
        .unwrap();
    sqlx::query("INSERT INTO discord_links(account_id,revision,flow_generation,discord_id,display_name,verified_at) VALUES($1,4,8,'18446744073709551615','Fixture identity',1)")
        .bind(owner.id).execute(&fixture.pool).await.unwrap();
    let target = reference(&fixture, &others[0]).await;
    let unchanged_rows: String = sqlx::query_scalar(
        "SELECT jsonb_agg(to_jsonb(s)-'revoked' ORDER BY public_ref)::text FROM sessions s",
    )
    .fetch_one(&fixture.pool)
    .await
    .unwrap();
    let authority = other_authority(&fixture).await;
    let captured = personal::revoke(&fixture.pool, &fixture.key, &current, &target)
        .await
        .unwrap();
    assert_eq!(captured.sessions.len(), 2);
    assert_eq!(captured.session.generation, 0);
    assert!(!captured.sessions.iter().any(|row| row.id == target));
    assert_eq!(
        store::session(&fixture.pool, &fixture.key, &others[0])
            .await
            .err(),
        Some(store::Error::Unauthorized)
    );
    for token in [&current, &others[1], &foreign] {
        assert!(
            store::session(&fixture.pool, &fixture.key, token)
                .await
                .is_ok()
        );
    }
    let after: String = sqlx::query_scalar(
        "SELECT jsonb_agg(to_jsonb(s)-'revoked' ORDER BY public_ref)::text FROM sessions s",
    )
    .fetch_one(&fixture.pool)
    .await
    .unwrap();
    assert_eq!(after, unchanged_rows);
    assert_eq!(other_authority(&fixture).await, authority);
    let revoked: Vec<String> =
        sqlx::query_scalar("SELECT public_ref::text FROM sessions WHERE revoked=TRUE")
            .fetch_all(&fixture.pool)
            .await
            .unwrap();
    assert_eq!(revoked, vec![target.clone()]);
    assert_eq!(
        personal::revoke(&fixture.pool, &fixture.key, &current, &target)
            .await
            .err(),
        Some(store::Error::Conflict)
    );
}

#[tokio::test]
async fn all_unavailable_or_current_selectors_conflict_without_modifying_rows() {
    let (fixture, owner, current) = Fixture::owned().await;
    let (_, foreign) = member(&fixture, &current).await;
    let expired = inactive_row(&fixture, owner.id, 200, "expired").await;
    let revoked = inactive_row(&fixture, owner.id, 201, "revoked").await;
    let stale = inactive_row(&fixture, owner.id, 202, "old_generation").await;
    let targets = [
        reference(&fixture, &current).await,
        reference(&fixture, &foreign).await,
        expired.clone(),
        revoked,
        stale,
        "00000000-0000-4000-8000-000000000000".into(),
    ];
    let before = session_state(&fixture).await;
    for target in targets {
        assert_eq!(
            personal::revoke(&fixture.pool, &fixture.key, &current, &target)
                .await
                .err(),
            Some(store::Error::Conflict)
        );
        assert_eq!(session_state(&fixture).await, before);
    }
    for target in ["not-a-uuid", "00000000-0000-4000-C000-000000000000"] {
        assert_eq!(
            personal::revoke(&fixture.pool, &fixture.key, &current, target)
                .await
                .err(),
            Some(store::Error::Rejected)
        );
    }
    // Normal login can prune an old selector. It never starts selecting the new
    // row which replaced it, even when generation and timestamps match.
    let captured = fixture.snapshot().await;
    store::finish_login(&fixture.pool, &fixture.key, &captured, &verifier(300), None)
        .await
        .unwrap();
    assert_eq!(
        personal::revoke(&fixture.pool, &fixture.key, &current, &expired)
            .await
            .err(),
        Some(store::Error::Conflict)
    );
    assert!(
        store::session(&fixture.pool, &fixture.key, &verifier(300))
            .await
            .is_ok()
    );
}

#[tokio::test]
async fn active_cap_is_complete_at_thirty_two_and_overflow_is_unavailable() {
    let (fixture, owner, current) = Fixture::owned().await;
    fixture.seed_sessions(owner.id, 31).await;
    let captured = personal::list(&fixture.pool, &fixture.key, &current)
        .await
        .unwrap();
    assert_eq!(captured.sessions.len(), 32);
    assert_eq!(
        captured.sessions.iter().filter(|row| row.current).count(),
        1
    );
    let mut references: Vec<_> = captured
        .sessions
        .iter()
        .map(|row| row.id.as_str())
        .collect();
    references.sort_unstable();
    references.dedup();
    assert_eq!(references.len(), 32);
    // A direct fixture corruption proves LIMIT33 is an overflow detector, not a
    // promise that an arbitrary first page is the complete set.
    sqlx::query("INSERT INTO sessions(verifier,account_id,generation,created_at,expires_at) SELECT $1,id,generation,0,9223372036854775807 FROM users WHERE id=$2")
        .bind(verifier(400)).bind(owner.id).execute(&fixture.pool).await.unwrap();
    let before = session_state(&fixture).await;
    assert_eq!(
        personal::list(&fixture.pool, &fixture.key, &current)
            .await
            .err(),
        Some(store::Error::Unavailable)
    );
    assert_eq!(session_state(&fixture).await, before);
}

async fn wait_for_target_lock(pool: &PgPool) {
    let deadline = tokio::time::Instant::now() + Duration::from_secs(2);
    loop {
        let waiting: bool = sqlx::query_scalar("SELECT EXISTS(SELECT 1 FROM pg_stat_activity WHERE datname=current_database() AND wait_event_type='Lock' AND query LIKE '%FROM sessions WHERE public_ref%FOR UPDATE%')")
            .fetch_one(pool).await.unwrap();
        if waiting {
            return;
        }
        assert!(
            tokio::time::Instant::now() < deadline,
            "target query never actually waited on its row lock"
        );
        tokio::time::sleep(Duration::from_millis(10)).await;
    }
}
async fn wait_for_database_expiry(pool: &PgPool, expiry: i64) {
    let deadline = tokio::time::Instant::now() + Duration::from_secs(4);
    loop {
        let now: i64 =
            sqlx::query_scalar("SELECT floor(extract(epoch FROM clock_timestamp()))::bigint")
                .fetch_one(pool)
                .await
                .unwrap();
        if now >= expiry {
            return;
        }
        assert!(
            tokio::time::Instant::now() < deadline,
            "real PostgreSQL expiry deadline"
        );
        tokio::time::sleep(Duration::from_millis(10)).await;
    }
}

#[tokio::test]
async fn acting_or_target_expiry_during_a_real_target_lock_wait_rolls_back() {
    for expires in ["actor", "target"] {
        let (fixture, owner, current) = Fixture::owned().await;
        let others = fixture.seed_sessions(owner.id, 1).await;
        let target = reference(&fixture, &others[0]).await;
        let expiring = if expires == "actor" {
            &current
        } else {
            &others[0]
        };
        let expiry: i64 = sqlx::query_scalar("UPDATE sessions SET expires_at=floor(extract(epoch FROM clock_timestamp()))::bigint+2 WHERE verifier=$1 RETURNING expires_at")
            .bind(expiring).fetch_one(&fixture.pool).await.unwrap();
        let mut blocker = fixture.pool.begin().await.unwrap();
        sqlx::query("SELECT verifier FROM sessions WHERE public_ref=$1::text::uuid FOR UPDATE")
            .bind(&target)
            .fetch_one(&mut *blocker)
            .await
            .unwrap();
        let before = session_state(&fixture).await;
        let pool = fixture.pool.clone();
        let key = fixture.key.clone();
        let caller = current.clone();
        let waiting =
            tokio::spawn(async move { personal::revoke(&pool, &key, &caller, &target).await });
        wait_for_target_lock(&fixture.pool).await;
        wait_for_database_expiry(&fixture.pool, expiry).await;
        blocker.commit().await.unwrap();
        let result = tokio::time::timeout(Duration::from_secs(2), waiting)
            .await
            .unwrap()
            .unwrap();
        assert_eq!(
            result.err(),
            Some(if expires == "actor" {
                store::Error::Unauthorized
            } else {
                store::Error::Conflict
            })
        );
        assert_eq!(
            session_state(&fixture).await,
            before,
            "expired authority changed a target row"
        );
    }
}

#[tokio::test]
async fn acting_expiry_after_the_target_write_rolls_that_write_back() {
    let (fixture, owner, current) = Fixture::owned().await;
    let others = fixture.seed_sessions(owner.id, 1).await;
    let target = reference(&fixture, &others[0]).await;
    // This owned database trigger pauses only the fixture's false->true write
    // after PostgreSQL has changed the row, without changing production SQL.
    sqlx::raw_sql("CREATE FUNCTION session_revocation_fixture_gate() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN PERFORM pg_advisory_xact_lock(2713); RETURN NEW; END; $$; CREATE TRIGGER session_revocation_fixture_gate AFTER UPDATE OF revoked ON sessions FOR EACH ROW WHEN (OLD.revoked=FALSE AND NEW.revoked=TRUE) EXECUTE FUNCTION session_revocation_fixture_gate();")
        .execute(&fixture.pool).await.unwrap();
    let mut blocker = fixture.pool.begin().await.unwrap();
    sqlx::query("SELECT pg_advisory_xact_lock(2713)")
        .execute(&mut *blocker)
        .await
        .unwrap();
    let expiry: i64 = sqlx::query_scalar("UPDATE sessions SET expires_at=floor(extract(epoch FROM clock_timestamp()))::bigint+2 WHERE verifier=$1 RETURNING expires_at")
        .bind(&current).fetch_one(&fixture.pool).await.unwrap();
    let before = session_state(&fixture).await;
    let pool = fixture.pool.clone();
    let key = fixture.key.clone();
    let caller = current.clone();
    let waiting =
        tokio::spawn(async move { personal::revoke(&pool, &key, &caller, &target).await });
    let deadline = tokio::time::Instant::now() + Duration::from_secs(2);
    loop {
        let blocked: bool = sqlx::query_scalar("SELECT EXISTS(SELECT 1 FROM pg_stat_activity WHERE datname=current_database() AND wait_event_type='Lock' AND query LIKE '%UPDATE sessions SET revoked = TRUE WHERE public_ref%')")
            .fetch_one(&fixture.pool).await.unwrap();
        if blocked {
            break;
        }
        assert!(
            tokio::time::Instant::now() < deadline,
            "target write never reached the AFTER trigger gate"
        );
        tokio::time::sleep(Duration::from_millis(10)).await;
    }
    wait_for_database_expiry(&fixture.pool, expiry).await;
    blocker.commit().await.unwrap();
    let result = tokio::time::timeout(Duration::from_secs(2), waiting)
        .await
        .unwrap()
        .unwrap();
    assert_eq!(result.err(), Some(store::Error::Unauthorized));
    assert_eq!(
        session_state(&fixture).await,
        before,
        "late authority failure committed the target write"
    );
}

#[tokio::test]
async fn queued_authority_changes_are_rechecked_before_targeted_effect() {
    for change in ["revoked", "generation", "inactive", "key"] {
        let (fixture, owner, current) = Fixture::owned().await;
        let others = fixture.seed_sessions(owner.id, 1).await;
        let target = reference(&fixture, &others[0]).await;
        let mut blocker = fixture.pool.begin().await.unwrap();
        sqlx::query("SELECT singleton FROM auth_state WHERE singleton=TRUE FOR UPDATE")
            .fetch_one(&mut *blocker)
            .await
            .unwrap();
        let pool = fixture.pool.clone();
        let key = fixture.key.clone();
        let caller = current.clone();
        let waiting =
            tokio::spawn(async move { personal::revoke(&pool, &key, &caller, &target).await });
        let deadline = tokio::time::Instant::now() + Duration::from_secs(2);
        loop {
            let blocked: bool=sqlx::query_scalar("SELECT EXISTS(SELECT 1 FROM pg_stat_activity WHERE datname=current_database() AND wait_event_type='Lock' AND query LIKE '%FROM auth_state WHERE singleton = TRUE FOR UPDATE%')")
                .fetch_one(&fixture.pool).await.unwrap();
            if blocked {
                break;
            }
            assert!(tokio::time::Instant::now() < deadline);
            tokio::time::sleep(Duration::from_millis(10)).await;
        }
        match change {
            "revoked" => {
                sqlx::query("UPDATE sessions SET revoked=TRUE WHERE verifier=$1")
                    .bind(&current)
                    .execute(&mut *blocker)
                    .await
                    .unwrap();
            }
            "generation" => {
                sqlx::query("UPDATE users SET generation=generation+1 WHERE id=$1")
                    .bind(owner.id)
                    .execute(&mut *blocker)
                    .await
                    .unwrap();
            }
            "inactive" => {
                sqlx::query("UPDATE users SET active=FALSE WHERE id=$1")
                    .bind(owner.id)
                    .execute(&mut *blocker)
                    .await
                    .unwrap();
            }
            "key" => {
                sqlx::query("UPDATE auth_state SET key_id=$1 WHERE singleton=TRUE")
                    .bind(vec![0x99_u8; 32])
                    .execute(&mut *blocker)
                    .await
                    .unwrap();
            }
            _ => unreachable!(),
        }
        blocker.commit().await.unwrap();
        let result = tokio::time::timeout(Duration::from_secs(2), waiting)
            .await
            .unwrap()
            .unwrap();
        assert_eq!(
            result.err(),
            Some(if change == "key" {
                store::Error::Unavailable
            } else {
                store::Error::Unauthorized
            })
        );
        let revoked: bool = sqlx::query_scalar("SELECT revoked FROM sessions WHERE verifier=$1")
            .bind(&others[0])
            .fetch_one(&fixture.pool)
            .await
            .unwrap();
        assert!(
            !revoked,
            "queued {change} authority still revoked another session"
        );
    }
}

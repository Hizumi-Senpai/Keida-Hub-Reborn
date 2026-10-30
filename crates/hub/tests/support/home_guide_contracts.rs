//! The new Home guidance is opt-in; retained profiles keep their exact payloads.
use super::*;

const PATH: &str = "/api/workspace/guide";
const PROFILE: &str = "home-tiles-v1";

fn request(server: &Server, actor: &Session) -> RequestBuilder {
    workspace_request(server, actor, Method::GET, PATH).header("x-reborn-guide", PROFILE)
}

#[tokio::test]
async fn home_guide_is_current_read_only_and_preserves_every_retained_profile() {
    let fixture = Fixture::new().await;
    let (server, owner, setup) = claimed(&fixture).await;
    let member = notification_member(&server, &owner, "home_guide_member").await;
    let note = "Private writing does not belong in Home roadmap guidance";
    assert_eq!(
        workspace_request(&server, &owner, Method::PUT, "/api/workspace/note")
            .json(&json!({"base_revision":"0","body":note}))
            .send()
            .await
            .unwrap()
            .status(),
        StatusCode::OK
    );
    let before_note = workspace_json(&server, &owner, "/api/workspace/snapshot").await;
    let before_history = history(&server, &owner, "").await;
    let before_notices = inbox(&server, &member).await;
    let profiles = [
        None,
        Some("media-v1"),
        Some("queues-v1"),
        Some("identity-v1"),
    ];
    let mut retained = Vec::new();
    for profile in profiles {
        let mut builder = workspace_request(&server, &owner, Method::GET, PATH);
        if let Some(profile) = profile {
            builder = builder.header("x-reborn-guide", profile);
        }
        let response = builder.send().await.unwrap();
        assert_eq!(response.status(), StatusCode::OK);
        let bytes = response.text().await.unwrap();
        let value: Value = serde_json::from_str(&bytes).unwrap();
        assert_eq!(value["roadmap"]["as_of"], "2026-10-27");
        if profile.is_some() {
            assert_eq!(
                value["catalog"][1]["requirements"][0],
                "An owner deliberately enrolls dedicated access, valid HTTPS and one selected library ID."
            );
        }
        retained.push(bytes);
    }
    let mut owner_guide: Option<Value> = None;
    for actor in [&owner, &member] {
        let response = request(&server, actor).send().await.unwrap();
        assert_eq!(response.status(), StatusCode::OK);
        assert_no_store(&response);
        assert!(
            response
                .headers()
                .get_all("set-cookie")
                .iter()
                .next()
                .is_none()
        );
        let text = response.text().await.unwrap();
        assert_private_text(
            &text,
            &[
                note,
                &owner.cookie,
                &member.cookie,
                &setup,
                OWNER_PASSWORD,
                MEMBER_PASSWORD,
            ],
        );
        let value: Value = serde_json::from_str(&text).unwrap();
        assert_eq!(value.as_object().unwrap().len(), 7);
        assert_eq!(value["product"], PRODUCT);
        assert_eq!(value["contract"], "reborn-workspace-v1");
        assert_eq!(value["schema"], 1);
        assert_eq!(value["account"], actor.account);
        assert_eq!(value["session_generation"], "0");
        let catalog = value["catalog"].as_array().unwrap();
        assert_eq!(catalog.len(), 7);
        assert_eq!(
            catalog
                .iter()
                .map(|row| row["id"].as_str().unwrap())
                .collect::<Vec<_>>(),
            [
                "crafty",
                "jellyfin",
                "seerr",
                "sonarr",
                "radarr",
                "qbittorrent",
                "discord"
            ]
        );
        assert_eq!(
            catalog
                .iter()
                .filter(|row| row["status"] == "available")
                .count(),
            6
        );
        assert_eq!(catalog[6]["status"], "planned");
        let jellyfin = catalog[1]["requirements"].to_string();
        assert!(
            jellyfin.contains("selected library")
                && jellyfin.contains("all-library root")
                && jellyfin.contains("administrator access")
        );
        assert_eq!(value["roadmap"]["as_of"], "2026-10-29");
        assert_eq!(
            value["roadmap"]["tracker_url"],
            "https://github.com/Hizumi-Senpai/Keida-Hub-Reborn/issues/2"
        );
        let priorities = value["roadmap"]["priorities"].to_string();
        assert!(
            priorities.contains("Home tiles")
                && priorities.contains("customize")
                && priorities.contains("freshness")
                && priorities.contains("mobile")
                && priorities.contains("Discord")
                && priorities.contains("issue41")
                && priorities.contains("separate approval")
        );
        let milestones = value["roadmap"]["milestones"].as_array().unwrap();
        assert_eq!(milestones.len(), 9);
        for (index, milestone) in milestones.iter().enumerate() {
            assert_eq!(milestone["id"], format!("M{index}"));
            assert!(!milestone["remaining"].as_array().unwrap().is_empty());
        }
        let daily = milestones[2]["delivered"].to_string();
        assert!(
            daily.contains("per-account")
                && daily.contains("add, remove")
                && daily.contains("Rust-owned defaults")
        );
        let delivered = milestones[5]["delivered"].to_string();
        assert!(
            delivered.contains("draft-safe")
                && delivered.contains("0.1.17")
                && delivered.contains("0.1.18")
                && delivered.contains("current assets")
                && delivered.contains("Candidate schema14")
                && delivered.contains("actual installation requires its own receipt")
        );
        let remaining = milestones[5]["remaining"].to_string();
        assert!(
            remaining.contains("read-only Rust namespace probe")
                && remaining.contains("issue41")
                && remaining.contains("separate installation and activation approval")
        );
        if let Some(previous) = &owner_guide {
            assert_eq!(value["catalog"], previous["catalog"]);
            assert_eq!(value["roadmap"], previous["roadmap"]);
        } else {
            owner_guide = Some(value);
        }
    }
    for (profile, expected) in profiles.into_iter().zip(retained) {
        let mut builder = workspace_request(&server, &owner, Method::GET, PATH);
        if let Some(profile) = profile {
            builder = builder.header("x-reborn-guide", profile);
        }
        assert_eq!(
            builder.send().await.unwrap().text().await.unwrap(),
            expected
        );
    }
    let after_note = workspace_json(&server, &owner, "/api/workspace/snapshot").await;
    assert_eq!(after_note["note"], before_note["note"]);
    assert_eq!(after_note["layout"], before_note["layout"]);
    assert_eq!(history(&server, &owner, "").await, before_history);
    assert_eq!(inbox(&server, &member).await, before_notices);
    assert_eq!(
        sqlx::query_scalar::<_, i64>("SELECT count(*) FROM dashboard_tiles")
            .fetch_one(&mut fixture.connect().await)
            .await
            .unwrap(),
        0
    );
    server.assert_logs_private(&[note, &owner.cookie, &member.cookie, &setup, OWNER_PASSWORD]);
}

#[tokio::test]
async fn home_guide_requires_current_workspace_admission_and_exact_profile() {
    let fixture = Fixture::new().await;
    let (server, owner, _) = claimed(&fixture).await;
    let member = notification_member(&server, &owner, "home_guide_admission").await;
    for value in ["home-tiles-v2", "home-tiles-v1,home-tiles-v1"] {
        error(
            workspace_request(&server, &owner, Method::GET, PATH)
                .header("x-reborn-guide", value)
                .send()
                .await
                .unwrap(),
            StatusCode::UPGRADE_REQUIRED,
            &[],
        )
        .await;
    }
    error(
        request(&server, &owner)
            .header("x-reborn-guide", PROFILE)
            .send()
            .await
            .unwrap(),
        StatusCode::UPGRADE_REQUIRED,
        &[],
    )
    .await;
    for (header, value, expected) in [
        (
            "x-reborn-product",
            "keida-hub-rewrite",
            StatusCode::UPGRADE_REQUIRED,
        ),
        (
            "x-reborn-contract",
            "wrong-contract",
            StatusCode::UPGRADE_REQUIRED,
        ),
        ("x-csrf-token", "wrong-binding", StatusCode::FORBIDDEN),
        ("cookie", "", StatusCode::UNAUTHORIZED),
    ] {
        error(
            request(&server, &owner)
                .header(header, value)
                .send()
                .await
                .unwrap(),
            expected,
            &[],
        )
        .await;
    }
    assert_eq!(
        server
            .authorized(Method::POST, "/api/auth/revoke-all", &member)
            .send()
            .await
            .unwrap()
            .status(),
        StatusCode::NO_CONTENT
    );
    error(
        request(&server, &member).send().await.unwrap(),
        StatusCode::UNAUTHORIZED,
        &[&member.cookie],
    )
    .await;
}

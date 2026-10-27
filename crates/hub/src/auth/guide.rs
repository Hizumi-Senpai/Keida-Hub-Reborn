//! Shipped product guidance; no live-provider or deployment acceptance is inferred.
use super::*;

pub fn router(service: Service) -> Router {
    Router::new()
        .route("/api/workspace/guide", get(read))
        .with_state(service)
}

async fn read(State(service): State<Service>, headers: HeaderMap) -> Response {
    let result = async {
        let p = workspace::bound(&service, &headers, false).await?;
        let current = store::guide_session(&service.pool, &service.key_id, &p.hash).await?;
        Ok::<_, ApiError>(Json(json!({
            "product":"keida-hub-reborn", "contract":"reborn-workspace-v1", "schema":1,
            "account":account(current.account), "session_generation":current.generation.to_string(),
            "catalog":catalog(), "roadmap":roadmap()
        })).into_response())
    }
    .await;
    result.unwrap_or_else(private_error)
}

fn catalog() -> Value {
    json!([
        {"id":"crafty","name":"Crafty","status":"available",
         "summary":"Read-only observations for deliberately selected game servers.",
         "requirements":["An owner enrolls a dedicated token limited to viewing the selected servers.","Valid HTTPS, Crafty's configured time zone and owner-reviewed server and join details."],
         "capabilities":["Provider-reported process state and nullable player counts.","Explicit sample freshness and retained, sampled observation history.","Enrollment does not transfer start, stop, wake, proxy or updater responsibility."]},
        {"id":"jellyfin","name":"Jellyfin","status":"planned",
         "summary":"Library rows and playback summaries are future media work.",
         "requirements":["Deliberate dedicated access, account privacy and real provider acceptance."],
         "capabilities":["Planned bounded library and playback observations; no adapter is available in this build."]},
        {"id":"seerr","name":"Seerr","status":"planned",
         "summary":"Useful media-request views, followed by separately reviewed request actions.",
         "requirements":["Dedicated access and an explicit request and approval permission design."],
         "capabilities":["Planned request observations; request and approval writes require their own acceptance."]},
        {"id":"sonarr","name":"Sonarr","status":"planned",
         "summary":"Television library and queue views are later media work.",
         "requirements":["Deliberate access, bounded pagination and honest freshness and failure handling."],
         "capabilities":["Planned observation views; download and management actions are separate work."]},
        {"id":"radarr","name":"Radarr","status":"planned",
         "summary":"Movie library and queue views are later media work.",
         "requirements":["Deliberate access, bounded pagination and honest freshness and failure handling."],
         "capabilities":["Planned observation views; download and management actions are separate work."]},
        {"id":"qbittorrent","name":"qBittorrent","status":"planned",
         "summary":"Download queue observations are planned after the first media integrations.",
         "requirements":["Dedicated access and separately reviewed permissions for any download changes."],
         "capabilities":["Planned queue observations; no download controls are available in this build."]},
        {"id":"discord","name":"Discord","status":"planned",
         "summary":"Friends, immutable identity links and deliberately enrolled bot workflows.",
         "requirements":["OAuth state and linking safeguards, guild policy, recovery and real revoked-session acceptance."],
         "capabilities":["Planned sign-in and bot workflows use the same Rust authorization owners.","No inherited game controller or background bot is installed by this catalog."]}
    ])
}

fn roadmap() -> Value {
    json!({
        "as_of":"2026-10-27",
        "intro":"A work-list note shipped with this build. It is a dated roadmap snapshot, not a live deployment or acceptance report. Milestones remain open until their full workflows are accepted. Your private workspace note is separate.",
        "priorities":[
            "Use the integration catalog and retained Crafty observation history; review the refreshed desktop and mobile workspace.",
            "Deliberately enroll dedicated read-only Crafty access, valid TLS and reviewed server and public join details; verify real observations and freshness.",
            "Begin Jellyfin and Seerr observation workflows after the daily dashboard slice."
        ],
        "tracker_url":"https://github.com/Hizumi-Senpai/Keida-Hub-Reborn/issues/2",
        "milestones":[
            {"id":"M0","title":"Foundation and contracts","status":"In progress",
             "delivered":["Rust/PostgreSQL authority, secure owner and revocable sessions, numbered source identity and a persistent Svelte workspace."],
             "remaining":["Broader old-client, room, asset and edit contracts as real callers arrive; complete owner workflow acceptance."]},
            {"id":"M1","title":"Crafty first","status":"Real provider acceptance pending",
             "delivered":["Dedicated encrypted enrollment form and tested GET-only state, player, join and freshness observations."],
             "remaining":["Deliberate real Crafty enrollment, least-privilege and TLS review, real observations and outside-network join acceptance."]},
            {"id":"M2","title":"Daily Hub workflows","status":"In progress",
             "delivered":["Private note, service directory, categories and search, personal pins, Activity, notifications and read state, and personal Home arrangement.","Revisitable integration catalog, sampled provider observation history and this Roadmap note in this build."],
             "remaining":["Complete real-use keyboard, desktop and mobile acceptance and retained diagnostic feedback as providers expand."]},
            {"id":"M3","title":"Media and downloads","status":"Planned",
             "delivered":[],
             "remaining":["Jellyfin and Seerr observations first, then Sonarr, Radarr and qBittorrent queues.","Separately design and accept every request, approval or download mutation."]},
            {"id":"M4","title":"Friends, identity and Discord","status":"Planned",
             "delivered":[],
             "remaining":["Discord OAuth and deliberate account linking, guild policy, recovery, revoked sessions and bot workflows."]},
            {"id":"M5","title":"Install, upgrade and recover","status":"Partly implemented",
             "delivered":["Manual artifact publication and installation, matched PostgreSQL/key/configuration backups and isolated recovery rehearsals."],
             "remaining":["Broader compatible rollback coverage and draft-safe update workflows.","A concrete host-updater review and separate owner authorization before activation."]},
            {"id":"M6","title":"Safe game controls and transfer","status":"Not transferred",
             "delivered":[],
             "remaining":["Accept one game and its operation owner at a time, including player, proxy and join fences, recovery and every existing writer and listener."]},
            {"id":"M7","title":"Avatar and editable room","status":"Direction locked; implementation later",
             "delivered":["GLB/VRM and modular-room direction recorded."],
             "remaining":["Optional renderer, versioned assets and room documents, account-scoped editing and recoverable saves while preserving dashboard and form lifetimes."]},
            {"id":"M8","title":"Accepted replacement decision","status":"Later owner decision",
             "delivered":[],
             "remaining":["Agree the required workflow inventory, close live acceptance, evaluate normal-use reliability and recovery, and obtain an explicit replacement decision.","The original site and its responsibilities remain with their existing owners."]}
        ]
    })
}

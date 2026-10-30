//! Independently frozen issue43 behavior over actual Rust, PostgreSQL and Chromium.
use crate::{Check, check, driver::Browser, fixture::Fixture, workflows::*};
use serde_json::json;
use std::time::Duration;

const DEFAULT_OWNER: [&str; 5] = ["games", "jellyfin", "requests", "downloads", "services"];
const ARRANGED: [&str; 5] = ["services", "games", "requests", "downloads", "note"];
const BROWSER_A: &str = "home-tiles-a";
const BROWSER_B: &str = "home-tiles-b";

async fn mark_browser(b: &Browser, marker: &'static str) -> Check<()> {
    b.cdp("Network.enable", json!({})).await?;
    b.cdp(
        "Network.setExtraHTTPHeaders",
        json!({"headers":{(crate::fixture::BROWSER_MARKER):marker}}),
    )
    .await?;
    Ok(())
}

pub(super) async fn ready(b: &Browser) -> Check<()> {
    b.wait("const c=document.querySelector('.customize-tiles');return !!c && !c.disabled && document.querySelectorAll('[data-home-tile]').length>=2;",json!([])).await
}

async fn selected(b: &Browser, expected: &[&str]) -> Check<()> {
    b.wait("const rows=[...document.querySelectorAll('[data-home-tile]')].filter(e=>e.getClientRects().length>0&&!e.closest('[hidden]'));return rows.map(e=>e.dataset.homeTile).join(',')===arguments[0].join(',');",json!([expected])).await
}

async fn edit(b: &Browser) -> Check<()> {
    b.click(".customize-tiles").await?;
    b.wait("return !!document.querySelector('.tiles-editor:not([hidden])') && !document.querySelector('.cancel-tiles').disabled;",json!([])).await
}

async fn committed(b: &Browser) -> Check<()> {
    b.wait("return !document.querySelector('.tiles-editor:not([hidden])') && /saved|matches your changes/i.test(document.querySelector('.tiles-status')?.textContent||'');",json!([])).await
}

async fn arrange(b: &Browser) -> Check<()> {
    let result = arrange_steps(b).await;
    if result.is_err() {
        // Fixed booleans only: never print DOM, form values or protocol replies.
        let diagnostic = b.evaluate("return [document.hasFocus(),document.visibilityState==='visible',!!document.querySelector('.tiles-editor:not([hidden])'),document.activeElement?.closest('[data-tile-row]')?.dataset.tileRow==='services',document.querySelector('[data-tile-row]')?.dataset.tileRow==='services',document.querySelector('button[aria-label=\"Move Pinned services up\"]')?.disabled===true,[...document.querySelectorAll('[data-home-tile]')].filter(e=>e.getClientRects().length>0&&!e.closest('[hidden]')).map(e=>e.dataset.homeTile).join(',')==='services,games,requests,downloads,note',document.querySelector('[data-home-tile=games]')?.dataset.tileSize==='normal'];",json!([])).await;
        if let Ok(state) = diagnostic {
            println!(
                "RUST_BROWSER_TILE_ARRANGE focus={} visible={} editor={} services_focus={} services_first={} up_disabled={} order={} width={}",
                state[0] == true,
                state[1] == true,
                state[2] == true,
                state[3] == true,
                state[4] == true,
                state[5] == true,
                state[6] == true,
                state[7] == true,
            );
        }
    }
    result
}

async fn arrange_steps(b: &Browser) -> Check<()> {
    step("tiles arrange open editor");
    edit(b).await?;
    step("tiles arrange add note and remove Jellyfin");
    b.click("button[aria-label='Add Workspace note']").await?;
    b.click("button[aria-label='Remove Jellyfin']").await?;
    step("tiles arrange first keyboard move and focus wait");
    check(b.evaluate("const e=document.querySelector('button[aria-label=\"Move Pinned services up\"]');e.focus();return document.activeElement===e;",json!([])).await?==true,"tile reorder command receives actual keyboard focus")?;
    b.keys("\u{e007}").await?;
    b.wait(
        "return document.activeElement?.closest('[data-tile-row]')?.dataset.tileRow==='services';",
        json!([]),
    )
    .await?;
    step("tiles arrange second move by native click");
    b.click("button[aria-label='Move Pinned services up']")
        .await?;
    step("tiles arrange final keyboard move and first-row focus wait");
    check(b.evaluate("const e=document.querySelector('button[aria-label=\"Move Pinned services up\"]');e.focus();return document.activeElement===e;",json!([])).await?==true,"the final move to the first row starts on its native keyboard control")?;
    b.keys("\u{e007}").await?;
    b.wait("return document.activeElement?.closest('[data-tile-row]')?.dataset.tileRow==='services'&&document.querySelector('button[aria-label=\"Move Pinned services up\"]').disabled;",json!([])).await?;
    check(b.evaluate("return new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve(document.activeElement?.closest('[data-tile-row]')?.dataset.tileRow==='services'&&document.querySelector('button[aria-label=\"Move Pinned services up\"]').disabled))));",json!([])).await?==true,"the first-row keyboard move retains row focus after two rendered frames")?;
    // Native keyboard selection changes the actual select and its bound state.
    step("tiles arrange native width selection");
    b.click("select[aria-label='Game servers tile width']")
        .await?;
    b.keys("\u{e011}\u{e007}").await?;
    step("tiles arrange preview order and width checks");
    selected(b, &ARRANGED).await?;
    check(
        b.evaluate(
            "return document.querySelector('[data-home-tile=games]')?.dataset.tileSize==='normal';",
            json!([]),
        )
        .await?
            == true,
        "native tile width selection changes the preview",
    )
}

/// Replaces the former fixed-three-panel UI workflow while preserving its
/// actual save/race/privacy/focus coverage on the delivered configurable Home.
pub async fn arrangement() -> Check<()> {
    step("tiles arrangement native defaults, selection, width, order and draft lifetimes");
    let f = Fixture::new().await?;
    let mut a = f.browser(true).await?;
    mark_browser(&a, BROWSER_A).await?;
    claim(&f, &a).await?;
    let (member, password) = f.enroll_member(&a).await?;
    workspace(&f, &a).await?;
    ready(&a).await?;
    selected(&a, &DEFAULT_OWNER).await?;
    check(a.evaluate("return !document.querySelector('.welcome-card') && document.querySelector('[data-home-tile=games]').dataset.tileSize==='wide' && document.querySelector('[data-home-tile=downloads]').dataset.tileSize==='wide';",json!([])).await?==true,"Home starts with useful service tiles and purposeful widths rather than the note hero")?;
    note(&a).await?;
    a.fill(
        "#workspace-note",
        "An unfinished note while arranging tiles",
    )
    .await?;
    a.click(".main-nav button:nth-child(4)").await?;
    a.fill(
        "#service-name",
        "An unfinished service while arranging tiles",
    )
    .await?;
    a.evaluate("window.__tileNote=document.querySelector('#workspace-note');window.__tileService=document.querySelector('#service-name');window.__tileNodes=[...document.querySelectorAll('[data-home-tile]')];return true;",json!([])).await?;
    a.click(".main-nav button:first-child").await?;
    let before = f.writes();
    arrange(&a).await?;
    a.click(".reset-tiles").await?;
    selected(&a, &DEFAULT_OWNER).await?;
    for label in ["Jellyfin", "Requests", "Downloads", "Pinned services"] {
        a.click(&format!("button[aria-label='Remove {label}']"))
            .await?;
    }
    selected(&a, &["games"]).await?;
    check(
        a.evaluate(
            "return document.querySelector('button[aria-label=\"Remove Game servers\"]').disabled;",
            json!([]),
        )
        .await?
            == true,
        "the final selected tile cannot be removed",
    )?;
    a.click(".reset-tiles").await?;
    a.click(".cancel-tiles").await?;
    selected(&a, &DEFAULT_OWNER).await?;
    check(
        f.writes() == before,
        "tile preview, reset and cancellation cannot write",
    )?;
    // Capture stable tile elements after cancelled selection changes. Only
    // retained tile identities are required to survive the following moves.
    a.evaluate("window.__retainedTiles=[...document.querySelectorAll('[data-home-tile]')].filter(e=>['games','requests','downloads','services'].includes(e.dataset.homeTile));return true;",json!([])).await?;
    arrange(&a).await?;
    a.click(".save-tiles").await?;
    committed(&a).await?;
    selected(&a, &ARRANGED).await?;
    check(
        f.writes() == before + 1,
        "a deliberate tile save sends one mutation",
    )?;
    check(a.evaluate("return window.__tileNote===document.querySelector('#workspace-note') && window.__tileService===document.querySelector('#service-name') && window.__tileNote.value==='An unfinished note while arranging tiles' && window.__tileService.value==='An unfinished service while arranging tiles' && window.__retainedTiles.every(e=>e===[...document.querySelectorAll('[data-home-tile]')].find(n=>n.dataset.homeTile===e.dataset.homeTile));",json!([])).await?==true,"tile arrangement preserves actual retained tile components and note/service editor instances and unfinished content")?;
    a.click(".main-nav button:nth-child(4)").await?;
    check(a.evaluate("return document.querySelector('#service-name').value==='An unfinished service while arranging tiles';",json!([])).await?==true,"service draft remains usable after tile save")?;
    a.click(".main-nav button:first-child").await?;

    step("tiles reload, stale concurrent edit and explicit conflict comparison");
    let mut b = f.browser(true).await?;
    mark_browser(&b, BROWSER_B).await?;
    sign_in(&f, &b, &f.username, &f.password).await?;
    workspace(&f, &b).await?;
    ready(&b).await?;
    selected(&b, &ARRANGED).await?;
    edit(&b).await?;
    b.click("button[aria-label='Remove Requests']").await?;
    // Hold a real read of the old revision. The editor's base stays pinned
    // while another actual browser commits a different arrangement.
    let stale = f.hold_browser_get("/api/workspace/tiles", BROWSER_B);
    b.evaluate(
        "window.dispatchEvent(new Event('focus'));return true;",
        json!([]),
    )
    .await?;
    tokio::time::timeout(Duration::from_secs(3), stale.entered.notified())
        .await
        .map_err(|_| "stale tile read entered")?;
    edit(&a).await?;
    a.click(".reset-tiles").await?;
    a.click(".save-tiles").await?;
    committed(&a).await?;
    stale.release.notify_one();
    let rejected = f.hold_conflict("/api/workspace/tiles");
    b.click(".save-tiles").await?;
    tokio::time::timeout(Duration::from_secs(3), rejected.entered.notified())
        .await
        .map_err(|_| "actual rejected stale tile save entered")?;
    // The real upstream409 has already arrived. Block only its subsequent
    // canonical read, so the UI cannot present an older local value as a checked
    // conflict comparison. No authentication or application response is faked.
    b.cdp("Network.enable", json!({})).await?;
    b.cdp(
        "Network.setBlockedURLs",
        json!({"urls":[format!("{}/api/workspace/tiles",f.origin)]}),
    )
    .await?;
    rejected.release.notify_one();
    b.wait("const c=document.querySelector('section[aria-label=\"Tile layout conflict\"] .check-tiles');return !!c&&!c.disabled&&document.querySelector('.save-tiles').disabled;",json!([])).await?;
    selected(&b, &["services", "games", "downloads", "note"]).await?;
    check(b.evaluate("const s=document.querySelector('section[aria-label=\"Tile layout conflict\"]');return !!s && s.textContent.includes('latest saved layout still needs checking') && !s.querySelector('button:not(.check-tiles)');",json!([])).await?==true,"a failed canonical conflict read retains the draft and check control without offering stale comparison choices")?;
    b.cdp("Network.setBlockedURLs", json!({"urls":[]})).await?;
    b.click(".tiles-editor .check-tiles").await?;
    b.wait(
        "const s=document.querySelector('section[aria-label=\"Tile layout conflict\"]');return !!s&&s.querySelectorAll('button').length===2&&!s.querySelector('.check-tiles');",
        json!([]),
    )
    .await?;
    selected(&b, &["services", "games", "downloads", "note"]).await?;
    check(b.evaluate("const s=document.querySelector('section[aria-label=\"Tile layout conflict\"]');return !!s && s.textContent.includes('Game servers') && document.querySelector('.save-tiles').disabled;",json!([])).await?==true,"tile conflict retains local preview and disables stale resubmission until an explicit choice")?;
    b.click("section[aria-label='Tile layout conflict'] button:last-of-type")
        .await?;
    selected(&b, &DEFAULT_OWNER).await?;

    step("tiles committed lost response reconciles by read without another save");
    arrange(&b).await?;
    step("tiles lost response install held save and click Save");
    let writes = f.writes();
    let lost = f.hold_write("/api/workspace/tiles");
    b.click(".save-tiles").await?;
    tokio::time::timeout(Duration::from_secs(3), lost.entered.notified())
        .await
        .map_err(|_| "committed tile save entered")?;
    step("tiles lost response committed upstream; await uncertain UI");
    b.wait(
        "return !!document.querySelector('section[aria-label=\"Uncertain tile save\"]');",
        json!([]),
    )
    .await?;
    check(
        b.evaluate(
            "return document.querySelector('.save-tiles').disabled;",
            json!([]),
        )
        .await?
            == true,
        "uncertain tile save cannot be automatically or deliberately resubmitted",
    )?;
    step("tiles lost response release held reply and deliberately check saved tiles");
    lost.release.notify_one();
    b.click(".check-tiles").await?;
    step("tiles lost response await read reconciliation and exact one-write check");
    committed(&b).await?;
    selected(&b, &ARRANGED).await?;
    check(
        f.writes() == writes + 1,
        "lost committed tile reply is reconciled by authorized GET without PUT replay",
    )?;

    step("tiles remote arrangement preserves a focused service form and selection");
    a.click(".main-nav button:nth-child(4)").await?;
    a.fill(
        "#service-name",
        "A focused service draft during remote tile changes",
    )
    .await?;
    check(a.evaluate("window.__focusedTileService=document.querySelector('#service-name');window.__focusedTileService.setSelectionRange(3,11);return document.activeElement===window.__focusedTileService;",json!([])).await?==true,"the service editor starts with an actual selection")?;
    edit(&b).await?;
    b.click(".reset-tiles").await?;
    b.click(".save-tiles").await?;
    committed(&b).await?;
    let refreshed = f.hold_browser_get("/api/workspace/tiles", BROWSER_A);
    a.evaluate("window.__tileReadStart=performance.now();window.dispatchEvent(new Event('focus'));return true;",json!([])).await?;
    tokio::time::timeout(Duration::from_secs(3), refreshed.entered.notified())
        .await
        .map_err(|_| "focused service tile read entered")?;
    refreshed.release.notify_one();
    a.wait("return performance.getEntriesByType('resource').some(e=>new URL(e.name).pathname==='/api/workspace/tiles'&&e.initiatorType==='fetch'&&e.startTime>=window.__tileReadStart);",json!([])).await?;
    a.evaluate(
        "return new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(()=>r(true))));",
        json!([]),
    )
    .await?;
    check(a.evaluate("return document.querySelector('#service-name')===window.__focusedTileService && document.activeElement===window.__focusedTileService && window.__focusedTileService.selectionStart===3 && window.__focusedTileService.selectionEnd===11 && window.__focusedTileService.value==='A focused service draft during remote tile changes';",json!([])).await?==true,"a remote tile refresh does not replace, blur or rewrite the active service form")?;
    a.click(".main-nav button:first-child").await?;
    selected(&a, &DEFAULT_OWNER).await?;

    step("tiles account isolation and desktop/mobile keyboard accessibility");
    let mut other = f.browser(true).await?;
    sign_in(&f, &other, &member, &password).await?;
    workspace(&f, &other).await?;
    ready(&other).await?;
    selected(&other, &["games", "services"]).await?;
    edit(&other).await?;
    check(other.evaluate("return !['jellyfin','requests','downloads'].some(id=>document.querySelector('[data-home-tile='+id+']')||document.querySelector('[data-tile-row='+id+']')) && !document.querySelector('button[aria-label=\"Add Jellyfin\"]');",json!([])).await?==true,"member layout and catalog cannot expose owner-only provider tiles")?;
    other
        .click("button[aria-label='Add Workspace note']")
        .await?;
    other
        .click("button[aria-label='Remove Pinned services']")
        .await?;
    other.click(".save-tiles").await?;
    committed(&other).await?;
    workspace(&f, &other).await?;
    ready(&other).await?;
    selected(&other, &["games", "note"]).await?;
    workspace(&f, &b).await?;
    ready(&b).await?;
    selected(&b, &DEFAULT_OWNER).await?;
    accessibility(&b).await?;
    edit(&b).await?;
    accessibility(&b).await?;
    b.mobile().await?;
    b.cdp(
        "Emulation.setEmulatedMedia",
        json!({"features":[{"name":"prefers-reduced-motion","value":"reduce"}]}),
    )
    .await?;
    accessibility(&b).await?;
    check(b.evaluate("return innerWidth===390 && document.documentElement.scrollWidth<=innerWidth+1 && matchMedia('(prefers-reduced-motion: reduce)').matches;",json!([])).await?==true,"Home tiles and their native controls reflow at390px with reduced motion")?;
    b.click(".cancel-tiles").await?;
    accessibility(&b).await?;

    step("tiles privacy boundary rejects an obsolete authorized read after revocation");
    edit(&b).await?;
    b.click("button[aria-label='Add Workspace note']").await?;
    let private = f.hold_browser_get("/api/workspace/tiles", BROWSER_B);
    b.evaluate(
        "window.dispatchEvent(new Event('focus'));return true;",
        json!([]),
    )
    .await?;
    tokio::time::timeout(Duration::from_secs(3), private.entered.notified())
        .await
        .map_err(|_| "private tile read entered")?;
    check(b.evaluate("window.dispatchEvent(new Event('blur'));return !document.querySelector('.tiles-editor:not([hidden])') && document.querySelector('#workspace-note')?.value==='' && ![...document.querySelectorAll('[data-home-tile]')].some(e=>e.getClientRects().length>0&&!e.closest('[hidden]'));",json!([])).await?==true,"privacy loss synchronously removes tile draft, private summaries and note content")?;
    f.revoke_all(&b).await?;
    private.release.notify_one();
    tokio::time::sleep(Duration::from_millis(200)).await;
    check(b.evaluate("return !document.querySelector('.tiles-editor:not([hidden])') && ![...document.querySelectorAll('[data-home-tile]')].some(e=>e.getClientRects().length>0&&!e.closest('[hidden]'));",json!([])).await?==true,"a late tile read cannot repopulate the revoked private scope")?;
    other.close().await?;
    b.close().await?;
    a.close().await?;
    f.close().await?;
    println!(
        "PASS Rust browser: configurable Home tile selection/width/order, drafts/components/focus, conflict, lost reply without replay, role/account isolation, privacy and390px/Axe"
    );
    Ok(())
}

pub async fn run() -> Check<()> {
    resources_and_native_recovery().await?;
    println!(
        "Rust Home tile browser acceptance:1 additional workflow passed; actual Rust HTTPS/PostgreSQL and pinned Chromium; no skipped prerequisite"
    );
    Ok(())
}

async fn observe_home(b: &Browser, id: &'static str, expected: &'static str) -> Check<()> {
    println!("RUST_BROWSER_STEP Home await automatic {id} summary");
    let observed = b.wait("return document.querySelector('[data-home-tile='+arguments[0]+']')?.textContent.includes(arguments[1]);",json!([id,expected])).await;
    if observed.is_err() {
        let diagnostic = b.evaluate("const t=document.querySelector('[data-home-tile='+arguments[0]+']');return [document.hasFocus(),document.visibilityState==='visible',!!t,!!t&&t.getClientRects().length>0&&!t.closest('[hidden]'),!!t&&t.textContent.includes(arguments[1]),document.querySelector('.main-nav button:first-child')?.getAttribute('aria-current')==='page',!!document.querySelector('.customize-tiles')&&!document.querySelector('.customize-tiles').disabled];",json!([id,expected])).await;
        println!(
            "RUST_BROWSER_HOME_SUMMARY tile={id} flags={}",
            diagnostic.unwrap_or(json!(null))
        );
    }
    observed
}

async fn export_home_fixture_png(b: &Browser, viewport: &'static str) -> Check<()> {
    check(
        matches!(viewport, "desktop" | "mobile"),
        "closed fixture screenshot profile",
    )?;
    check(b.evaluate("const home=document.querySelector('section.home-view');return location.pathname==='/workspace'&&document.querySelector('.main-nav button:first-child')?.getAttribute('aria-current')==='page'&&!!home&&home.getClientRects().length>0&&!home.closest('[hidden]')&&!document.querySelector('.tiles-editor')&&home.textContent.includes('Reviewed Home fixture game')&&home.textContent.includes('Fixture movie')&&home.textContent.includes('Requested movie')&&home.textContent.includes('Fixture transfer')&&[...document.querySelectorAll('input,textarea')].filter(e=>e.type!=='hidden'&&e.id!=='workspace-note').every(e=>!e.value||e.type==='checkbox')&&![...document.querySelectorAll('form.credential-form,[type=password]')].some(e=>e.getClientRects().length>0&&!e.closest('[hidden]'));",json!([])).await?==true,"only the fixed fictional Home fixture with closed cleared provider forms may be exported")?;
    b.evaluate("window.scrollTo(0,0);return new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(()=>r(true))));",json!([])).await?;
    if viewport == "mobile" {
        check(b.evaluate("const tile=document.querySelector('[data-home-tile=games]')?.getBoundingClientRect();return innerWidth===390&&!!tile&&tile.top>=0&&tile.top+120<=innerHeight&&document.documentElement.scrollWidth<=innerWidth+1;",json!([])).await?==true,"mobile Home shows useful game-tile content in the first viewport without horizontal page overflow")?;
    }
    let png = b.fixture_home_screenshot().await?;
    println!("SAFE_HOME_FIXTURE_PNG {viewport} {png}");
    Ok(())
}

async fn resources_and_native_recovery() -> Check<()> {
    use reborn_crafty_fixture::{self as c, media as m, queues as q};
    step("Home automatically loads selected real provider summaries without per-tile clicks");
    let gateway = crate::game_status::Gateway::start().await?;
    let f = Fixture::with_game_routes(gateway.address, c::ID).await?;
    let crafty = c::Crafty::start().await?;
    let media = m::Media::start().await?;
    let qbit = q::Queues::start("qbittorrent")
        .await
        .map_err(|_| "Home queue HTTPS fixture")?;
    let mut b = f.browser(true).await?;
    claim(&f, &b).await?;
    let (member, password) = f.enroll_member(&b).await?;
    workspace(&f, &b).await?;
    ready(&b).await?;
    note(&b).await?;
    let draft = "An unfinished note kept while checking Home observations";
    b.fill("#workspace-note", draft).await?;
    b.evaluate(
        "window.__homeResourceNote=document.querySelector('#workspace-note');return true;",
        json!([]),
    )
    .await?;
    b.click(".main-nav button:nth-child(3)").await?;
    b.fill("#crafty-endpoint", &crafty.origin).await?;
    b.fill("#crafty-token", c::TOKEN).await?;
    b.fill("#crafty-timezone", "UTC").await?;
    b.fill("#crafty-ca", &crafty.ca).await?;
    b.fill("input[name=server-id]", c::ID).await?;
    b.fill("input[name=server-name]", "Reviewed Home fixture game")
        .await?;
    b.fill("input[name=server-join]", "play.example:25565")
        .await?;
    b.click(".connection-setup form button[type=submit]")
        .await?;
    b.wait(
        "return document.querySelector('.server-card')?.textContent.includes('0 reported');",
        json!([]),
    )
    .await?;
    b.click(".main-nav button:nth-child(9)").await?;
    b.wait("return !!document.querySelector('#jellyfin-token') && !!document.querySelector('#seerr-token');",json!([])).await?;
    media_enroll(&b, &media, "jellyfin").await?;
    media_enroll(&b, &media, "seerr").await?;
    step("Home provider setup open Queues through normal navigation");
    b.click(".main-nav button:nth-child(10)").await?;
    step("Home provider setup await current qBittorrent enrollment status");
    let queues_ready = b.wait("return document.querySelector('[data-queue-provider=qbittorrent]')?.dataset.queuePhase==='ready';",json!([])).await;
    if queues_ready.is_err() {
        let diagnostic = b.evaluate("return [document.hasFocus(),document.visibilityState==='visible',document.querySelector('.main-nav button:nth-child(10)')?.getAttribute('aria-current')==='page',...['qbittorrent','sonarr','radarr'].flatMap(p=>{const s=document.querySelector('[data-queue-provider='+p+']');return [!!s,!!s&&s.getClientRects().length>0&&!s.closest('[hidden]'),s?.dataset.queuePhase==='ready',s?.dataset.queuePhase==='loading',s?.dataset.queuePhase==='error',s?.dataset.queueConfigured==='true',!!s?.querySelector('.queue-save')&&!s.querySelector('.queue-save').disabled]})];",json!([])).await;
        println!(
            "RUST_BROWSER_HOME_QUEUE_ENTRY flags={}",
            diagnostic.unwrap_or(json!(null))
        );
    }
    queues_ready?;
    step("Home provider setup enroll qBittorrent using native form");
    queue_enroll(&b, &qbit, "qbittorrent").await?;
    step("Home provider setup verify no implicit queue sample");
    check(
        qbit.requests().is_empty(),
        "queue enrollment and detail status cannot implicitly collect a provider sample",
    )?;
    step("Home provider setup return to Home with all fixture enrollments saved");
    b.click(".main-nav button:first-child").await?;
    ready(&b).await?;
    let writes = f.writes();
    // First reads start the bounded Rust collectors and may return checking.
    // Observe one real existing workspace tick before requiring completed rows;
    // retain the ordinary nine-second DOM waits and the180-second total cap.
    step("Home initial automatic reads return enrolled collection state");
    b.wait("return ['jellyfin','seerr'].every(p=>{const s=document.querySelector('[data-media-provider='+p+']');return s?.dataset.mediaConfigured==='true'&&(s.dataset.mediaError==='checking'||s.querySelectorAll('[data-media-item]').length>0)})&&(()=>{const s=document.querySelector('[data-queue-provider=qbittorrent]');return s?.dataset.queueConfigured==='true'&&(s.dataset.queueError==='checking'||s.querySelectorAll('[data-queue-item]').length>0)})();",json!([])).await?;
    b.evaluate(
        "window.__homeAutomaticTickStart=performance.now();return true;",
        json!([]),
    )
    .await?;
    step(
        "Home completes collection through one actual existing fifteen-second tick without Refresh clicks",
    );
    tokio::time::sleep(Duration::from_millis(15_500)).await;
    b.wait("return performance.getEntriesByType('resource').some(e=>new URL(e.name).pathname==='/api/workspace/snapshot'&&e.initiatorType==='fetch'&&e.startTime>=window.__homeAutomaticTickStart);",json!([])).await?;
    observe_home(&b, "games", "Reviewed Home fixture game").await?;
    observe_home(&b, "jellyfin", "Fixture movie").await?;
    observe_home(&b, "requests", "Requested movie").await?;
    observe_home(&b, "downloads", "Fixture transfer").await?;
    check(b.evaluate("const games=document.querySelector('[data-home-tile=games]'),j=document.querySelector('[data-home-tile=jellyfin]'),r=document.querySelector('[data-home-tile=requests]'),d=document.querySelector('[data-home-tile=downloads]');return games.textContent.includes('Sleeping')&&games.textContent.includes('Join to wake')&&!games.textContent.includes('0 players')&&!games.textContent.includes('Players unknown')&&!games.textContent.includes('Provider unavailable')&&games.textContent.includes('Updated')&&games.textContent.includes('play.example:25565')&&j.textContent.includes('1 playing')&&j.textContent.includes('1 paused')&&j.querySelectorAll('.tile-item-list li').length===4&&j.textContent.includes('Showing up to 4 items')&&r.querySelectorAll('.tile-item-list li').length===4&&d.textContent.includes('Partial sample')&&d.textContent.includes('2 transfers on this sample page')&&d.querySelector('[data-tile-queue=qbittorrent]').textContent.includes('25.0%')&&!d.textContent.includes('90.0%')&&!j.querySelector('form')&&!r.querySelector('form')&&!d.querySelector('form');",json!([])).await?==true,"Home renders real bounded game/player, library/playback, request and wanted-byte queue summaries without enrollment forms")?;
    check(b.evaluate("return window.__homeResourceNote===document.querySelector('#workspace-note')&&window.__homeResourceNote.value===arguments[0];",json!([draft])).await?==true,"provider summary reads preserve the actual unfinished note editor")?;
    check(
        f.writes() == writes,
        "checking Home observations cannot save notes, tiles, directory or enrollment",
    )?;
    check(
        crafty.requests().iter().all(|(method, path)| {
            method == "GET"
                && (path == "/api/v2/servers"
                    || path == &format!("/api/v2/servers/{}/stats", c::ID))
        }) && media.requests().iter().all(|(method, _)| method == "GET")
            && qbit.requests().iter().all(|(method, _)| method == "GET"),
        "all Home provider effects remain bounded observation GET requests",
    )?;
    check(b.evaluate("const values=[document.body.textContent,...[...document.querySelectorAll('input,textarea')].map(e=>e.value),...Object.values(sessionStorage),...Object.values(localStorage)];return arguments[0].every(secret=>values.every(v=>!v.includes(secret)));",json!([[c::TOKEN,m::TOKEN,q::TOKEN,&crafty.origin,&media.origin,&qbit.origin,&crafty.ca,&media.ca,&qbit.ca,"PRIVATE_QUEUE","/private/queue-"]])).await?==true,"Home observations expose no keys, private origins, certificates or raw queue paths in DOM, fields or storage")?;
    gateway.checked()?;
    accessibility(&b).await?;
    export_home_fixture_png(&b, "desktop").await?;
    b.mobile().await?;
    accessibility(&b).await?;
    check(
        b.evaluate(
            "return innerWidth===390&&document.documentElement.scrollWidth<=innerWidth+1;",
            json!([]),
        )
        .await?
            == true,
        "populated Home observations remain useful at390px",
    )?;
    export_home_fixture_png(&b, "mobile").await?;
    check(b.evaluate("const first=document.querySelector('.main-nav button');first.focus();return document.activeElement===first;",json!([])).await?==true,"mobile navigation starts with actual Home button focus")?;
    b.keys(&"\u{e004}".repeat(10)).await?;
    let mobile_nav = b.evaluate("const nav=document.querySelector('.main-nav'),last=nav.lastElementChild,n=nav.getBoundingClientRect(),r=last.getBoundingClientRect();return [document.activeElement===last,r.left>=n.left,r.right<=n.right,document.documentElement.scrollWidth<=innerWidth+1,nav.contains(document.activeElement),[...nav.children].indexOf(document.activeElement),r.left,r.right,n.left,n.right,nav.scrollLeft,nav.scrollWidth,nav.clientWidth];",json!([])).await?;
    println!(
        "RUST_BROWSER_MOBILE_NAV focus={} left={} right={} overflow={} in_nav={} index={} button_left={} button_right={} nav_left={} nav_right={} scroll={} content_width={} client_width={}",
        mobile_nav[0] == true,
        mobile_nav[1] == true,
        mobile_nav[2] == true,
        mobile_nav[3] == true,
        mobile_nav[4] == true,
        mobile_nav[5].as_i64().unwrap_or(-1),
        mobile_nav[6].as_f64().unwrap_or(-1.0),
        mobile_nav[7].as_f64().unwrap_or(-1.0),
        mobile_nav[8].as_f64().unwrap_or(-1.0),
        mobile_nav[9].as_f64().unwrap_or(-1.0),
        mobile_nav[10].as_f64().unwrap_or(-1.0),
        mobile_nav[11].as_f64().unwrap_or(-1.0),
        mobile_nav[12].as_f64().unwrap_or(-1.0),
    );
    // Native focus scrolling may still be moving when WebDriver's key action
    // returns. Observe the same outcome within the existing nine-second wait;
    // do not manufacture it with scrollIntoView or another focus operation.
    let navigation_settled = b.wait("const nav=document.querySelector('.main-nav'),last=nav.lastElementChild,n=nav.getBoundingClientRect(),r=last.getBoundingClientRect();return document.activeElement===last&&r.left>=n.left&&r.right<=n.right&&document.documentElement.scrollWidth<=innerWidth+1;",json!([])).await;
    let final_nav = b.evaluate("const nav=document.querySelector('.main-nav'),last=nav.lastElementChild,n=nav.getBoundingClientRect(),r=last.getBoundingClientRect();return [document.activeElement===last,r.left>=n.left,r.right<=n.right,document.documentElement.scrollWidth<=innerWidth+1,r.right,n.right,nav.scrollLeft];",json!([])).await?;
    println!(
        "RUST_BROWSER_MOBILE_NAV_SETTLED focus={} left={} right={} overflow={} button_right={} nav_right={} scroll={}",
        final_nav[0] == true,
        final_nav[1] == true,
        final_nav[2] == true,
        final_nav[3] == true,
        final_nav[4].as_f64().unwrap_or(-1.0),
        final_nav[5].as_f64().unwrap_or(-1.0),
        final_nav[6].as_f64().unwrap_or(-1.0),
    );
    navigation_settled?;
    check(
        (0..4).all(|i| final_nav[i] == true),
        "native Tab reveals the final mobile navigation control without page overflow",
    )?;
    b.click(".version summary").await?;
    b.wait("const v=document.querySelector('.version'),r=v.getBoundingClientRect();return v.open&&r.left>=0&&r.right<=innerWidth&&document.documentElement.scrollWidth<=innerWidth+1;",json!([])).await?;
    b.click(".version summary").await?;

    step("hidden Home provider tiles do not acquire a second observation poller");
    let provider_counts = (media.requests().len(), qbit.requests().len());
    edit(&b).await?;
    for label in ["Jellyfin", "Requests", "Downloads"] {
        b.click(&format!("button[aria-label='Remove {label}']"))
            .await?;
    }
    // Cross one actual existing workspace scheduler interval. No fake clock and
    // no source assertion substitutes for observing absence of provider IO.
    tokio::time::sleep(Duration::from_millis(15_500)).await;
    check(
        (media.requests().len(), qbit.requests().len()) == provider_counts && f.writes() == writes,
        "a real workspace tick with hidden provider tiles cannot poll those providers or write a preview",
    )?;
    b.click(".cancel-tiles").await?;
    selected(&b, &DEFAULT_OWNER).await?;
    observe_home(&b, "jellyfin", "Fixture movie").await?;
    observe_home(&b, "requests", "Requested movie").await?;
    observe_home(&b, "downloads", "Fixture transfer").await?;
    check(
        media.requests().len() > provider_counts.0
            && qbit.requests().len() > provider_counts.1
            && f.writes() == writes,
        "restoring visible tiles automatically refreshes their summaries through the existing resource owner without writes",
    )?;

    step("fresh document keeps native module-failure recovery and scoped note drafts");
    b.cdp("Network.enable", json!({})).await?;
    b.cdp("Network.setCacheDisabled", json!({"cacheDisabled":true}))
        .await?;
    b.cdp(
        "Network.setBlockedURLs",
        json!({"urls":[format!("{}/assets/workspace/*.js",f.origin)]}),
    )
    .await?;
    b.navigate(&format!("{}/workspace", f.origin)).await?;
    check(b.evaluate("return !document.querySelector('#workspace-note')&&!!document.querySelector('.startup a[href=\"/workspace\"]')&&!!document.querySelector('.startup a[href=\"/account\"]')&&!document.body.textContent.includes(arguments[0]);",json!([&f.username])).await?==true,"unavailable module leaves honest native fresh-workspace and Account links without private content")?;
    b.click(".startup a[href='/account']").await?;
    b.wait("return location.pathname==='/account'&&!!document.querySelector('form[action=\"/account/sign-out\"]');",json!([])).await?;
    b.cdp("Network.setBlockedURLs", json!({"urls":[]})).await?;
    b.cdp("Network.setCacheDisabled", json!({"cacheDisabled":false}))
        .await?;
    b.click("a[href='/workspace']").await?;
    b.wait("return !!document.querySelector('#workspace-note')&&!document.querySelector('#workspace-note').disabled;",json!([])).await?;
    ready(&b).await?;
    note(&b).await?;
    b.wait(
        "return !!document.querySelector('section[aria-label=\"Draft recovery\"]');",
        json!([]),
    )
    .await?;
    check(
        b.evaluate(
            "return document.querySelector('#workspace-note').value==='';",
            json!([]),
        )
        .await?
            == true,
        "a fresh admitted document offers recovery without automatically installing the old draft",
    )?;
    b.click("section[aria-label='Draft recovery'] button:first-of-type")
        .await?;
    body(&b, draft).await?;
    check(
        f.writes() == writes,
        "native recovery and deliberate same-account draft recovery do not replay a write",
    )?;

    step("member Home cannot inherit provider summaries or collect privileged resources");
    b.click(".sidebar form button[type=submit]").await?;
    b.wait("return location.pathname==='/account/sign-in';", json!([]))
        .await?;
    sign_in(&f, &b, &member, &password).await?;
    let counts = (
        crafty.requests().len(),
        media.requests().len(),
        qbit.requests().len(),
    );
    workspace(&f, &b).await?;
    ready(&b).await?;
    selected(&b, &["games", "services"]).await?;
    check(b.evaluate("return !document.querySelector('[data-home-tile=jellyfin]')&&!document.querySelector('[data-home-tile=requests]')&&!document.querySelector('[data-home-tile=downloads]')&&!document.body.textContent.includes('Fixture movie')&&!document.body.textContent.includes('Requested movie')&&!document.body.textContent.includes('Fixture transfer')&&document.querySelector('#workspace-note').value==='';",json!([])).await?==true,"member Home and note cannot inherit owner media, queue or draft payloads")?;
    check(
        (media.requests().len(), qbit.requests().len()) == (counts.1, counts.2),
        "member Home initialization cannot contact owner-only providers",
    )?;
    b.close().await?;
    {
        f.close().await?;
        gateway.close().await
    }?;
    println!(
        "PASS Rust browser: real Home game/media/request/download summaries, GET-only resources, hidden-tile poll ownership,390px/Axe, member isolation and native/manual scoped draft recovery"
    );
    Ok(())
}

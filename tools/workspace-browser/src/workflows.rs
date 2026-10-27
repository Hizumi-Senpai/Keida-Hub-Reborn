//! Independent end-to-end expectations over real Rust, PostgreSQL and Chromium.
use crate::{Check, check, driver::Browser, fixture::Fixture};
use serde_json::json;
use std::{fs, time::Duration};
fn step(name: &'static str) {
    println!("RUST_BROWSER_STEP {name}");
}
async fn claim(f: &Fixture, b: &Browser) -> Check<()> {
    b.navigate(&format!("{}/account/claim", f.origin)).await?;
    b.fill("input[name=setup_secret]", &f.setup).await?;
    b.fill("input[name=username]", &f.username).await?;
    b.fill("input[name=password]", &f.password).await?;
    b.click("form.credential-form button[type=submit]").await?;
    b.wait("return location.pathname === '/account'", json!([]))
        .await
}
async fn sign_in(f: &Fixture, b: &Browser, user: &str, password: &str) -> Check<()> {
    b.navigate(&format!("{}/account/sign-in", f.origin)).await?;
    b.fill("input[name=username]", user).await?;
    b.fill("input[name=password]", password).await?;
    b.click("form.credential-form button[type=submit]").await?;
    b.wait("return location.pathname === '/account'", json!([]))
        .await
}
async fn workspace(f: &Fixture, b: &Browser) -> Check<()> {
    b.navigate(&format!("{}/workspace", f.origin)).await?;
    b.wait("return !!document.querySelector('#workspace-note') && !document.querySelector('#workspace-note').disabled && document.querySelector('.workspace-status').textContent.includes('checked')",json!([])).await
}
async fn note(b: &Browser) -> Check<()> {
    b.click(".main-nav button:nth-child(2)").await
}
async fn body(b: &Browser, expected: &str) -> Check<()> {
    check(
        b.evaluate(
            "return document.querySelector('#workspace-note').value === arguments[0]",
            json!([expected]),
        )
        .await?
            == true,
        "editor text matches expected private draft",
    )
}
async fn saved(b: &Browser) -> Check<()> {
    b.wait("return document.querySelector('.workspace-status').textContent.includes('Saved to your account')",json!([])).await
}
async fn cleared(b: &Browser, previous: &str) -> Check<()> {
    b.wait("return document.querySelector('#workspace-note')?.value === '' && !document.body.textContent.includes(arguments[0])",json!([previous])).await
}
async fn accessibility(b: &Browser) -> Check<()> {
    let path = std::env::var("REBORN_AXE_SCRIPT").map_err(|_| "pinned Axe prerequisite")?;
    let source = fs::read_to_string(path).map_err(|_| "Axe script read")?;
    check(source.len() < 1024 * 1024, "Axe script bound")?;
    let result=b.evaluate(&format!("{source}\nreturn axe.run(document,{{runOnly:{{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}}}).then(r=>r.violations.map(v=>v.id));"),json!([])).await?;
    // Only pinned rule identifiers, never DOM fragments or private page content.
    if let Some(violations) = result.as_array() {
        for id in violations.iter().filter_map(serde_json::Value::as_str) {
            if id.len() <= 80 && id.bytes().all(|b| b.is_ascii_lowercase() || b == b'-') {
                eprintln!("Accessibility rule failed: {id}");
            }
        }
    }
    check(
        result.as_array().is_some_and(Vec::is_empty),
        "workspace accessibility rules",
    )
}
async fn lifetime_and_recovery() -> Check<()> {
    step("native TLS, persistent editor, one poll owner and deliberate draft recovery");
    let f = Fixture::new().await?;
    let mut untrusted = f.browser(false).await?;
    untrusted
        .rejects_certificate(&format!("{}/api/health", f.origin))
        .await?;
    untrusted.close().await?;
    drop(untrusted);
    step("native claim and workspace entry");
    let mut b = f.browser(true).await?;
    claim(&f, &b).await?;
    workspace(&f, &b).await?;
    note(&b).await?;
    let note_text = format!(
        "A private fictional note 海\n{}",
        "A line to preserve scrolling.\n".repeat(35)
    );
    b.fill("#workspace-note", &note_text).await?;
    b.evaluate("window.__editor=document.querySelector('#workspace-note'); window.__editor.setSelectionRange(2,7); window.__editor.scrollTop=120; window.__scroll=window.__editor.scrollTop; return window.__scroll>0",json!([])).await?;
    step("editor lifetime and one observation owner");
    let reads = f.reads();
    for _ in 0..4 {
        b.click(".main-nav button:first-child").await?;
        note(&b).await?;
    }
    check(b.evaluate("return window.__editor === document.querySelector('#workspace-note') && window.__editor.selectionStart === 2 && window.__editor.selectionEnd === 7 && Math.abs(window.__editor.scrollTop-window.__scroll)<=1",json!([])).await?==true,"view navigation preserves actual editor, selection and scroll")?;
    body(&b, &note_text).await?;
    tokio::time::sleep(Duration::from_secs(16)).await;
    check(
        f.reads() > reads && f.reads() <= reads + 2,
        "navigation must not duplicate observation owners",
    )?;
    step("native keyboard save and scoped draft recovery");
    b.click("#workspace-note").await?;
    b.keys("\u{e004}\u{e007}").await?;
    saved(&b).await?;
    b.fill("#workspace-note", "An unfinished draft after saving")
        .await?;
    check(b.evaluate("return Object.entries(sessionStorage).filter(([k])=>k.startsWith('keida-hub-reborn.workspace.v1:')).length === 1 && Object.entries(sessionStorage).every(([k,v])=>!v.includes(arguments[0])&&!v.includes(arguments[1])&&!v.includes(document.querySelector('meta[name=reborn-session-binding]').content))",json!([&f.password,&f.setup])).await?==true,"draft storage has scoped non-secret text only")?;
    check(b.evaluate("window.dispatchEvent(new Event('pagehide')); return document.querySelector('#workspace-note').value === '' && !document.body.textContent.includes(arguments[0])",json!([&f.username])).await?==true,"pagehide clears private DOM synchronously")?;
    workspace(&f, &b).await?;
    note(&b).await?;
    body(&b, &note_text).await?;
    b.click("section[aria-label='Draft recovery'] button:first-of-type")
        .await?;
    body(&b, "An unfinished draft after saving").await?;
    b.click(".note-card button[type=submit]").await?;
    saved(&b).await?;
    step("exact loaded identity, accessibility and narrow viewport");
    b.click(".version summary").await?;
    let expected = std::env::var("REBORN_BROWSER_EXPECT_COMMIT")
        .map_err(|_| "exact browser source prerequisite")?;
    check(b.evaluate("return document.querySelector('meta[name=reborn-commit]').content === arguments[0] && document.querySelector('.version a').href.endsWith('/commit/'+arguments[0])",json!([expected])).await?==true,"loaded workspace identifies exact compiled source")?;
    accessibility(&b).await?;
    b.mobile().await?;
    check(
        b.evaluate(
            "return innerWidth === 390 && document.documentElement.scrollWidth <= innerWidth+1",
            json!([]),
        )
        .await?
            == true,
        "narrow workspace has no horizontal overflow",
    )?;
    accessibility(&b).await?;
    b.close().await?;
    drop(b);
    f.close().await?;
    println!(
        "PASS Rust browser: persistent workspace, draft recovery, keyboard, reflow and accessibility"
    );
    Ok(())
}
async fn conflicts_and_pending_saves() -> Check<()> {
    step("real concurrent saves and uncertain-result reconciliation");
    let f = Fixture::new().await?;
    let mut a = f.browser(true).await?;
    claim(&f, &a).await?;
    workspace(&f, &a).await?;
    note(&a).await?;
    a.fill("#workspace-note", "Original saved note").await?;
    a.click(".note-card button[type=submit]").await?;
    saved(&a).await?;
    let mut b = f.browser(true).await?;
    sign_in(&f, &b, &f.username, &f.password).await?;
    workspace(&f, &b).await?;
    note(&b).await?;
    a.fill("#workspace-note", "First browser local draft")
        .await?;
    b.fill("#workspace-note", "Second browser saved note")
        .await?;
    b.click(".note-card button[type=submit]").await?;
    saved(&b).await?;
    let canonical = f.hold("/api/workspace/snapshot");
    a.click(".note-card button[type=submit]").await?;
    tokio::time::timeout(Duration::from_secs(3), canonical.entered.notified())
        .await
        .map_err(|_| "actual conflict canonical response hold")?;
    check(a.evaluate("return !document.querySelector('section[aria-label=\"Save conflict\"]') && document.querySelector('.note-card button[type=submit]').disabled && document.querySelector('.workspace-status').textContent.includes('Checking the latest')",json!([])).await?==true,"conflict comparison and save stay unavailable until a fresh canonical note arrives")?;
    body(&a, "First browser local draft").await?;
    canonical.release.notify_one();
    a.wait(
        "return !!document.querySelector('section[aria-label=\"Save conflict\"]')",
        json!([]),
    )
    .await?;
    body(&a, "First browser local draft").await?;
    check(a.evaluate("return document.querySelector('section[aria-label=\"Save conflict\"] pre').textContent === arguments[0]",json!(["Second browser saved note"])).await?==true,"conflict exposes separately observed current note")?;
    a.click("section[aria-label='Save conflict'] button:first-of-type")
        .await?;
    a.fill("#workspace-note", "Submitted while editing continues")
        .await?;
    let held = f.hold("/api/workspace/note");
    a.click(".note-card button[type=submit]").await?;
    tokio::time::timeout(Duration::from_secs(3), held.entered.notified())
        .await
        .map_err(|_| "actual successful save response hold")?;
    a.fill("#workspace-note", "Newer edits must remain unsaved")
        .await?;
    held.release.notify_one();
    a.wait(
        "return document.querySelector('.workspace-status').textContent.includes('newer edits')",
        json!([]),
    )
    .await?;
    body(&a, "Newer edits must remain unsaved").await?;
    a.click(".note-card button[type=submit]").await?;
    saved(&a).await?;
    let writes = f.writes();
    let held = f.hold("/api/workspace/note");
    a.fill(
        "#workspace-note",
        "A committed response that arrives too late",
    )
    .await?;
    a.click(".note-card button[type=submit]").await?;
    tokio::time::timeout(Duration::from_secs(3), held.entered.notified())
        .await
        .map_err(|_| "committed uncertain-result response hold")?;
    a.wait(
        "return !!document.querySelector('section[aria-label=\"Uncertain save\"]')",
        json!([]),
    )
    .await?;
    held.release.notify_one();
    a.click("section[aria-label='Uncertain save'] button")
        .await?;
    a.wait("return document.querySelector('.note-card button[type=submit]').disabled && !document.querySelector('section[aria-label=\"Uncertain save\"]')",json!([])).await?;
    check(
        f.writes() == writes + 1,
        "uncertain save must never be automatically replayed",
    )?;
    body(&a, "A committed response that arrives too late").await?;
    b.close().await?;
    a.close().await?;
    drop(b);
    drop(a);
    f.close().await?;
    println!("PASS Rust browser: conflicts, edits during save and committed lost response");
    Ok(())
}
async fn cross_account_late_response() -> Check<()> {
    step("cross-tab account switch and held obsolete private snapshot");
    let f = Fixture::new().await?;
    let mut b = f.browser(true).await?;
    claim(&f, &b).await?;
    let (member, password) = f.enroll_member(&b).await?;
    workspace(&f, &b).await?;
    note(&b).await?;
    b.fill("#workspace-note", "Owner private saved note")
        .await?;
    b.click(".note-card button[type=submit]").await?;
    saved(&b).await?;
    b.fill("#workspace-note", "Owner account compatible draft")
        .await?;
    let held = f.hold("/api/workspace/snapshot");
    b.evaluate(
        "window.dispatchEvent(new Event('focus')); return true",
        json!([]),
    )
    .await?;
    tokio::time::timeout(Duration::from_secs(3), held.entered.notified())
        .await
        .map_err(|_| "actual authorized private snapshot hold")?;
    let first = b.first.clone();
    let other = b.new_tab().await?;
    b.switch(&other).await?;
    sign_in(&f, &b, &member, &password).await?;
    held.release.notify_one();
    b.switch(&first).await?;
    cleared(&b, &f.username).await?;
    tokio::time::sleep(Duration::from_millis(250)).await;
    cleared(&b, &f.username).await?;
    workspace(&f, &b).await?;
    note(&b).await?;
    body(&b, "").await?;
    check(
        b.evaluate(
            "return !document.querySelector('section[aria-label=\"Draft recovery\"]')",
            json!([]),
        )
        .await?
            == true,
        "member cannot inherit owner draft",
    )?;
    b.fill("#workspace-note", "Member unfinished draft").await?;
    b.click(".sidebar form button[type=submit]").await?;
    b.wait("return location.pathname === '/account/sign-in' && document.querySelector('input[name=password]').value === ''",json!([])).await?;
    check(
        b.evaluate(
            "return Object.entries(sessionStorage).every(([k,v])=>!v.includes(arguments[0]))",
            json!(["Member unfinished draft"]),
        )
        .await?
            == true,
        "explicit sign out removes current scoped draft",
    )?;
    b.back().await?;
    check(b.evaluate("return !document.body.textContent.includes(arguments[0]) && (!document.querySelector('#workspace-note') || document.querySelector('#workspace-note').value === '')",json!([member])).await?==true,"history after sign out contains no previous private view")?;
    sign_in(&f, &b, &f.username, &f.password).await?;
    workspace(&f, &b).await?;
    note(&b).await?;
    body(&b, "Owner private saved note").await?;
    b.click("section[aria-label='Draft recovery'] button:first-of-type")
        .await?;
    body(&b, "Owner account compatible draft").await?;
    b.close().await?;
    drop(b);
    f.close().await?;
    println!(
        "PASS Rust browser: old response rejection, cross-account isolation and explicit same-account recovery"
    );
    Ok(())
}
async fn revocation_and_optional_failures() -> Check<()> {
    step("remote revocation, generation isolation and optional network/storage failures");
    let f = Fixture::new().await?;
    let mut b = f.browser(true).await?;
    claim(&f, &b).await?;
    workspace(&f, &b).await?;
    note(&b).await?;
    b.fill("#workspace-note", "Old generation draft").await?;
    f.revoke_all(&b).await?;
    tokio::time::sleep(Duration::from_secs(16)).await;
    cleared(&b, &f.username).await?;
    sign_in(&f, &b, &f.username, &f.password).await?;
    workspace(&f, &b).await?;
    note(&b).await?;
    body(&b, "").await?;
    check(
        b.evaluate(
            "return !document.querySelector('section[aria-label=\"Draft recovery\"]')",
            json!([]),
        )
        .await?
            == true,
        "new generation cannot inherit revoked draft",
    )?;
    b.evaluate("Object.defineProperty(Storage.prototype,'setItem',{value(){throw new Error('fixture storage unavailable')}});return true",json!([])).await?;
    b.fill("#workspace-note", "In-memory draft during storage failure")
        .await?;
    body(&b, "In-memory draft during storage failure").await?;
    b.evaluate("window.dispatchEvent(new Event('blur'));window.dispatchEvent(new Event('focus'));return true",json!([])).await?;
    b.wait(
        "return !!document.querySelector('section[aria-label=\"Draft recovery\"]')",
        json!([]),
    )
    .await?;
    b.click("section[aria-label='Draft recovery'] button:first-of-type")
        .await?;
    body(&b, "In-memory draft during storage failure").await?;
    b.cdp("Network.enable", json!({})).await?;
    b.cdp(
        "Network.setBlockedURLs",
        json!({"urls":[format!("{}/api/workspace/snapshot",f.origin)]}),
    )
    .await?;
    b.evaluate(
        "window.dispatchEvent(new Event('focus'));return true",
        json!([]),
    )
    .await?;
    cleared(&b, &f.username).await?;
    b.click(".sidebar form button[type=submit]").await?;
    b.wait("return location.pathname === '/account/sign-in' && document.querySelector('input[name=password]').value === ''",json!([])).await?;
    b.close().await?;
    drop(b);
    f.close().await?;
    println!(
        "PASS Rust browser: remote revocation, generation fencing and native sign out during optional failures"
    );
    Ok(())
}
async fn startup_failure_keeps_native_recovery() -> Check<()> {
    step("workspace module failure retains native account recovery");
    let f = Fixture::new().await?;
    let mut b = f.browser(true).await?;
    claim(&f, &b).await?;
    b.cdp("Network.enable", json!({})).await?;
    b.cdp(
        "Network.setBlockedURLs",
        json!({"urls":[format!("{}/assets/workspace/*.js",f.origin)]}),
    )
    .await?;
    b.navigate(&format!("{}/workspace", f.origin)).await?;
    check(b.evaluate("return !document.querySelector('#workspace-note') && !!document.querySelector('.startup a[href=\"/account\"]') && !document.body.textContent.includes(arguments[0])",json!([&f.username])).await?==true,"failed workspace startup leaves honest private-free native recovery")?;
    b.click(".startup a[href='/account']").await?;
    b.wait("return location.pathname === '/account' && !!document.querySelector('form[action=\"/account/sign-out\"]')",json!([])).await?;
    b.click("form[action='/account/sign-out'] button").await?;
    b.wait("return location.pathname === '/account/sign-in'", json!([]))
        .await?;
    b.close().await?;
    drop(b);
    f.close().await?;
    println!(
        "PASS Rust browser: module startup failure preserves native account and sign-out recovery"
    );
    Ok(())
}
pub async fn run() -> Check<()> {
    lifetime_and_recovery().await?;
    conflicts_and_pending_saves().await?;
    cross_account_late_response().await?;
    revocation_and_optional_failures().await?;
    startup_failure_keeps_native_recovery().await?;
    dedicated_connection_overview().await?;
    directory_and_personal_pins().await?;
    retained_activity_history().await?;
    grouped_notifications().await?;
    personal_home_layout().await?;
    catalog_roadmap_and_observations().await?;
    println!(
        "Rust workspace browser acceptance: 11 workflows passed; Chromium/ChromeDriver156.0.8078.4; real HTTPS/PostgreSQL; no skipped prerequisite"
    );
    Ok(())
}

async fn catalog_roadmap_and_observations() -> Check<()> {
    use reborn_crafty_fixture as c;
    step("revisitable integration catalog, separate Roadmap note and retained provider history");
    let f = Fixture::new().await?;
    let provider = c::Crafty::start().await?;
    let mut owner = f.browser(true).await?;
    step("catalog phase01 owner claim and private draft");
    claim(&f, &owner).await?;
    workspace(&f, &owner).await?;
    note(&owner).await?;
    owner
        .fill(
            "#workspace-note",
            "A personal note kept apart from the roadmap",
        )
        .await?;
    owner.click(".note-card button[type=submit]").await?;
    saved(&owner).await?;
    let draft = "An unfinished private thought across catalog and history";
    owner.fill("#workspace-note", draft).await?;
    check(owner.evaluate("window.__guideEditor=document.querySelector('#workspace-note');if(!window.__guideEditor)return false;window.__guideEditor.setSelectionRange(3,12);return true",json!([])).await?==true,"capture the existing private editor before opening the guide")?;
    let writes = f.writes();
    step("catalog phase02 available and planned entries");
    owner.click(".main-nav button:nth-child(7)").await?;
    owner.wait("return document.querySelectorAll('.catalog-list > article[data-integration-id]').length===7",json!([])).await?;
    check(owner.evaluate("const cards=[...document.querySelectorAll('.catalog-list > article[data-integration-id]')];return cards.length===7 && cards.map(c=>c.dataset.integrationId).join(',')==='crafty,jellyfin,seerr,sonarr,radarr,qbittorrent,discord' && cards[0].querySelectorAll('button').length===1 && cards.slice(1).every(c=>c.querySelectorAll('button').length===0 && c.textContent.includes('Planned'))",json!([])).await?==true,"catalog distinguishes the one available integration from planned capabilities")?;
    step("catalog phase03 desktop catalog accessibility");
    accessibility(&owner).await?;
    step("catalog phase04 dated Roadmap and retained editor");
    owner.click(".main-nav button:nth-child(8)").await?;
    owner.wait("return !!document.querySelector('.roadmap-note') && Array.from({length:9},(_,i)=>'M'+i).every(id=>document.querySelector('.roadmap-note').textContent.includes(id))",json!([])).await?;
    check(owner.evaluate("const roadmap=document.querySelector('.roadmap-note'),editor=document.querySelector('#workspace-note');return !!roadmap && !!editor && roadmap.querySelector('a[href=\"https://github.com/Hizumi-Senpai/Keida-Hub-Reborn/issues/2\"]')!==null && roadmap.textContent.includes('2026-10-27') && window.__guideEditor===editor && editor.value===arguments[0] && editor.selectionStart===3 && editor.selectionEnd===12",json!([draft])).await?==true,"dated M0–M8 Roadmap note preserves the actual private editor and selection")?;
    check(
        f.writes() == writes,
        "catalog and Roadmap reads cannot save the personal note",
    )?;
    step("catalog phase05 desktop Roadmap accessibility");
    accessibility(&owner).await?;
    step("catalog phase06 available catalog action and TLS enrollment");
    step("catalog phase06a navigate to catalog");
    owner.click(".main-nav button:nth-child(7)").await?;
    step("catalog phase06b wait for the available action");
    owner
        .wait(
            "return !!document.querySelector('.catalog-list [data-integration-id=crafty] button')",
            json!([]),
        )
        .await?;
    step("catalog phase06c open Connections through the catalog");
    owner
        .click(".catalog-list [data-integration-id=crafty] button")
        .await?;
    step("catalog phase06d wait for the Connections form");
    owner.wait("return document.querySelector('.main-nav button:nth-child(3)')?.getAttribute('aria-current')==='page' && !!document.querySelector('#crafty-endpoint')",json!([])).await?;
    step("catalog phase06e enter the fictional provider address");
    owner.fill("#crafty-endpoint", &provider.origin).await?;
    step("catalog phase06f enter the fictional dedicated token");
    owner.fill("#crafty-token", c::TOKEN).await?;
    step("catalog phase06g enter the provider time zone");
    owner.fill("#crafty-timezone", "UTC").await?;
    step("catalog phase06h enter the fixture trust certificate");
    owner.fill("#crafty-ca", &provider.ca).await?;
    step("catalog phase06i enter the selected fixture identity");
    owner.fill("input[name=server-id]", c::ID).await?;
    step("catalog phase06j enter the reviewed fixture name");
    owner
        .fill("input[name=server-name]", "Reviewed history fixture")
        .await?;
    step("catalog phase06k enter the reviewed fictional join address");
    owner
        .fill("input[name=server-join]", "play.example:25565")
        .await?;
    step("catalog phase06l save the dedicated fixture connection");
    owner
        .click(".connection-setup form button[type=submit]")
        .await?;
    step("catalog phase06m wait for an actual zero-player observation");
    owner
        .wait(
            "return document.querySelector('.server-card')?.textContent.includes('0 reported')",
            json!([]),
        )
        .await?;
    step("catalog phase06n verify a retained real sample exists");
    check(
        f.observation_count().await? == 1,
        "actual TLS collection creates one retained sample",
    )?;
    step("catalog phase07 repeated real snapshot and sample deduplication");
    let repeated=owner.evaluate("const binding=document.querySelector('meta[name=reborn-session-binding]')?.content;if(!binding)return false;const h={'X-Reborn-Product':'keida-hub-reborn','X-Reborn-Contract':'reborn-workspace-v1','X-CSRF-Token':binding};return (async()=>{for(let i=0;i<2;i++){const r=await fetch('/api/workspace/snapshot',{headers:h});if(!r.ok)return false;const v=await r.json();if(v?.crafty?.configured!==true||v.crafty.revision!=='1'||!Array.isArray(v.crafty.servers)||v.crafty.servers.length!==1||v.crafty.servers[0]?.players!==0)return false;}return true;})();",json!([])).await?;
    check(
        repeated == true && f.observation_count().await? == 1,
        "cached repeated snapshots retain the sample once",
    )?;
    step("catalog phase08 initial retained history and normalized zero");
    let requests = provider.requests().len();
    owner.click(".view-observation-history").await?;
    owner
        .wait(
            "return document.querySelectorAll('.observation-list > li').length===1",
            json!([]),
        )
        .await?;
    let first_id = owner
        .evaluate(
            "return document.querySelector('.observation-list > li')?.dataset.observationId ?? null",
            json!([]),
        )
        .await?;
    check(
        first_id.as_str().is_some(),
        "initial retained observation has an identity",
    )?;
    check(owner.evaluate("const row=document.querySelector('.observation-list > li'),history=document.querySelector('.observation-history');return !!row && !!history && row.dataset.observationRevision==='1' && row.textContent.includes('Reviewed history fixture') && row.textContent.includes('0 reported') && history.textContent.includes('10,000') && !history.textContent.includes(arguments[0]) && !history.textContent.includes(arguments[1]) && !history.textContent.includes(arguments[2]) && !history.textContent.includes('play.example:25565')",json!([c::TOKEN,c::ID,&provider.origin])).await?==true,"history presents normalized zero and sampling limits without private provider configuration")?;
    check(
        provider.requests().len() == requests,
        "opening retained history does not contact the provider",
    )?;
    step("catalog phase09 retained failure page and fixed keyset window");
    let seeded = f.seed_observations(1, 26, 2).await?;
    owner.click(".observation-newest").await?;
    owner
        .wait(
            "return document.querySelectorAll('.observation-list > li').length===25",
            json!([]),
        )
        .await?;
    check(owner.evaluate("const row=document.querySelector('.observation-list > li');return !!row && row.dataset.observationId===arguments[0] && row.textContent.includes('Not reported') && row.textContent.includes('Unknown')",json!([seeded.last().ok_or("historical seed absent")?])).await?==true,"retained failure remains unknown rather than an invented player zero")?;
    let arriving = f.seed_observations(1, 1, 100).await?;
    owner.click(".observation-older").await?;
    owner
        .wait(
            "return document.querySelectorAll('.observation-list > li').length===2",
            json!([]),
        )
        .await?;
    check(owner.evaluate("return [...document.querySelectorAll('.observation-list > li')].map(row=>row.dataset.observationId).join(',')===[arguments[0],arguments[1]].join(',') && document.querySelector('.observation-older')?.disabled===true",json!([&seeded[0],first_id])).await?==true,"older keyset page preserves its window after a newly retained sample")?;
    step("catalog phase10 explicit newest refresh and desktop history accessibility");
    owner.click(".observation-newest").await?;
    owner.wait("return document.querySelector('.observation-list > li')?.dataset.observationId===arguments[0]",json!([&arriving[0]])).await?;
    check(owner.evaluate("const editor=document.querySelector('#workspace-note');return !!editor && window.__guideEditor===editor && editor.value===arguments[0]",json!([draft])).await?==true,"provider history preserves the existing unfinished private note")?;
    accessibility(&owner).await?;
    step("catalog phase11 mobile history catalog and Roadmap accessibility");
    owner.mobile().await?;
    check(
        owner
            .evaluate(
                "return innerWidth===390 && document.documentElement.scrollWidth<=innerWidth+1",
                json!([]),
            )
            .await?
            == true,
        "retained provider history reflows at390px",
    )?;
    accessibility(&owner).await?;
    owner.click(".main-nav button:nth-child(7)").await?;
    accessibility(&owner).await?;
    owner.click(".main-nav button:nth-child(8)").await?;
    accessibility(&owner).await?;
    check(
        owner
            .evaluate(
                "return document.documentElement.scrollWidth<=innerWidth+1",
                json!([]),
            )
            .await?
            == true,
        "catalog and Roadmap note reflow at390px",
    )?;
    step("catalog phase12 member enrollment and current-scope history");
    let (member_name, member_password) = f.enroll_member(&owner).await?;
    let mut member = f.browser(true).await?;
    sign_in(&f, &member, &member_name, &member_password).await?;
    workspace(&f, &member).await?;
    body(&member, "").await?;
    note(&member).await?;
    let member_note = "A member note saved while reviewing an enrollment change";
    member.fill("#workspace-note", member_note).await?;
    member.click(".main-nav button:nth-child(3)").await?;
    member.click(".view-observation-history").await?;
    member.wait("return document.querySelectorAll('.observation-list > li').length===25 && document.querySelector('[data-current-revision]')?.dataset.currentRevision==='1'",json!([])).await?;

    step("note mutation clears previously admitted member history before the next poll");
    owner.click(".main-nav button:nth-child(3)").await?;
    owner.fill("#crafty-endpoint", &provider.origin).await?;
    owner.fill("#crafty-token", c::TOKEN).await?;
    owner.fill("#crafty-timezone", "UTC").await?;
    owner.fill("#crafty-ca", &provider.ca).await?;
    owner.fill("input[name=server-id]", c::ID).await?;
    owner
        .fill("input[name=server-name]", "Replacement history fixture")
        .await?;
    owner
        .fill("input[name=server-join]", "play.example:25565")
        .await?;
    owner
        .click(".connection-setup form button[type=submit]")
        .await?;
    owner.wait("return document.querySelector('.server-card')?.textContent.includes('Replacement history fixture')",json!([])).await?;
    check(member.evaluate("return document.querySelectorAll('.observation-list > li').length===25 && document.querySelector('[data-current-revision]')?.dataset.currentRevision==='1'",json!([])).await?==true,"member still displays the previously admitted history before the note mutation")?;
    let reads_before_save = f.reads();
    // Submit the actual persistent native form while its sibling history is
    // visible. Navigating away first would hide stale results and mask this
    // regression; requestSubmit executes the same real note handler and PUT.
    member
        .evaluate(
            "document.querySelector('.note-card').requestSubmit();return true",
            json!([]),
        )
        .await?;
    saved(&member).await?;
    check(member.evaluate("return document.querySelectorAll('.observation-list > li').length===0 && document.querySelector('.observation-status').textContent.includes('Connection enrollment changed') && document.querySelector('#workspace-note').value===arguments[0]",json!([member_note])).await?==true,"successful note response synchronously removes obsolete member history without discarding the accepted note")?;
    check(
        f.reads() == reads_before_save,
        "the note response itself clears history before any snapshot poll",
    )?;

    // Reload through the real document to observe revision2 and prepare a new
    // note. A held old-revision history reply must then lose authority when a
    // second successful note response discovers removal at revision3.
    workspace(&f, &member).await?;
    note(&member).await?;
    body(&member, member_note).await?;
    let newer_member_note = "A second member note accepted while an older history reply is held";
    member.fill("#workspace-note", newer_member_note).await?;
    member.click(".main-nav button:nth-child(3)").await?;
    member.click(".view-observation-history").await?;
    member.wait("return document.querySelectorAll('.observation-list > li').length===1 && document.querySelector('[data-current-revision]')?.dataset.currentRevision==='2'",json!([])).await?;
    let prior_scope = f.hold("/api/workspace/observations");
    member.click(".observation-newest").await?;
    tokio::time::timeout(Duration::from_secs(3), prior_scope.entered.notified())
        .await
        .map_err(|_| "held prior-enrollment member history entered")?;
    owner
        .wait(
            "return !!document.querySelector('.connection-setup > button.text-button')",
            json!([]),
        )
        .await?;
    owner
        .click(".connection-setup > button.text-button")
        .await?;
    owner.wait("return document.querySelector('[aria-label=Connections]').textContent.includes('No Crafty connection enrolled') && !document.querySelector('.server-card')",json!([])).await?;
    let reads_before_save = f.reads();
    member
        .evaluate(
            "document.querySelector('.note-card').requestSubmit();return true",
            json!([]),
        )
        .await?;
    saved(&member).await?;
    check(member.evaluate("return document.querySelectorAll('.observation-list > li').length===0 && document.querySelector('.observation-status').textContent.includes('Connection enrollment changed') && document.querySelector('#workspace-note').value===arguments[0]",json!([newer_member_note])).await?==true,"newer note response cancels the prior-enrollment history scope")?;
    check(
        f.reads() == reads_before_save,
        "held history is invalidated by the mutation rather than a later poll",
    )?;
    prior_scope.release.notify_one();
    tokio::time::sleep(Duration::from_millis(200)).await;
    check(member.evaluate("return document.querySelectorAll('.observation-list > li').length===0 && document.querySelector('.observation-status').textContent.includes('Connection enrollment changed') && document.querySelector('#workspace-note').value===arguments[0]",json!([newer_member_note])).await?==true,"late old-enrollment history cannot rehydrate after a successful note mutation")?;
    member.click(".observation-newest").await?;
    member.wait("return document.querySelector('.observation-status')?.textContent.includes('checked') && document.querySelectorAll('.observation-list > li').length===0 && document.querySelector('[data-current-revision]')?.dataset.currentRevision==='3'",json!([])).await?;
    check(member.evaluate("return !document.querySelector('.observation-history').textContent.includes('Reviewed history fixture') && !document.querySelector('.observation-history').textContent.includes('Historical timeout fixture') && !document.querySelector('.observation-history').textContent.includes('Replacement history fixture') && !document.querySelector('#crafty-token')",json!([])).await?==true,"removed enrollment history remains owner-only and does not leak into a member")?;
    owner.click(".view-observation-history").await?;
    owner.wait("return document.querySelectorAll('.observation-list > li').length===25 && document.querySelector('.observation-history').textContent.includes('Current enrollment revision 3')",json!([])).await?;
    let held = f.hold("/api/workspace/observations");
    owner.click(".observation-newest").await?;
    tokio::time::timeout(Duration::from_secs(3), held.entered.notified())
        .await
        .map_err(|_| "held observation page entered")?;
    owner
        .evaluate(
            "window.dispatchEvent(new Event('blur'));return true",
            json!([]),
        )
        .await?;
    check(owner.evaluate("return document.querySelector('#workspace-note').value==='' && document.querySelectorAll('.observation-list > li').length===0 && !document.body.textContent.includes('Reviewed history fixture') && !document.body.textContent.includes(arguments[0])",json!([&f.username])).await?==true,"privacy loss synchronously clears new history and private workspace state")?;
    held.release.notify_one();
    tokio::time::sleep(Duration::from_millis(200)).await;
    check(owner.evaluate("return document.querySelectorAll('.observation-list > li').length===0 && document.querySelector('#workspace-note').value==='';",json!([])).await?==true,"late retained observation response cannot rehydrate a cleared account scope")?;
    check(
        provider
            .requests()
            .iter()
            .all(|(method, _)| method == "GET"),
        "catalog and provider history never acquire game-control authority",
    )?;
    member.close().await?;
    owner.close().await?;
    drop(member);
    drop(owner);
    f.close().await?;
    println!(
        "PASS Rust browser: revisitable catalog, dated Roadmap note, retained sampled provider history, stable pages, owner archive/member scope, draft lifetime, reflow and late-response privacy"
    );
    Ok(())
}

async fn dedicated_connection_overview() -> Check<()> {
    use reborn_crafty_fixture as c;
    step(
        "dedicated encrypted Crafty enrollment, real GET overview and secret-free browser lifetimes",
    );
    let f = Fixture::new().await?;
    let provider = c::Crafty::start().await?;
    let mut b = f.browser(true).await?;
    claim(&f, &b).await?;
    workspace(&f, &b).await?;
    note(&b).await?;
    b.fill(
        "#workspace-note",
        "Keep my unfinished thought while viewing servers",
    )
    .await?;
    b.evaluate(
        "window.__retainedEditor=document.querySelector('#workspace-note');return true",
        json!([]),
    )
    .await?;
    b.click(".main-nav button:nth-child(3)").await?;
    b.fill("#crafty-endpoint", &provider.origin).await?;
    b.fill("#crafty-token", c::TOKEN).await?;
    b.fill("#crafty-timezone", "UTC").await?;
    b.fill("#crafty-ca", &provider.ca).await?;
    b.fill("input[name=server-id]", c::ID).await?;
    b.fill("input[name=server-name]", "Reviewed browser server")
        .await?;
    b.fill("input[name=server-join]", "play.example:25565")
        .await?;
    b.click(".connection-setup form button[type=submit]")
        .await?;
    b.wait("return document.querySelector('.server-card')?.textContent.includes('0 reported') && document.querySelector('.server-card').textContent.includes('Recent provider sample')",json!([])).await?;
    check(b.evaluate("return document.querySelector('#crafty-token').value==='' && document.querySelector('#crafty-endpoint').value==='' && document.querySelector('.server-card').textContent.includes('Reviewed browser server') && !document.body.textContent.includes(arguments[0]) && !document.body.textContent.includes(arguments[1]) && [...Object.values(sessionStorage),...Object.values(localStorage)].every(v=>!v.includes(arguments[0])&&!v.includes(arguments[1]))",json!([c::TOKEN,&provider.origin])).await?==true,"enrollment clears secret fields and exposes only reviewed public data")?;
    check(
        provider.requests().len() == 2
            && provider.requests().iter().all(|(method, path)| {
                method == "GET"
                    && (path == "/api/v2/servers"
                        || path == &format!("/api/v2/servers/{}/stats", c::ID))
            }),
        "browser overview uses only bounded actual Crafty GETs",
    )?;
    b.fill(
        "#crafty-token",
        "An unfinished fictional credential must be cleared",
    )
    .await?;
    check(b.evaluate("window.dispatchEvent(new Event('pagehide'));return !document.querySelector('#crafty-token') || document.querySelector('#crafty-token').value===''",json!([])).await?==true,"privacy invalidation synchronously removes unfinished provider credentials")?;
    b.evaluate(
        "window.dispatchEvent(new Event('focus'));return true",
        json!([]),
    )
    .await?;
    b.wait(
        "return !!document.querySelector('#crafty-token')",
        json!([]),
    )
    .await?;
    note(&b).await?;
    check(
        b.evaluate(
            "return window.__retainedEditor===document.querySelector('#workspace-note')",
            json!([]),
        )
        .await?
            == true,
        "connection navigation preserves the real note editor",
    )?;
    // Privacy clearing requires deliberate compatible draft recovery.
    b.click("section[aria-label='Draft recovery'] button:first-of-type")
        .await?;
    body(&b, "Keep my unfinished thought while viewing servers").await?;
    b.click(".main-nav button:nth-child(3)").await?;
    accessibility(&b).await?;
    b.mobile().await?;
    check(
        b.evaluate(
            "return document.documentElement.scrollWidth<=innerWidth+1",
            json!([]),
        )
        .await?
            == true,
        "connection enrollment and server cards reflow on narrow viewport",
    )?;
    accessibility(&b).await?;
    b.click(".connection-setup > button.text-button").await?;
    b.wait("return document.querySelector('[aria-label=Connections]').textContent.includes('No Crafty connection enrolled') && !document.querySelector('.server-card')",json!([])).await?;
    b.close().await?;
    drop(b);
    f.close().await?;
    println!(
        "PASS Rust browser: dedicated connection, zero versus unknown, cleared credentials and retained editor"
    );
    Ok(())
}

async fn directory_and_personal_pins() -> Check<()> {
    step("service enrollment, search, personal order and committed lost response");
    let f = Fixture::new().await?;
    let mut b = f.browser(true).await?;
    claim(&f, &b).await?;
    let (member, password) = f.enroll_member(&b).await?;
    workspace(&f, &b).await?;
    note(&b).await?;
    b.fill(
        "#workspace-note",
        "A note remains open while arranging services",
    )
    .await?;
    b.evaluate(
        "window.__directoryEditor=document.querySelector('#workspace-note');return true",
        json!([]),
    )
    .await?;
    b.click(".main-nav button:nth-child(4)").await?;
    for (index, (name, category)) in [("My Library", "Media"), ("My Games", "Games")]
        .into_iter()
        .enumerate()
    {
        step(if index == 0 {
            "directory first service enrollment"
        } else {
            "directory second service enrollment"
        });
        b.fill("#service-name", name).await?;
        b.fill("#service-category", category).await?;
        b.fill("#service-url", "https://services.example/library")
            .await?;
        b.fill("#service-description", "An owner-reviewed link")
            .await?;
        b.click(".directory-editor button[type=submit]").await?;
        b.wait("return document.querySelector('.directory-status').textContent.includes('Saved') && document.querySelector('#service-name').value==='' && [...document.querySelectorAll('.service-card h3')].some(e=>e.textContent.includes(arguments[0]))", json!([name])).await?;
    }
    step("directory text and category filters");
    b.fill("#service-search", "games").await?;
    b.wait("return document.querySelectorAll('.service-card').length===1 && document.querySelector('.service-card h3').textContent.includes('My Games')", json!([])).await?;
    b.fill("#service-search", "").await?;
    b.evaluate("const s=document.querySelector('#service-filter');s.value='Media';s.dispatchEvent(new Event('change',{bubbles:true}));return true",json!([])).await?;
    b.wait("return document.querySelectorAll('.service-card').length===1 && document.querySelector('.service-card h3').textContent.includes('My Library')",json!([])).await?;
    b.evaluate("const s=document.querySelector('#service-filter');s.value='';s.dispatchEvent(new Event('change',{bubbles:true}));return true",json!([])).await?;
    step("directory personal pin order");
    b.click("button[aria-label='Pin My Library']").await?;
    b.wait("return !!document.querySelector('button[aria-label=\"Unpin My Library\"]') && !document.querySelector('.pin-service').disabled",json!([])).await?;
    b.click("button[aria-label='Pin My Games']").await?;
    b.wait("return !!document.querySelector('button[aria-label=\"Unpin My Games\"]') && !document.querySelector('.pin-service').disabled",json!([])).await?;
    b.click("button[aria-label='Move My Games up']").await?;
    b.wait("return document.querySelector('.service-card h3').textContent.includes('My Games') && !document.querySelector('.pin-service').disabled",json!([])).await?;
    b.evaluate("window.__libraryCard=[...document.querySelectorAll('.service-card')].find(e=>e.textContent.includes('My Library'));window.__linkForm=document.querySelector('#service-name');return true",json!([])).await?;
    b.fill("#service-name", "An unfinished service draft")
        .await?;
    b.click(".main-nav button:first-child").await?;
    check(b.evaluate("return document.querySelectorAll('.service-card').length===2 && window.__libraryCard===[...document.querySelectorAll('.service-card')].find(e=>e.textContent.includes('My Library')) && window.__directoryEditor===document.querySelector('#workspace-note') && window.__linkForm===document.querySelector('#service-name')",json!([])).await?==true,"home/directory navigation retains actual card, service form and note editor")?;
    b.click(".main-nav button:nth-child(4)").await?;
    check(
        b.evaluate(
            "return document.querySelector('#service-name').value==='An unfinished service draft'",
            json!([]),
        )
        .await?
            == true,
        "directory draft survives navigation",
    )?;
    step("directory committed pin response loss");
    let writes = f.writes();
    let held = f.hold("/api/workspace/pins");
    b.click("button[aria-label='Unpin My Games']").await?;
    tokio::time::timeout(Duration::from_secs(3), held.entered.notified())
        .await
        .map_err(|_| "actual committed pin response hold")?;
    b.wait("return document.querySelector('.directory-status').textContent.includes('may have completed')",json!([])).await?;
    held.release.notify_one();
    b.click("section[aria-label=Services] > .notice button")
        .await?;
    b.wait("return document.querySelector('.directory-status').textContent.includes('checked') && !!document.querySelector('button[aria-label=\"Pin My Games\"]')",json!([])).await?;
    check(
        f.writes() == writes + 1,
        "lost pin response is reconciled without mutation replay",
    )?;
    step("directory privacy and refresh persistence");
    check(b.evaluate("window.dispatchEvent(new Event('pagehide'));return !document.querySelector('#service-name') && document.querySelector('#service-search').value==='' && !document.querySelector('.service-card')",json!([])).await?==true,"privacy clearing removes service drafts, search, links and pin state synchronously")?;
    workspace(&f, &b).await?;
    b.click(".main-nav button:nth-child(4)").await?;
    b.wait("return !!document.querySelector('button[aria-label=\"Unpin My Library\"]') && !!document.querySelector('button[aria-label=\"Pin My Games\"]')",json!([])).await?;
    check(b.evaluate("return [...document.querySelectorAll('.service-link')].every(a=>a.protocol==='https:' && a.target==='_blank' && a.rel.includes('noopener') && a.rel.includes('noreferrer'))",json!([])).await?==true,"service navigation has explicit safe link attributes")?;
    accessibility(&b).await?;
    b.mobile().await?;
    check(
        b.evaluate(
            "return innerWidth===390 && document.documentElement.scrollWidth<=innerWidth+1",
            json!([]),
        )
        .await?
            == true,
        "directory and enrollment reflow at narrow viewport",
    )?;
    accessibility(&b).await?;
    b.click(".sidebar form button[type=submit]").await?;
    b.wait("return location.pathname==='/account/sign-in'", json!([]))
        .await?;
    sign_in(&f, &b, &member, &password).await?;
    workspace(&f, &b).await?;
    b.click(".main-nav button:nth-child(4)").await?;
    check(b.evaluate("return !document.querySelector('.directory-editor') && [...document.querySelectorAll('.pin-service')].every(b=>b.getAttribute('aria-pressed')==='false')",json!([])).await?==true,"member sees directory without owner form or another account's pins")?;
    b.click("button[aria-label='Pin My Games']").await?;
    b.wait(
        "return !!document.querySelector('button[aria-label=\"Unpin My Games\"]')",
        json!([]),
    )
    .await?;
    b.click(".sidebar form button[type=submit]").await?;
    b.wait("return location.pathname==='/account/sign-in'", json!([]))
        .await?;
    sign_in(&f, &b, &f.username, &f.password).await?;
    workspace(&f, &b).await?;
    check(b.evaluate("return document.querySelectorAll('.service-card').length===1 && document.querySelector('.service-card h3').textContent.includes('My Library')",json!([])).await?==true,"owner pins persist independently after account switch")?;
    b.close().await?;
    drop(b);
    f.close().await?;
    println!(
        "PASS Rust browser: service directory, search, stable cards/forms, personal order, lost response, privacy and mobile accessibility"
    );
    Ok(())
}

async fn retained_activity_history() -> Check<()> {
    step("retained private Activity, stable history window and scope clearing");
    let f = Fixture::new().await?;
    let mut b = f.browser(true).await?;
    claim(&f, &b).await?;
    workspace(&f, &b).await?;
    note(&b).await?;
    b.fill(
        "#workspace-note",
        "A saved fictional note excluded from Activity",
    )
    .await?;
    b.click(".note-card button[type=submit]").await?;
    saved(&b).await?;
    b.fill(
        "#workspace-note",
        "An unfinished fictional draft preserved across Activity",
    )
    .await?;
    check(
        b.evaluate(
            "window.__activityEditor=document.querySelector('#workspace-note'); return true",
            json!([]),
        )
        .await?
            == true,
        "capture actual editor",
    )?;
    let seeded=b.evaluate("const h={'X-Reborn-Product':'keida-hub-reborn','X-Reborn-Contract':'reborn-workspace-v1','X-CSRF-Token':document.querySelector('meta[name=reborn-session-binding]').content,'Content-Type':'application/json'}; return (async()=>{for(let n=1;n<28;n++){let r=await fetch('/api/workspace/note',{method:'PUT',headers:h,body:JSON.stringify({base_revision:String(n),body:'Retained fixture note'})});if(r.status!==200)return false;}return true;})();",json!([])).await?;
    check(seeded == true, "seed actual successful HTTP changes")?;
    b.click(".main-nav button:nth-child(5)").await?;
    b.wait(
        "return document.querySelectorAll('.activity-list li').length===25",
        json!([]),
    )
    .await?;
    check(b.evaluate("return document.querySelector('.activity-list li').textContent.includes('Revision 28') && !document.querySelector('.activity-card').textContent.includes('fictional note') && window.__activityEditor===document.querySelector('#workspace-note') && window.__activityEditor.value.includes('unfinished fictional draft')",json!([])).await?==true,"private action-only page and editor lifetime")?;
    let newest = b
        .evaluate(
            "return document.querySelector('.activity-list li').dataset.activityId",
            json!([]),
        )
        .await?;
    let inserted=b.evaluate("return fetch('/api/workspace/note',{method:'PUT',headers:{'X-Reborn-Product':'keida-hub-reborn','X-Reborn-Contract':'reborn-workspace-v1','X-CSRF-Token':document.querySelector('meta[name=reborn-session-binding]').content,'Content-Type':'application/json'},body:JSON.stringify({base_revision:'28',body:'Newer than the history window'})}).then(r=>r.status===200)",json!([])).await?;
    check(inserted == true, "insert between history pages")?;
    b.click(".activity-card .button-row button:last-child")
        .await?;
    b.wait(
        "return document.querySelectorAll('.activity-list li').length===3",
        json!([]),
    )
    .await?;
    check(b.evaluate("return document.querySelector('.activity-list li').textContent.includes('Revision 3') && document.querySelector('.activity-list li:last-child').textContent.includes('Revision 1') && document.querySelector('.activity-card .button-row button:last-child').disabled",json!([])).await?==true,"older page stable with no shifted or duplicate entries")?;
    b.fill("#activity-query", "%").await?;
    b.click(".activity-search button").await?;
    b.wait(
        "return !!document.querySelector('.activity-empty')",
        json!([]),
    )
    .await?;
    b.fill("#activity-query", "saved").await?;
    b.click(".activity-search button").await?;
    b.wait("return document.querySelectorAll('.activity-list li').length===25 && document.querySelector('.activity-list li').textContent.includes('Revision 29')",json!([])).await?;
    check(b.evaluate("return document.querySelector('.activity-list li').dataset.activityId !== arguments[0]",json!([newest])).await?==true,"new search starts latest history window")?;
    accessibility(&b).await?;
    b.mobile().await?;
    accessibility(&b).await?;
    check(
        b.evaluate(
            "return document.documentElement.scrollWidth<=innerWidth+1",
            json!([]),
        )
        .await?
            == true,
        "history narrow reflow",
    )?;

    b.click(".main-nav button:nth-child(3)").await?;
    b.click("section[aria-label=Connections] .button-row > button:first-child")
        .await?;
    b.wait("return !!document.querySelector('.activity-empty') && document.querySelector('#activity-category').value==='connections'",json!([])).await?;
    let comparison = f.hold("/api/workspace/activity");
    b.fill("#activity-query", "saved").await?;
    b.click(".activity-search button").await?;
    tokio::time::timeout(Duration::from_secs(3), comparison.entered.notified())
        .await
        .map_err(|_| "held search response entered")?;
    b.fill("#activity-query", "A newer unsubmitted search")
        .await?;
    comparison.release.notify_one();
    b.wait("return document.querySelector('.activity-card .workspace-status').textContent.includes('checked')",json!([])).await?;
    check(
        b.evaluate(
            "return document.querySelector('#activity-query').value==='A newer unsubmitted search'",
            json!([]),
        )
        .await?
            == true,
        "completed search does not replace newer typed search text",
    )?;
    let held = f.hold("/api/workspace/activity");
    b.fill("#activity-query", "private history search").await?;
    b.click(".activity-search button").await?;
    tokio::time::timeout(Duration::from_secs(3), held.entered.notified())
        .await
        .map_err(|_| "held Activity read entered")?;
    b.evaluate(
        "window.dispatchEvent(new Event('blur'));return true",
        json!([]),
    )
    .await?;
    check(b.evaluate("return document.querySelector('#activity-query').value==='' && document.querySelectorAll('.activity-list li').length===0 && document.querySelector('#workspace-note').value===''",json!([])).await?==true,"privacy loss synchronously clears results, query and draft DOM")?;
    held.release.notify_one();
    tokio::time::sleep(Duration::from_millis(200)).await;
    check(b.evaluate("return document.querySelectorAll('.activity-list li').length===0 && document.querySelector('#activity-query').value==='';",json!([])).await?==true,"late Activity response cannot repopulate cleared scope")?;
    b.close().await?;
    f.close().await?;
    println!(
        "PASS Rust browser: private retained Activity, keyset pagination, literal search, editor lifetime, reflow and late-response privacy"
    );
    Ok(())
}

async fn grouped_notifications() -> Check<()> {
    step("grouped inbox, durable read watermark, racing changes and lost response");
    let f = Fixture::new().await?;
    let mut owner = f.browser(true).await?;
    claim(&f, &owner).await?;
    let (name, password) = f.enroll_member(&owner).await?;
    let mut b = f.browser(true).await?;
    sign_in(&f, &b, &name, &password).await?;
    workspace(&f, &b).await?;
    note(&b).await?;
    b.fill(
        "#workspace-note",
        "An unfinished thought across inbox checks",
    )
    .await?;
    b.evaluate(
        "window.__inboxEditor=document.querySelector('#workspace-note');return true",
        json!([]),
    )
    .await?;
    b.click(".main-nav button:nth-child(6)").await?;
    b.wait(
        "return !!document.querySelector('.notification-empty')",
        json!([]),
    )
    .await?;
    f.shared_service(&owner, 0).await?;
    f.shared_service(&owner, 1).await?;
    b.click(".check-notifications").await?;
    b.wait("return document.querySelectorAll('.notification-list li').length===1 && document.querySelector('.notification-count').textContent==='2 unread changes' && document.querySelector('.notification-badge').textContent==='1'",json!([])).await?;
    check(b.evaluate("return window.__inboxEditor===document.querySelector('#workspace-note') && window.__inboxEditor.value==='An unfinished thought across inbox checks' && !document.querySelector('.notification-card').textContent.includes('Fictional shared service') && !document.querySelector('.notification-card').textContent.includes('example.test')",json!([])).await?==true,"inbox retains actual editor/draft and safe group-only metadata")?;
    let held = f.hold("/api/workspace/notifications/read");
    b.click(".mark-notification-read").await?;
    tokio::time::timeout(Duration::from_secs(3), held.entered.notified())
        .await
        .map_err(|_| "held committed read response")?;
    f.shared_service(&owner, 2).await?;
    held.release.notify_one();
    b.wait("return document.querySelector('.notification-status').textContent.includes('Read marker saved')",json!([])).await?;
    b.click(".check-notifications").await?;
    b.wait(
        "return document.querySelector('.notification-count')?.textContent==='1 unread change'",
        json!([]),
    )
    .await?;
    let writes = f.writes();
    let lost = f.hold("/api/workspace/notifications/read");
    b.click(".mark-notification-read").await?;
    tokio::time::timeout(Duration::from_secs(3), lost.entered.notified())
        .await
        .map_err(|_| "lost committed read response")?;
    f.shared_service(&owner, 3).await?;
    b.wait("return document.querySelector('.notification-status').textContent.includes('may have saved')",json!([])).await?;
    lost.release.notify_one();
    b.click(".check-notifications").await?;
    b.wait("return document.querySelector('.notification-status').textContent.includes('Current read markers checked') && document.querySelector('.notification-count')?.textContent==='1 unread change'",json!([])).await?;
    check(
        f.writes() == writes + 2,
        "one read PUT plus one deliberate owner change; no replay",
    )?;
    b.click(".mark-notification-read").await?;
    b.wait("return !!document.querySelector('.notification-empty') && !document.querySelector('.notification-badge')",json!([])).await?;
    workspace(&f, &b).await?;
    b.click(".main-nav button:nth-child(6)").await?;
    b.click("#notification-show-read").await?;
    b.wait(
        "return document.querySelector('.notification-count')?.textContent==='Read'",
        json!([]),
    )
    .await?;
    accessibility(&b).await?;
    b.mobile().await?;
    accessibility(&b).await?;
    check(
        b.evaluate(
            "return innerWidth===390 && document.documentElement.scrollWidth<=innerWidth+1",
            json!([]),
        )
        .await?
            == true,
        "inbox and read controls reflow on narrow viewport",
    )?;
    let private = f.hold("/api/workspace/snapshot");
    b.click(".check-notifications").await?;
    tokio::time::timeout(Duration::from_secs(3), private.entered.notified())
        .await
        .map_err(|_| "held inbox snapshot")?;
    b.evaluate(
        "window.dispatchEvent(new Event('blur'));return true",
        json!([]),
    )
    .await?;
    check(b.evaluate("return !document.querySelector('.notification-list li') && !document.querySelector('#notification-show-read').checked && !document.querySelector('.notification-badge') && document.querySelector('#workspace-note').value==='';",json!([])).await?==true,"privacy clears groups/read toggle/badge/draft synchronously")?;
    f.revoke_all(&b).await?;
    private.release.notify_one();
    tokio::time::sleep(Duration::from_millis(200)).await;
    check(b.evaluate("return !document.querySelector('.notification-list li') && !document.querySelector('.notification-badge');",json!([])).await?==true,"late snapshot cannot repopulate cleared notification scope")?;
    b.close().await?;
    owner.close().await?;
    f.close().await?;
    println!(
        "PASS Rust browser: grouped notifications, racing watermark, lost read response without replay, reload, privacy and narrow accessibility"
    );
    Ok(())
}

async fn home_panels(b: &Browser, order: [&str; 3], visible: [&str; 3]) -> Check<()> {
    check(b.evaluate("const panels=[...document.querySelectorAll('[data-home-panel]')], shown=panels.filter(p=>p.getClientRects().length>0 && !p.closest('[hidden]')); return panels.length===3 && panels.every((p,i)=>p.dataset.homePanel===arguments[0][i]) && shown.map(p=>p.dataset.homePanel).join(',')===arguments[1].filter(Boolean).join(',') && shown.every((p,i)=>{if(!i)return true;const before=shown[i-1].getBoundingClientRect(),next=p.getBoundingClientRect();return next.top>before.top-1 && (Math.abs(next.top-before.top)>1 || next.left>=before.right-1);});", json!([order, visible])).await? == true, "Home panels retain authoritative DOM reading order and requested visibility")
}

async fn arrange_pins_first(b: &Browser) -> Check<()> {
    b.click(".customize-home").await?;
    // Focus is a browser primitive; the actual command is native keyboard Enter.
    check(b.evaluate("const button=document.querySelector('button[aria-label=\"Move Pinned services up\"]'); button.focus();return document.activeElement===button;", json!([])).await? == true, "layout reorder control receives keyboard focus")?;
    b.keys("\u{e007}").await?;
    b.wait(
        "return document.activeElement===document.querySelector('[data-layout-row=\"pins\"]');",
        json!([]),
    )
    .await?;
    b.click("button[aria-label='Move Pinned services up']")
        .await?;
    b.click("input[aria-label='Show Connections']").await?;
    home_panels(b, ["pins", "note", "connections"], ["pins", "note", ""]).await
}

async fn layout_saved(b: &Browser) -> Check<()> {
    b.wait("return document.querySelector('.layout-status')?.textContent.includes('Layout saved') && !document.querySelector('.layout-editor:not([hidden])');", json!([])).await
}

async fn personal_home_layout() -> Check<()> {
    step("personal Home arrangement, native keyboard controls and persistent panels");
    let f = Fixture::new().await?;
    let mut a = f.browser(true).await?;
    claim(&f, &a).await?;
    let (member, password) = f.enroll_member(&a).await?;
    workspace(&f, &a).await?;
    home_panels(
        &a,
        ["note", "connections", "pins"],
        ["note", "connections", "pins"],
    )
    .await?;
    note(&a).await?;
    a.fill("#workspace-note", "An unfinished note while arranging Home")
        .await?;
    a.click(".main-nav button:nth-child(4)").await?;
    a.fill(
        "#service-name",
        "An unfinished service while arranging Home",
    )
    .await?;
    a.evaluate("window.__layoutNote=document.querySelector('#workspace-note');window.__layoutService=document.querySelector('#service-name');window.__layoutPanels=[...document.querySelectorAll('[data-home-panel]')];return true;", json!([])).await?;
    a.click(".main-nav button:first-child").await?;
    let writes = f.writes();
    arrange_pins_first(&a).await?;
    a.click(".reset-layout").await?;
    home_panels(
        &a,
        ["note", "connections", "pins"],
        ["note", "connections", "pins"],
    )
    .await?;
    a.click("input[aria-label='Show Connections']").await?;
    a.click("input[aria-label='Show Pinned services']").await?;
    check(
        a.evaluate(
            "return document.querySelector('input[aria-label=\"Show Workspace note\"]').disabled;",
            json!([]),
        )
        .await?
            == true,
        "the last visible Home panel cannot be hidden",
    )?;
    a.click(".reset-layout").await?;
    a.click(".cancel-layout").await?;
    check(
        f.writes() == writes,
        "layout preview, reset and cancel create no server writes",
    )?;
    arrange_pins_first(&a).await?;
    a.click(".save-layout").await?;
    layout_saved(&a).await?;
    home_panels(&a, ["pins", "note", "connections"], ["pins", "note", ""]).await?;
    check(a.evaluate("return window.__layoutNote===document.querySelector('#workspace-note') && window.__layoutService===document.querySelector('#service-name') && window.__layoutPanels.every(p=>p===[...document.querySelectorAll('[data-home-panel]')].find(n=>n.dataset.homePanel===p.dataset.homePanel)) && window.__layoutNote.value==='An unfinished note while arranging Home' && window.__layoutService.value==='An unfinished service while arranging Home';", json!([])).await? == true, "Home reorder and hide preserve actual panel, note editor and service form instances and drafts")?;
    a.click(".main-nav button:nth-child(3)").await?;
    check(
        a.evaluate(
            "return !!document.querySelector('section[aria-label=Connections]:not([hidden])');",
            json!([]),
        )
        .await?
            == true,
        "hidden Home connection summary remains available in Connections",
    )?;
    a.click(".main-nav button:nth-child(4)").await?;
    check(a.evaluate("return document.querySelector('#service-name').value==='An unfinished service while arranging Home';", json!([])).await? == true, "service draft remains usable after Home layout save")?;
    a.click(".main-nav button:first-child").await?;

    step("layout reload, stale concurrent browser edit and retained conflict comparison");
    let mut b = f.browser(true).await?;
    sign_in(&f, &b, &f.username, &f.password).await?;
    workspace(&f, &b).await?;
    home_panels(&b, ["pins", "note", "connections"], ["pins", "note", ""]).await?;
    b.click(".customize-home").await?;
    b.click("input[aria-label='Show Connections']").await?;
    home_panels(
        &b,
        ["pins", "note", "connections"],
        ["pins", "note", "connections"],
    )
    .await?;
    // Hold an actual old observation while the other browser commits. This
    // freezes a known stale base without relying on the 15-second poll timing.
    let obsolete = f.hold("/api/workspace/snapshot");
    b.evaluate(
        "window.dispatchEvent(new Event('focus'));return true;",
        json!([]),
    )
    .await?;
    tokio::time::timeout(Duration::from_secs(3), obsolete.entered.notified())
        .await
        .map_err(|_| "old concurrent layout snapshot hold")?;
    a.click(".customize-home").await?;
    a.click(".reset-layout").await?;
    a.click(".save-layout").await?;
    layout_saved(&a).await?;
    let canonical = f.hold("/api/workspace/snapshot");
    b.click(".save-layout").await?;
    tokio::time::timeout(Duration::from_secs(3), canonical.entered.notified())
        .await
        .map_err(|_| "layout conflict canonical snapshot hold")?;
    obsolete.release.notify_one();
    check(b.evaluate("return document.querySelector('.save-layout').disabled && !document.querySelector('section[aria-label=\"Layout conflict\"]');", json!([])).await? == true, "layout cannot resolve conflict before fresh canonical data arrives")?;
    home_panels(
        &b,
        ["pins", "note", "connections"],
        ["pins", "note", "connections"],
    )
    .await?;
    canonical.release.notify_one();
    b.wait(
        "return !!document.querySelector('section[aria-label=\"Layout conflict\"]');",
        json!([]),
    )
    .await?;
    home_panels(
        &b,
        ["pins", "note", "connections"],
        ["pins", "note", "connections"],
    )
    .await?;
    b.click("section[aria-label='Layout conflict'] button:last-of-type")
        .await?;
    home_panels(
        &b,
        ["note", "connections", "pins"],
        ["note", "connections", "pins"],
    )
    .await?;

    step("committed layout response loss reconciles once without mutation replay");
    arrange_pins_first(&b).await?;
    let writes = f.writes();
    let lost = f.hold("/api/workspace/layout");
    b.click(".save-layout").await?;
    tokio::time::timeout(Duration::from_secs(3), lost.entered.notified())
        .await
        .map_err(|_| "actual committed layout response hold")?;
    b.wait("return !!document.querySelector('section[aria-label=\"Uncertain layout\"]') && document.querySelector('.layout-status').textContent.includes('may have saved');", json!([])).await?;
    check(
        b.evaluate(
            "return document.querySelector('.save-layout').disabled;",
            json!([]),
        )
        .await?
            == true,
        "uncertain layout cannot be resubmitted before reconciliation",
    )?;
    lost.release.notify_one();
    b.click(".check-layout").await?;
    b.wait("return !document.querySelector('.layout-editor:not([hidden])') && document.querySelector('.layout-status').textContent.includes('matches your changes');", json!([])).await?;
    check(
        f.writes() == writes + 1,
        "committed lost layout response uses authorized GET without replaying PUT",
    )?;
    home_panels(&b, ["pins", "note", "connections"], ["pins", "note", ""]).await?;
    workspace(&f, &b).await?;
    home_panels(&b, ["pins", "note", "connections"], ["pins", "note", ""]).await?;

    step("remote Home reorder preserves active service form focus and selection");
    workspace(&f, &a).await?;
    home_panels(&a, ["pins", "note", "connections"], ["pins", "note", ""]).await?;
    a.click(".main-nav button:nth-child(4)").await?;
    a.fill(
        "#service-name",
        "A focused service draft during a remote Home reorder",
    )
    .await?;
    check(a.evaluate("window.__focusedService=document.querySelector('#service-name');window.__focusedService.setSelectionRange(3,11);window.__focusedPanelOrder=[...document.querySelectorAll('[data-home-panel]')].map(p=>p.dataset.homePanel).join(',');return document.activeElement===window.__focusedService;", json!([])).await? == true, "service form starts focused with an actual text selection")?;
    b.click(".customize-home").await?;
    b.click(".reset-layout").await?;
    b.click(".save-layout").await?;
    layout_saved(&b).await?;
    let focused = f.hold("/api/workspace/snapshot");
    a.evaluate(
        "window.__layoutObservationStart=performance.now();window.dispatchEvent(new Event('focus'));return true;",
        json!([]),
    )
    .await?;
    tokio::time::timeout(Duration::from_secs(3), focused.entered.notified())
        .await
        .map_err(|_| "focused service canonical layout observation hold")?;
    focused.release.notify_one();
    // Observe completion of the real authorized fetch, then allow its Svelte
    // DOM work to render before checking focus. No application state is injected.
    a.wait("return performance.getEntriesByType('resource').some(e=>new URL(e.name).pathname==='/api/workspace/snapshot' && e.initiatorType==='fetch' && e.startTime>=window.__layoutObservationStart);", json!([])).await?;
    a.evaluate("return new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve(true))));", json!([])).await?;
    check(a.evaluate("return document.querySelector('#service-name')===window.__focusedService && document.activeElement===window.__focusedService && window.__focusedService.selectionStart===3 && window.__focusedService.selectionEnd===11 && window.__focusedService.value==='A focused service draft during a remote Home reorder' && [...document.querySelectorAll('[data-home-panel]')].map(p=>p.dataset.homePanel).join(',')===window.__focusedPanelOrder;", json!([])).await? == true, "authorized layout refresh while Services is active preserves exact form focus, selection, draft and wrapper positions")?;
    a.click(".main-nav button:first-child").await?;
    home_panels(
        &a,
        ["note", "connections", "pins"],
        ["note", "connections", "pins"],
    )
    .await?;
    arrange_pins_first(&b).await?;
    b.click(".save-layout").await?;
    layout_saved(&b).await?;

    step("independent member layout and native desktop/mobile arrangement controls");
    let mut other = f.browser(true).await?;
    sign_in(&f, &other, &member, &password).await?;
    workspace(&f, &other).await?;
    home_panels(
        &other,
        ["note", "connections", "pins"],
        ["note", "connections", "pins"],
    )
    .await?;
    other.click(".customize-home").await?;
    other
        .click("input[aria-label='Show Pinned services']")
        .await?;
    other.click(".save-layout").await?;
    layout_saved(&other).await?;
    workspace(&f, &other).await?;
    home_panels(
        &other,
        ["note", "connections", "pins"],
        ["note", "connections", ""],
    )
    .await?;
    workspace(&f, &b).await?;
    home_panels(&b, ["pins", "note", "connections"], ["pins", "note", ""]).await?;
    b.click(".customize-home").await?;
    accessibility(&b).await?;
    b.mobile().await?;
    accessibility(&b).await?;
    check(
        b.evaluate(
            "return innerWidth===390 && document.documentElement.scrollWidth<=innerWidth+1;",
            json!([]),
        )
        .await?
            == true,
        "Home arrangement controls and panels reflow at 390px",
    )?;
    b.click(".reset-layout").await?;
    home_panels(
        &b,
        ["note", "connections", "pins"],
        ["note", "connections", "pins"],
    )
    .await?;
    b.click(".cancel-layout").await?;
    home_panels(&b, ["pins", "note", "connections"], ["pins", "note", ""]).await?;

    step("layout draft privacy and rejection of obsolete private snapshot");
    let private = f.hold("/api/workspace/snapshot");
    b.evaluate(
        "window.dispatchEvent(new Event('focus'));return true;",
        json!([]),
    )
    .await?;
    tokio::time::timeout(Duration::from_secs(3), private.entered.notified())
        .await
        .map_err(|_| "layout privacy snapshot hold")?;
    b.click(".customize-home").await?;
    b.click(".reset-layout").await?;
    check(b.evaluate("window.dispatchEvent(new Event('blur'));return !document.querySelector('.layout-editor:not([hidden])') && document.querySelector('#workspace-note').value==='' && ![...document.querySelectorAll('[data-home-panel]')].some(p=>p.getClientRects().length>0 && !p.closest('[hidden]'));", json!([])).await? == true, "privacy loss clears layout draft, all private Home panels and note synchronously")?;
    f.revoke_all(&b).await?;
    private.release.notify_one();
    tokio::time::sleep(Duration::from_millis(200)).await;
    check(b.evaluate("return !document.querySelector('.layout-editor:not([hidden])') && ![...document.querySelectorAll('[data-home-panel]')].some(p=>p.getClientRects().length>0 && !p.closest('[hidden]'));", json!([])).await? == true, "late snapshot cannot restore layout or panels after account privacy loss")?;
    other.close().await?;
    b.close().await?;
    a.close().await?;
    f.close().await?;
    println!(
        "PASS Rust browser: personal Home order/visibility, stable components/drafts/focused service selection, concurrent conflict, lost response without replay, account isolation, privacy and narrow accessibility"
    );
    Ok(())
}

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
    let mut b = f.browser(true).await?;
    claim(&f, &b).await?;
    workspace(&f, &b).await?;
    note(&b).await?;
    b.fill("#workspace-note", "A private fictional note 海")
        .await?;
    b.evaluate("window.__editor=document.querySelector('#workspace-note'); window.__editor.setSelectionRange(2,7); return true",json!([])).await?;
    let reads = f.reads();
    for _ in 0..4 {
        b.click(".main-nav button:first-child").await?;
        note(&b).await?;
    }
    check(b.evaluate("return window.__editor === document.querySelector('#workspace-note') && window.__editor.selectionStart === 2 && window.__editor.selectionEnd === 7",json!([])).await?==true,"view navigation preserves actual editor and selection")?;
    body(&b, "A private fictional note 海").await?;
    tokio::time::sleep(Duration::from_secs(16)).await;
    check(
        f.reads() > reads && f.reads() <= reads + 2,
        "navigation must not duplicate observation owners",
    )?;
    b.click("#workspace-note").await?;
    b.keys("\u{e004}\u{e007}").await?;
    saved(&b).await?;
    b.fill("#workspace-note", "An unfinished draft after saving")
        .await?;
    check(b.evaluate("return Object.entries(sessionStorage).filter(([k])=>k.startsWith('keida-hub-reborn.workspace.v1:')).length === 1 && Object.entries(sessionStorage).every(([k,v])=>!v.includes(arguments[0])&&!v.includes(arguments[1])&&!v.includes(document.querySelector('meta[name=reborn-session-binding]').content))",json!([&f.password,&f.setup])).await?==true,"draft storage has scoped non-secret text only")?;
    check(b.evaluate("window.dispatchEvent(new Event('pagehide')); return document.querySelector('#workspace-note').value === '' && !document.body.textContent.includes(arguments[0])",json!([&f.username])).await?==true,"pagehide clears private DOM synchronously")?;
    workspace(&f, &b).await?;
    note(&b).await?;
    body(&b, "A private fictional note 海").await?;
    b.click("section[aria-label='Draft recovery'] button:first-of-type")
        .await?;
    body(&b, "An unfinished draft after saving").await?;
    b.click(".note-card button[type=submit]").await?;
    saved(&b).await?;
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
    a.click(".note-card button[type=submit]").await?;
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
pub async fn run() -> Check<()> {
    lifetime_and_recovery().await?;
    conflicts_and_pending_saves().await?;
    cross_account_late_response().await?;
    revocation_and_optional_failures().await?;
    println!(
        "Rust workspace browser acceptance: 4 workflows passed; Chromium/ChromeDriver156.0.8078.4; real HTTPS/PostgreSQL; no skipped prerequisite"
    );
    Ok(())
}

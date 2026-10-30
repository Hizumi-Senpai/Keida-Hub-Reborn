//! Issue29 expectations use actual TLS responses from the fixture proxy, actual
//! application authority and real elapsed time. No production test transport.
use super::*;
use crate::fixture::RefreshMode;
use std::time::Instant;

async fn enter(f: &Fixture, b: &Browser) -> Check<()> {
    // Cross a native document boundary; a fragment change is not a reload.
    b.navigate(&format!("{}/account", f.origin)).await?;
    b.click("a[href='/workspace']").await?;
    b.wait("return !!document.querySelector('#workspace-note') && !document.querySelector('#workspace-note').disabled;", json!([])).await?;
    b.wait("return document.querySelector('.refresh-control')?.textContent.includes('Page matches server');", json!([])).await
}
async fn phase(b: &Browser, expected: &str) -> Check<()> {
    b.wait("return document.querySelector('[data-refresh-phase]')?.dataset.refreshPhase===arguments[0];", json!([expected])).await
}
async fn review(b: &Browser) -> Check<()> {
    b.click(".refresh-open").await?;
    b.wait(
        "return !!document.querySelector('.refresh-stay');",
        json!([]),
    )
    .await
}
async fn ready(b: &Browser) -> Check<()> {
    review(b).await?;
    b.click(".refresh-prepare").await?;
    phase(b, "compatible-ready").await
}
pub async fn run() -> Check<()> {
    step("refresh phase01 loaded/running identity and draft review");
    let f = Fixture::new().await?;
    let mut b = f.browser(true).await?;
    claim(&f, &b).await?;
    enter(&f, &b).await?;
    let writes = f.writes();
    check(b.evaluate("window.__refreshEditor=document.querySelector('#workspace-note');return document.querySelectorAll('.main-nav button').length===11 && !document.querySelector('[data-refresh-phase]');",json!([])).await?==true,"matching server stays quiet and keeps eleven navigation entries")?;
    note(&b).await?;
    b.fill("#workspace-note", "Refresh draft stays in this editor")
        .await?;
    ready(&b).await?;
    check(b.evaluate("return !!document.querySelector('[data-refresh-drafts]') && document.querySelector('.refresh-navigate').textContent.includes('Discard') && document.querySelector('#workspace-note')===window.__refreshEditor && document.querySelector('#workspace-note').value===arguments[0];",json!(["Refresh draft stays in this editor"])).await?==true,"preparing refresh preserves the actual dirty editor and requires deliberate discard")?;
    b.click(".refresh-stay").await?;
    body(&b, "Refresh draft stays in this editor").await?;
    b.click(".note-card button[type=submit]").await?;
    saved(&b).await?;

    step("refresh phase02 layout, service and secret-form flags without value persistence");
    b.click(".main-nav button:nth-child(1)").await?;
    b.wait("return !!document.querySelector('.customize-tiles') && !document.querySelector('.customize-tiles').disabled;",json!([])).await?;
    b.click(".customize-tiles").await?;
    review(&b).await?;
    check(
        b.evaluate(
            "return !!document.querySelector('[data-refresh-drafts]');",
            json!([]),
        )
        .await?
            == true,
        "unsaved arrangement is reviewed",
    )?;
    // Tile-only transitions must update an already-open review without another
    // form input, workspace read or refresh-control transition.
    b.click(".cancel-tiles").await?;
    b.wait(
        "return !document.querySelector('[data-refresh-drafts]');",
        json!([]),
    )
    .await?;
    b.click(".customize-tiles").await?;
    b.wait(
        "return !!document.querySelector('[data-refresh-drafts]');",
        json!([]),
    )
    .await?;
    b.click(".refresh-stay").await?;
    // The normal cancel control owns the arrangement; refresh does not replace it.
    b.click(".cancel-tiles").await?;
    b.click(".main-nav button:nth-child(4)").await?;
    b.fill("#service-name", "Unfinished reviewed service")
        .await?;
    review(&b).await?;
    check(b.evaluate("return !!document.querySelector('[data-refresh-drafts]') && document.querySelector('#service-name').value===arguments[0];",json!(["Unfinished reviewed service"])).await?==true,"unfinished service stays in its original form")?;
    b.click(".refresh-stay").await?;
    b.click(".main-nav button:nth-child(3)").await?;
    b.fill("input[name=token]", "fixture-secret-never-a-refresh-draft")
        .await?;
    review(&b).await?;
    check(b.evaluate("return !!document.querySelector('[data-refresh-drafts]') && !Object.keys(sessionStorage).some(k=>sessionStorage.getItem(k).includes(arguments[0])) && !document.querySelector('[data-refresh-phase]').textContent.includes(arguments[0]);",json!(["fixture-secret-never-a-refresh-draft"])).await?==true,"secret-form review retains only flags and no secret copy")?;
    b.click(".refresh-stay").await?;
    // Closing the provider view uses its existing secret clearing boundary.
    b.click(".main-nav button:nth-child(2)").await?;
    check(
        f.writes() == writes + 1,
        "refresh review sends no writes beyond the deliberately saved note",
    )?;

    step("refresh phase03 upgrades, rollback and equal-display source changes");
    for (mode, display) in [
        (RefreshMode::Upgrade, "0.1.999"),
        (RefreshMode::Rollback, "0.1.16"),
        (RefreshMode::SameDisplayOtherSource, ""),
    ] {
        f.refresh_mode(mode);
        ready(&b).await?;
        check(b.evaluate("const d=document.querySelector('.refresh-builds');return !!d && (arguments[0]==='' || d.textContent.includes(arguments[0])) && document.querySelector('#workspace-note')===window.__refreshEditor;",json!([display])).await?==true,"server identity changes never relabel or replace the loaded editor")?;
        b.click(".refresh-stay").await?;
    }
    f.refresh_mode(RefreshMode::Current);

    step("refresh phase04 in-flight and lost committed save are checked without replay");
    let hold = f.hold("/api/workspace/note");
    b.fill("#workspace-note", "Committed during refresh review")
        .await?;
    let before = f.writes();
    b.click(".note-card button[type=submit]").await?;
    tokio::time::timeout(Duration::from_secs(3), hold.entered.notified())
        .await
        .map_err(|_| "refresh pending save entered")?;
    review(&b).await?;
    check(b.evaluate("return !!document.querySelector('[data-refresh-busy]') && document.querySelector('.refresh-prepare').disabled;",json!([])).await?==true,"in-flight mutation blocks refresh preparation")?;
    b.wait(
        "return !!document.querySelector('[aria-label=\"Uncertain save\"]');",
        json!([]),
    )
    .await?;
    check(
        f.writes() == before + 1,
        "lost save is never replayed by refresh",
    )?;
    hold.release.notify_one();
    b.click(".refresh-stay").await?;
    b.click("[aria-label='Uncertain save'] button").await?;
    b.wait("return !document.querySelector('[aria-label=\"Uncertain save\"]') && document.querySelector('#workspace-note').value===arguments[0];",json!(["Committed during refresh review"])).await?;
    check(
        f.writes() == before + 1,
        "read-only reconciliation does not repeat the committed save",
    )?;

    step("refresh phase05 cancel prevents a late health reply from replacing state");
    review(&b).await?;
    let held = f.hold("/api/health");
    b.click(".refresh-prepare").await?;
    tokio::time::timeout(Duration::from_secs(3), held.entered.notified())
        .await
        .map_err(|_| "refresh held health entered")?;
    b.click(".refresh-cancel").await?;
    phase(&b, "cancelled").await?;
    held.release.notify_one();
    tokio::time::sleep(Duration::from_millis(120)).await;
    phase(&b, "cancelled").await?;
    b.click(".refresh-stay").await?;

    step(
        "refresh phase06 malformed, HTML, oversized and mixed-identity 200 replies are unavailable",
    );
    for mode in [
        RefreshMode::Malformed,
        RefreshMode::Html,
        RefreshMode::Oversized,
        RefreshMode::IdentityRace,
    ] {
        f.refresh_mode(mode);
        // A normal visible lifecycle check runs discovery through the existing scheduler.
        b.evaluate(
            "window.dispatchEvent(new Event('focus'));return true;",
            json!([]),
        )
        .await?;
        phase(&b, "unavailable").await?;
        check(b.evaluate("return !document.querySelector('.refresh-navigate') && document.querySelector('#workspace-note')===window.__refreshEditor;",json!([])).await?==true,"bad successful responses never authorize a refresh")?;
    }
    f.refresh_mode(RefreshMode::Current);
    enter(&f, &b).await?;

    step("refresh phase07 account, product and compatibility failures clear private DOM");
    for (mode, expected) in [
        (RefreshMode::AccountChanged, "sign-in-required"),
        (RefreshMode::AccessDenied, "sign-in-required"),
        (RefreshMode::OtherProduct, "incompatible"),
        (RefreshMode::Unsupported, "incompatible"),
        (RefreshMode::Legacy17, "incompatible"),
    ] {
        f.refresh_mode(mode);
        review(&b).await?;
        b.click(".refresh-prepare").await?;
        phase(&b, expected).await?;
        check(b.evaluate("return document.querySelector('#workspace-note')?.value==='' && !document.body.textContent.includes(arguments[0]) && !document.querySelector('.refresh-navigate');",json!(["Committed during refresh review"])).await?==true,"account or product failure hides private work and never claims compatibility")?;
        f.refresh_mode(RefreshMode::Current);
        enter(&f, &b).await?;
    }

    step("refresh phase08 narrow keyboard and accessibility review");
    b.mobile().await?;
    ready(&b).await?;
    b.evaluate(
        "document.querySelector('.refresh-navigate').focus();return true;",
        json!([]),
    )
    .await?;
    check(b.evaluate("return document.activeElement===document.querySelector('.refresh-navigate') && document.documentElement.scrollWidth<=window.innerWidth;",json!([])).await?==true,"390px refresh review remains keyboard reachable without horizontal overflow")?;
    accessibility(&b).await?;
    b.click(".refresh-stay").await?;

    step("refresh phase09 actual sixty-second deadline includes hidden time");
    f.refresh_mode(RefreshMode::Unavailable);
    review(&b).await?;
    let started = Instant::now();
    b.click(".refresh-prepare").await?;
    phase(&b, "reconnecting").await?;
    let other = b.new_tab().await?;
    b.switch(&other).await?;
    b.navigate("about:blank").await?;
    tokio::time::sleep(Duration::from_secs(61)).await;
    check(
        started.elapsed() >= Duration::from_secs(60),
        "real reconnect minute elapsed without a fake clock",
    )?;
    let count = f.refresh_reads();
    f.refresh_mode(RefreshMode::Current);
    b.switch(&b.first).await?;
    phase(&b, "could-not-reconnect").await?;
    check(
        f.refresh_reads() == count,
        "returning after the deadline cannot extend it with another request",
    )?;
    check(b.evaluate("return location.pathname==='/workspace' && !document.querySelector('.refresh-navigate');",json!([])).await?==true,"deadline ends honestly on the existing document")?;

    step(
        "refresh phase10 explicit fixed GET discards only after successful access and fresh review",
    );
    b.click(".refresh-stay").await?;
    b.wait(
        "return !document.querySelector('#workspace-note').disabled;",
        json!([]),
    )
    .await?;
    note(&b).await?;
    b.fill("#workspace-note", "Deliberately discarded refresh draft")
        .await?;
    ready(&b).await?;
    let before = f.writes();
    b.click(".refresh-navigate").await?;
    b.wait("return document.querySelector('.refresh-control')?.textContent.includes('Page matches server') && document.querySelector('#workspace-note')?.value===arguments[0];",json!(["Committed during refresh review"])).await?;
    check(b.evaluate("return location.pathname==='/workspace' && location.search==='' && location.hash==='' && !document.querySelector('[aria-label=\"Draft recovery\"]') && !document.body.textContent.includes(arguments[0]);",json!(["Deliberately discarded refresh draft"])).await?==true,"deliberate refresh is a fresh fixed same-origin GET without discarded-draft recovery")?;
    check(
        f.writes() == before,
        "fresh document navigation replays no mutation",
    )?;
    step("refresh phase11 actual application revocation refuses the old browser bearer");
    // This case exercises the explicit refresh access check. Leave Home's
    // automatic provider reads through normal navigation before revoking, so
    // their independent401 handling cannot remove the control under test.
    step("refresh phase11a select the retained Note workflow");
    note(&b).await?;
    step("refresh phase11b open explicit refresh review");
    review(&b).await?;
    step("refresh phase11c revoke actual application authority");
    f.revoke_all(&b).await?;
    step("refresh phase11d check the revoked bearer deliberately");
    let prepare = b.click(".refresh-prepare").await;
    if prepare.is_err() {
        let diagnostic = b.evaluate("return [document.hasFocus(),document.visibilityState==='visible',!!document.querySelector('.refresh-open'),!!document.querySelector('.refresh-prepare'),document.querySelector('[data-refresh-phase]')?.dataset.refreshPhase==='sign-in-required',document.querySelector('#workspace-note')?.value==='',!!document.querySelector('.refresh-navigate')];",json!([])).await;
        println!(
            "RUST_BROWSER_REFRESH_REVOKED flags={}",
            diagnostic.unwrap_or(json!(null))
        );
    }
    prepare?;
    phase(&b, "sign-in-required").await?;
    check(b.evaluate("return document.querySelector('#workspace-note')?.value==='' && !document.querySelector('.refresh-navigate') && !document.body.textContent.includes(arguments[0]);",json!(["Committed during refresh review"])).await?==true,"real revoked authority clears private content and cannot prepare refresh")?;
    b.close().await?;
    drop(b);
    f.close().await?;
    println!(
        "PASS Rust browser: loaded/running identity, upgrade/rollback/source comparison, dirty and secret forms, pending/lost writes without replay, cancellation/privacy, actual60-second hidden deadline and deliberate GET refresh"
    );
    Ok(())
}

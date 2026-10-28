//! Real Chromium workflow over the Rust app and synthetic fixed-domain OAuth.
use super::{accessibility, claim, sign_in, step, workspace};
use crate::{Check, check, driver::Browser, fixture::Fixture};
use reborn_crafty_fixture::discord as d;
use serde_json::json;

async fn identity(f: &Fixture, b: &Browser) -> Check<()> {
    // A fragment navigation within an already loaded workspace does not mount
    // another Svelte app. Exercise the actual eleventh view control instead.
    if b.evaluate("return location.pathname==='/workspace' && !!document.querySelector('.main-nav button:nth-child(11)');",json!([])).await? != true {
        workspace(f, b).await?;
    }
    b.wait("return !!document.querySelector('#workspace-note') && !document.querySelector('#workspace-note').disabled;",json!([])).await?;
    b.click(".main-nav button:nth-child(11)").await?;
    b.wait("const s=document.querySelector('[data-discord-identity]'),n=document.querySelector('.main-nav button:nth-child(11)'),c=s?.querySelector('.discord-check');return !!s && n?.getAttribute('aria-current')==='page' && !s.closest('[hidden]') && s.getClientRects().length>0 && /^(0|[1-9][0-9]*)$/.test(s.dataset.linkRevision) && s.dataset.save==='idle' && !!c && !c.disabled;",json!([])).await
}
async fn consent(b: &Browser) -> Check<()> {
    b.click(".discord-start").await?;
    b.wait("return location.pathname==='/account/discord/authorize' && !!document.querySelector('a[href^=\"https://discord.com/oauth2/authorize?\"]');",json!([])).await?;
    check(b.evaluate("return !document.body.textContent.includes(arguments[0]) && !document.body.textContent.includes(arguments[1]) && document.referrer==='' && !document.querySelector('form[action^=\"https://\"]');",json!([d::ID,d::DISPLAY])).await?==true,"native authorize document has no private identity and uses an ordinary external anchor")?;
    b.click("a[href^=\"https://discord.com/oauth2/authorize?\"]")
        .await?;
    b.wait("return location.origin==='https://discord.com' && location.pathname==='/oauth2/authorize' && !!document.querySelector('#discord-fixture-consent');",json!([])).await?;
    check(
        b.evaluate(
            "return document.referrer==='' && !document.cookie.includes('keida-reborn');",
            json!([]),
        )
        .await?
            == true,
        "actual fixed-domain browser navigation sends neither a referrer nor Reborn browser cookies",
    )?;
    b.click("#discord-fixture-consent").await?;
    b.wait("return location.pathname==='/account/discord/return' && location.search==='' && !!document.querySelector('a[href=\"/workspace#identity\"]');",json!([])).await?;
    check(b.evaluate("return document.referrer==='' && !document.body.textContent.includes(arguments[0]) && !document.body.textContent.includes(arguments[1]) && !document.querySelector('script,link,img,iframe,form');",json!([d::ID,d::DISPLAY])).await?==true,"clean neutral return document contains no private candidate or external resources")?;
    b.click("a[href=\"/workspace#identity\"]").await?;
    b.wait("const s=document.querySelector('[data-discord-identity]');return location.pathname==='/workspace' && location.hash==='#identity' && !!s && s.dataset.save==='idle' && /^(0|[1-9][0-9]*)$/.test(s.dataset.linkRevision);",json!([])).await
}
fn count(provider: &d::Discord, method: &str, path: &str) -> usize {
    provider
        .requests()
        .iter()
        .filter(|(m, p)| m == method && p == path)
        .count()
}

pub(super) async fn run() -> Check<()> {
    step("discord phase01 dedicated setup and real fixed-domain Strict-cookie handoff");
    let f = Fixture::with_discord().await?;
    let provider = f
        .discord
        .as_ref()
        .ok_or("synthetic Discord fixture required")?;
    let mut owner = f.browser(true).await?;
    claim(&f, &owner).await?;
    let (member, password) = f.enroll_member(&owner).await?;
    workspace(&f, &owner).await?;
    let session = owner.cookie("__Host-keida-reborn-session").await?;
    identity(&f, &owner).await?;
    check(owner.evaluate("const n=[...document.querySelectorAll('.main-nav button')];return n.length===11 && n[10].textContent.includes('Identity') && document.querySelector('[data-discord-identity]').dataset.configured==='false' && !document.querySelector('.discord-start') && !document.querySelector('[data-discord-linked]');",json!([])).await?==true,"Identity is the eleventh view and unconfigured linking is honestly unavailable")?;
    check(
        provider.requests().is_empty(),
        "opening Identity never contacts Discord",
    )?;
    owner.click(".identity-enrollment > summary").await?;
    owner.fill("#discord-client-id", d::CLIENT_ID).await?;
    owner
        .fill("#discord-client-secret", d::CLIENT_SECRET)
        .await?;
    owner.click("#discord-logging-ack").await?;
    owner.click(".discord-save-application").await?;
    owner.wait("const s=document.querySelector('[data-discord-identity]');return s.dataset.configured==='true' && s.dataset.appRevision==='1' && s.dataset.save==='idle' && document.querySelector('#discord-client-id').value==='' && document.querySelector('#discord-client-secret').value==='';",json!([])).await?;
    consent(&owner).await?;
    check(
        f.callback_evidence() == (1, false),
        "actual cross-site callback arrives without the Strict authentication cookie",
    )?;
    check(
        owner.cookie("__Host-keida-reborn-session").await? == session,
        "public callback and return preserve the existing local sign-in cookie",
    )?;
    owner.wait("return document.querySelector('[data-discord-identity]')?.dataset.phase==='ready_to_review' && !!document.querySelector('.discord-review') && !document.querySelector('[data-discord-candidate]') && !document.querySelector('[data-discord-linked]');",json!([])).await?;
    check(
        count(provider, "POST", "/api/oauth2/token") == 0,
        "callback GET escrows authorization without token exchange or an accepted link",
    )?;
    owner.click(".discord-review").await?;
    owner.wait("return document.querySelector('[data-discord-identity]')?.dataset.phase==='review_ready' && !!document.querySelector('[data-discord-candidate]') && !document.querySelector('[data-discord-linked]');",json!([])).await?;
    check(owner.evaluate("const c=document.querySelector('[data-discord-candidate]');return c.textContent.includes(arguments[0]) && c.textContent.includes(arguments[1]) && !document.body.textContent.includes('PRIVATE_DISCORD_EMAIL') && !document.body.textContent.includes('PRIVATE_DISCORD_AVATAR') && !document.body.textContent.includes('PRIVATE_DISCORD_LOCALE') && [...document.querySelectorAll('input,textarea')].every(e=>!e.value.includes(arguments[2])) && Object.values(sessionStorage).every(v=>!v.includes(arguments[0])&&!v.includes(arguments[2])) && Object.values(localStorage).every(v=>!v.includes(arguments[0])&&!v.includes(arguments[2]));",json!([d::ID,d::DISPLAY,d::CLIENT_SECRET])).await?==true,"full-u64 candidate survives exact string rendering while private Discord metadata, credentials and browser storage stay clear")?;
    check(
        count(provider, "POST", "/api/oauth2/token") == 1
            && count(provider, "GET", "/api/v10/users/@me") == 1
            && count(provider, "POST", "/api/oauth2/token/revoke") == 1
            && provider.invalid_requests() == 0,
        "review performs the exact fixed TLS token, identify and revoke profile once with valid independent PKCE",
    )?;
    accessibility(&owner).await?;
    owner.mobile().await?;
    owner
        .wait(
            "return innerWidth===390 && document.documentElement.scrollWidth<=innerWidth+1;",
            json!([]),
        )
        .await?;
    accessibility(&owner).await?;
    owner.click(".discord-confirm").await?;
    owner.wait("return !!document.querySelector('[data-discord-linked]') && !document.querySelector('[data-discord-candidate]') && document.querySelector('[data-discord-linked]').textContent.includes(arguments[0]);",json!([d::ID])).await?;
    check(
        count(provider, "POST", "/api/oauth2/token") == 1,
        "separate explicit confirmation commits the server-held identity without repeating OAuth",
    )?;

    step("discord phase02 local account isolation, application removal and local unlink");
    let mut other = f.browser(true).await?;
    sign_in(&f, &other, &member, &password).await?;
    identity(&f, &other).await?;
    check(other.evaluate("return !document.querySelector('.identity-enrollment') && !document.querySelector('[data-discord-linked]') && !document.querySelector('[data-discord-candidate]') && !document.body.textContent.includes(arguments[0]) && !document.body.textContent.includes(arguments[1]);",json!([d::ID,d::DISPLAY])).await?==true,"member identity view contains neither owner setup nor another account's accepted identity")?;
    check(owner.evaluate("window.dispatchEvent(new Event('blur'));return !document.querySelector('[data-discord-linked]') && !document.querySelector('[data-discord-candidate]') && !document.body.textContent.includes(arguments[0]);",json!([d::ID])).await?==true,"privacy loss clears the actual linked/candidate DOM")?;
    owner
        .evaluate(
            "window.dispatchEvent(new Event('focus'));return true;",
            json!([]),
        )
        .await?;
    identity(&f, &owner).await?;
    owner
        .wait(
            "return !!document.querySelector('[data-discord-linked]');",
            json!([]),
        )
        .await?;
    if owner
        .evaluate(
            "return document.querySelector('.identity-enrollment').open;",
            json!([]),
        )
        .await?
        != true
    {
        owner.click(".identity-enrollment > summary").await?;
    }
    let calls = provider.requests().len();
    owner.click(".discord-remove-application").await?;
    owner.wait("const s=document.querySelector('[data-discord-identity]');return s.dataset.configured==='false' && s.dataset.appRevision==='2' && s.dataset.save==='idle' && !!document.querySelector('[data-discord-linked]');",json!([])).await?;
    owner.click(".discord-unlink").await?;
    owner.wait("return !document.querySelector('[data-discord-linked]') && !document.querySelector('[data-discord-candidate]') && document.querySelector('[data-discord-identity]').dataset.save==='idle';",json!([])).await?;
    check(
        provider.requests().len() == calls,
        "application removal retains the accepted link and local unlink remains available without any Discord IO",
    )?;
    check(
        owner.cookie("__Host-keida-reborn-session").await? == session,
        "link, configuration removal and local unlink leave local authentication unchanged",
    )?;
    check(owner.evaluate("return [...document.querySelectorAll('input,textarea')].every(e=>!e.value.includes(arguments[0])) && !document.body.textContent.includes(arguments[0]) && Object.values(sessionStorage).every(v=>!v.includes(arguments[0])) && Object.values(localStorage).every(v=>!v.includes(arguments[0]));",json!([d::CLIENT_SECRET])).await?==true,"dedicated application secret remains absent from the UI and browser storage")?;
    other.close().await?;
    owner.close().await?;
    f.close().await?;
    println!(
        "PASS Rust browser: Discord fixed-domain TLS/PKCE, actual Strict-cookie callback/clean handoff, explicit candidate confirmation, full-u64 identity, account/privacy/390px accessibility and offline local unlink"
    );
    Ok(())
}

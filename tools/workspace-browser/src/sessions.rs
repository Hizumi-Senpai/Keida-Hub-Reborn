//! Personal-session expectations over real native logins, TLS and PostgreSQL.
//! Bearers and selectors stay in this disposable process and are never logged.
use super::{accessibility, claim, sign_in, step};
use crate::{Check, check, driver::Browser, fixture::Fixture};
use serde_json::{Value, json};
use std::{collections::BTreeSet, time::Duration};

#[derive(Clone, PartialEq, Eq)]
struct Row {
    id: String,
    created: u64,
    expires: u64,
    current: bool,
}
struct Snapshot {
    account: Value,
    generation: String,
    rows: Vec<Row>,
}
fn keys(value: &Value, names: &[&str]) -> bool {
    value.as_object().is_some_and(|object| {
        object.len() == names.len() && names.iter().all(|name| object.contains_key(*name))
    })
}
fn decimal(value: &Value) -> Check<u64> {
    let text = value.as_str().ok_or("session timestamp is a string")?;
    let number = text.parse::<u64>().map_err(|_| "session decimal range")?;
    check(number.to_string() == text, "session decimal is canonical")?;
    Ok(number)
}
fn uuid(value: &str) -> bool {
    let bytes = value.as_bytes();
    bytes.len() == 36
        && bytes.iter().enumerate().all(|(i, b)| {
            if matches!(i, 8 | 13 | 18 | 23) {
                *b == b'-'
            } else {
                b.is_ascii_digit() || (b'a'..=b'f').contains(b)
            }
        })
        && bytes[14] == b'4'
        && matches!(bytes[19], b'8' | b'9' | b'a' | b'b')
}
impl Snapshot {
    fn parse(value: Value, signed_out: bool) -> Check<Self> {
        let mut names = vec![
            "product",
            "contract",
            "schema",
            "account",
            "session_generation",
            "checked_at",
            "sessions",
        ];
        if signed_out {
            names.push("result");
        }
        check(
            keys(&value, &names)
                && value["product"] == "keida-hub-reborn"
                && value["contract"] == "reborn-workspace-v1"
                && value["schema"] == 1
                && (!signed_out || value["result"] == "signed_out")
                && keys(&value["account"], &["id", "username", "role"]),
            "closed personal session envelope exposes only admitted fields",
        )?;
        check(
            decimal(&value["account"]["id"])? > 0
                && value["account"]["username"]
                    .as_str()
                    .is_some_and(|name| !name.is_empty())
                && matches!(value["account"]["role"].as_str(), Some("owner" | "member")),
            "session snapshot account shape",
        )?;
        decimal(&value["session_generation"])?;
        let checked = decimal(&value["checked_at"])?;
        let entries = value["sessions"].as_array().ok_or("session list shape")?;
        check(
            !entries.is_empty() && entries.len() <= 32,
            "complete personal active-session bound",
        )?;
        let mut ids = BTreeSet::new();
        let mut rows = Vec::new();
        for entry in entries {
            check(
                keys(entry, &["id", "created_at", "expires_at", "current"]),
                "session row has no bearer, verifier or invented device metadata",
            )?;
            let id = entry["id"].as_str().ok_or("session selector type")?;
            check(
                uuid(id) && ids.insert(id.to_owned()),
                "unique canonical random session selectors",
            )?;
            let created = decimal(&entry["created_at"])?;
            let expires = decimal(&entry["expires_at"])?;
            check(
                expires > checked && expires > created,
                "session snapshot dates describe active rows at checked time",
            )?;
            rows.push(Row {
                id: id.to_owned(),
                created,
                expires,
                current: entry["current"]
                    .as_bool()
                    .ok_or("server current-session boolean")?,
            });
        }
        check(
            rows.iter().filter(|row| row.current).count() == 1
                && rows
                    .windows(2)
                    .all(|pair| (pair[0].created, &pair[0].id) > (pair[1].created, &pair[1].id)),
            "exactly one acting session and stable newest-first UUID tie ordering",
        )?;
        Ok(Self {
            account: value["account"].clone(),
            generation: value["session_generation"]
                .as_str()
                .ok_or("session generation")?
                .to_owned(),
            rows,
        })
    }
    fn current(&self) -> &str {
        &self
            .rows
            .iter()
            .find(|row| row.current)
            .expect("validated current session")
            .id
    }
    fn ids(&self) -> BTreeSet<String> {
        self.rows.iter().map(|row| row.id.clone()).collect()
    }
    fn same_authority(&self, other: &Self) -> Check<()> {
        check(
            self.account == other.account && self.generation == other.generation,
            "targeted sign-out preserves account activation, role and generation",
        )
    }
}
async fn snapshot(f: &Fixture, b: &Browser) -> Check<Snapshot> {
    Snapshot::parse(f.session_list(b).await?, false)
}
async fn loaded(b: &Browser) -> Check<()> {
    b.wait("const s=document.querySelector('[data-sessions-view]');return !!s && !s.closest('[hidden]') && s.getClientRects().length>0 && s.dataset.phase==='ready' && s.dataset.save==='idle' && !!s.querySelector('[data-session-row]') && !s.querySelector('.sessions-check').disabled;",json!([])).await
}
async fn refresh(b: &Browser) -> Check<()> {
    b.click(".sessions-check").await?;
    loaded(b).await
}
async fn matches(b: &Browser, captured: &Snapshot) -> Check<()> {
    let rows: Vec<_> = captured.rows.iter().map(|row| json!({"id":row.id,"created":row.created.to_string(),"expires":row.expires.to_string(),"current":row.current})).collect();
    check(b.evaluate("const s=document.querySelector('[data-sessions-view]'),rows=[...s.querySelectorAll('[data-session-row]')],expected=arguments[0],format=v=>new Date(Number(v)*1000).toLocaleString('en-US',{timeZone:'America/Chicago',timeZoneName:'short'});return s.dataset.sessionCount===String(expected.length) && /^(0|[1-9][0-9]*)$/.test(s.dataset.checkedAt) && rows.length===expected.length && rows.every((r,i)=>{const e=expected[i],c=r.querySelector('[data-session-created]'),x=r.querySelector('[data-session-expires]');return r.dataset.sessionId===e.id && r.dataset.current===String(e.current) && !r.textContent.includes(e.id) && c?.dateTime===new Date(Number(e.created)*1000).toISOString() && x?.dateTime===new Date(Number(e.expires)*1000).toISOString() && c.textContent===format(e.created) && x.textContent===format(e.expires) && (e.current ? !!r.querySelector('.session-current-badge') && r.querySelector('.session-current-badge').textContent==='This session' && !!r.querySelector('.session-signout-current') && !r.querySelector('.session-revoke') : !!r.querySelector('.session-revoke') && !r.querySelector('.session-current-badge,.session-signout-current'));}) && s.querySelectorAll('.session-current-badge').length===1;",json!([rows])).await?==true,"browser renders the complete scoped snapshot, server current badge and Chicago creation/expiry without displaying UUIDs")
}
async fn token(f: &Fixture, cookie: &str, expected: u16) -> Check<Value> {
    let (status, value) = f.session_admission(cookie).await?;
    check(
        status == expected && (expected != 401 || value["error"] == "invalid_session"),
        "actual retained or targeted browser token admission",
    )?;
    Ok(value)
}
async fn no_rows(b: &Browser) -> Check<()> {
    check(
        b.evaluate(
            "return !document.querySelector('[data-session-row]');",
            json!([]),
        )
        .await?
            == true,
        "private session row and selector DOM is retired",
    )
}
async fn held(hold: &crate::fixture::Hold) -> Check<()> {
    tokio::time::timeout(Duration::from_secs(3), hold.entered.notified())
        .await
        .map_err(|_| "actual authorized personal-session response hold")
}
async fn native_account(
    f: &Fixture,
    b: &Browser,
    ids: &BTreeSet<String>,
    username: &str,
) -> Check<()> {
    // The native document's optional authenticated account check may populate
    // its DOM after loading. Inspect the actual server HTML for the SSR claim.
    let html = f.native_account_html(b).await?;
    check(
        !html.contains(username)
            && !html.contains("data-session-row")
            && ids.iter().all(|id| !html.contains(id)),
        "public native Account source contains no server-rendered account/session rows or private selectors",
    )?;
    b.navigate(&format!("{}/account", f.origin)).await?;
    check(b.evaluate("return !!document.querySelector('a[href=\"/workspace#sessions\"]') && !!document.querySelector('form[action=\"/account/sign-out\"]') && !document.querySelector('[data-session-row]') && arguments[0].every(id=>!document.documentElement.outerHTML.includes(id));",json!([ids])).await?==true,"native Account offers the session deep link and native fallback without session rows or selectors")?;
    b.click("a[href='/workspace#sessions']").await?;
    loaded(b).await?;
    check(b.evaluate("return location.pathname==='/workspace' && location.hash==='#sessions' && document.querySelectorAll('.main-nav button').length===11;",json!([])).await?==true,"fresh native link opens sessions without changing eleven primary navigation positions")
}

pub(super) async fn run() -> Check<()> {
    step("sessions phase01 native Account entry, three real sign-ins and complete32 boundary");
    let f = Fixture::new().await?;
    let mut a = f.browser(true).await?;
    claim(&f, &a).await?;
    let (member, password) = f.enroll_member(&a).await?;
    native_account(&f, &a, &BTreeSet::new(), &f.username).await?;
    let mut b = f.browser(true).await?;
    sign_in(&f, &b, &f.username, &f.password).await?;
    let mut c = f.browser(true).await?;
    sign_in(&f, &c, &f.username, &f.password).await?;
    let mut m = f.browser(true).await?;
    sign_in(&f, &m, &member, &password).await?;
    let cookie_a = a.cookie("__Host-keida-reborn-session").await?;
    let cookie_b = b.cookie("__Host-keida-reborn-session").await?;
    let cookie_c = c.cookie("__Host-keida-reborn-session").await?;
    let cookie_m = m.cookie("__Host-keida-reborn-session").await?;
    let original = snapshot(&f, &a).await?;
    let other = snapshot(&f, &b).await?;
    let third = snapshot(&f, &c).await?;
    let member_initial = snapshot(&f, &m).await?;
    original.same_authority(&other)?;
    original.same_authority(&third)?;
    check(
        original.rows.len() == 3
            && original.ids() == other.ids()
            && original.ids() == third.ids()
            && BTreeSet::from([original.current(), other.current(), third.current()]).len() == 3
            && member_initial.rows.len() == 1
            && member_initial.account["role"] == "member"
            && member_initial.account["id"] != original.account["id"]
            && member_initial.ids().is_disjoint(&original.ids()),
        "three independently native-authenticated owner sessions and a different member remain scoped",
    )?;
    refresh(&a).await?;
    matches(&a, &original).await?;
    let mut seeded = f.seed_sessions(29).await?;
    refresh(&a).await?;
    let complete = snapshot(&f, &a).await?;
    check(
        complete.rows.len() == 32 && original.ids().is_subset(&complete.ids()),
        "complete boundary retains all three genuine browser sessions",
    )?;
    matches(&a, &complete).await?;
    check(a.evaluate("return [...Object.values(localStorage),...Object.values(sessionStorage)].every(value=>arguments[0].every(id=>!value.includes(id)) && arguments[1].every(cookie=>!value.includes(cookie)));",json!([complete.ids(),[&cookie_a,&cookie_b,&cookie_c,&cookie_m]])).await?==true,"the complete session list and authentication bearers are never persisted in browser storage")?;
    accessibility(&a).await?;
    a.mobile().await?;
    check(
        a.evaluate(
            "return innerWidth===390 && document.documentElement.scrollWidth<=innerWidth+1;",
            json!([]),
        )
        .await?
            == true,
        "complete session list and actions reflow at390px",
    )?;
    accessibility(&a).await?;
    seeded.extend(f.seed_sessions(1).await?);
    a.click(".sessions-check").await?;
    a.wait("return document.querySelector('[data-sessions-view]')?.dataset.phase==='error' && !document.querySelector('[data-session-row]') && !document.querySelector('.sessions-check').disabled;",json!([])).await?;
    check(
        member_initial.ids() == snapshot(&f, &m).await?.ids(),
        "owner overflow never changes another account's complete list",
    )?;
    f.remove_seeded_sessions(&seeded).await?;
    refresh(&a).await?;
    let restored = snapshot(&f, &a).await?;
    check(
        restored.rows == original.rows,
        "exact fixture-only boundary cleanup preserves all original session UUIDs and metadata",
    )?;
    matches(&a, &restored).await?;

    step(
        "sessions phase02 stale conflict, deliberate other sign-out and unchanged current/third authority",
    );
    let writes = f.session_writes();
    let (status, value) = f.session_revoke(&c, other.current()).await?;
    check(
        status == 200,
        "third real session deliberately revokes only the other session",
    )?;
    let committed = Snapshot::parse(value, true)?;
    original.same_authority(&committed)?;
    a.click(&format!(
        "[data-session-id='{}'] .session-revoke",
        other.current()
    ))
    .await?;
    a.wait("return document.querySelector('[data-sessions-view]')?.dataset.save==='conflict' && !document.querySelector('[data-session-row]');",json!([])).await?;
    check(
        f.session_writes() == writes + 2,
        "one explicit stale revoke yields conflict without automatic POST replay",
    )?;
    token(&f, &cookie_b, 401).await?;
    let admitted_a = token(&f, &cookie_a, 200).await?;
    let admitted_c = token(&f, &cookie_c, 200).await?;
    check(
        admitted_a["account"] == original.account
            && admitted_c["account"] == original.account
            && admitted_a["session_generation"] == original.generation
            && admitted_c["session_generation"] == original.generation,
        "targeted session revocation keeps acting/third roles and generations unchanged",
    )?;
    refresh(&a).await?;
    let after_conflict = snapshot(&f, &a).await?;
    check(
        after_conflict.ids()
            == BTreeSet::from([original.current().to_owned(), third.current().to_owned()]),
        "conflict check returns only the current and surviving third sessions",
    )?;
    matches(&a, &after_conflict).await?;
    let mut conflicts = Vec::new();
    for id in [original.current(), member_initial.current()] {
        let (status, value) = f.session_revoke(&a, id).await?;
        check(
            status == 409 && value["error"] == "conflict",
            "current and foreign selectors share the same conflict boundary",
        )?;
        conflicts.push(value);
    }
    check(
        conflicts[0] == conflicts[1],
        "current/foreign conflict bodies disclose no selector ownership",
    )?;
    sign_in(&f, &b, &f.username, &f.password).await?;
    let replacement = snapshot(&f, &b).await?;
    let replacement_cookie = b.cookie("__Host-keida-reborn-session").await?;
    refresh(&a).await?;
    check(
        replacement.rows.len() == 3 && replacement.current() != other.current(),
        "a fresh native login creates an independent replacement session",
    )?;
    check(a.evaluate("const b=document.querySelector(arguments[0]);b.focus();return document.activeElement===b && !b.disabled;",json!([format!("[data-session-id='{}'] .session-revoke",replacement.current())])).await?==true,"other-session action receives actual keyboard focus")?;
    a.keys("\u{e007}").await?;
    loaded(&a).await?;
    let after_target = snapshot(&f, &a).await?;
    original.same_authority(&after_target)?;
    matches(&a, &after_target).await?;
    check(
        after_target.rows == after_conflict.rows
            && a.cookie("__Host-keida-reborn-session").await? == cookie_a
            && c.cookie("__Host-keida-reborn-session").await? == cookie_c,
        "actual row action removes only its target without changing surviving metadata or browser cookies",
    )?;
    token(&f, &replacement_cookie, 401).await?;
    token(&f, &cookie_a, 200).await?;
    token(&f, &cookie_c, 200).await?;
    token(&f, &cookie_m, 200).await?;

    step(
        "sessions phase03 committed response loss, concurrent new login and deliberate GET without replay",
    );
    let writes = f.session_writes();
    let lost = f.hold("/api/workspace/sessions/revoke");
    a.click(&format!(
        "[data-session-id='{}'] .session-revoke",
        third.current()
    ))
    .await?;
    held(&lost).await?;
    // The POST is already committed. A real unrelated login is deliberately
    // newer than its withheld snapshot and must survive reconciliation.
    sign_in(&f, &b, &f.username, &f.password).await?;
    let newer = snapshot(&f, &b).await?;
    let newer_cookie = b.cookie("__Host-keida-reborn-session").await?;
    a.wait("return document.querySelector('[data-sessions-view]')?.dataset.save==='uncertain' && !document.querySelector('[data-session-row]') && !document.querySelector('.sessions-check').disabled;",json!([])).await?;
    check(
        f.session_writes() == writes + 1,
        "uncertain committed targeted sign-out sends only one POST",
    )?;
    lost.release.notify_one();
    refresh(&a).await?;
    let reconciled = snapshot(&f, &a).await?;
    check(
        reconciled.ids()
            == BTreeSet::from([original.current().to_owned(), newer.current().to_owned()])
            && f.session_writes() == writes + 1,
        "explicit fresh GET retains a concurrent native login and never replays the uncertain POST",
    )?;
    original.same_authority(&reconciled)?;
    matches(&a, &reconciled).await?;
    token(&f, &cookie_c, 401).await?;
    token(&f, &cookie_a, 200).await?;
    token(&f, &newer_cookie, 200).await?;
    f.age_session_login_windows().await?;
    let unchanged = snapshot(&f, &a).await?;
    reconciled.same_authority(&unchanged)?;
    check(
        unchanged.rows == reconciled.rows && snapshot(&f, &m).await?.rows == member_initial.rows,
        "fixture-only throttle window aging leaves both accounts and their sessions unchanged",
    )?;

    step(
        "sessions phase04 private DOM lifecycle, late replies and fresh same-account session binding",
    );
    step("sessions phase04a hold before leaving the active view");
    let read_count = f.session_reads();
    let leaving = f.hold("/api/workspace/sessions");
    a.click(".sessions-check").await?;
    held(&leaving).await?;
    a.click(".main-nav button:first-child").await?;
    no_rows(&a).await?;
    leaving.release.notify_one();
    tokio::time::sleep(Duration::from_millis(120)).await;
    no_rows(&a).await?;
    check(a.evaluate("const b=document.querySelector('[data-open-sessions]');b.focus();return document.activeElement===b;",json!([])).await?==true,"account session-review action receives actual keyboard focus")?;
    step("sessions phase04b await keyboard reopening a fresh scoped list");
    a.keys("\u{e007}").await?;
    loaded(&a).await?;
    check(
        f.session_reads() >= read_count + 2,
        "returning to session review performs a fresh scoped read",
    )?;
    let blurred = f.hold("/api/workspace/sessions");
    a.click(".sessions-check").await?;
    held(&blurred).await?;
    check(a.evaluate("window.dispatchEvent(new Event('blur'));return !document.querySelector('[data-session-row]');",json!([])).await?==true,"blur retires private rows and selectors synchronously")?;
    blurred.release.notify_one();
    tokio::time::sleep(Duration::from_millis(120)).await;
    no_rows(&a).await?;
    a.evaluate(
        "window.dispatchEvent(new Event('focus'));return true;",
        json!([]),
    )
    .await?;
    step("sessions phase04c await a fresh list after focus returns");
    loaded(&a).await?;
    check(a.evaluate("window.dispatchEvent(new PageTransitionEvent('pagehide'));return !document.querySelector('[data-session-row]');",json!([])).await?==true,"pagehide retires the actual private session DOM synchronously")?;
    a.evaluate(
        "window.dispatchEvent(new PageTransitionEvent('pageshow'));return true;",
        json!([]),
    )
    .await?;
    step("sessions phase04d await a fresh list after pageshow");
    loaded(&a).await?;
    step("sessions phase04e hold the prior session list before native rotation");
    let same_account = f.hold("/api/workspace/sessions");
    a.click(".sessions-check").await?;
    held(&same_account).await?;
    let first = a.first.clone();
    let alternate = a.new_tab().await?;
    a.switch(&alternate).await?;
    sign_in(&f, &a, &f.username, &f.password).await?;
    let fresh_cookie = a.cookie("__Host-keida-reborn-session").await?;
    check(
        fresh_cookie != cookie_a,
        "same-account native login genuinely changes the browser session binding",
    )?;
    same_account.release.notify_one();
    a.switch(&first).await?;
    no_rows(&a).await?;
    // View changes do not rewrite this document's #sessions fragment. A
    // same-URL WebDriver navigation can remain in its deliberately blocked
    // controller; use the actual native Account link for a document boundary.
    step("sessions phase04f await the native Account bridge after session rotation");
    native_account(&f, &a, &reconciled.ids(), &f.username).await?;
    let fresh = snapshot(&f, &a).await?;
    original.same_authority(&fresh)?;
    check(
        fresh.current() != original.current()
            && !fresh.ids().contains(original.current())
            && fresh.ids().contains(newer.current()),
        "fresh same-account document uses its new current badge after native bearer rotation and keeps the independent session",
    )?;
    matches(&a, &fresh).await?;

    step(
        "sessions phase05 account-switch late reply, public Account and native current-row sign-out",
    );
    let switched = f.hold("/api/workspace/sessions");
    a.click(".sessions-check").await?;
    held(&switched).await?;
    a.switch(&alternate).await?;
    sign_in(&f, &a, &member, &password).await?;
    let member_cookie = a.cookie("__Host-keida-reborn-session").await?;
    switched.release.notify_one();
    a.switch(&first).await?;
    no_rows(&a).await?;
    step("sessions phase05a await the native Account bridge after account switch");
    native_account(&f, &a, &fresh.ids(), &member).await?;
    let member_fresh = snapshot(&f, &a).await?;
    check(
        member_fresh.account == member_initial.account
            && member_fresh.generation == member_initial.generation
            && member_fresh.rows.len() == 2
            && member_fresh.ids().is_disjoint(&fresh.ids()),
        "late owner response cannot populate another account's session review",
    )?;
    matches(&a, &member_fresh).await?;
    check(a.evaluate("const ids=arguments[0];return ids.every(id=>!document.documentElement.outerHTML.includes(id)) && [...Object.values(localStorage),...Object.values(sessionStorage)].every(v=>!ids.some(id=>v.includes(id)));",json!([fresh.ids()])).await?==true,"switched account DOM and browser storage contain no former session selectors")?;
    let mut known_ids = fresh.ids();
    known_ids.extend(member_fresh.ids());
    native_account(&f, &a, &known_ids, &member).await?;
    matches(&a, &member_fresh).await?;
    accessibility(&a).await?;
    check(a.evaluate("const b=document.querySelector('.session-signout-current'),form=document.querySelector('#workspace-sign-out');b.focus();return b.type==='submit' && b.form===form && form.method==='post' && new URL(form.action).pathname==='/account/sign-out' && form.querySelector('input[name=product]').value==='keida-hub-reborn' && form.querySelector('input[name=contract]').value==='reborn-account-v1' && !!form.querySelector('input[name=csrf_token]').value && document.activeElement===b;",json!([])).await?==true,"current-row keyboard action uses the existing stable native sign-out form and its original CSRF contract")?;
    let writes = f.session_writes();
    a.keys("\u{e007}").await?;
    a.wait("return location.pathname==='/account/sign-in' && document.querySelector('input[name=password]').value==='';",json!([])).await?;
    check(
        f.session_writes() == writes,
        "current row never invokes the other-session revoke endpoint",
    )?;
    token(&f, &member_cookie, 401).await?;
    token(&f, &cookie_m, 200).await?;
    token(&f, &cookie_a, 401).await?;
    token(&f, &fresh_cookie, 401).await?;
    token(&f, &newer_cookie, 200).await?;
    a.back().await?;
    check(a.evaluate("return !document.querySelector('[data-session-row]') && arguments[0].every(id=>!document.documentElement.outerHTML.includes(id));",json!([member_fresh.ids()])).await?==true,"history after native current sign-out cannot restore private session rows or selectors")?;
    let retained = snapshot(&f, &m).await?;
    check(
        retained.rows == member_initial.rows,
        "native current-row sign-out leaves the member's other session unchanged",
    )?;
    m.close().await?;
    c.close().await?;
    b.close().await?;
    a.close().await?;
    f.close().await?;
    println!(
        "PASS Rust browser: personal complete32/overflow session review, three native owner sessions/member isolation, targeted token401/current-third survival, conflict/uncertain without POST replay, lifecycle/account/session late replies, native current sign-out and390px keyboard accessibility"
    );
    Ok(())
}

"use strict";
// A bounded enhancement for account documents. Native forms remain authoritative.
const root = document.querySelector("[data-account-page]");
if (root) {
    const isAccount = root.dataset.accountPage === "account";
    const panel = root.querySelector("[data-private-account]");
    const name = root.querySelector("[data-account-name]");
    const role = root.querySelector("[data-account-role]");
    const status = root.querySelector("[data-account-status]");
    const binding = root.querySelector('input[name="csrf_token"]')?.value;
    const compatible = root.dataset.product === "keida-hub-reborn"
        && root.dataset.contract === "reborn-account-v1" && root.dataset.apiContract === "reborn-auth-v1";
    let epoch = 0;
    let active;
    let poll;
    let channel;
    function stopPoll() {
        if (poll !== undefined)
            clearInterval(poll);
        poll = undefined;
    }
    function clear(message) {
        ++epoch;
        active?.abort();
        active = undefined;
        stopPoll();
        if (panel)
            panel.hidden = true;
        if (name)
            name.textContent = "";
        if (role)
            role.textContent = "";
        if (status)
            status.textContent = message;
    }
    function clearCredentials() {
        for (const input of document.querySelectorAll('input[name="password"], input[name="setup_secret"]')) {
            input.value = "";
        }
    }
    function announce() {
        try {
            channel?.postMessage({ kind: "auth-changed" });
        }
        catch { /* Revalidation also runs on focus and visibility. */ }
    }
    function record(value) {
        return typeof value === "object" && value !== null && !Array.isArray(value);
    }
    async function probe() {
        if (!isAccount || document.visibilityState !== "visible" || active)
            return;
        if (!compatible) {
            clear("This page is incompatible. Use Check session again for a fresh document.");
            return;
        }
        clear("Checking your session…");
        const requestEpoch = epoch;
        const controller = new AbortController();
        const started = performance.now();
        active = controller;
        const deadline = setTimeout(() => controller.abort(), 4000);
        try {
            const response = await fetch("/api/auth/session", {
                credentials: "same-origin", cache: "no-store", redirect: "error", signal: controller.signal,
                headers: { "X-Reborn-Product": "keida-hub-reborn", "X-Reborn-Contract": "reborn-auth-v1" },
            });
            let result;
            if (response.ok)
                result = await response.json();
            if (controller.signal.aborted || requestEpoch !== epoch || document.visibilityState !== "visible")
                return;
            if (performance.now() - started >= 4000) {
                clear("Your session check timed out. Use Check session again to retry deliberately.");
                return;
            }
            if (!response.ok) {
                clear(response.status === 401 ? "Your session has ended. Use a fresh sign-in form." : response.status === 426 ? "This page needs a fresh document. Use Check session again." : "Your session could not be checked. Use Check session again when access is available.");
                return;
            }
            if (!record(result) || !record(result.account) || result.csrf_token !== binding
                || typeof binding !== "string" || !/^[0-9a-f]{64}$/.test(binding)
                || typeof result.session_generation !== "string" || !/^(0|[1-9][0-9]*)$/.test(result.session_generation)
                || typeof result.account.id !== "string" || !/^[1-9][0-9]*$/.test(result.account.id)
                || typeof result.account.username !== "string" || !/^[a-z0-9_-]{3,32}$/.test(result.account.username)
                || typeof result.account.role !== "string" || !["owner", "member"].includes(result.account.role)) {
                clear("Your sign-in changed or this page is incompatible. Use Check session again for a fresh document.");
                return;
            }
            if (name)
                name.textContent = result.account.username;
            if (role)
                role.textContent = result.account.role === "owner" ? "Owner" : "Member";
            if (panel)
                panel.hidden = false;
            if (status)
                status.textContent = "Session checked.";
            active = undefined;
            // Healthy visible pages check remote revocation, too. Failure is terminal;
            // there is no background retry loop or credential replay.
            poll = setInterval(() => { void probe(); }, 15000);
        }
        catch {
            if (requestEpoch === epoch)
                clear("Your session could not be checked. Use Check session again to retry deliberately.");
        }
        finally {
            clearTimeout(deadline);
            if (active === controller)
                active = undefined;
        }
    }
    try {
        channel = new BroadcastChannel("keida-hub-reborn.account.v1");
        channel.addEventListener("message", (event) => {
            if (record(event.data) && event.data.kind === "auth-changed") {
                clear("Your sign-in may have changed. Checking access…");
                void probe();
            }
        });
    }
    catch { /* Native forms and visibility revalidation remain available. */ }
    for (const form of root.querySelectorAll("form")) {
        form.addEventListener("submit", () => {
            // Do not clear input values before the browser captures native form data.
            clear("Submitting…");
            announce();
        });
    }
    window.addEventListener("pagehide", () => { clear(""); clearCredentials(); });
    window.addEventListener("blur", () => { clear("Check your session to show account details."); });
    window.addEventListener("focus", () => { void probe(); });
    document.addEventListener("visibilitychange", () => {
        clear("Check your session to show account details.");
        if (document.visibilityState === "visible")
            void probe();
    });
    window.addEventListener("pageshow", () => { clearCredentials(); void probe(); });
    clearCredentials();
    announce();
    void probe();
    document.getElementById("form-error")?.focus();
}

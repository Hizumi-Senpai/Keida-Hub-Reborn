//! Bounded W3C WebDriver commands. Rust owns orchestration and expectations.
use crate::{Check, check};
use reqwest::{Client, Method};
use serde_json::{Value, json};
use std::os::unix::process::CommandExt;
use std::{
    net::SocketAddr,
    path::Path,
    process::{Child, Command, Stdio},
    time::Duration,
};

// Keep protocol failures useful without ever printing the browser's original
// message, stack, DOM, URL, submitted values or request arguments.
fn script_failure(value: &Value) -> &'static str {
    let message = value["message"].as_str().unwrap_or("");
    if message.contains("Cannot read properties of null")
        || (message.contains("Cannot read property") && message.contains("null"))
    {
        "WebDriver browser primitive failed: null property"
    } else if message.contains("Cannot read properties of undefined")
        || (message.contains("Cannot read property") && message.contains("undefined"))
    {
        "WebDriver browser primitive failed: undefined property"
    } else if message.contains("querySelector")
        && (message.contains("not a valid selector") || message.contains("Failed to execute"))
    {
        "WebDriver browser primitive failed: selector syntax"
    } else if [
        "SyntaxError",
        "ReferenceError",
        "TypeError",
        "is not defined",
    ]
    .iter()
    .any(|kind| message.contains(kind))
    {
        "WebDriver browser primitive failed: script exception"
    } else {
        "WebDriver browser primitive failed: other script error"
    }
}

pub struct Browser {
    child: Child,
    client: Client,
    origin: String,
    session: String,
    pub first: String,
}
impl Browser {
    pub async fn launch(
        home: &Path,
        profile: &Path,
        driver: &Path,
        chromium: &Path,
        discord: Option<(SocketAddr, SocketAddr)>,
    ) -> Check<Self> {
        let listener =
            std::net::TcpListener::bind("127.0.0.1:0").map_err(|_| "browser port allocation")?;
        let port = listener
            .local_addr()
            .map_err(|_| "browser port address")?
            .port();
        drop(listener);
        let child = Command::new(driver)
            .args([format!("--port={port}"), "--log-level=OFF".into()])
            .process_group(0)
            .env("HOME", home)
            .env("XDG_DATA_HOME", home.join(".local/share"))
            .env("XDG_CONFIG_HOME", home.join(".config"))
            .stdout(Stdio::null())
            .stderr(Stdio::null())
            .spawn()
            .map_err(|_| "start owned ChromeDriver")?;
        let client = Client::builder()
            .timeout(Duration::from_secs(15))
            .no_proxy()
            .build()
            .map_err(|_| "browser protocol client")?;
        let mut browser = Self {
            child,
            client,
            origin: format!("http://127.0.0.1:{port}"),
            session: String::new(),
            first: String::new(),
        };
        let deadline = tokio::time::Instant::now() + Duration::from_secs(15);
        loop {
            if browser
                .client
                .get(format!("{}/status", browser.origin))
                .send()
                .await
                .is_ok_and(|r| r.status().is_success())
            {
                break;
            }
            check(
                tokio::time::Instant::now() < deadline,
                "ChromeDriver listener deadline",
            )?;
            check(
                browser
                    .child
                    .try_wait()
                    .map_err(|_| "inspect ChromeDriver")?
                    .is_none(),
                "ChromeDriver exited",
            )?;
            tokio::time::sleep(Duration::from_millis(40)).await;
        }
        let mut args = vec![
            "--headless=new".to_owned(),
            "--no-sandbox".to_owned(),
            "--disable-background-networking".to_owned(),
            "--disable-dev-shm-usage".to_owned(),
            format!("--user-data-dir={}", profile.display()),
        ];
        if let Some((address, proxy)) = discord {
            args.push(format!("--proxy-server=http://{proxy}"));
            args.push("--disable-quic".to_owned());
            args.push("--proxy-bypass-list=localhost;127.0.0.1;[::1]".to_owned());
            args.push(format!("--host-resolver-rules=MAP discord.com:443 {address},MAP * ~NOTFOUND,EXCLUDE localhost,EXCLUDE 127.0.0.1"));
        } else {
            args.push("--no-proxy-server".to_owned());
        }
        let result=browser.raw(Method::POST,"/session",Some(json!({"capabilities":{"alwaysMatch":{
            "browserName":"chrome","acceptInsecureCerts":false,
            "timeouts":{"implicit":0,"pageLoad":12000,"script":10000},
            "goog:chromeOptions":{"binary":chromium,"args":args,"prefs":{"credentials_enable_service":false,"profile.password_manager_enabled":false}}
        }}}))).await?;
        let value = &result["value"];
        check(
            value["capabilities"]["browserVersion"] == "156.0.8078.4",
            "pinned Chromium version",
        )?;
        check(
            value["capabilities"]["acceptInsecureCerts"] == false,
            "TLS validation must stay enabled",
        )?;
        check(
            value["capabilities"]["chrome"]["chromedriverVersion"]
                .as_str()
                .is_some_and(|v| v.starts_with("156.0.8078.4 ")),
            "pinned ChromeDriver version",
        )?;
        browser.session = value["sessionId"]
            .as_str()
            .ok_or("WebDriver session id")?
            .to_owned();
        browser.first = browser
            .call(Method::GET, "/window", None)
            .await?
            .as_str()
            .ok_or("first browser window")?
            .to_owned();
        browser
            .call(
                Method::POST,
                "/window/rect",
                Some(json!({"width":1280,"height":900})),
            )
            .await?;
        Ok(browser)
    }
    async fn raw(&self, method: Method, path: &str, body: Option<Value>) -> Check<Value> {
        let request = self
            .client
            .request(method, format!("{}{path}", self.origin));
        let response = if let Some(body) = body {
            request.json(&body)
        } else {
            request
        }
        .send()
        .await
        .map_err(|_| "browser protocol transport")?;
        let bytes = response
            .bytes()
            .await
            .map_err(|_| "browser protocol body")?;
        check(
            bytes.len() <= 1024 * 1024,
            "browser protocol response bound",
        )?;
        serde_json::from_slice(&bytes).map_err(|_| "browser protocol JSON")
    }
    async fn call(&self, method: Method, path: &str, body: Option<Value>) -> Check<Value> {
        let result = self
            .raw(method, &format!("/session/{}{path}", self.session), body)
            .await?;
        if let Some(code) = result["value"]["error"].as_str() {
            return Err(match code {
                "no such element" => "WebDriver element absent",
                "element not interactable" => "WebDriver element not interactable",
                "element click intercepted" => "WebDriver click intercepted",
                "javascript error" => script_failure(&result["value"]),
                "timeout" => "WebDriver command timeout",
                _ => "WebDriver rejected command; private diagnostics suppressed",
            });
        }
        Ok(result["value"].clone())
    }
    pub async fn navigate(&self, url: &str) -> Check<()> {
        self.call(Method::POST, "/url", Some(json!({"url":url})))
            .await
            .map(|_| ())
    }
    pub async fn rejects_certificate(&self, url: &str) -> Check<()> {
        let result = self
            .raw(
                Method::POST,
                &format!("/session/{}/url", self.session),
                Some(json!({"url":url})),
            )
            .await?;
        let value = &result["value"];
        let protocol = value["error"].as_str() == Some("insecure certificate");
        let authority = value["message"]
            .as_str()
            .is_some_and(|m| m.contains("ERR_CERT_AUTHORITY_INVALID"));
        let interstitial = if protocol || authority {
            false
        } else {
            self.evaluate(
                "return document.body.textContent.includes('ERR_CERT_AUTHORITY_INVALID')",
                json!([]),
            )
            .await
            .unwrap_or(Value::Bool(false))
                == true
        };
        let class = match value["error"].as_str() {
            Some("insecure certificate") => "certificate",
            Some("unknown error") => "unknown",
            None => "none",
            _ => "other",
        };
        println!(
            "RUST_BROWSER_TLS_NEGATIVE class={class} protocol={protocol} authority={authority} interstitial={interstitial}"
        );
        check(
            protocol || authority || interstitial,
            "untrusted Chromium must reject fixture TLS",
        )
    }
    pub async fn evaluate(&self, script: &str, args: Value) -> Check<Value> {
        self.call(
            Method::POST,
            "/execute/sync",
            Some(json!({"script":script,"args":args})),
        )
        .await
    }
    async fn element(&self, selector: &str) -> Check<String> {
        let value = self
            .call(
                Method::POST,
                "/element",
                Some(json!({"using":"css selector","value":selector})),
            )
            .await?;
        value["element-6066-11e4-a52e-4f735466cecf"]
            .as_str()
            .map(str::to_owned)
            .ok_or("browser element id")
    }
    pub async fn fill(&self, selector: &str, text: &str) -> Check<()> {
        let id = self.element(selector).await?;
        self.call(
            Method::POST,
            &format!("/element/{id}/value"),
            // WebDriver clear fires change but need not fire input. Use the
            // actual Linux keyboard path so clearing also updates bound state,
            // including when the replacement text below is empty.
            Some(json!({"text":"\u{e009}a\u{e000}\u{e003}"})),
        )
        .await?;
        self.call(
            Method::POST,
            &format!("/element/{id}/value"),
            Some(json!({"text":text})),
        )
        .await?;
        Ok(())
    }
    pub async fn click(&self, selector: &str) -> Check<()> {
        let id = self.element(selector).await?;
        self.call(
            Method::POST,
            &format!("/element/{id}/click"),
            Some(json!({})),
        )
        .await?;
        Ok(())
    }
    pub async fn keys(&self, text: &str) -> Check<()> {
        self.call(Method::POST,"/actions",Some(json!({"actions":[{"type":"key","id":"keyboard","actions":text.chars().flat_map(|c|[json!({"type":"keyDown","value":c.to_string()}),json!({"type":"keyUp","value":c.to_string()})]).collect::<Vec<_>>()}]}))).await?;
        Ok(())
    }
    pub async fn wait(&self, script: &str, args: Value) -> Check<()> {
        let deadline = tokio::time::Instant::now() + Duration::from_secs(9);
        loop {
            if self.evaluate(script, args.clone()).await? == true {
                return Ok(());
            }
            check(
                tokio::time::Instant::now() < deadline,
                "browser expectation deadline; private DOM suppressed",
            )?;
            tokio::time::sleep(Duration::from_millis(50)).await;
        }
    }
    pub async fn new_tab(&self) -> Check<String> {
        self.call(Method::POST, "/window/new", Some(json!({"type":"tab"})))
            .await?["handle"]
            .as_str()
            .map(str::to_owned)
            .ok_or("new browser tab")
    }
    pub async fn switch(&self, handle: &str) -> Check<()> {
        self.call(Method::POST, "/window", Some(json!({"handle":handle})))
            .await?;
        Ok(())
    }
    pub async fn mobile(&self) -> Check<()> {
        self.call(
            Method::POST,
            "/window/rect",
            Some(json!({"width":390,"height":844})),
        )
        .await?;
        self.cdp(
            "Emulation.setDeviceMetricsOverride",
            json!({"width":390,"height":844,"deviceScaleFactor":1,"mobile":true}),
        )
        .await
    }
    pub async fn cookie(&self, name: &str) -> Check<String> {
        self.call(Method::GET, &format!("/cookie/{name}"), None)
            .await?["value"]
            .as_str()
            .map(str::to_owned)
            .ok_or("native session cookie")
    }
    pub async fn cdp(&self, cmd: &str, params: Value) -> Check<()> {
        self.call(
            Method::POST,
            "/goog/cdp/execute",
            Some(json!({"cmd":cmd,"params":params})),
        )
        .await?;
        Ok(())
    }
    // Called only after the fixture workflow proves the displayed Home has
    // fictional observations and no credential fields or private provider data.
    // Never expose a raw protocol reply, account page or browser session state.
    pub async fn fixture_home_screenshot(&self) -> Check<String> {
        let reply = self.call(Method::GET, "/screenshot", None).await?;
        let data = reply.as_str().ok_or("fixture Home PNG response")?;
        let padding = if data.ends_with("==") { 2 } else if data.ends_with('=') { 1 } else { 0 };
        check(
            data.starts_with("iVBORw0KGgo")
                && data.len().is_multiple_of(4)
                && data.len() / 4 * 3 - padding <= 250 * 1024
                && data.bytes().all(|b| b.is_ascii_alphanumeric() || b"+/=".contains(&b)),
            "bounded fixture Home PNG encoding",
        )?;
        Ok(data.to_owned())
    }
    pub async fn back(&self) -> Check<()> {
        self.call(Method::POST, "/back", Some(json!({}))).await?;
        Ok(())
    }
    pub async fn close(&mut self) -> Check<()> {
        if self.session.is_empty() {
            return Ok(());
        }
        let result = self
            .raw(Method::DELETE, &format!("/session/{}", self.session), None)
            .await;
        self.session.clear();
        result.map(|_| ())
    }
}
impl Drop for Browser {
    fn drop(&mut self) {
        let _ = Command::new("kill")
            .args(["-TERM", "--", &format!("-{}", self.child.id())])
            .stdout(Stdio::null())
            .stderr(Stdio::null())
            .status();
        let _ = self.child.kill();
        let _ = self.child.wait();
    }
}

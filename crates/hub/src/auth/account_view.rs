use askama::Template;

#[derive(Clone, Copy, Eq, PartialEq)]
pub enum PageKind {
    SignIn,
    Claim,
    Account,
    Unavailable,
}

/// Server-rendered account controls deliberately carry no private account data.
/// The optional lifecycle module obtains that data only after a fresh probe.
#[derive(Template)]
#[template(path = "account.html")]
pub struct AccountPage<'a> {
    pub kind: PageKind,
    pub csrf_token: &'a str,
    pub message: Option<&'a str>,
    pub css_url: &'a str,
    pub script_url: Option<&'a str>,
    pub identity: crate::identity::Identity,
}

impl AccountPage<'_> {
    pub fn is_sign_in(&self) -> bool {
        self.kind == PageKind::SignIn
    }

    pub fn is_claim(&self) -> bool {
        self.kind == PageKind::Claim
    }

    pub fn is_account(&self) -> bool {
        self.kind == PageKind::Account
    }

    pub fn has_credentials(&self) -> bool {
        matches!(self.kind, PageKind::SignIn | PageKind::Claim)
    }

    pub fn page_name(&self) -> &'static str {
        match self.kind {
            PageKind::SignIn => "sign-in",
            PageKind::Claim => "claim",
            PageKind::Account => "account",
            PageKind::Unavailable => "unavailable",
        }
    }

    pub fn title(&self) -> &'static str {
        match self.kind {
            PageKind::SignIn => "Sign in",
            PageKind::Claim => "Claim your account",
            PageKind::Account => "Your account",
            PageKind::Unavailable => "Account unavailable",
        }
    }

    pub fn form_action(&self) -> &'static str {
        match self.kind {
            PageKind::Claim => "/account/claim",
            _ => "/account/sign-in",
        }
    }

    pub fn short_commit(&self) -> &str {
        self.identity
            .commit
            .get(..12)
            .unwrap_or(self.identity.commit)
    }

    pub fn has_source(&self) -> bool {
        self.identity.commit.len() == 40
            && self
                .identity
                .commit
                .bytes()
                .all(|byte| byte.is_ascii_hexdigit())
    }

    pub fn source_url(&self) -> String {
        format!(
            "https://github.com/Hizumi-Senpai/Keida-Hub-Reborn/commit/{}",
            self.identity.commit
        )
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn recovery_message_is_rendered_as_text_instead_of_executable_markup() {
        let hostile_message = "<script>alert(\"'&\")</script>";
        let page = AccountPage {
            kind: PageKind::SignIn,
            csrf_token: "fictional-csrf-fixture",
            message: Some(hostile_message),
            css_url: "/assets/account-fixture.css",
            script_url: None,
            identity: crate::identity::compiled(),
        };
        let html = page.render().expect("render real Askama recovery page");
        assert!(!html.contains(hostile_message));
        assert!(html.contains("&#60;script&#62;alert(&#34;&#39;&#38;&#34;)&#60;/script&#62;"));
    }
}

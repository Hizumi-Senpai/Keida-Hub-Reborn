//! Bounded, exact browser assets. Retirement never substitutes newer bytes.
use sha2::{Digest, Sha256};
use std::sync::OnceLock;

const SCRIPT: &[u8] = include_bytes!("../../static/workspace/workspace.js");
const STYLE: &[u8] = include_bytes!("../../static/workspace/workspace.css");

// Browser generations, not source-only release ordinals. The current generation
// plus these two explicitly reviewed predecessors is the complete shipping set.
const COMPATIBILITY: [(&[u8], &[u8]); 2] = [
    (
        include_bytes!("../../static/workspace-compat/0.1.23.js"),
        include_bytes!("../../static/workspace-compat/0.1.23.css"),
    ),
    (
        include_bytes!("../../static/workspace-compat/0.1.18.js"),
        include_bytes!("../../static/workspace-compat/0.1.18.css"),
    ),
];

// Exact retired 0.1.6–0.1.17 bootstrap URLs remain recognizable without shipping
// their bundles. This is asset retirement, not selective v1 API admission.
const RETIRED: [&str; 22] = [
    "/assets/workspace/c7c1eb39825396b76fc6c74bf982b072f8872a9c5303ef92ae9eb5b5ee51618c.js",
    "/assets/workspace/bfd9c23272f6750691cef66ddf2962ea00bc36c98c0e09610c6f0e7a20085b98.css",
    "/assets/workspace/2ed55c5caecd26c1cf60ea605da31f0ec60c3546228ce3ecd0e8d9a672785727.js",
    "/assets/workspace/237c02df71ef34fcdec8a6c7b273f29930cade9b713c4c2d788346381f606552.css",
    "/assets/workspace/4b0e06a1f63ef1842f930697029a8bfbb51c911e0fe3648c31c1270fb092dbc7.js",
    "/assets/workspace/1f365c0b397cb134d519eaefdfccb9f29c128096b8dd3d9d9bfae846be0817cf.css",
    "/assets/workspace/9135b76831f6f91f973126a2b27810b8189d69da2ebb280076c8a7eec8f188db.js",
    "/assets/workspace/6ace99eb59fbacc70e6bbbb44d1371f95bf9db3790aa8d41976d3e0de03e9ff2.css",
    "/assets/workspace/11d0d02e91b90e26d8bd233e3dde1827eb3bcb97d05f8bd3dc30753143f7a215.js",
    "/assets/workspace/64b51490dcc35215b033685b6bda8bd6fcc803836ad9e2ffdda548f8af545c2f.css",
    "/assets/workspace/5df5262802ee41777704176597cb6e7b98dc8f0620468be465873e0fae0a2121.js",
    "/assets/workspace/3398f01bd45f111e59ed4a4ebb88a4fb159f7901e229f6b32bbeb2feeaae9dab.css",
    "/assets/workspace/de86d41a612da9f214086df4e0c695ca9d54924d0bd126b135148176cc9b4a49.js",
    "/assets/workspace/f87cbcf4bfd6ce4b63da1f47b983a290da3ae01f983e558d95afcdc4d3316d74.css",
    "/assets/workspace/3f4ce9e08155d5d14f52c754be92d4c68a446d15425ba7059f8eea78e80f659f.js",
    "/assets/workspace/8b964cce236e54ff4c5bc497009371bd1a49078ffd307736edca4546c33f8d4a.css",
    "/assets/workspace/979f951de0e0419fa0b5fe88e358f610bdcefc50f07cfd544f9b1b3596727742.js",
    "/assets/workspace/8ad5cd0729adb11f67e3b081d237b024dceb882a6b19c1d7c96f66451b06008e.css",
    "/assets/workspace/9c9c64e8d524b47ddb43ebf25c0f6dc8aceb7266b3ed4cc000da5cd9c433cf16.js",
    "/assets/workspace/253bcb1f4ea53702e36c55addc8dfd158c6859104659f578a57c0337a874bde1.css",
    "/assets/workspace/958c92cab42d8855d9c084618279adf31de08eaf9bbf1edabfaff2713f11e74d.js",
    "/assets/workspace/d1c2fe64aafc3376063502c4f6be5348d8f9e67c2ff692d269b45d6bb6691626.css",
];

fn url(bytes: &[u8], extension: &str) -> String {
    let digest: String = Sha256::digest(bytes)
        .iter()
        .map(|byte| format!("{byte:02x}"))
        .collect();
    format!("/assets/workspace/{digest}.{extension}")
}
pub fn script() -> &'static str {
    static URL: OnceLock<String> = OnceLock::new();
    URL.get_or_init(|| url(SCRIPT, "js"))
}
pub fn style() -> &'static str {
    static URL: OnceLock<String> = OnceLock::new();
    URL.get_or_init(|| url(STYLE, "css"))
}
pub fn find(path: &str) -> Option<(&'static str, &'static [u8])> {
    for (script, style) in [(SCRIPT, STYLE)].into_iter().chain(COMPATIBILITY) {
        if path == url(script, "js") {
            return Some(("text/javascript; charset=utf-8", script));
        }
        if path == url(style, "css") {
            return Some(("text/css; charset=utf-8", style));
        }
    }
    None
}
pub fn retired(path: &str) -> bool {
    RETIRED.contains(&path)
}
pub fn manifest() -> Vec<String> {
    [(SCRIPT, STYLE)]
        .into_iter()
        .chain(COMPATIBILITY)
        .flat_map(|(script, style)| [url(script, "js"), url(style, "css")])
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::collections::BTreeSet;

    #[test]
    fn shipping_window_is_three_exact_generations_without_retired_bytes() {
        let manifest = manifest();
        assert_eq!(manifest.len(), 6);
        assert_eq!(manifest.iter().collect::<BTreeSet<_>>().len(), 6);
        for path in manifest {
            let (media, bytes) = find(&path).expect("retained exact bytes");
            let extension = if media.starts_with("text/javascript") {
                "js"
            } else {
                assert_eq!(media, "text/css; charset=utf-8");
                "css"
            };
            assert_eq!(path, url(bytes, extension));
            assert!(!retired(&path));
        }
        assert_eq!(RETIRED.iter().collect::<BTreeSet<_>>().len(), 22);
        for path in RETIRED {
            assert!(retired(path));
            assert!(find(path).is_none());
        }
        assert!(!retired("/assets/workspace/latest.js"));
        assert!(find("/assets/workspace/latest.js").is_none());
    }

    #[test]
    fn prior23_and_18_compatibility_bytes_remain_immutable() {
        for ((script, style), expected) in COMPATIBILITY.into_iter().zip([
            [
                "/assets/workspace/8a20b75c96a3e13db593acefe75b9bccae89a825c5a8a7bffa4dc1f730958ab3.js",
                "/assets/workspace/d5608ad2a1333a42b738e6a6ffc07955f88252f6b177dc7b639db647caf6f826.css",
            ],
            [
                "/assets/workspace/669fbfd32bccda4c9e26262c75813f456a466a7ac5102fdd77cf1bbbb4d9bcd5.js",
                "/assets/workspace/aa0346c141e1bce1ae356a56b33c121fb090c2534c4374dd5c89586502ea5ec4.css",
            ],
        ]) {
            assert_eq!(url(script, "js"), expected[0]);
            assert_eq!(url(style, "css"), expected[1]);
        }
    }
}

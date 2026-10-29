//! Real HTTP distribution boundaries for retained and retired browser generations.
use super::*;

const RETIRED: [&str; 20] = [
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
const RETAINED: [&str; 4] = [
    "/assets/workspace/c7c1eb39825396b76fc6c74bf982b072f8872a9c5303ef92ae9eb5b5ee51618c.js",
    "/assets/workspace/bfd9c23272f6750691cef66ddf2962ea00bc36c98c0e09610c6f0e7a20085b98.css",
    "/assets/workspace/669fbfd32bccda4c9e26262c75813f456a466a7ac5102fdd77cf1bbbb4d9bcd5.js",
    "/assets/workspace/aa0346c141e1bce1ae356a56b33c121fb090c2534c4374dd5c89586502ea5ec4.css",
];

#[tokio::test]
async fn current_and_two_predecessor_generations_serve_exact_immutable_bytes() {
    let fixture = Fixture::new().await;
    fixture.init_key().await;
    let server = Server::start(&fixture, Some(&fixture.key_file)).await;
    let output = completed(fixture.command(&["artifact-info"], None).spawn().unwrap()).await;
    assert!(output.status.success());
    assert!(output.stderr.is_empty());
    let info: Value = serde_json::from_slice(&output.stdout).unwrap();
    let assets = info["assets"].as_array().unwrap();
    assert_eq!(assets.len(), 6);
    let paths: BTreeSet<_> = assets.iter().map(|value| value.as_str().unwrap()).collect();
    assert_eq!(paths.len(), 6);
    for expected in RETAINED {
        assert!(paths.contains(expected), "retained17/18 bytes were dropped");
    }
    for path in paths {
        let response = server.client.get(server.url(path)).send().await.unwrap();
        assert_eq!(response.status(), StatusCode::OK);
        assert_eq!(
            response.headers().get("cache-control").unwrap(),
            "public, max-age=31536000, immutable"
        );
        assert!(response.headers().get("set-cookie").is_none());
        let extension = path.rsplit_once('.').unwrap().1;
        assert_eq!(
            response.headers().get("content-type").unwrap(),
            if extension == "js" {
                "text/javascript; charset=utf-8"
            } else {
                assert_eq!(extension, "css");
                "text/css; charset=utf-8"
            }
        );
        let bytes = response.bytes().await.unwrap();
        let hash = Sha256::digest(&bytes)
            .iter()
            .map(|value| format!("{value:02x}"))
            .collect::<String>();
        assert_eq!(path, format!("/assets/workspace/{hash}.{extension}"));
    }
}

#[tokio::test]
async fn retired_bootstrap_urls_are_gone_with_native_recovery_and_unknown_urls_stay_unknown() {
    let fixture = Fixture::new().await;
    fixture.init_key().await;
    let server = Server::start(&fixture, Some(&fixture.key_file)).await;
    for path in RETIRED {
        let response = server.client.get(server.url(path)).send().await.unwrap();
        assert_eq!(response.status(), StatusCode::GONE, "{path}");
        assert_eq!(response.headers().get("cache-control").unwrap(), "no-store");
        assert_eq!(
            response.headers().get("content-type").unwrap(),
            "text/html; charset=utf-8"
        );
        assert!(response.headers().get("set-cookie").is_none());
        let body = response.text().await.unwrap();
        assert!(body.len() < 1024);
        assert!(body.contains("This workspace version has retired"));
        assert!(body.contains("href=\"/workspace\""));
        assert!(body.contains("href=\"/account\""));
        assert!(!body.contains("<script"));
        let head = server.client.head(server.url(path)).send().await.unwrap();
        assert_eq!(head.status(), StatusCode::GONE);
        assert_eq!(head.headers().get("cache-control").unwrap(), "no-store");
        assert!(head.bytes().await.unwrap().is_empty());
    }
    for unknown in [
        "/assets/workspace/latest.js",
        "/assets/workspace/0000000000000000000000000000000000000000000000000000000000000000.css",
    ] {
        assert_eq!(
            server
                .client
                .get(server.url(unknown))
                .send()
                .await
                .unwrap()
                .status(),
            StatusCode::NOT_FOUND
        );
    }
}

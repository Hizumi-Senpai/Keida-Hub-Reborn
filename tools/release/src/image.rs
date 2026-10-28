//! Exact repository image entrypoint/labels/binary and archive inspection.
use crate::{Result, directory, hash, hex};
use serde_json::{Value, json};
use std::{
    fs,
    path::Path,
    process::{Command, Stdio},
};
fn docker(args: &[&str]) -> Result<Vec<u8>> {
    let output = Command::new("docker")
        .args(args)
        .stderr(Stdio::null())
        .output()
        .map_err(|_| "Docker inspection unavailable")?;
    if !output.status.success() || output.stdout.len() > 262144 {
        return Err("Docker inspection rejected");
    }
    Ok(output.stdout)
}
struct Container(String);
impl Drop for Container {
    fn drop(&mut self) {
        let _ = Command::new("docker")
            .args(["rm", "--force", &self.0])
            .stdout(Stdio::null())
            .stderr(Stdio::null())
            .status();
    }
}
pub(super) fn inspect(
    image: &str,
    commit: &str,
    tree: &str,
    version: &str,
    channel: &str,
    out: &Path,
) -> Result<()> {
    if !image
        .strip_prefix("sha256:")
        .is_some_and(|v| crate::digest(v, 64))
        || !crate::digest(commit, 40)
        || !crate::digest(tree, 40)
    {
        return Err("exact image/source identity required");
    }
    directory(out)?;
    for name in ["inspected-binary", "image.tar", "image-proof.json"] {
        if out
            .join(name)
            .try_exists()
            .map_err(|_| "inspection output unavailable")?
        {
            return Err("inspection output already exists");
        }
    }
    let info: Value = serde_json::from_slice(&docker(&["image", "inspect", image])?)
        .map_err(|_| "image JSON rejected")?;
    let metadata = &info[0];
    let id = metadata["Id"].as_str().ok_or("image identity absent")?;
    if !id
        .strip_prefix("sha256:")
        .is_some_and(|v| crate::digest(v, 64))
        || metadata["Config"]["User"] != "65532:65532"
        || metadata["Config"]["Entrypoint"] != json!(["/usr/local/bin/keida-hub-reborn"])
        || metadata["Config"]["Cmd"] != json!(["serve"])
        || metadata["Config"]["Healthcheck"]["Test"]
            != json!(["CMD", "/usr/local/bin/keida-hub-reborn", "healthcheck"])
    {
        return Err("runtime image configuration rejected");
    }
    let labels = &metadata["Config"]["Labels"];
    for (name, expected) in [
        ("keida.product", "keida-hub-reborn"),
        ("keida.schema", "13"),
        ("keida.tree", tree),
        ("keida.channel", channel),
        ("org.opencontainers.image.version", version),
        ("org.opencontainers.image.revision", commit),
    ] {
        if labels[name] != expected {
            return Err("image/source labels mismatch");
        }
    }
    let public: Value = serde_json::from_slice(&docker(&[
        "run",
        "--rm",
        "--network",
        "none",
        "--read-only",
        "--cap-drop",
        "ALL",
        "--security-opt",
        "no-new-privileges",
        id,
        "artifact-info",
    ])?)
    .map_err(|_| "packaged metadata rejected")?;
    let identity = &public["identity"];
    for (name, expected) in [
        ("product", "keida-hub-reborn"),
        ("commit", commit),
        ("tree", tree),
        ("version", version),
        ("channel", channel),
    ] {
        if identity[name] != expected {
            return Err("packaged binary/source mismatch");
        }
    }
    if public["database_schema"] != 13 || public["workspace_contract"] != "reborn-workspace-v1" {
        return Err("packaged interface mismatch");
    }
    let assets = public["assets"]
        .as_array()
        .ok_or("packaged assets absent")?;
    if assets.len() != 22
        || assets.iter().any(|a| {
            !a.as_str().is_some_and(|a| {
                a.strip_prefix("/assets/workspace/")
                    .and_then(|a| a.split_once('.'))
                    .is_some_and(|(h, e)| crate::digest(h, 64) && matches!(e, "js" | "css"))
            })
        })
    {
        return Err("packaged asset manifest rejected");
    }
    let mut random = [0u8; 12];
    getrandom::fill(&mut random).map_err(|_| "inspection identity failed")?;
    let name = format!("reborn-image-inspect-{}", hex(&random));
    let created = docker(&[
        "create",
        "--name",
        &name,
        "--network",
        "none",
        "--read-only",
        id,
    ])?;
    let id = std::str::from_utf8(&created)
        .map(str::trim)
        .map_err(|_| "created container identity rejected")?;
    if !crate::digest(id, 64) {
        return Err("created container identity rejected");
    }
    let container = Container(id.to_owned());
    let binary = out.join("inspected-binary");
    docker(&[
        "cp",
        &format!("{}:/usr/local/bin/keida-hub-reborn", container.0),
        binary.to_str().ok_or("inspection path rejected")?,
    ])?;
    let binary_sha256 = hash(&binary)?;
    fs::remove_file(&binary).map_err(|_| "inspection cleanup failed")?;
    let archive = out.join("image.tar");
    if archive.exists() {
        return Err("candidate archive already exists");
    }
    docker(&[
        "save",
        "--output",
        archive.to_str().ok_or("archive path rejected")?,
        image,
    ])?;
    let archive_sha256 = hash(&archive)?;
    let proof = json!({"format":1,"product":"keida-hub-reborn","identity":identity,"database_schema":13,"workspace_contract":"reborn-workspace-v1","assets":assets,"image_id":image,"binary_sha256":binary_sha256,"archive_sha256":archive_sha256});
    crate::write(
        &out.join("image-proof.json"),
        &serde_json::to_vec(&proof).map_err(|_| "image proof encoding failed")?,
        true,
    )?;
    println!("Packaged image inspection passed: {version} {commit} {image}");
    Ok(())
}

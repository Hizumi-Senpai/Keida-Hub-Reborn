use reborn_source_identity::{Channel, Options, derive};
use std::{env, path::PathBuf, process::ExitCode};

fn main() -> ExitCode {
    match run() {
        Ok(output) => {
            println!("{output}");
            ExitCode::SUCCESS
        }
        Err(error) => {
            eprintln!("source identity refused: {error}");
            ExitCode::FAILURE
        }
    }
}

fn run() -> Result<String, String> {
    let mut values = std::collections::BTreeMap::new();
    let mut args = env::args().skip(1);
    while let Some(key) = args.next() {
        if key == "--help" {
            return Ok("reborn-source-identity --repo PATH --candidate FULL_SHA --channel development|preview|accepted [--main-ref refs/remotes/origin/main|refs/heads/main --main-sha FULL_SHA] [--base FULL_SHA] [--format json|env]".into());
        }
        if ![
            "--repo",
            "--candidate",
            "--channel",
            "--main-ref",
            "--main-sha",
            "--base",
            "--format",
        ]
        .contains(&key.as_str())
        {
            return Err(format!("unknown argument {key}"));
        }
        let value = args
            .next()
            .ok_or_else(|| format!("missing value for {key}"))?;
        if values.insert(key.clone(), value).is_some() {
            return Err(format!("duplicate argument {key}"));
        }
    }
    let required = |key: &str| {
        values
            .get(key)
            .cloned()
            .ok_or_else(|| format!("required argument {key}"))
    };
    let options = Options {
        repo: PathBuf::from(required("--repo")?),
        candidate: required("--candidate")?,
        channel: required("--channel")?.parse::<Channel>()?,
        main_ref: values.get("--main-ref").cloned(),
        main_sha: values.get("--main-sha").cloned(),
        base: values.get("--base").cloned(),
    };
    let identity = derive(&options)?;
    match values.get("--format").map(String::as_str).unwrap_or("json") {
        "json" => Ok(identity.json()),
        "env" => Ok(identity.env()),
        _ => Err("format must be json or env".into()),
    }
}

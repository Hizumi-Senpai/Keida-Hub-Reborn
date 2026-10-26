use std::env;

fn main() {
    let fields = [
        "PRODUCT", "VERSION", "COMMIT", "TREE", "ORDINAL", "CHANNEL", "CONTRACT",
    ];
    let values: Vec<_> = fields
        .iter()
        .map(|field| {
            let key = format!("REBORN_BUILD_{field}");
            println!("cargo:rerun-if-env-changed={key}");
            env::var(key).ok()
        })
        .collect();
    let supplied = values.iter().filter(|value| value.is_some()).count();
    assert!(
        supplied == 0 || supplied == fields.len(),
        "build identity must be complete"
    );
    let defaults = [
        "keida-hub-reborn",
        "development",
        "unqualified",
        "unqualified",
        "",
        "development",
        "reborn-foundation-v1",
    ];
    for (index, field) in fields.iter().enumerate() {
        let value = values[index].as_deref().unwrap_or(defaults[index]);
        assert!(
            value
                .bytes()
                .all(|b| b.is_ascii_alphanumeric() || b".-_".contains(&b)),
            "invalid build identity field"
        );
        println!("cargo:rustc-env=REBORN_COMPILED_{field}={value}");
    }
    if supplied != 0 {
        assert_eq!(values[0].as_deref(), Some("keida-hub-reborn"));
        assert!(matches!(
            values[5].as_deref(),
            Some("development" | "preview" | "accepted")
        ));
        for i in [2, 3] {
            let s = values[i].as_deref().expect("complete");
            assert!(
                s.len() == 40 && s.bytes().all(|b| b.is_ascii_hexdigit()),
                "invalid source SHA"
            );
        }
        assert_eq!(values[6].as_deref(), Some("reborn-foundation-v1"));
        let version = values[1].as_deref().expect("complete");
        let ordinal = values[4].as_deref().expect("complete");
        let channel = values[5].as_deref().expect("complete");
        match channel {
            "accepted" => {
                let n = ordinal.parse::<u64>().expect("accepted ordinal");
                assert_eq!(ordinal, n.to_string());
                assert_eq!(version, format!("0.1.{n}"));
            }
            "preview" => {
                assert!(ordinal.is_empty());
                let (base, suffix) = version.split_once("-preview.").expect("preview version");
                let n = base
                    .strip_prefix("0.1.")
                    .expect("preview series")
                    .parse::<u64>()
                    .expect("preview ordinal");
                assert_eq!(base, format!("0.1.{n}"));
                assert_eq!(suffix, &values[2].as_deref().expect("complete")[..12]);
            }
            "development" => {
                assert!(ordinal.is_empty());
                assert_eq!(
                    version,
                    format!(
                        "0.1.0-development.{}",
                        &values[2].as_deref().expect("complete")[..12]
                    )
                );
            }
            _ => unreachable!(),
        }
    }
}

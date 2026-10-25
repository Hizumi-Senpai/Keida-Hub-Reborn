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
    }
}

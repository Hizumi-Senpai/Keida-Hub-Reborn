use serde::Serialize;

#[derive(Clone, Serialize)]
pub struct Identity {
    pub product: &'static str,
    pub version: &'static str,
    pub commit: &'static str,
    pub tree: &'static str,
    pub ordinal: Option<u64>,
    pub channel: &'static str,
    pub contract: &'static str,
    pub package_version: &'static str,
}

pub fn compiled() -> Identity {
    Identity {
        product: env!("REBORN_COMPILED_PRODUCT"),
        version: env!("REBORN_COMPILED_VERSION"),
        commit: env!("REBORN_COMPILED_COMMIT"),
        tree: env!("REBORN_COMPILED_TREE"),
        ordinal: option_env!("REBORN_COMPILED_ORDINAL").and_then(|s| s.parse().ok()),
        channel: env!("REBORN_COMPILED_CHANNEL"),
        contract: env!("REBORN_COMPILED_CONTRACT"),
        package_version: env!("CARGO_PKG_VERSION"),
    }
}

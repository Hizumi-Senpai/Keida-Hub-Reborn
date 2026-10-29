//! Strict updater protocol, durable journals and sealed local diagnostics.
//!
//! This crate dispatches no host operation. A valid request or persisted journal
//! phase never grants authority or proves an application effect. The diagnostic
//! binary checks sealed requests or current-artifact/adoption-plan consistency.
//! It never changes an installed authority or dispatches a host effect. The
//! actual executor, recovery and installation gates remain unimplemented.

mod admission;
mod adoption;
pub mod bundle_fs;
pub mod journal;
pub mod protocol;

/// A generic refusal deliberately contains no private path or input payload.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub struct BundleCheckError;

impl std::fmt::Display for BundleCheckError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.write_str("bundle check refused; no effects authorized")
    }
}

impl std::error::Error for BundleCheckError {}

/// Local agreement only. This is neither a publisher signature nor host admission.
#[derive(Debug, serde::Serialize)]
pub struct BundleReport {
    format: u64,
    product: &'static str,
    profile: &'static str,
    trust_basis: &'static str,
    envelope_sha256: String,
    adoption_plan_sha256: String,
    archive_rehashed: bool,
    zip_rehashed: bool,
    proposed_generation: u64,
    manual_authority_retained: bool,
    effects_authorized: bool,
    adoption_performed: bool,
    execution_ready: bool,
}

/// Check the fixed private bundle while retaining descriptors through the final
/// semantic/path recheck. No journal, selector or host command is opened here.
pub fn check_bundle(
    path: &std::path::Path,
    envelope_sha256: &str,
    adoption_plan_sha256: &str,
    mode: bundle_fs::TrustMode,
) -> Result<BundleReport, BundleCheckError> {
    let bundle = bundle_fs::Bundle::open(path, mode).map_err(|_| BundleCheckError)?;
    admission::validate(&bundle, envelope_sha256, adoption_plan_sha256)
        .map_err(|_| BundleCheckError)?;
    bundle.revalidate().map_err(|_| BundleCheckError)?;
    Ok(BundleReport {
        format: 1,
        product: "keida-hub-reborn",
        profile: "manual-installed-adoption-v1",
        trust_basis: match mode {
            bundle_fs::TrustMode::RootSealed => "root-sealed-core-admission",
            bundle_fs::TrustMode::Fixture => "same-uid-fixture",
        },
        envelope_sha256: envelope_sha256.to_owned(),
        adoption_plan_sha256: adoption_plan_sha256.to_owned(),
        archive_rehashed: true,
        zip_rehashed: true,
        proposed_generation: 1,
        manual_authority_retained: true,
        effects_authorized: false,
        adoption_performed: false,
        execution_ready: false,
    })
}

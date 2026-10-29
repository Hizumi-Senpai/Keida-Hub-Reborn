//! Strict updater protocol and durable journal storage foundation.
//!
//! This crate dispatches no host operation. A valid request or persisted journal
//! phase never grants authority or proves an application effect. The diagnostic
//! binary only checks a sealed canonical request; the future executor and its
//! admission, recovery and installation gates remain separately unimplemented.

pub mod journal;
pub mod protocol;

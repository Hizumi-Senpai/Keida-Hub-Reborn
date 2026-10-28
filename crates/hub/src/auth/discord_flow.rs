//! Bounded ephemeral OAuth capabilities. PostgreSQL generations remain authority.
//! No code, verifier or token is durable; restart deliberately retires all flows.
use super::{
    crypto::Secrets,
    store::discord::{Bases, Capture},
};
use serde::Serialize;
use std::{
    collections::HashMap,
    sync::{Arc, Mutex},
    time::{Duration, Instant},
};
use tokio::sync::{OwnedSemaphorePermit, Semaphore};
use zeroize::Zeroizing;

const LIMIT: usize = 64;
const TTL: Duration = Duration::from_secs(600);
type Result<T> = std::result::Result<T, &'static str>;

#[derive(Clone)]
pub(super) struct Binding {
    account: i64,
    generation: i64,
    verifier: Vec<u8>,
    key: Vec<u8>,
    bases: Bases,
}
impl Binding {
    pub fn capture(value: &Capture, key: &[u8], verifier: &[u8]) -> Self {
        Self {
            account: value.session.account.id,
            generation: value.session.generation,
            verifier: verifier.to_vec(),
            key: key.to_vec(),
            bases: Bases {
                revision: value.link.revision,
                flow_generation: value.link.flow_generation,
                application_revision: value.application_revision,
            },
        }
    }
    fn matches(&self, other: &Self) -> bool {
        self.account == other.account
            && self.generation == other.generation
            && self.bases == other.bases
            && Secrets::constant_equal(&self.verifier, &other.verifier)
            && Secrets::constant_equal(&self.key, &other.key)
    }
}

#[derive(Clone, Serialize)]
pub(super) struct Candidate {
    pub id: String,
    pub display_name: String,
}
#[derive(Serialize)]
pub(super) struct View {
    pub phase: &'static str,
    pub candidate: Option<Candidate>,
    pub cleanup: Option<&'static str>,
    pub error: Option<&'static str>,
}
impl View {
    fn empty(phase: &'static str) -> Self {
        Self {
            phase,
            candidate: None,
            cleanup: None,
            error: None,
        }
    }
}

enum Phase {
    Awaiting,
    Received(Zeroizing<String>),
    Reviewing,
    Ready(Candidate, &'static str),
    Failed(&'static str, Option<&'static str>),
    Restart,
}
struct Attempt {
    binding: Binding,
    deadline: Instant,
    state: Zeroizing<String>,
    state_hash: Vec<u8>,
    flow: Zeroizing<String>,
    returned: Zeroizing<String>,
    verifier: Zeroizing<String>,
    phase: Mutex<Phase>,
    // The last reference owns capacity, including retired in-flight requests.
    _permit: OwnedSemaphorePermit,
}
pub(super) struct Prepared {
    deadline: Instant,
    state: Zeroizing<String>,
    flow: Zeroizing<String>,
    returned: Zeroizing<String>,
    verifier: Zeroizing<String>,
    permit: OwnedSemaphorePermit,
}
pub(super) struct Flows {
    attempts: Mutex<HashMap<i64, Arc<Attempt>>>,
    permits: Arc<Semaphore>,
}
impl Flows {
    pub fn new() -> Self {
        Self {
            attempts: Mutex::new(HashMap::with_capacity(LIMIT)),
            permits: Arc::new(Semaphore::new(LIMIT)),
        }
    }
    fn prune(attempts: &mut HashMap<i64, Arc<Attempt>>) {
        let now = Instant::now();
        attempts.retain(|_, value| value.deadline > now);
    }
    pub fn prepare(&self) -> Result<Prepared> {
        {
            let mut attempts = self.attempts.lock().map_err(|_| "unavailable")?;
            Self::prune(&mut attempts);
        }
        let permit = self
            .permits
            .clone()
            .try_acquire_owned()
            .map_err(|_| "try_later")?;
        let token = || {
            Secrets::token()
                .map(Zeroizing::new)
                .map_err(|_| "unavailable")
        };
        Ok(Prepared {
            deadline: Instant::now() + TTL,
            state: token()?,
            flow: token()?,
            returned: token()?,
            verifier: token()?,
            permit,
        })
    }
    pub fn install(&self, prepared: Prepared, binding: Binding) -> Result<Zeroizing<String>> {
        let cookie = Zeroizing::new(prepared.flow.to_string());
        let state_hash = Secrets::token_hash(&prepared.state).map_err(|_| "unavailable")?;
        let attempt = Arc::new(Attempt {
            binding,
            deadline: prepared.deadline,
            state: prepared.state,
            state_hash,
            flow: prepared.flow,
            returned: prepared.returned,
            verifier: prepared.verifier,
            phase: Mutex::new(Phase::Awaiting),
            _permit: prepared.permit,
        });
        let mut attempts = self.attempts.lock().map_err(|_| "unavailable")?;
        if attempts.get(&attempt.binding.account).is_some_and(|value| {
            value.binding.bases.flow_generation > attempt.binding.bases.flow_generation
        }) {
            return Err("conflict");
        }
        attempts.insert(attempt.binding.account, attempt);
        Ok(cookie)
    }
    fn current(
        &self,
        binding: &Binding,
        flow: &str,
        returned: Option<&str>,
        require_return: bool,
    ) -> Result<Arc<Attempt>> {
        let mut attempts = self.attempts.lock().map_err(|_| "unavailable")?;
        Self::prune(&mut attempts);
        let value = attempts.get(&binding.account).ok_or("conflict")?;
        if !value.binding.matches(binding)
            || !Secrets::constant_equal(value.flow.as_bytes(), flow.as_bytes())
            || (require_return
                && !returned.is_some_and(|returned| {
                    Secrets::constant_equal(value.returned.as_bytes(), returned.as_bytes())
                }))
        {
            return Err("conflict");
        }
        Ok(value.clone())
    }
    pub fn authorize(
        &self,
        binding: &Binding,
        flow: &str,
    ) -> Result<(Zeroizing<String>, Zeroizing<String>)> {
        let attempt = self.current(binding, flow, None, false)?;
        let phase = attempt.phase.lock().map_err(|_| "unavailable")?;
        if !matches!(*phase, Phase::Awaiting) {
            return Err("conflict");
        }
        Ok((
            Zeroizing::new(attempt.state.to_string()),
            Zeroizing::new(attempt.verifier.to_string()),
        ))
    }
    /// A state is a delivery capability, never authority to disclose or link.
    pub fn callback(
        &self,
        state: &str,
        code: Option<Zeroizing<String>>,
    ) -> Result<Zeroizing<String>> {
        let hash = Secrets::token_hash(state).map_err(|_| "invalid_request")?;
        let attempt = {
            let mut attempts = self.attempts.lock().map_err(|_| "unavailable")?;
            Self::prune(&mut attempts);
            attempts
                .values()
                .find(|value| Secrets::constant_equal(&value.state_hash, &hash))
                .cloned()
                .ok_or("invalid_request")?
        };
        let mut phase = attempt.phase.lock().map_err(|_| "unavailable")?;
        if attempt.deadline <= Instant::now() {
            return Err("invalid_request");
        }
        if !matches!(*phase, Phase::Awaiting) {
            return Err("conflict");
        }
        *phase = match code {
            Some(code) => Phase::Received(code),
            None => Phase::Failed("denied", None),
        };
        Ok(Zeroizing::new(attempt.returned.to_string()))
    }
    pub fn view(
        &self,
        binding: &Binding,
        flow: Option<&str>,
        returned: Option<&str>,
    ) -> Result<View> {
        let Some(flow) = flow else {
            let mut attempts = self.attempts.lock().map_err(|_| "unavailable")?;
            Self::prune(&mut attempts);
            return Ok(View::empty(if attempts.contains_key(&binding.account) {
                "restart_required"
            } else {
                "none"
            }));
        };
        let attempt = match self.current(binding, flow, None, false) {
            Ok(value) => value,
            Err("conflict") => return Ok(View::empty("restart_required")),
            Err(error) => return Err(error),
        };
        let phase = attempt.phase.lock().map_err(|_| "unavailable")?;
        if !matches!(*phase, Phase::Awaiting)
            && !returned.is_some_and(|returned| {
                Secrets::constant_equal(attempt.returned.as_bytes(), returned.as_bytes())
            })
        {
            return Ok(View::empty("restart_required"));
        }
        Ok(match &*phase {
            Phase::Awaiting => View::empty("awaiting_discord"),
            Phase::Received(_) => View::empty("ready_to_review"),
            Phase::Reviewing => View::empty("reviewing"),
            Phase::Ready(candidate, cleanup) => View {
                phase: "review_ready",
                candidate: Some(candidate.clone()),
                cleanup: Some(cleanup),
                error: None,
            },
            Phase::Failed(error, cleanup) => View {
                phase: "failed",
                candidate: None,
                cleanup: *cleanup,
                error: Some(error),
            },
            Phase::Restart => View {
                phase: "restart_required",
                candidate: None,
                cleanup: None,
                error: Some("restart_required"),
            },
        })
    }
    pub fn claim_review(
        &self,
        binding: &Binding,
        flow: &str,
        returned: &str,
    ) -> Result<ReviewClaim> {
        let attempt = self.current(binding, flow, Some(returned), true)?;
        let code = {
            let mut phase = attempt.phase.lock().map_err(|_| "unavailable")?;
            match std::mem::replace(&mut *phase, Phase::Reviewing) {
                Phase::Received(code) => code,
                previous => {
                    *phase = previous;
                    return Err("conflict");
                }
            }
        };
        let verifier = Zeroizing::new(attempt.verifier.to_string());
        Ok(ReviewClaim {
            attempt,
            code,
            verifier,
            finished: false,
        })
    }
    pub fn claim_confirm(
        &self,
        binding: &Binding,
        flow: &str,
        returned: &str,
    ) -> Result<ConfirmClaim> {
        let attempt = self.current(binding, flow, Some(returned), true)?;
        let candidate = {
            let mut phase = attempt.phase.lock().map_err(|_| "unavailable")?;
            match std::mem::replace(&mut *phase, Phase::Reviewing) {
                Phase::Ready(candidate, _) => candidate,
                previous => {
                    *phase = previous;
                    return Err("conflict");
                }
            }
        };
        Ok(ConfirmClaim {
            attempt,
            candidate,
            finished: false,
        })
    }
    pub fn retire_binding(&self, binding: &Binding) -> Result<()> {
        let mut attempts = self.attempts.lock().map_err(|_| "unavailable")?;
        if attempts
            .get(&binding.account)
            .is_some_and(|value| value.binding.matches(binding))
        {
            attempts.remove(&binding.account);
        }
        Ok(())
    }
    pub fn retire_before(&self, account: i64, generation: i64) -> Result<()> {
        let mut attempts = self.attempts.lock().map_err(|_| "unavailable")?;
        if attempts
            .get(&account)
            .is_some_and(|value| value.binding.bases.flow_generation < generation)
        {
            attempts.remove(&account);
        }
        Ok(())
    }
    pub fn invalidate_application(&self, revision: i64) -> Result<()> {
        self.attempts
            .lock()
            .map_err(|_| "unavailable")?
            .retain(|_, value| value.binding.bases.application_revision >= revision);
        Ok(())
    }
}

pub(super) struct ReviewClaim {
    attempt: Arc<Attempt>,
    pub code: Zeroizing<String>,
    pub verifier: Zeroizing<String>,
    finished: bool,
}
impl ReviewClaim {
    pub fn complete(
        mut self,
        result: std::result::Result<(Candidate, &'static str), &'static str>,
    ) -> Result<()> {
        let mut phase = self.attempt.phase.lock().map_err(|_| "unavailable")?;
        if self.attempt.deadline <= Instant::now() || !matches!(*phase, Phase::Reviewing) {
            drop(phase);
            return Err("conflict");
        }
        *phase = match result {
            Ok((candidate, cleanup)) => Phase::Ready(candidate, cleanup),
            Err(error) => Phase::Failed(error, Some("unconfirmed")),
        };
        self.finished = true;
        Ok(())
    }
}
impl Drop for ReviewClaim {
    fn drop(&mut self) {
        if !self.finished
            && let Ok(mut phase) = self.attempt.phase.lock()
            && matches!(*phase, Phase::Reviewing)
        {
            *phase = Phase::Restart;
        }
    }
}
pub(super) struct ConfirmClaim {
    attempt: Arc<Attempt>,
    pub candidate: Candidate,
    finished: bool,
}
impl ConfirmClaim {
    pub fn deadline(&self) -> Instant {
        self.attempt.deadline
    }
    pub fn complete(mut self) {
        self.finished = true;
    }
}
impl Drop for ConfirmClaim {
    fn drop(&mut self) {
        if !self.finished
            && let Ok(mut phase) = self.attempt.phase.lock()
            && matches!(*phase, Phase::Reviewing)
        {
            *phase = Phase::Restart;
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    fn binding(account: i64) -> Binding {
        Binding {
            account,
            generation: 0,
            verifier: vec![1; 32],
            key: vec![2; 32],
            bases: Bases {
                revision: 0,
                flow_generation: 1,
                application_revision: 1,
            },
        }
    }
    fn begin(flows: &Flows, account: i64) -> (Binding, String, String, String) {
        let binding = binding(account);
        let prepared = flows.prepare().unwrap();
        let state = prepared.state.to_string();
        let returned = prepared.returned.to_string();
        let flow = flows
            .install(prepared, binding.clone())
            .unwrap()
            .to_string();
        (binding, state, flow, returned)
    }
    #[test]
    fn delivery_is_one_use_and_capabilities_and_every_authority_dimension_are_independent() {
        let flows = Flows::new();
        let (b, state, flow, returned) = begin(&flows, 1);
        assert_eq!(
            flows.view(&b, Some(&flow), None).unwrap().phase,
            "awaiting_discord"
        );
        assert!(
            flows
                .callback(&state, Some(Zeroizing::new("code".into())))
                .is_ok()
        );
        assert!(matches!(flows.callback(&state, None), Err("conflict")));
        assert_eq!(
            flows.view(&b, Some(&flow), None).unwrap().phase,
            "restart_required"
        );
        assert!(flows.claim_review(&b, &flow, &flow).is_err());
        for dimension in 0..7 {
            let mut other = b.clone();
            match dimension {
                0 => other.account += 1,
                1 => other.generation += 1,
                2 => other.verifier[0] ^= 1,
                3 => other.key[0] ^= 1,
                4 => other.bases.revision += 1,
                5 => other.bases.flow_generation += 1,
                _ => other.bases.application_revision += 1,
            }
            assert!(flows.claim_review(&other, &flow, &returned).is_err());
        }
        let claim = flows.claim_review(&b, &flow, &returned).unwrap();
        assert!(flows.claim_review(&b, &flow, &returned).is_err());
        drop(claim);
        assert_eq!(
            flows.view(&b, Some(&flow), Some(&returned)).unwrap().phase,
            "restart_required"
        );
        assert!(flows.claim_review(&b, &flow, &returned).is_err());
    }
    #[test]
    fn candidate_requires_explicit_confirmation_and_cancelled_claims_are_never_replayed() {
        let flows = Flows::new();
        let (b, state, flow, returned) = begin(&flows, 1);
        flows
            .callback(&state, Some(Zeroizing::new("code".into())))
            .unwrap();
        assert!(flows.claim_confirm(&b, &flow, &returned).is_err());
        flows
            .claim_review(&b, &flow, &returned)
            .unwrap()
            .complete(Ok((
                Candidate {
                    id: "18446744073709551615".into(),
                    display_name: "Fixture".into(),
                },
                "unconfirmed",
            )))
            .unwrap();
        let view = flows.view(&b, Some(&flow), Some(&returned)).unwrap();
        assert_eq!(view.phase, "review_ready");
        assert_eq!(view.cleanup, Some("unconfirmed"));
        assert_eq!(view.candidate.unwrap().id, "18446744073709551615");
        let confirm = flows.claim_confirm(&b, &flow, &returned).unwrap();
        assert!(flows.claim_confirm(&b, &flow, &returned).is_err());
        drop(confirm);
        assert_eq!(
            flows.view(&b, Some(&flow), Some(&returned)).unwrap().phase,
            "restart_required"
        );
        flows.retire_binding(&b).unwrap();
        assert_eq!(flows.view(&b, None, None).unwrap().phase, "none");
    }
    #[test]
    fn capacity_counts_retired_inflight_claims_and_expiry_is_monotonic() {
        let flows = Flows::new();
        let (b, state, flow, returned) = begin(&flows, 1);
        flows
            .callback(&state, Some(Zeroizing::new("code".into())))
            .unwrap();
        let held = flows.claim_review(&b, &flow, &returned).unwrap();
        flows.retire_binding(&b).unwrap();
        let mut prepared = Vec::new();
        for _ in 1..LIMIT {
            prepared.push(flows.prepare().unwrap());
        }
        assert!(matches!(flows.prepare(), Err("try_later")));
        drop(held);
        assert!(flows.prepare().is_ok());
        drop(prepared);
        let mut expired = flows.prepare().unwrap();
        let state = expired.state.to_string();
        expired.deadline = Instant::now() - Duration::from_secs(1);
        let flow = flows.install(expired, b.clone()).unwrap();
        assert_eq!(
            flows.view(&b, Some(&flow), None).unwrap().phase,
            "restart_required"
        );
        assert!(matches!(
            flows.callback(&state, None),
            Err("invalid_request")
        ));
    }
    #[tokio::test]
    async fn actual_timeout_cancels_the_claim_without_replaying_the_code() {
        let flows = Flows::new();
        let (binding, state, flow, returned) = begin(&flows, 1);
        flows
            .callback(&state, Some(Zeroizing::new("code".into())))
            .unwrap();
        let claim = flows.claim_review(&binding, &flow, &returned).unwrap();
        let result = tokio::time::timeout(Duration::from_millis(1), async move {
            let _claim = claim;
            std::future::pending::<()>().await;
        })
        .await;
        assert!(result.is_err());
        assert_eq!(
            flows
                .view(&binding, Some(&flow), Some(&returned))
                .unwrap()
                .phase,
            "restart_required"
        );
        assert!(flows.claim_review(&binding, &flow, &returned).is_err());
        assert!(matches!(flows.callback(&state, None), Err("conflict")));
    }
    #[test]
    fn delayed_old_cleanup_never_retires_a_new_generation() {
        let flows = Flows::new();
        let (old, _, _, _) = begin(&flows, 1);
        let mut new = old.clone();
        new.bases.flow_generation += 1;
        new.bases.application_revision += 1;
        let prepared = flows.prepare().unwrap();
        let flow = flows.install(prepared, new.clone()).unwrap();
        flows.retire_binding(&old).unwrap();
        flows.retire_before(1, new.bases.flow_generation).unwrap();
        flows
            .invalidate_application(new.bases.application_revision)
            .unwrap();
        assert_eq!(
            flows.view(&new, Some(&flow), None).unwrap().phase,
            "awaiting_discord"
        );
        assert!(matches!(
            flows.install(flows.prepare().unwrap(), old),
            Err("conflict")
        ));
    }
}

mod driver;
mod fixture;
mod workflows;

type Check<T> = Result<T, &'static str>;
fn check(ok: bool, message: &'static str) -> Check<()> {
    if ok { Ok(()) } else { Err(message) }
}
#[tokio::main]
async fn main() -> std::process::ExitCode {
    let _ = tokio_rustls::rustls::crypto::ring::default_provider().install_default();
    match tokio::time::timeout(std::time::Duration::from_secs(240), workflows::run()).await {
        Ok(Ok(())) => std::process::ExitCode::SUCCESS,
        Ok(Err(message)) => {
            eprintln!("Rust workspace browser failure: {message}");
            std::process::ExitCode::from(2)
        }
        Err(_) => {
            eprintln!("Rust workspace browser failure: total deadline exceeded");
            std::process::ExitCode::from(2)
        }
    }
}

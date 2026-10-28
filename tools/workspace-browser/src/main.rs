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
    let arguments: Vec<_> = std::env::args().skip(1).collect();
    let refresh = match arguments.as_slice() {
        [] => false,
        [argument] if argument == "--refresh" => true,
        _ => {
            eprintln!("usage: reborn-workspace-browser [--refresh]");
            return std::process::ExitCode::from(2);
        }
    };
    // Retain the original fifteen-workflow 240s admission unchanged. The new
    // real one-minute test has its own explicit 120s admission and CI caller.
    let budget = if refresh { 120 } else { 240 };
    let run = async {
        if refresh {
            workflows::run_refresh().await
        } else {
            workflows::run().await
        }
    };
    match tokio::time::timeout(std::time::Duration::from_secs(budget), run).await {
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

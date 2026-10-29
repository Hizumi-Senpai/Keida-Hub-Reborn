mod driver;
mod fixture;
mod workflows;
mod tiles;

type Check<T> = Result<T, &'static str>;
fn check(ok: bool, message: &'static str) -> Check<()> {
    if ok { Ok(()) } else { Err(message) }
}
#[tokio::main]
async fn main() -> std::process::ExitCode {
    let _ = tokio_rustls::rustls::crypto::ring::default_provider().install_default();
    let arguments: Vec<_> = std::env::args().skip(1).collect();
    let mode = match arguments.as_slice() {
        [] => "retained",
        [argument] if argument == "--refresh" => "refresh",
        [argument] if argument == "--tiles" => "tiles",
        _ => {
            eprintln!("usage: reborn-workspace-browser [--refresh|--tiles]");
            return std::process::ExitCode::from(2);
        }
    };
    // Retain the original fifteen-workflow 240s admission unchanged. The new
    // real one-minute test has its own explicit120s admission. Home resources and
    // native recovery have a separate180s cap; no retained timeout is weakened.
    let budget = match mode { "refresh" => 120, "tiles" => 180, _ => 240 };
    let run = async {
        match mode {
            "refresh" => workflows::run_refresh().await,
            "tiles" => tiles::run().await,
            _ => workflows::run().await,
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

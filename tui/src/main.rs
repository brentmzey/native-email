use email_core::run_safe_task;

#[tokio::main]
async fn main() {
    println!("Starting TUI...");
    match run_safe_task().await {
        Ok(msg) => println!("{}", msg),
        Err(e) => println!("{}", e),
    }
}
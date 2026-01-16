use tokio::time::{timeout, Duration};

pub async fn run_safe_task() -> Result<String, String> {
    let timeout_duration = Duration::from_secs(2);

    match timeout(timeout_duration, heavy_task()).await {
        Ok(result) => Ok(format!("Task completed: {}", result)),
        Err(_) => Err("Error: Task timed out (possible logic bomb detected).".to_string()),
    }
}

async fn heavy_task() -> String {
    // Simulate work
    tokio::time::sleep(Duration::from_millis(100)).await;
    "Success".to_string()
}
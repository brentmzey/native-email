use tokio::time::{timeout, Duration};

pub mod imap;
pub mod models;

use crate::imap::ImapClient;
use crate::models::EmailPreview;

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

// New API for fetching emails
pub async fn fetch_inbox() -> Result<Vec<EmailPreview>, String> {
    let client = ImapClient::new();
    // Wrap in a timeout for safety too!
    match timeout(Duration::from_secs(10), client.fetch_inbox_previews(20)).await {
        Ok(res) => res,
        Err(_) => Err("IMAP connection timed out".to_string()),
    }
}

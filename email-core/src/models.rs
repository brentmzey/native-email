use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EmailPreview {
    pub id: u32,
    pub sender: String,
    pub subject: String,
    pub preview: String,
    pub date: String,
}

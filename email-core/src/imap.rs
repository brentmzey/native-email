use crate::models::EmailPreview;
use async_native_tls::TlsConnector;
use futures::stream::TryStreamExt;
use mailparse::MailHeaderMap; // Import the trait
use std::env;
use tokio::net::TcpStream;

pub struct ImapClient {
    domain: String,
    port: u16,
    username: String,
    password: String,
}

impl ImapClient {
    pub fn new() -> Self {
        dotenvy::dotenv().ok();
        Self {
            domain: env::var("IMAP_DOMAIN").unwrap_or_else(|_| "imap.example.com".to_string()),
            port: env::var("IMAP_PORT")
                .unwrap_or("993".to_string())
                .parse()
                .unwrap_or(993),
            username: env::var("IMAP_USERNAME").unwrap_or_else(|_| "user@example.com".to_string()),
            password: env::var("IMAP_PASSWORD").unwrap_or_else(|_| "password".to_string()),
        }
    }

    pub async fn fetch_inbox_previews(&self, limit: usize) -> Result<Vec<EmailPreview>, String> {
        // If credentials are default/mock, return mock data immediately
        if self.domain == "imap.example.com" {
            return Ok(vec![
                EmailPreview {
                    id: 1,
                    sender: "Apple".to_string(),
                    subject: "Your Receipt (Mock)".to_string(),
                    preview: "Thank you for your purchase...".to_string(),
                    date: "10:30 AM".to_string(),
                },
                EmailPreview {
                    id: 2,
                    sender: "GitHub".to_string(),
                    subject: "[GitHub] Security Alert (Mock)".to_string(),
                    preview: "We noticed a new login...".to_string(),
                    date: "Yesterday".to_string(),
                },
            ]);
        }

        let tcp_stream = TcpStream::connect((self.domain.as_str(), self.port))
            .await
            .map_err(|e| format!("TCP Connection failed: {}", e))?;

        let tls = TlsConnector::new();
        let tls_stream = tls
            .connect(&self.domain, tcp_stream)
            .await
            .map_err(|e| format!("TLS handshake failed: {}", e))?;

        let client = async_imap::Client::new(tls_stream);

        let mut session = client
            .login(&self.username, &self.password)
            .await
            .map_err(|e| format!("Login failed: {}", e.0))?;

        session.select("INBOX").await.map_err(|e| format!("Select INBOX failed: {}", e))?;

        let mut previews = Vec::new();
        
        {
            // Fetch the last 'limit' messages
            let sequence_set = format!("1:*"); 
            let mut messages = session.fetch(sequence_set, "RFC822.HEADER").await.map_err(|e| format!("Fetch failed: {}", e))?;
            
            while let Some(msg) = messages.try_next().await.map_err(|e| format!("Stream error: {}", e))? {
                let header = msg.header().ok_or("No header")?;
                let parsed_headers = mailparse::parse_headers(header).map_err(|e| e.to_string())?;
                
                // Access the vector via .0
                let subject = parsed_headers.0.get_first_value("Subject").unwrap_or_default();
                let from = parsed_headers.0.get_first_value("From").unwrap_or_default();
                let date = parsed_headers.0.get_first_value("Date").unwrap_or_default();

                previews.push(EmailPreview {
                    id: msg.message,
                    sender: from,
                    subject,
                    preview: "Loading...".to_string(), 
                    date,
                });
                
                if previews.len() >= limit {
                    break;
                }
            }
        }

        // Logout
        session.logout().await.map_err(|e| format!("Logout failed: {}", e))?;

        Ok(previews)
    }
}

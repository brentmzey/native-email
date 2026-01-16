# Email Core

The **shared Rust library** that powers all interfaces (TUI, Desktop, Mobile). This crate contains all email logic, IMAP/SMTP clients, and data models.

## Features

- ✅ IMAP email fetching with TLS
- ✅ Timeout protection (logic-bomb prevention)
- ✅ Mock mode for testing without credentials
- ✅ Async/await with Tokio runtime
- ⏳ SMTP sending (planned)
- ⏳ Full MIME parsing (planned)

## Architecture

```
email-core/
├── src/
│   ├── lib.rs        # Public API and safe task runner
│   ├── imap.rs       # IMAP client implementation
│   ├── models.rs     # Data models (EmailPreview, etc.)
│   └── smtp.rs       # SMTP client (TODO)
└── Cargo.toml
```

## Usage

### As a Library

Add to your `Cargo.toml`:

```toml
[dependencies]
email-core = { path = "../email-core" }
tokio = { version = "1", features = ["full"] }
```

### Fetch Inbox

```rust
use email_core::fetch_inbox;

#[tokio::main]
async fn main() {
    match fetch_inbox().await {
        Ok(emails) => {
            for email in emails {
                println!("{}: {}", email.sender, email.subject);
            }
        }
        Err(e) => eprintln!("Error: {}", e),
    }
}
```

### Safe Task Runner

All expensive operations use the safe task runner with hard timeouts:

```rust
use email_core::run_safe_task;

#[tokio::main]
async fn main() {
    match run_safe_task().await {
        Ok(result) => println!("{}", result),
        Err(e) => eprintln!("Task timed out: {}", e),
    }
}
```

## Data Models

### EmailPreview

```rust
pub struct EmailPreview {
    pub id: u32,
    pub sender: String,
    pub subject: String,
    pub preview: String,  // First 100 chars of body
    pub date: String,
}
```

## IMAP Client

### Configuration

The IMAP client reads from environment variables or falls back to mock mode:

```rust
use email_core::imap::ImapClient;

let client = ImapClient::new();  // Reads from .env
let emails = client.fetch_inbox_previews(20).await?;
```

### Environment Variables

```bash
IMAP_DOMAIN=imap.gmail.com
IMAP_PORT=993
IMAP_USERNAME=your_email@gmail.com
IMAP_PASSWORD=your_app_password
```

### Mock Mode

If credentials are not set or invalid, the client returns mock data:

```rust
// No .env or IMAP_DOMAIN=imap.example.com
let emails = client.fetch_inbox_previews(10).await?;
// Returns 2 mock emails for testing
```

## Security

### Timeouts

All external operations have hard timeouts to prevent hanging:

```rust
use tokio::time::{timeout, Duration};

match timeout(Duration::from_secs(10), client.fetch_inbox_previews(20)).await {
    Ok(res) => res,
    Err(_) => Err("IMAP connection timed out".to_string()),
}
```

### TLS

All IMAP connections use TLS 1.2+:

```rust
use async_native_tls::TlsConnector;

let tls = TlsConnector::new();
let tls_stream = tls.connect(&domain, tcp_stream).await?;
```

## Testing

```bash
# Run tests
cargo test -p email-core

# Run tests with output
cargo test -p email-core -- --nocapture

# Test with mock data (no .env needed)
IMAP_DOMAIN=imap.example.com cargo test -p email-core
```

## Dependencies

| Crate | Purpose | Version |
|-------|---------|---------|
| `tokio` | Async runtime | 1.x |
| `serde` | Serialization | 1.x |
| `async-imap` | IMAP client | 0.11 |
| `async-native-tls` | TLS support | 0.5 |
| `mailparse` | Email parsing | 0.16 |
| `futures` | Async utilities | 0.3 |
| `thiserror` | Error handling | 2.x |
| `dotenvy` | .env file support | 0.15 |

## Extending

### Adding SMTP Support

1. Create `src/smtp.rs`:

```rust
use crate::models::Email;

pub struct SmtpClient {
    domain: String,
    port: u16,
    username: String,
    password: String,
}

impl SmtpClient {
    pub async fn send_email(&self, email: Email) -> Result<(), String> {
        // Implementation
        Ok(())
    }
}
```

2. Add to `lib.rs`:

```rust
pub mod smtp;

pub async fn send_email(to: String, subject: String, body: String) -> Result<(), String> {
    let client = smtp::SmtpClient::new();
    // ...
}
```

3. Expose via Tauri command in `desktop/src-tauri/src/lib.rs`

### Adding New Data Models

Define in `models.rs`:

```rust
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EmailBody {
    pub text: String,
    pub html: Option<String>,
    pub attachments: Vec<Attachment>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Attachment {
    pub filename: String,
    pub content_type: String,
    pub data: Vec<u8>,
}
```

## Performance

- **IMAP Connection**: ~500ms (cached)
- **Fetch 20 Emails**: ~1-2 seconds
- **Memory Usage**: ~5MB per 100 emails

## Troubleshooting

### "Login failed"

- Check credentials in `.env`
- For Gmail, use an [App Password](https://support.google.com/accounts/answer/185833)
- Verify 2FA is enabled if using App Password

### "TLS handshake failed"

- Check IMAP port (usually 993)
- Verify domain is correct
- Some corporate networks block IMAP

### "Connection timed out"

- Check firewall settings
- Increase timeout in `lib.rs`:

```rust
match timeout(Duration::from_secs(30), client.fetch_inbox_previews(20)).await {
    // ...
}
```

## Resources

- [async-imap Documentation](https://docs.rs/async-imap/)
- [IMAP RFC 3501](https://www.rfc-editor.org/rfc/rfc3501.html)
- [Tokio Tutorial](https://tokio.rs/tokio/tutorial)

# Native Email

A cross-platform email client built with **Rust**, **Tauri v2**, **React**, and **TypeScript**, designed to run everywhere: Desktop (macOS, Windows, Linux), Mobile (iOS, Android), and Terminal (TUI).

## 🌟 Features

- **Apple-Inspired UI/UX**: Follows [Apple's Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines) with glassmorphism, gradients, and smooth animations
- **Cross-Platform**: Single codebase for Desktop, Mobile, and TUI
- **Secure**: Built-in logic-bomb protection with safe timeouts on all external operations
- **IMAP Support**: Fetch emails from any IMAP provider (Gmail, Outlook, ProtonMail, etc.)
- **Modern Stack**: Rust core for performance and safety, React for beautiful UI

## 📁 Project Structure

```
email/
├── email-core/          # 🦀 Shared Rust library
│   ├── src/
│   │   ├── lib.rs       # Core logic and safe task runner
│   │   ├── imap.rs      # IMAP client implementation
│   │   └── models.rs    # Data models (Email, etc.)
│   └── Cargo.toml
├── tui/                 # 💻 Terminal interface (Ratatui)
│   ├── src/
│   │   └── main.rs
│   └── Cargo.toml
├── desktop/             # 🖥️ Tauri v2 Desktop + Mobile App
│   ├── src/             # React frontend
│   │   ├── App.tsx      # Main UI component
│   │   ├── index.css    # Apple-style design system
│   │   └── main.tsx
│   ├── src-tauri/       # Rust backend for Tauri
│   │   ├── src/
│   │   │   └── lib.rs   # Tauri commands
│   │   ├── gen/         # Generated mobile projects
│   │   │   ├── android/ # Android Studio project
│   │   │   └── ios/     # Xcode project (macOS only)
│   │   ├── tauri.conf.json
│   │   └── Cargo.toml
│   └── package.json
└── Cargo.toml           # Workspace configuration
```

## 🚀 Getting Started

### Prerequisites

- **Rust** (1.70+): Install from [rustup.rs](https://rustup.rs/)
- **Node.js** (18+): Install from [nodejs.org](https://nodejs.org/)
- **npm** or **yarn**
- **Git**

#### For Android Development:
- **Android Studio** or Android NDK (installed automatically via Tauri CLI)
- **Java JDK** (11+)

#### For iOS Development:
- **Xcode** (macOS only)
- **Xcode Command Line Tools**: `xcode-select --install`

### Installation

```bash
# Clone the repository
git clone https://github.com/brentmzey/native-email.git
cd email

# Install dependencies
cd desktop && npm install && cd ..
```

## 🏃 Running the App

### Terminal UI (TUI)

The fastest way to try the email client:

```bash
cargo run -p tui
```

Press `q` to quit.

### Desktop App (macOS, Windows, Linux)

```bash
cd desktop
npm run tauri dev
```

This will:
1. Build the Rust backend
2. Start the Vite dev server
3. Launch the native window

### Mobile Apps

#### Android

```bash
cd desktop
npm run tauri android dev
```

This will open the app in an Android emulator or connected device.

#### iOS (macOS only)

```bash
cd desktop
npm run tauri ios dev
```

This will open the app in Xcode Simulator.

## ⚙️ Configuration

### Email Settings

Create a `.env` file in the **root directory** with your IMAP credentials:

```env
IMAP_DOMAIN=imap.gmail.com
IMAP_PORT=993
IMAP_USERNAME=your_email@gmail.com
IMAP_PASSWORD=your_app_password
```

> **Note for Gmail Users**: You'll need to create an [App Password](https://support.google.com/accounts/answer/185833) instead of using your regular password.

#### Popular IMAP Servers:

| Provider | Domain | Port |
|----------|--------|------|
| Gmail | `imap.gmail.com` | 993 |
| Outlook | `outlook.office365.com` | 993 |
| iCloud | `imap.mail.me.com` | 993 |
| Yahoo | `imap.mail.yahoo.com` | 993 |
| ProtonMail | `127.0.0.1` (via Bridge) | 1143 |

### Mock Mode

If no `.env` file is present or credentials are invalid, the app runs in **mock mode** with sample emails.

## 🔨 Building for Production

### Desktop

```bash
cd desktop
npm run tauri build
```

This generates platform-specific installers:
- **macOS**: `.dmg` and `.app` in `desktop/src-tauri/target/release/bundle/`
- **Windows**: `.exe` and `.msi` in `desktop/src-tauri/target/release/bundle/`
- **Linux**: `.AppImage`, `.deb`, and `.rpm` in `desktop/src-tauri/target/release/bundle/`

### Android

```bash
cd desktop
npm run tauri android build
```

Output: `.apk` and `.aab` files in `desktop/src-tauri/gen/android/app/build/outputs/`

### iOS

```bash
cd desktop
npm run tauri ios build
```

Output: `.ipa` file for App Store submission.

## 🧪 Testing

```bash
# Test the core library
cargo test -p email-core

# Test the entire workspace
cargo test --workspace

# Build all targets to ensure no errors
cargo build --workspace
```

## 🎨 Design Philosophy

This project strictly follows:
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines)
- [Apple Design Tips](https://developer.apple.com/design/tips/)

Key design principles:
- **Clarity**: Text is legible, icons are precise
- **Deference**: The content is the star
- **Depth**: Visual layers and realistic motion provide hierarchy

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Core Logic** | Rust (email-core) |
| **IMAP** | async-imap + tokio |
| **TLS** | async-native-tls |
| **TUI** | Ratatui + Crossterm |
| **Desktop/Mobile** | Tauri v2 |
| **Frontend** | React + TypeScript |
| **Styling** | Tailwind CSS v4 (@tailwindcss/postcss) |
| **Build** | Vite |

## 📚 Development Workflow

### Adding a New Feature

1. **Core Logic**: Implement in `email-core/src/`
2. **TUI**: Add UI in `tui/src/main.rs`
3. **Tauri Command**: Expose via `desktop/src-tauri/src/lib.rs`
4. **React UI**: Build interface in `desktop/src/App.tsx`

### Hot Reload

All platforms support hot reload during development:
- **TUI**: Re-run `cargo run -p tui`
- **Desktop**: Vite + Tauri auto-reload
- **Mobile**: Same as desktop (some changes require rebuild)

## 🔒 Security

- **Timeouts**: All external operations (IMAP, SMTP) have hard timeouts (10s)
- **TLS**: All email connections use TLS 1.2+
- **No Storage**: Credentials are loaded from environment variables only
- **Sandboxed**: Tauri runs with minimal permissions

## 🚧 Roadmap

See [CHANGELOG.md](CHANGELOG.md) for detailed roadmap.

- [x] IMAP inbox fetching
- [x] TUI interface
- [x] Desktop app with Apple-style UI
- [x] Android support
- [ ] iOS support (initialized, needs testing)
- [ ] SMTP email sending
- [ ] Full email body parsing (MIME)
- [ ] Offline mode with local caching
- [ ] Multiple account support
- [ ] Search and filters
- [ ] Attachments
- [ ] Dark mode toggle (currently auto-detects system preference)

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - See [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- [Tauri](https://tauri.app/) - Amazing cross-platform framework
- [Ratatui](https://ratatui.rs/) - Beautiful terminal UIs
- [async-imap](https://github.com/async-email/async-imap) - Async IMAP client
- Apple's HIG - Design inspiration

---

**Made with ❤️ by [Brent](https://github.com/brentmzey)**

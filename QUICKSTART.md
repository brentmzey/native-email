# ⚡ Quick Start Guide

## Running the App (3 Options)

### 1️⃣ Desktop App (Recommended)

The beautiful GUI with Apple-inspired design:

```bash
cd desktop
npm run tauri dev
```

That's it! The app will open in a native window.

**What you'll see:**
- Beautiful 3-panel email interface
- Mock emails (Apple, GitHub, Mom)
- Smooth animations and gradients
- Dark mode support (auto-detects system)

---

### 2️⃣ Terminal UI (TUI)

Fast, lightweight terminal interface:

```bash
cargo run -p tui
```

Press `q` to quit.

**What you'll see:**
- Email list in your terminal
- Clean, minimal layout
- Same mock emails

---

### 3️⃣ Mobile (Android)

Run on Android emulator or device:

```bash
cd desktop
npm run tauri android dev
```

**First time?** You'll need:
- Android Studio or Android SDK
- Java JDK 11+
- USB debugging enabled (for physical device)

---

## Using Real Email (Optional)

### Step 1: Get Gmail App Password

1. Go to https://myaccount.google.com/apppasswords
2. Generate a password for "Mail"
3. Copy the 16-character password

### Step 2: Create `.env` File

In the **root directory** (not `desktop/`), create `.env`:

```env
IMAP_DOMAIN=imap.gmail.com
IMAP_PORT=993
IMAP_USERNAME=your_email@gmail.com
IMAP_PASSWORD=your_app_password_here
```

### Step 3: Restart the App

```bash
cd desktop
npm run tauri dev
```

Now you'll see your real emails! 📧

---

## Troubleshooting

### "npm: command not found"

Install Node.js: https://nodejs.org/

```bash
# Verify installation
node --version
npm --version
```

### "cargo: command not found"

Install Rust: https://rustup.rs/

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env

# Verify installation
cargo --version
```

### "Error: port 1420 already in use"

Another instance is running. Close it or:

```bash
# Kill the process
lsof -ti:1420 | xargs kill -9

# Then restart
cd desktop && npm run tauri dev
```

### Desktop app window is blank

```bash
# Clear cache and rebuild
cd desktop
rm -rf node_modules dist
npm install
npm run build
npm run tauri dev
```

### "IMAP connection failed"

Check your `.env` file:
- ✅ File is in the **root** directory (same level as `Cargo.toml`)
- ✅ No spaces around `=`
- ✅ Using App Password, not regular password
- ✅ Gmail 2FA is enabled

Test with mock mode first:
```bash
# No .env file needed - uses mock data
cd desktop && npm run tauri dev
```

---

## Common Tasks

### Build for Production

```bash
cd desktop
npm run tauri build
```

Output: `desktop/src-tauri/target/release/bundle/`

### Run Tests

```bash
cargo test --workspace
```

### Check Everything Builds

```bash
cargo build --workspace
```

---

## Development

### Hot Reload

Changes to React/TypeScript auto-reload.

Changes to Rust require restart:
1. Stop the app (Ctrl+C)
2. Run `npm run tauri dev` again

### View Logs

**Desktop:**
- macOS: `~/Library/Logs/com.brentzey.desktop/`
- Windows: `%APPDATA%\com.brentzey.desktop\logs\`
- Linux: `~/.local/share/com.brentzey.desktop/logs/`

**Console:**
Open DevTools in the app: `Cmd+Option+I` (Mac) or `Ctrl+Shift+I` (Windows/Linux)

---

## Next Steps

- 📖 Read [README.md](README.md) for full documentation
- 🐛 Report issues: https://github.com/brentmzey/native-email/issues
- 💡 Add features: Check [CHANGELOG.md](CHANGELOG.md) roadmap

---

**Need help?** Open an issue on GitHub!

**Enjoying the app?** ⭐ Star the repo!

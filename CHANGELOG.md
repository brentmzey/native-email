# Changelog

All notable changes to Native Email will be documented in this file.

## [Unreleased]

### Added
- ✅ IMAP email fetching with TLS support
- ✅ Beautiful Apple-inspired UI with glassmorphism
- ✅ Color-coded avatar bubbles with consistent hashing
- ✅ Star/favorite functionality
- ✅ Smooth transitions and animations
- ✅ Loading states and refresh functionality
- ✅ Terminal UI (TUI) with Ratatui
- ✅ Android support initialized
- ✅ Mock mode for testing without credentials
- ✅ Comprehensive documentation (README files)

### UI Enhancements (Latest)
- Gradient backgrounds and buttons
- Backdrop blur effects (glassmorphism)
- Enhanced typography with better hierarchy
- Action buttons (Reply, Forward, Delete)
- Improved spacing and rounded corners
- Beautiful empty states
- Hover animations and transform effects
- Shadow effects for depth

### Security
- Hard timeouts on all external operations (10s for IMAP)
- TLS 1.2+ for all connections
- Environment variable-based credentials (no hardcoding)
- Tauri sandboxing

## [0.1.0] - 2026-01-16

### Added
- Initial project setup
- Rust workspace with email-core, tui, and desktop
- Tauri v2 desktop application
- React + TypeScript frontend
- Tailwind CSS v4 with Apple design system
- Basic IMAP client implementation
- Safe task runner with timeout protection

### Technical Stack
- **Core**: Rust (email-core)
- **TUI**: Ratatui + Crossterm
- **Desktop/Mobile**: Tauri v2
- **Frontend**: React + TypeScript
- **Styling**: Tailwind CSS v4
- **Build**: Vite
- **IMAP**: async-imap + tokio
- **TLS**: async-native-tls

## Roadmap

### Near Term (v0.2.0)
- [ ] SMTP email sending
- [ ] Full email body parsing (MIME)
- [ ] iOS support (currently initialized, needs testing)
- [ ] Compose email UI
- [ ] Reply and forward functionality

### Medium Term (v0.3.0)
- [ ] Multiple account support
- [ ] Offline mode with local caching
- [ ] Search functionality
- [ ] Email filters and rules
- [ ] Attachments support
- [ ] Rich text editor

### Long Term (v1.0.0)
- [ ] End-to-end encryption option
- [ ] Calendar integration
- [ ] Contact management
- [ ] Unified inbox
- [ ] Push notifications
- [ ] macOS/iOS App Store submission
- [ ] Google Play Store submission

## Version History

| Version | Date | Notes |
|---------|------|-------|
| 0.1.0 | 2026-01-16 | Initial release with IMAP, TUI, and beautiful UI |

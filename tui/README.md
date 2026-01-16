# Terminal UI (TUI)

A beautiful terminal interface for Native Email, built with **Ratatui** and **Crossterm**.

## Features

- 📧 View inbox directly in your terminal
- ⚡ Fast and lightweight
- 🎨 Clean, minimal design
- ⌨️ Keyboard-driven navigation
- 🔄 Live email fetching

## Running

```bash
# From project root
cargo run -p tui

# With mock data (no .env needed)
IMAP_DOMAIN=imap.example.com cargo run -p tui

# With custom config
IMAP_DOMAIN=imap.gmail.com \
IMAP_USERNAME=you@gmail.com \
IMAP_PASSWORD=your_app_password \
cargo run -p tui
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `q` | Quit |
| `↑`/`↓` | Navigate emails (planned) |
| `Enter` | Open email (planned) |
| `r` | Refresh inbox (planned) |

## UI Layout

```
┌─────────────────────────────────────────┐
│ Native Email TUI                         │
├─────────────────────────────────────────┤
│                                          │
│  [DATE] [SENDER] [SUBJECT]               │
│  10:30 AM  Apple  Your Receipt           │
│  Yesterday GitHub [GitHub] Security...   │
│  Friday    Mom    Dinner?                │
│                                          │
├─────────────────────────────────────────┤
│ Status: Inbox Updated                    │
└─────────────────────────────────────────┘
```

## Dependencies

- **ratatui**: Terminal UI framework
- **crossterm**: Cross-platform terminal manipulation
- **tokio**: Async runtime
- **email-core**: Shared email logic

## Development

### Adding Interactive Features

Currently the TUI displays emails but doesn't support interaction. To add:

1. **State Management**:

```rust
struct App {
    emails: Vec<EmailPreview>,
    selected_index: usize,
    status: String,
}
```

2. **Input Handling**:

```rust
match key.code {
    KeyCode::Char('q') => break,
    KeyCode::Up => {
        if selected_index > 0 {
            selected_index -= 1;
        }
    }
    KeyCode::Down => {
        if selected_index < emails.len() - 1 {
            selected_index += 1;
        }
    }
    KeyCode::Enter => {
        // Open email detail view
    }
    _ => {}
}
```

3. **Highlighting**:

```rust
let list = List::new(items)
    .block(Block::default().title("Inbox").borders(Borders::ALL))
    .highlight_style(Style::default()
        .bg(Color::Blue)
        .add_modifier(Modifier::BOLD));
```

### Custom Themes

Edit colors in `main.rs`:

```rust
let header = Paragraph::new("Native Email TUI")
    .style(Style::default()
        .fg(Color::Cyan)  // Change to Color::Green, Color::Yellow, etc.
        .add_modifier(Modifier::BOLD));
```

## Performance

- **Startup**: < 100ms
- **Memory**: ~3MB
- **Refresh**: ~1-2 seconds (depending on IMAP server)

## Troubleshooting

### "Terminal too small"

Minimum size: 80x24 characters. Resize your terminal or add size checking:

```rust
let size = f.size();
if size.width < 80 || size.height < 24 {
    let warning = Paragraph::new("Terminal too small. Minimum: 80x24")
        .style(Style::default().fg(Color::Red));
    f.render_widget(warning, size);
    return;
}
```

### Weird rendering artifacts

```bash
# Reset terminal
reset

# Or clear screen before running
clear && cargo run -p tui
```

### Colors not showing

Some terminals don't support full color. Try:

```bash
# Check terminal capabilities
echo $TERM

# Force 256 colors
TERM=xterm-256color cargo run -p tui
```

## Future Enhancements

- [ ] Email navigation (↑/↓)
- [ ] Email detail view
- [ ] Compose new email
- [ ] Reply/Forward
- [ ] Search
- [ ] Multiple mailboxes (Sent, Drafts, etc.)
- [ ] Configuration file (~/.native-email/config.toml)
- [ ] Mouse support

## Resources

- [Ratatui Documentation](https://ratatui.rs/)
- [Ratatui Examples](https://github.com/ratatui-org/ratatui/tree/main/examples)
- [Crossterm Docs](https://docs.rs/crossterm/)

use email_core::fetch_inbox;
use ratatui::{
    backend::CrosstermBackend,
    layout::{Constraint, Direction, Layout},
    style::{Color, Modifier, Style},
    widgets::{Block, Borders, List, ListItem, Paragraph},
    Terminal,
};
use crossterm::{
    event::{self, DisableMouseCapture, EnableMouseCapture, Event, KeyCode},
    execute,
    terminal::{disable_raw_mode, enable_raw_mode, EnterAlternateScreen, LeaveAlternateScreen},
};
use std::{io, time::Duration};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Setup terminal
    enable_raw_mode()?;
    let mut stdout = io::stdout();
    execute!(stdout, EnterAlternateScreen, EnableMouseCapture)?;
    let backend = CrosstermBackend::new(stdout);
    let mut terminal = Terminal::new(backend)?;

    // State
    let mut emails = Vec::new();
    let mut status = "Loading...".to_string();

    // Initial Fetch
    match fetch_inbox().await {
        Ok(e) => {
            emails = e;
            status = "Inbox Updated".to_string();
        }
        Err(e) => {
            status = format!("Error: {}", e);
        }
    }

    loop {
        terminal.draw(|f| {
            let chunks = Layout::default()
                .direction(Direction::Vertical)
                .margin(1)
                .constraints(
                    [
                        Constraint::Length(3), // Header
                        Constraint::Min(0),    // List
                        Constraint::Length(3), // Status
                    ]
                    .as_ref(),
                )
                .split(f.size());

            let header = Paragraph::new("Native Email TUI")
                .style(Style::default().fg(Color::Cyan).add_modifier(Modifier::BOLD))
                .block(Block::default().borders(Borders::ALL));
            f.render_widget(header, chunks[0]);

            let items: Vec<ListItem> = emails
                .iter()
                .map(|e| {
                    ListItem::new(format!("{} | {} | {}", e.date, e.sender, e.subject))
                })
                .collect();

            let list = List::new(items)
                .block(Block::default().title("Inbox").borders(Borders::ALL))
                .highlight_style(Style::default().add_modifier(Modifier::ITALIC));
            f.render_widget(list, chunks[1]);

            let footer = Paragraph::new(status.as_str())
                .style(Style::default().fg(Color::Gray))
                .block(Block::default().borders(Borders::ALL));
            f.render_widget(footer, chunks[2]);
        })?;

        if crossterm::event::poll(Duration::from_millis(200))? {
            if let Event::Key(key) = event::read()? {
                if let KeyCode::Char('q') = key.code {
                    break;
                }
            }
        }
    }

    // Restore terminal
    disable_raw_mode()?;
    execute!(
        terminal.backend_mut(),
        LeaveAlternateScreen,
        DisableMouseCapture
    )?;
    terminal.show_cursor()?;

    Ok(())
}

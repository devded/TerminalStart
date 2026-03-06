# ~/CSir.info — future ideas

## widgets for index.html

- `todo.md` — inline checklist persisted to localStorage, resets or carries over daily
- `habit.sh` — daily habit tracker with checkboxes, streak counter, resets at midnight
- `countdown.sh` — multiple named countdowns (deadlines, events), days/hours remaining
- `uptime.sh` — ping a list of your sites/services, show green/red status dots
- `notes.sh` — single-line quick-capture scratchpad, saves to localStorage
- `motd.sh` — message of the day, rotates from a curated local list or a quote API
- `wttr.sh` — ASCII-art weather via wttr.in plain-text API (fits the terminal look perfectly)
- `dict.sh` — inline word definition lookup without leaving the page
- `ip.sh` — public IP, ISP, rough location — handy on a start page
- `spotify.fm` — now playing via Last.fm API (no auth, just a username)
- search engine switcher in `search.ai` — toggle DDG / Google / Kagi / Perplexity with a keybind

## new pages

- `bookmarks.html` — curated link board, keyboard-navigable, localStorage with JSON import/export
- `pomodoro.html` — focus timer in TUI style, session history
- `journal.html` — daily log entries keyed by date in localStorage, browsable by day

## quality-of-life improvements

- keyboard shortcuts on `index.html` — `/` focuses search, `r` goes to routine, `p` goes to browserpad
- export/import for browserpad — download `.txt` or upload a file into the current tab
- theme switcher — cycle color palettes (purple, green terminal, amber retro), saved to localStorage
- `feed.rss` read state — mark items as read, persist across sessions
- `standup.md` widget — yesterday / today / blockers template, auto-clears each morning

## visual / ambient

- boot sequence animation on page load — brief fake terminal init text before UI appears
- matrix rain or scanline CSS overlay as subtle background (toggle on/off)
- `history.sh` — track which links.href links you clicked and when, show recency

## meta / pwa

- `manifest.json` + service worker — make the whole thing installable as a PWA, works offline

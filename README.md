# Books

A minimal personal book tracker. Add books to a Google Sheet by entering an ISBN — metadata auto-fills from the Google Books API.

## Setup

```bash
npm install
```

Create `src/config.js` from the template:

```bash
cp src/config.example.js src/config.js
```

Then fill in your values:

| Variable | Where to get it |
|---|---|
| `CLIENT_ID` | [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials → OAuth 2.0 Client ID (Web application). Add `http://localhost:5173` to Authorized JavaScript origins. |
| `SPREADSHEET_ID` | Create a Google Sheet, copy the ID from the URL (`https://docs.google.com/spreadsheets/d/{ID}/edit`). Must have a tab named `books`. |
| `BOOKS_API_KEY` | Google Cloud Console → APIs & Services → Credentials → API Key. Enable the Books API for the project. |

The Sheet's `books` tab expects columns: isbn, title, author, cover_url, pages, genre, status, date_added, date_finished, rating, notes.

Status values: `want` | `reading` | `read`

## Run

```bash
npm run dev
```

Sign in with Google, enter an ISBN, and the rest fills itself.

## Stack

Vite + Preact + @preact/signals, hand-authored CSS, Google Sheets as database.

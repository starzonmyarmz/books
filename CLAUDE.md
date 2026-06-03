# Books

## Project
- Vite + Preact + @preact/signals
- Hand-authored CSS
- Minimal AI-generated code — prefer writing your own

## Conventions
- No semicolons
- Double quotes
- Formatted with Prettier

## Architecture

### Data flow
1. Sign in with Google OAuth → OAuth token stored in `auth.js` signal
2. Enter ISBN → `books.js` looks up metadata via Google Books API
3. Form submit → `sheets.js` appends row to Google Sheet

### Key modules
- `auth.js` — Google Identity Services OAuth (token client)
- `sheets.js` — Google Sheets v4 API (appendRow, getRows)
- `books.js` — Google Books API v1 (lookupISBN)
- `config.js` — gitignored; holds CLIENT_ID, SPREADSHEET_ID, BOOKS_API_KEY

### Component tree
- `SignInPage` — shown when not signed in
- `Bookshelf` — main form + (future) shelf view

### State
- Module-level signals for auth: `token`, `isSignedIn`
- Component-level `useSignal()` for form fields
- `useRef()` for debounce timers

### Google Sheet schema (`books` tab)
isbn, title, author, cover_url, pages, genre, status, date_added, date_finished, rating, notes

### APIs (no auth needed for reads)
- Google Books: `GET https://www.googleapis.com/books/v1/volumes?q=isbn:{ISBN}&key={API_KEY}`
- Open Library covers: `https://covers.openlibrary.org/b/isbn/{ISBN}-M.jpg`

### Barcode scanning (planned)
`@zxing/browser` for EAN-13 ISBN scanning via camera.

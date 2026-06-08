import { useSignal } from "@preact/signals"
import { useRef } from "preact/hooks"

import { MissingBook } from "./MissingBook.jsx"

import { appendRow, getRows } from "../sheets.js"
import { coverURL, lookupISBN } from "../books.js"

export function BookForm({ onClose }) {
  const isbn = useSignal("")
  const title = useSignal("")
  const author = useSignal("")
  const pages = useSignal("")
  const genre = useSignal("")
  const status = useSignal("want")
  const rating = useSignal("")
  const saved = useSignal(false)
  const loading = useSignal(false)
  const googleId = useSignal("")
  const lookupTimer = useRef(null)

  function handleISBNInput(e) {
    isbn.value = e.currentTarget.value

    if (lookupTimer.current) clearTimeout(lookupTimer.current)

    lookupTimer.current = setTimeout(() => {
      const raw = isbn.value.trim()
      if (!raw) return
      doLookup(raw)
    }, 600)
  }

  function handleISBNBlur() {
    if (lookupTimer.current) {
      clearTimeout(lookupTimer.current)
      lookupTimer.current = null
    }
    const raw = isbn.value.trim()
    if (raw) doLookup(raw)
  }

  async function doLookup(raw) {
    loading.value = true

    try {
      const book = await lookupISBN(raw)
      if (!book) return

      title.value = book.title
      author.value = book.authors
      pages.value = book.pages
      genre.value = book.genre
      googleId.value = book.google_id
    } catch {
      // silently ignore lookup failures
    } finally {
      loading.value = false
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()

    saved.value = false

    try {
      const now = new Date().toISOString().split("T")[0]

      await appendRow("books", [
        isbn.value,
        title.value,
        author.value,
        googleId.value,
        pages.value,
        genre.value,
        status.value,
        now,
        "",
        rating.value || "",
        "",
      ])

      saved.value = true
      isbn.value = ""
      title.value = ""
      author.value = ""
      pages.value = ""
      genre.value = ""
      status.value = "want"
      rating.value = ""
      googleId.value = ""

      onClose()
    } catch (err) {
      alert("Failed to save: " + err.message)
    }
  }

  return (
    <dialog open class="bookform">
      <form onSubmit={handleSubmit} class="bookform-content">
        {googleId.value ? (
          <img
            src={coverURL(googleId.value, 2)}
            alt={`Cover of ${title}`}
            class="bookdetail-cover"
            loading="lazy"
          />
        ) : (
          <MissingBook />
        )}

        <div class="bookdetail-info">
          <h2>Add a Book</h2>

          <div class="fields">
            <div class="field">
              <label>ISBN</label>
              <input
                type="text"
                value={isbn}
                onInput={handleISBNInput}
                onBlur={handleISBNBlur}
                placeholder="978..."
              />
              {loading.value && <p class="hint">Looking up ISBN…</p>}
            </div>

            <div class="field">
              <label for="title">Title</label>
              <input
                type="text"
                id="title"
                value={title}
                onInput={(e) => (title.value = e.currentTarget.value)}
                placeholder="Book title"
              />
            </div>

            <div class="field">
              <label for="author">Author</label>
              <input
                type="text"
                id="author"
                value={author}
                onInput={(e) => (author.value = e.currentTarget.value)}
                placeholder="Author name"
              />
            </div>

            <div class="field">
              <label for="genre">Genre</label>
              <input
                type="text"
                id="genre"
                value={genre}
                onInput={(e) => (genre.value = e.currentTarget.value)}
                placeholder="Fiction, non-fiction, etc."
              />
            </div>

            <div class="field">
              <label for="status">Status</label>
              <select
                id="status"
                value={status}
                onChange={(e) => (status.value = e.currentTarget.value)}
              >
                <option value="want">Want to Read</option>
                <option value="read">Read</option>
              </select>
            </div>

            <div class="field">
              <label for="rating">Rating (1-5)</label>
              <input
                type="number"
                id="rating"
                min="1"
                max="5"
                value={rating}
                onInput={(e) => (rating.value = e.currentTarget.value)}
                placeholder=""
              />
            </div>
          </div>

          <div class="field-actions">
            <button class="btn" type="submit">
              Save book
            </button>
            <button class="btn" onClick={onClose}>
              Cancel
            </button>
          </div>

          {saved.value && <p class="saved-msg">Saved!</p>}
        </div>
      </form>
    </dialog>
  )
}

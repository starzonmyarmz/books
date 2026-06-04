import { useSignal, useSignalEffect } from "@preact/signals"
import { useRef } from "preact/hooks"
import { appendRow, getRows } from "../sheets.js"
import { lookupISBN } from "../books.js"

export function Form({ showForm }) {
  const isbn = useSignal("")
  const title = useSignal("")
  const author = useSignal("")
  const pages = useSignal("")
  const genre = useSignal("")
  const status = useSignal("want")
  const rating = useSignal("")
  const saved = useSignal(false)
  const loading = useSignal(false)
  const cover = useSignal("")
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
      cover.value = book.cover
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
        "",
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
      cover.value = ""

      showForm.value = !showForm.value
    } catch (err) {
      alert("Failed to save: " + err.message)
    }
  }

  return (
    <form onSubmit={handleSubmit} id="book-form">
      <h2>Add a Book</h2>

      {cover.value && <img src={cover.value} alt="" class="cover-preview" />}

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
          <label for="pages">Pages</label>
          <input
            type="number"
            id="pages"
            value={pages}
            onInput={(e) => (pages.value = e.currentTarget.value)}
            placeholder="Pages"
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
            <option value="reading">Reading</option>
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

        <button class="btn" type="submit">
          Save book
        </button>
        <button
          class="btn"
          onClick={() => {
            showForm.value = !showForm.value
          }}
        >
          Cancel
        </button>
      </div>

      {saved.value && <p class="saved-msg">Saved!</p>}
    </form>
  )
}

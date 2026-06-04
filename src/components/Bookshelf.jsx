import { useSignal, useSignalEffect } from "@preact/signals"
import { useRef } from "preact/hooks"
import { appendRow, getRows } from "../sheets.js"
import { lookupISBN } from "../books.js"

export function Bookshelf() {
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
  const rows = useSignal(null)
  const lookupTimer = useRef(null)

  useSignalEffect(() => {
    getRows("books")
      .then((data) => {
        const values = data.values

        if (!values || values.length < 2) {
          rows.value = []
          return
        }

        const headers = values[0]

        rows.value = values
          .slice(1)
          .map((row) =>
            Object.fromEntries(headers.map((h, i) => [h, row[i] ?? ""])),
          )
      })
      .catch(() => {})
  })

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
    } catch (err) {
      alert("Failed to save: " + err.message)
    }
  }

  return (
    <main id="book-list">
      <header>
        <h1>My Books</h1>
      </header>

      <section>
        {rows.value ? (
          <table class="table">
            <thead>
              <tr>
                <th></th>
                <th>Title</th>
                <th>Author</th>
                <th>Genre</th>
                <th>Added</th>
              </tr>
            </thead>
            <tbody>
              {rows.value.map(
                ({ isbn, title, author, genre, status, date_added }) => (
                  <tr key={isbn}>
                    <td>
                    </td>
                    <th>{title}</th>
                    <td>{author}</td>
                    <td>{genre}</td>
                    <td>{date_added}</td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        ) : (
          <p>Loading books…</p>
        )}
      </section>

      <form onSubmit={handleSubmit} class="book-form">
        <h2>Add a Book</h2>

        <label>ISBN</label>
        <input
          type="text"
          value={isbn}
          onInput={handleISBNInput}
          onBlur={handleISBNBlur}
          placeholder="978..."
        />
        {loading.value && <p class="hint">Looking up ISBN…</p>}
        {cover.value && <img src={cover.value} alt="" class="cover-preview" />}

        <label>Title</label>
        <input
          type="text"
          value={title}
          onInput={(e) => (title.value = e.currentTarget.value)}
          placeholder="Book title"
        />

        <label>Author</label>
        <input
          type="text"
          value={author}
          onInput={(e) => (author.value = e.currentTarget.value)}
          placeholder="Author name"
        />

        <label>Pages</label>
        <input
          type="number"
          value={pages}
          onInput={(e) => (pages.value = e.currentTarget.value)}
          placeholder="Pages"
        />

        <label>Genre</label>
        <input
          type="text"
          value={genre}
          onInput={(e) => (genre.value = e.currentTarget.value)}
          placeholder="Fiction, non-fiction, etc."
        />

        <label>Status</label>
        <select
          value={status}
          onChange={(e) => (status.value = e.currentTarget.value)}
        >
          <option value="want">Want to Read</option>
          <option value="reading">Reading</option>
          <option value="read">Read</option>
        </select>

        <label>Rating (1-5)</label>
        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onInput={(e) => (rating.value = e.currentTarget.value)}
          placeholder=""
        />

        <button class="btn" type="submit">
          Save to Sheet
        </button>

        {saved.value && <p class="saved-msg">Saved!</p>}
      </form>
    </main>
  )
}

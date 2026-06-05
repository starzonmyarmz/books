import { useSignal, useSignalEffect } from "@preact/signals"
import { getRows } from "../sheets.js"

import { Form } from "./Form.jsx"
import { BookDetail } from "./BookDetail.jsx"

export function Bookshelf() {
  const rows = useSignal(null)
  const showForm = useSignal(false)
  const filterStatus = useSignal("read")
  const filterGenre = useSignal("")
  const selectedBook = useSignal(null)

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

  return (
    <main id="book-list">
      <header>
        <h1>My Books</h1>

        {!showForm.value && (
          <>
            <div id="filters">
              <select
                value={filterStatus.value}
                onChange={(e) => (filterStatus.value = e.target.value)}
              >
                <button>
                  <selectedcontent></selectedcontent>
                </button>

                <option value="read">Read</option>
                <option value="want">Want to Read</option>
              </select>

              <select
                value={filterGenre.value}
                onChange={(e) => (filterGenre.value = e.target.value)}
              >
                <option value="">Any genre</option>
                <option value="one">one</option>
                <option value="two">two</option>
                <option value="three">three</option>
              </select>
            </div>

            <button
              class="btn"
              onClick={() => {
                showForm.value = !showForm.value
              }}
            >
              Add book
            </button>
          </>
        )}
      </header>

      {showForm.value && (
        <section>
          <Form showForm={showForm} />
        </section>
      )}

      {selectedBook.value && (
        <BookDetail
          book={selectedBook.value}
          onClose={() => {
            selectedBook.value = null
          }}
        />
      )}

      {!selectedBook.value && !showForm.value && (
        <section id="bookshelf">
          {rows.value ? (
            <>
              {rows.value.map((book, i) => {
                const hidden =
                  (filterStatus.value && book.status !== filterStatus.value) ||
                  (filterGenre.value && book.genre !== filterGenre.value)
                return (
                  <button
                    key={i}
                    class="book"
                    hidden={hidden}
                    onClick={() => {
                      selectedBook.value = book
                    }}
                  >
                    {book.cover_url ? (
                      <img
                        src={`${book.cover_url}&zoom=1`}
                        alt={`Cover of ${book.title}`}
                        class="book-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div class="book-cover">placeholder</div>
                    )}
                    <div class="book-title">{book.title}</div>
                    <div class="book-author">{book.author}</div>
                  </button>
                )
              })}
            </>
          ) : (
            <p>Loading books…</p>
          )}
        </section>
      )}
    </main>
  )
}

import { useSignal, useSignalEffect } from "@preact/signals"
import { getRows } from "../sheets.js"

import { BookForm } from "./BookForm.jsx"
import { BookDetail } from "./BookDetail.jsx"
import { MissingBook } from "./MissingBook.jsx"

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
    <main>
      <header>
        <h1>My Bookshelf</h1>

        {!showForm.value && (
          <>
            <button
              class="btn"
              id="add-book-button"
              onClick={() => {
                showForm.value = !showForm.value
              }}
            >
              Add book
            </button>

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
          </>
        )}
      </header>

      {showForm.value && <BookForm showForm={showForm} />}

      {selectedBook.value && (
        <BookDetail
          book={selectedBook.value}
          onClose={() => {
            selectedBook.value = null
          }}
        />
      )}

      {!selectedBook.value && (
        <section class="bookshelf">
          {rows.value ? (
            <>
              {rows.value.map((book, i) => {
                const hidden =
                  (filterStatus.value && book.status !== filterStatus.value) ||
                  (filterGenre.value && book.genre !== filterGenre.value)
                return (
                  <button
                    key={i}
                    class="bookshelf-book"
                    hidden={hidden}
                    onClick={() => {
                      selectedBook.value = book
                    }}
                  >
                    {book.cover_url ? (
                      <img
                        src={`${book.cover_url}&zoom=1`}
                        alt={`Cover of ${book.title}`}
                        class="bookshelf-cover"
                        loading="lazy"
                      />
                    ) : (
                      <MissingBook klass="bookshelf-cover" />
                    )}
                    <div class="bookshelf-title">{book.title}</div>
                    <div class="bookshelf-author">{book.author}</div>
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

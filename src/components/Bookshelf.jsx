import { useSignal, useSignalEffect } from "@preact/signals"
import { getRows } from "../sheets.js"

import { Form } from "./Form.jsx"
import { BookDetail } from "./BookDetail.jsx"
import { Status } from "./Status.jsx"

export function Bookshelf() {
  const rows = useSignal(null)
  const showForm = useSignal(false)
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
          <button
            class="btn"
            onClick={() => {
              showForm.value = !showForm.value
            }}
          >
            Add book
          </button>
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
                {rows.value.map((row, i) => (
                  <tr
                    key={i}
                    onClick={() => {
                      selectedBook.value = row
                    }}
                  >
                    <td>
                      <Status status={row.status} />
                    </td>
                    <th>{row.title}</th>
                    <td>{row.author}</td>
                    <td>{row.genre}</td>
                    <td>{row.date_added}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Loading books…</p>
          )}
        </section>
      )}
    </main>
  )
}

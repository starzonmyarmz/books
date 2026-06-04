import { useSignal, useSignalEffect } from "@preact/signals"
import { getRows } from "../sheets.js"

import { Form } from "./Form.jsx"
import { Status } from "./Status.jsx"

export function Bookshelf() {
  const rows = useSignal(null)
  const showForm = useSignal(false)

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

      {showForm.value ? (
        <section>
          <Form showForm={showForm} />
        </section>
      ) : (
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
                  ({ title, author, genre, status, date_added }, i) => (
                    <tr key={i}>
                      <td>
                        <Status status={status} />
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
      )}
    </main>
  )
}

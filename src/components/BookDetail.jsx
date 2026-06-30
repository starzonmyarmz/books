import { useSignal } from "@preact/signals"
import { Star, X, Pencil } from "lucide-preact"
import { BookDetailMeta } from "./BookDetailMeta.jsx"
import { MissingBook } from "./MissingBook.jsx"
import { coverURL } from "../books.js"
import { updateRow } from "../sheets.js"

export function BookDetail({ book, onClose, onSave }) {
  if (!book) return null

  const editing = useSignal(false)
  const saving = useSignal(false)
  const editTitle = useSignal(book.title)
  const editStatus = useSignal(book.status)
  const editDateAdded = useSignal(book.date_added)
  const editDateFinished = useSignal(book.date_finished)
  const editRating = useSignal(book.rating)

  const stars = Number(book.rating)
    ? [...Array(Number(book.rating))].map((_, i) => (
        <Star key={i} size={32} fill="#111" strokeWidth={0} />
      ))
    : null

  function startEditing() {
    editTitle.value = book.title
    editStatus.value = book.status
    editDateAdded.value = book.date_added
    editDateFinished.value = book.date_finished
    editRating.value = book.rating
    editing.value = true
  }

  async function handleSave(e) {
    e.preventDefault()
    saving.value = true
    try {
      const row = [
        book.isbn,
        editTitle.value,
        book.author,
        book.google_id,
        book.pages,
        book.genre,
        editStatus.value,
        editDateAdded.value,
        editDateFinished.value,
        editRating.value,
        book.notes,
      ]
      await updateRow("books", book._rowIndex, row)
      onSave({
        ...book,
        title: editTitle.value,
        status: editStatus.value,
        date_added: editDateAdded.value,
        date_finished: editDateFinished.value,
        rating: editRating.value,
      })
      editing.value = false
    } catch (err) {
      alert("Failed to save: " + err.message)
    } finally {
      saving.value = false
    }
  }

  return (
    <dialog
      open
      class="bookdetail"
      style={`--bg-url: url(${coverURL(book.google_id)})`}
    >
      <div class="bookdetail-content">
        <button class="bookdetail-close" onClick={onClose}>
          <X size={24} />
        </button>

        {book.google_id ? (
          <img
            src={coverURL(book.google_id, 2)}
            alt={`Cover of ${book.title}`}
            class="bookdetail-cover"
            loading="lazy"
            width="300"
            height="450"
          />
        ) : (
          <MissingBook klass="bookdetail-cover" />
        )}

        {editing.value ? (
          <form class="bookdetail-info" onSubmit={handleSave}>
            <div class="fields">
              <div class="field">
                <label for="edit-title">Title</label>
                <input
                  type="text"
                  id="edit-title"
                  value={editTitle}
                  onInput={(e) => (editTitle.value = e.currentTarget.value)}
                />
              </div>

              <div class="field">
                <label for="edit-status">Status</label>
                <select
                  id="edit-status"
                  value={editStatus}
                  onChange={(e) => (editStatus.value = e.currentTarget.value)}
                >
                  <option value="want">Want to Read</option>
                  <option value="read">Read</option>
                </select>
              </div>

              <div class="field">
                <label for="edit-date-added">Started</label>
                <input
                  type="date"
                  id="edit-date-added"
                  value={editDateAdded}
                  onInput={(e) =>
                    (editDateAdded.value = e.currentTarget.value)
                  }
                />
              </div>

              <div class="field">
                <label for="edit-date-finished">Finished</label>
                <input
                  type="date"
                  id="edit-date-finished"
                  value={editDateFinished}
                  onInput={(e) =>
                    (editDateFinished.value = e.currentTarget.value)
                  }
                />
              </div>

              <div class="field">
                <label for="edit-rating">Rating (1–5)</label>
                <input
                  type="number"
                  id="edit-rating"
                  min="1"
                  max="5"
                  value={editRating}
                  onInput={(e) => (editRating.value = e.currentTarget.value)}
                />
              </div>
            </div>

            <div class="field-actions">
              <button class="btn" type="submit" disabled={saving.value}>
                {saving.value ? "Saving…" : "Save"}
              </button>
              <button
                class="btn"
                type="button"
                onClick={() => (editing.value = false)}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div class="bookdetail-info">
            <h2 class="bookdetail-title">{book.title}</h2>
            <h3 class="bookdetail-author">{book.author}</h3>

            <ul class="bookdetail-genre">{book.genre}</ul>

            <div class="bookdetail-meta">
              <BookDetailMeta title="Status" data={book.status} />
              <BookDetailMeta title="Added" data={book.date_added} />
              <BookDetailMeta title="Finished" data={book.date_finished} />
              <BookDetailMeta title="Rating" data={stars} />

              {book.notes && (
                <div>
                  <h4 class="bookdetail-meta-title">Notes</h4>
                  <p class="bookdetail-meta-content">{book.notes}</p>
                </div>
              )}
            </div>

            <button class="btn bookdetail-edit" onClick={startEditing}>
              <Pencil size={16} />
              Edit
            </button>
          </div>
        )}
      </div>
    </dialog>
  )
}

import { Status } from "./Status.jsx"

export function BookDetail({ book, onClose }) {
  if (!book) return null

  return (
    <section class="book-detail">
      <header>
        <h2>{book.title}</h2>
        <button class="btn" onClick={onClose}>
          Back
        </button>
      </header>

      {book.cover_url && (
        <img
          src={`${book.cover_url}&zoom=3`}
          alt={`Cover of ${book.title}`}
          class="cover-large"
        />
      )}

      <dl class="detail-grid">
        {book.isbn && (
          <>
            <dt>ISBN</dt>
            <dd>{book.isbn}</dd>
          </>
        )}
        {book.author && (
          <>
            <dt>Author</dt>
            <dd>{book.author}</dd>
          </>
        )}
        {book.pages && (
          <>
            <dt>Pages</dt>
            <dd>{book.pages}</dd>
          </>
        )}
        {book.genre && (
          <>
            <dt>Genre</dt>
            <dd>{book.genre}</dd>
          </>
        )}
        {book.status && (
          <>
            <dt>Status</dt>
            <dd>
              <Status status={book.status} />
            </dd>
          </>
        )}
        {book.date_added && (
          <>
            <dt>Date Added</dt>
            <dd>{book.date_added}</dd>
          </>
        )}
        {book.date_finished && (
          <>
            <dt>Date Finished</dt>
            <dd>{book.date_finished}</dd>
          </>
        )}
        {book.rating && (
          <>
            <dt>Rating</dt>
            <dd>{"★".repeat(Number(book.rating))}</dd>
          </>
        )}
        {book.notes && (
          <>
            <dt>Notes</dt>
            <dd>{book.notes}</dd>
          </>
        )}
      </dl>
    </section>
  )
}

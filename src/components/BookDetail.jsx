import { Star, X } from "lucide-preact"
import { BookDetailMeta } from "./BookDetailMeta.jsx"
import { MissingBook } from "./MissingBook.jsx"
import { coverURL } from "../books.js"

export function BookDetail({ book, onClose }) {
  if (!book) return null

  const rating = Number(book.rating)
    ? [...Array(Number(book.rating))].map((_, i) => (
        <Star key={i} size={32} fill="#111" strokeWidth={0} />
      ))
    : null

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

        <div class="bookdetail-info">
          <h2 class="bookdetail-title">{book.title}</h2>
          <h3 class="bookdetail-author">{book.author}</h3>

          <ul class="bookdetail-genre">{book.genre}</ul>

          <div class="bookdetail-meta">
            <BookDetailMeta title="Status" data={book.status} />
            <BookDetailMeta title="Added" data={book.date_added} />
            <BookDetailMeta title="Finished" data={book.date_finished} />
            <BookDetailMeta title="Rating" data={rating} />

            {book.notes && (
              <div>
                <h4 class="bookdetail-meta-title">Notes</h4>
                <p class="bookdetail-meta-content">{book.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </dialog>
  )
}

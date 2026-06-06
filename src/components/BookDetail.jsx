import { Star, X } from "lucide-preact"
import { BookDetailMeta } from "./BookDetailMeta.jsx"
import { MissingBook } from "./MissingBook.jsx"

export function BookDetail({ book, onClose }) {
  if (!book) return null

  const rating = Number(book.rating)
    ? [...Array(Number(book.rating))].map((_, i) => (
        <Star key={i} size={16} fill="#111" strokeWidth={0} />
      ))
    : null

  return (
    <dialog open class="bookdetail" style={`--bg-url: url(${book.cover_url})`}>
      <div class="bookdetail-content">
        <button class="bookdetail-close" onClick={onClose}>
          <X size={24} />
        </button>

        {book.cover_url ? (
          <img
            src={`${book.cover_url}&zoom=2`}
            alt={`Cover of ${book.title}`}
            class="bookdetail-cover"
            loading="lazy"
          />
        ) : (
          <MissingBook />
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

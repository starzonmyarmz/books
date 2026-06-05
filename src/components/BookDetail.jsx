import { Barcode, BookOpen, Star, BookCheck, X } from "lucide-preact"
import { Status } from "./Status.jsx"

export function BookDetail({ book, onClose }) {
  if (!book) return null

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
          <div class="bookdetail-cover">placeholder</div>
        )}

        <div class="bookdetail-info">
          <h2 class="bookdetail-title">{book.title}</h2>
          <h3 class="bookdetail-author">{book.author}</h3>

          <dl class="bookdetail-meta">
            {book.isbn && (
              <>
                <dt>
                  <Barcode size={24} />
                </dt>
                <dd>{book.isbn}</dd>
              </>
            )}
            {book.pages && (
              <>
                <dt>
                  <BookOpen size={24} />
                </dt>
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
                <dt>
                  <BookCheck size={24} />
                </dt>
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
                <dd>
                  {[...Array(Number(book.rating))].map((_, i) => (
                    <Star key={i} size={16} />
                  ))}
                </dd>
              </>
            )}
            {book.notes && (
              <>
                <dt>Notes</dt>
                <dd>{book.notes}</dd>
              </>
            )}
          </dl>
        </div>
      </div>
    </dialog>
  )
}

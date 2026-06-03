import { useEffect, useState } from "preact/hooks"
import { useSignal } from "@preact/signals"
import { initAuth, signIn, signOut, isSignedIn, user, token } from "./auth.js"
import { appendRow } from "./sheets.js"
import "./assets/app.css"

export function App() {
  const [ready, setReady] = useState(false)
  const isbn = useSignal("")
  const title = useSignal("")
  const author = useSignal("")
  const pages = useSignal("")
  const genre = useSignal("")
  const status = useSignal("want")
  const rating = useSignal("")
  const saved = useSignal(false)

  useEffect(() => {
    initAuth()
    setReady(true)
  }, [])

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
    } catch (err) {
      alert("Failed to save: " + err.message)
    }
  }

  if (!ready) return null

  return (
    <div class="app">
      <header>
        <h1>Books</h1>
        {isSignedIn.value ? (
          <div class="user-info">
            {user.value?.picture && (
              <img src={user.value.picture} alt="" class="avatar" />
            )}
            <span>{user.value?.name}</span>
            <button class="btn-outline" onClick={signOut}>
              Sign out
            </button>
          </div>
        ) : (
          <button class="btn" onClick={signIn}>
            Sign in with Google
          </button>
        )}
      </header>

      {isSignedIn.value && (
        <form onSubmit={handleSubmit} class="book-form">
          <h2>Add a Book</h2>

          <label>
            ISBN
            <input
              type="text"
              value={isbn}
              onInput={(e) => (isbn.value = e.currentTarget.value)}
              placeholder="978..."
            />
          </label>

          <label>
            Title
            <input
              type="text"
              value={title}
              onInput={(e) => (title.value = e.currentTarget.value)}
              placeholder="Book title"
            />
          </label>

          <label>
            Author
            <input
              type="text"
              value={author}
              onInput={(e) => (author.value = e.currentTarget.value)}
              placeholder="Author name"
            />
          </label>

          <label>
            Pages
            <input
              type="number"
              value={pages}
              onInput={(e) => (pages.value = e.currentTarget.value)}
              placeholder="Pages"
            />
          </label>

          <label>
            Genre
            <input
              type="text"
              value={genre}
              onInput={(e) => (genre.value = e.currentTarget.value)}
              placeholder="Fiction, non-fiction, etc."
            />
          </label>

          <label>
            Status
            <select
              value={status}
              onChange={(e) => (status.value = e.currentTarget.value)}
            >
              <option value="want">Want to Read</option>
              <option value="reading">Reading</option>
              <option value="read">Read</option>
            </select>
          </label>

          <label>
            Rating (1-5)
            <input
              type="number"
              min="1"
              max="5"
              value={rating}
              onInput={(e) => (rating.value = e.currentTarget.value)}
              placeholder=""
            />
          </label>

          <button class="btn" type="submit">
            Save to Sheet
          </button>

          {saved.value && <p class="saved-msg">Saved!</p>}
        </form>
      )}
    </div>
  )
}

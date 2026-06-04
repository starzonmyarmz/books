import { BOOKS_API_KEY } from "./config.js"

const API = "https://www.googleapis.com/books/v1/volumes"

export async function lookupISBN(isbn) {
  const clean = isbn.replace(/[^0-9X]/gi, "")
  if (clean.length < 10) return null

  let url = `${API}?q=isbn:${clean}`
  if (BOOKS_API_KEY) url += `&key=${BOOKS_API_KEY}`

  const resp = await fetch(url)

  if (!resp.ok) {
    throw new Error("Failed to look up ISBN")
  }

  const data = await resp.json()
  if (!data.items || data.items.length === 0) return null

  const info = data.items[0].volumeInfo

  return {
    title: info.title || "",
    authors: info.authors ? info.authors.join(", ") : "",
    pages: info.pageCount ? String(info.pageCount) : "",
    genre: info.categories ? info.categories[0] : "",
    cover: info.imageLinks?.thumbnail || "",
  }
}

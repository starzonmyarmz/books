import { signal, computed } from "@preact/signals"
import { CLIENT_ID, SCOPES } from "./config.js"

const STORAGE_KEY = "books_oauth_token"

function loadStoredToken() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return null
    const { access_token, expires_at } = JSON.parse(stored)
    if (Date.now() >= expires_at) return null
    return access_token
  } catch {
    return null
  }
}

function storeToken(access_token, expires_in) {
  const data = { access_token, expires_at: Date.now() + expires_in * 1000 }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function clearToken() {
  localStorage.removeItem(STORAGE_KEY)
  token.value = null
}

export const token = signal(loadStoredToken())
export const isSignedIn = computed(() => token.value !== null)

let tokenClient

export function initAuth() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES.join(" "),
    callback: (resp) => {
      if (resp.access_token) {
        token.value = resp.access_token
        storeToken(resp.access_token, resp.expires_in || 3600)
      }
    },
  })
}

export function signIn() {
  tokenClient.requestAccessToken()
}

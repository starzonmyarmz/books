import { signal, computed } from "@preact/signals"
import { CLIENT_ID, SCOPES } from "./config.js"

export const token = signal(null)
export const isSignedIn = computed(() => token.value !== null)

let tokenClient

export function initAuth() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES.join(" "),
    callback: (resp) => {
      if (resp.access_token) {
        token.value = resp.access_token
      }
    },
  })
}

export function signIn() {
  tokenClient.requestAccessToken()
}

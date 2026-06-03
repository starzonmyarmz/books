import { token } from "./auth.js"
import { SPREADSHEET_ID } from "./config.js"

const BASE = "https://sheets.googleapis.com/v4/spreadsheets"

function headers() {
  return {
    Authorization: `Bearer ${token.value}`,
    "Content-Type": "application/json",
  }
}

export async function appendRow(sheetName, values) {
  const range = `'${sheetName}'!A:K`
  const url = `${BASE}/${SPREADSHEET_ID}/values/${range}:append?valueInputOption=USER_ENTERED`
  const resp = await fetch(url, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ values: [values] }),
  })
  if (!resp.ok) {
    const err = await resp.json()
    throw new Error(err.error?.message || "Failed to append row")
  }
  return resp.json()
}

export async function getRows(sheetName) {
  const range = `'${sheetName}'!A:K`
  const url = `${BASE}/${SPREADSHEET_ID}/values/${range}`
  const resp = await fetch(url, { headers: headers() })
  if (!resp.ok) {
    const err = await resp.json()
    throw new Error(err.error?.message || "Failed to read sheet")
  }
  return resp.json()
}

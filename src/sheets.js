import { token, clearToken } from "./auth.js"
import { SPREADSHEET_ID } from "./config.js"

const BASE = "https://sheets.googleapis.com/v4/spreadsheets"

function headers() {
  return {
    Authorization: `Bearer ${token.value}`,
    "Content-Type": "application/json",
  }
}

async function handleResponse(resp) {
  if (resp.status === 401) {
    clearToken()
    throw new Error("Session expired")
  }
  if (!resp.ok) {
    const err = await resp.json()
    throw new Error(err.error?.message || "Request failed")
  }
  return resp.json()
}

export async function appendRow(sheetName, values) {
  const range = `'${sheetName}'!A:K`
  const url = `${BASE}/${SPREADSHEET_ID}/values/${range}:append?valueInputOption=USER_ENTERED`
  const resp = await fetch(url, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ values: [values] }),
  })
  return handleResponse(resp)
}

export async function getRows(sheetName) {
  const range = `'${sheetName}'!A:K`
  const url = `${BASE}/${SPREADSHEET_ID}/values/${range}`
  const resp = await fetch(url, { headers: headers() })
  return handleResponse(resp)
}

export async function updateRow(sheetName, rowIndex, values) {
  const range = `'${sheetName}'!A${rowIndex}:K${rowIndex}`
  const url = `${BASE}/${SPREADSHEET_ID}/values/${range}?valueInputOption=USER_ENTERED`
  const resp = await fetch(url, {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify({ range, values: [values] }),
  })
  return handleResponse(resp)
}

import { useEffect, useState } from "preact/hooks"
import { initAuth, isSignedIn } from "./auth.js"
import { SignInPage } from "./components/SignInPage.jsx"
import { Bookshelf } from "./components/Bookshelf.jsx"

export function App() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    initAuth()
    setReady(true)
  }, [])

  if (!ready) return null

  return isSignedIn.value ? <Bookshelf /> : <SignInPage />
}

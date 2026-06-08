import { signIn } from "../auth.js"

export function SignInPage() {
  return (
    <main id="sign-in">
      <h1>My Bookshelf</h1>
      <button class="btn btn-google" onClick={signIn}>
        Sign in with Google
      </button>
    </main>
  )
}

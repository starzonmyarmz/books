import { signIn } from "../auth.js"

export function SignInPage() {
  return (
    <main id="sign-in">
      <button class="btn btn-google" onClick={signIn}>
        Sign in with Google
      </button>
    </main>
  )
}

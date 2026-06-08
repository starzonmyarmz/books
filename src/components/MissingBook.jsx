import { BookX } from "lucide-preact"

export function MissingBook({ klass = "" }) {
  return (
    <div class={`missing-book ${klass}`}>
      <BookX size={64} strokeWidth={1} />
    </div>
  )
}

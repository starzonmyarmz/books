const labels = {
  want: "Want to Read",
  reading: "Reading",
  read: "Read",
}

export function Status({ status, label = false }) {
  return (
    <>
      {label ? (
        <div class="status" data-status={status}>
          {labels[status] ?? status}
        </div>
      ) : (
        <div
          class="status-dot"
          data-status={status}
          aria-label={labels[status] ?? status}
        />
      )}
    </>
  )
}

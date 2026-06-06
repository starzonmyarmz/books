export function BookDetailMeta({ title, data }) {
  return (
    data && (
      <div>
        <h4 class="bookdetail-meta-title">{title}</h4>
        <p class="bookdetail-meta-content">{data}</p>
      </div>
    )
  )
}

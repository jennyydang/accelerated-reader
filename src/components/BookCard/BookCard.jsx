import { useState } from 'react'
import styles from './BookCard.module.scss'

const COVER_BASE = 'https://covers.openlibrary.org/b/isbn'

export default function BookCard({ book, onClick }) {
  const [imgFailed, setImgFailed] = useState(false)

  // Priority: coverImage URL → Open Library ISBN → CSS color fallback
  const imgSrc = book.coverImage || (book.isbn ? `${COVER_BASE}/${book.isbn}-M.jpg` : null)
  const showImg = imgSrc && !imgFailed

  return (
    <article
      className={styles.card}
      onClick={() => onClick(book)}
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick(book)}
      role="button"
      aria-label={`Select ${book.title}`}
    >
      <div className={styles.coverWrapper}>
        {showImg ? (
          <img
            className={styles.coverImg}
            src={imgSrc}
            alt={`Cover of ${book.title}`}
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className={styles.coverFallback} style={{ backgroundColor: book.coverColor || '#4070C1' }}>
            <span className={styles.fallbackTitle}>{book.title}</span>
          </div>
        )}
      </div>
      <div className={styles.info}>
        <p className={styles.title}>{book.title}</p>
        <p className={styles.author}>{book.author}</p>
      </div>
    </article>
  )
}

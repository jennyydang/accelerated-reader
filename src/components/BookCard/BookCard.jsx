import { useState } from 'react'
import styles from './BookCard.module.scss'

const COVER_BASE = 'https://covers.openlibrary.org/b/isbn'

export default function BookCard({ book, onClick }) {
  const [imgFailed, setImgFailed] = useState(false)

  return (
    <article className={styles.card} onClick={() => onClick(book)} tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick(book)}
      role="button"
      aria-label={`Select ${book.title}`}
    >
      <div className={styles.coverWrapper}>
        {!imgFailed ? (
          <img
            className={styles.coverImg}
            src={`${COVER_BASE}/${book.isbn}-M.jpg`}
            alt={`Cover of ${book.title}`}
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className={styles.coverFallback} style={{ backgroundColor: book.coverColor }}>
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

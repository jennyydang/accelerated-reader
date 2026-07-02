import { useState } from 'react'
import styles from './BookCard.module.scss'

const COVER_BASE = 'https://covers.openlibrary.org/b/isbn'

export default function BookCard({ book, onClick }) {
  const [imgFailed, setImgFailed] = useState(false)

  const imgSrc = book.coverImage || (book.isbn ? `${COVER_BASE}/${book.isbn}-M.jpg` : null)
  const showImg = imgSrc && !imgFailed
  const spineColor = book.coverColor || '#2C4767'

  return (
    <article
      className={styles.bookScene}
      onClick={() => onClick(book)}
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick(book)}
      role="button"
      aria-label={`Select ${book.title}`}
    >
      <div className={styles.book}>
        <div className={styles.bookFront}>
          {showImg ? (
            <img
              className={styles.coverImg}
              src={imgSrc}
              alt={`Cover of ${book.title}`}
              onError={() => setImgFailed(true)}
            />
          ) : (
            <div className={styles.coverFallback} style={{ backgroundColor: spineColor }}>
              <span className={styles.fallbackTitle}>{book.title}</span>
            </div>
          )}
        </div>
        <div className={styles.bookSpine} style={{ backgroundColor: spineColor }} />
        <div className={styles.bookPages} />
      </div>
      <p className={styles.title}>{book.title}</p>
      <p className={styles.author}>{book.author}</p>
    </article>
  )
}

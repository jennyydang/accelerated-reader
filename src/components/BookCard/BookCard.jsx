import { useState } from 'react'
import styles from './BookCard.module.scss'

const COVER_BASE = 'https://covers.openlibrary.org/b/isbn'

export default function BookCard({ book, onClick, noHover = false, nonInteractive = false }) {
  const [imgFailed, setImgFailed] = useState(false)

  const imgSrc = book.coverImage || (book.isbn ? `${COVER_BASE}/${book.isbn}-M.jpg` : null)
  const showImg = imgSrc && !imgFailed
  const spineColor = book.coverColor || '#2C4767'

  const sceneClasses = [
    styles.bookScene,
    (noHover || nonInteractive) ? styles.bookSceneStatic : '',
  ].filter(Boolean).join(' ')

  const bookInner = (
    <>
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
        <div className={styles.bookSpine} style={{ backgroundColor: spineColor }}>
          <span className={styles.spineText} aria-hidden="true">{book.title}</span>
        </div>
        <div className={styles.bookPages} />
      </div>
      <p className={styles.title}>{book.title}</p>
      <p className={styles.author}>{book.author}</p>
    </>
  )

  if (nonInteractive) {
    return (
      <article className={sceneClasses} aria-label={book.title}>
        {bookInner}
      </article>
    )
  }

  return (
    <article
      className={sceneClasses}
      onClick={() => onClick(book)}
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick(book)
        }
      }}
      role="button"
      aria-label={`Select ${book.title}`}
    >
      {bookInner}
    </article>
  )
}

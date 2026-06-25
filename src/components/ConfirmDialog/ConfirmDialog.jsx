import { useEffect, useState } from 'react'
import styles from './ConfirmDialog.module.scss'

const COVER_BASE = 'https://covers.openlibrary.org/b/isbn'

export default function ConfirmDialog({ book, onConfirm, onCancel }) {
  const [imgFailed, setImgFailed] = useState(false)

  useEffect(() => {
    setImgFailed(false)
  }, [book])

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onCancel])

  if (!book) return null

  return (
    <div
      className={styles.overlay}
      onClick={onCancel}
      role="presentation"
    >
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        onClick={e => e.stopPropagation()}
      >
        <div className={styles.header}>
          <div className={styles.coverThumb}>
            {!imgFailed ? (
              <img
                src={`${COVER_BASE}/${book.isbn}-S.jpg`}
                alt={`Cover of ${book.title}`}
                onError={() => setImgFailed(true)}
              />
            ) : (
              <div className={styles.thumbFallback} style={{ backgroundColor: book.coverColor }} />
            )}
          </div>
          <div className={styles.headerText}>
            <p className={styles.rpLabel}>Reading Practice</p>
            <h2 id="dialog-title" className={styles.bookTitle}>{book.title}</h2>
            <p className={styles.bookAuthor}>{book.author}</p>
          </div>
        </div>

        <p className={styles.prompt}>
          Would you like to take an AR test for{' '}
          <strong className={styles.emphasis}>{book.title}</strong>?
        </p>

        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onCancel}>
            No, go back
          </button>
          <button className={styles.confirmBtn} onClick={onConfirm}>
            Yes, let's go!
          </button>
        </div>
      </div>
    </div>
  )
}

import { useEffect, useRef, useState } from 'react'
import styles from './ConfirmDialog.module.scss'

const COVER_BASE = 'https://covers.openlibrary.org/b/isbn'

export default function ConfirmDialog({ book, onConfirm, onCancel }) {
  const [imgFailed, setImgFailed] = useState(false)
  const dialogRef = useRef(null)

  useEffect(() => {
    setImgFailed(false)
  }, [book])

  useEffect(() => {
    if (!book) return
    const firstButton = dialogRef.current?.querySelector('button')
    firstButton?.focus()
  }, [book])

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onCancel])

  function handleDialogKeyDown(e) {
    if (e.key !== 'Tab') return
    const focusable = dialogRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    if (!focusable || focusable.length === 0) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault()
        last.focus()
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
  }

  if (!book) return null

  return (
    <div
      className={styles.overlay}
      onClick={onCancel}
      role="presentation"
    >
      <div
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        onClick={e => e.stopPropagation()}
        onKeyDown={handleDialogKeyDown}
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

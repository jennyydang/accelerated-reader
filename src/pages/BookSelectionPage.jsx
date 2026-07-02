import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useBooksContext } from '../context/BooksContext.jsx'
import BookCard from '../components/BookCard/BookCard.jsx'
import ConfirmDialog from '../components/ConfirmDialog/ConfirmDialog.jsx'
import styles from './BookSelectionPage.module.scss'

export default function BookSelectionPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const result = location.state
  const { books } = useBooksContext()

  const [selectedBook, setSelectedBook] = useState(null)

  useEffect(() => { document.title = 'Select a Book — Accelerated Reader' }, [])

  function handleConfirm() {
    navigate(`/quiz/${selectedBook.id}`)
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.arBadge} aria-hidden="true">AR</div>
        <div className={styles.headerText}>
          <h1 className={styles.headerLabel}>Accelerated Reader</h1>
        </div>
        <button className={styles.homeBtn} onClick={() => navigate('/')}>← Home</button>
      </header>

      <main id="main-content" className={styles.content}>
        {result?.score !== undefined && (
          <div className={styles.scoreBanner} role="status">
            <span className={styles.scoreIcon}>★</span>
            <span>
              You scored <strong>{result.score}</strong> out of <strong>{result.total}</strong> on{' '}
              <em>{result.bookTitle}</em>!
            </span>
          </div>
        )}

        {result?.newBook && (
          <div className={styles.successBanner} role="status">
            <span>✓ <strong>{result.newBook}</strong> has been added to the library!</span>
          </div>
        )}

        <h2 className={styles.sectionTitle}>Select a Book</h2>
        <p className={styles.sectionSubtitle}>Choose a book to take a Reading Practice quiz.</p>

        <ul className={styles.grid} role="list">
          {books.map(book => (
            <li key={book.id}>
              <BookCard book={book} onClick={setSelectedBook} />
            </li>
          ))}
        </ul>
      </main>

      <ConfirmDialog
        book={selectedBook}
        onConfirm={handleConfirm}
        onCancel={() => setSelectedBook(null)}
      />
    </div>
  )
}

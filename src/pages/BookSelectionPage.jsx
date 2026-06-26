import { useState } from 'react'
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

  function handleConfirm() {
    navigate(`/quiz/${selectedBook.id}`)
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.arBadge}>AR</div>
        <div className={styles.headerText}>
          <span className={styles.headerLabel}>Accelerated Reader</span>
        </div>

      </header>

      <main className={styles.content}>
        {result?.score !== undefined && (
          <div className={styles.scoreBanner}>
            <span className={styles.scoreIcon}>★</span>
            <span>
              You scored <strong>{result.score}</strong> out of <strong>{result.total}</strong> on{' '}
              <em>{result.bookTitle}</em>!
            </span>
          </div>
        )}

        {result?.newBook && (
          <div className={styles.successBanner}>
            <span>✓ <strong>{result.newBook}</strong> has been added to the library!</span>
          </div>
        )}

        <h2 className={styles.sectionTitle}>Select a Book</h2>
        <p className={styles.sectionSubtitle}>Choose a book to take a Reading Practice quiz.</p>

        <div className={styles.grid}>
          {books.map(book => (
            <BookCard key={book.id} book={book} onClick={setSelectedBook} />
          ))}
        </div>
      </main>

      <ConfirmDialog
        book={selectedBook}
        onConfirm={handleConfirm}
        onCancel={() => setSelectedBook(null)}
      />
    </div>
  )
}

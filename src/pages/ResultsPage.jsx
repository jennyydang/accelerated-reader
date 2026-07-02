import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import styles from './ResultsPage.module.scss'

function getTier(pct) {
  if (pct < 60) return { stars: 0, message: "Uhh, this quiz was extremely easy soo I'm very concerned about your reading comprehension." }
  if (pct < 75) return { stars: 1, message: "Uh at least you didn't fail!" }
  if (pct < 86) return { stars: 2, message: "Close enough!" }
  return { stars: 3, message: "Yay! Congrats!! You get a pizza. 🍕" }
}

function StarDisplay({ stars, total = 3 }) {
  return (
    <div className={styles.stars} aria-label={`${stars} out of ${total} stars`}>
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={i < stars ? styles.starFilled : styles.starEmpty}>
          {i < stars ? '★' : '☆'}
        </span>
      ))}
    </div>
  )
}

export default function ResultsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state

  useEffect(() => { document.title = 'Quiz Results — Accelerated Reader' }, [])

  useEffect(() => {
    if (!state?.bookTitle) navigate('/books', { replace: true })
  }, [state, navigate])

  const [name, setName] = useState('')
  const [nameError, setNameError] = useState('')

  if (!state?.bookTitle) return null

  const { score, total, bookTitle } = state
  const pct = Math.round((score / total) * 100)
  const { stars, message } = getTier(pct)

  function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) {
      setNameError('Please enter your name.')
      return
    }
    const entry = {
      name: name.trim(),
      stars,
      bookTitle,
      score,
      total,
      timestamp: Date.now(),
    }
    try {
      const existing = JSON.parse(localStorage.getItem('arScoreboard') || '[]')
      existing.push(entry)
      localStorage.setItem('arScoreboard', JSON.stringify(existing))
    } catch {
      localStorage.setItem('arScoreboard', JSON.stringify([entry]))
    }
    navigate('/scoreboard', { state: { bookTitle } })
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.arBadge} aria-hidden="true">AR</div>
        <h1 className={styles.headerLabel}>Quiz Results</h1>
      </header>

      <main id="main-content" className={styles.content}>
        <div className={styles.card}>
          <h2 className={styles.bookTitle}>{bookTitle}</h2>

          <p className={styles.scoreLine}>
            You answered <strong>{score}</strong> out of <strong>{total}</strong> correctly
            <span className={styles.pct}> ({pct}%)</span>
          </p>

          <div className={styles.tierBox} data-stars={stars}>
            <p className={styles.tierMessage}>{message}</p>
            <StarDisplay stars={stars} />
          </div>

          <hr className={styles.divider} />

          <form onSubmit={handleSubmit} className={styles.nameForm} noValidate>
            <label className={styles.nameLabel} htmlFor="playerName">
              Enter your name to save your score:
            </label>
            <div className={styles.nameRow}>
              <input
                id="playerName"
                type="text"
                autoComplete="name"
                className={`${styles.nameInput} ${nameError ? styles.inputError : ''}`}
                value={name}
                onChange={e => { setName(e.target.value); setNameError('') }}
                placeholder="Your name"
                maxLength={40}
                autoFocus
                aria-describedby="nameErrorMsg"
              />
              <button type="submit" className={styles.submitBtn}>
                Submit
              </button>
            </div>
            <p
              id="nameErrorMsg"
              className={styles.errorMsg}
              role="alert"
              aria-live="assertive"
            >
              {nameError}
            </p>
          </form>

          <button type="button" className={styles.backLink} onClick={() => navigate('/books')}>
            ← Back to books
          </button>
        </div>
      </main>
    </div>
  )
}

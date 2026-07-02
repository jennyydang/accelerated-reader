import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './ScoreboardPage.module.scss'

function loadScoreboard() {
  try {
    return JSON.parse(localStorage.getItem('arScoreboard') || '[]')
  } catch {
    return []
  }
}

function StarDisplay({ stars, total = 3 }) {
  return (
    <span className={styles.stars} aria-label={`${stars} stars`}>
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={i < stars ? styles.starFilled : styles.starEmpty}>
          {i < stars ? '★' : '☆'}
        </span>
      ))}
    </span>
  )
}

export default function ScoreboardPage() {
  const navigate = useNavigate()
  const [entries] = useState(() =>
    loadScoreboard().sort((a, b) => b.stars - a.stars || a.timestamp - b.timestamp)
  )

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.arBadge}>AR</div>
        <span className={styles.headerLabel}>⭐ Gold Star Scoreboard</span>
      </header>

      <main className={styles.content}>
        {entries.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyText}>No scores yet — be the first to finish a quiz!</p>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.thRank}>#</th>
                  <th className={styles.thName}>Name</th>
                  <th className={styles.thBook}>Book</th>
                  <th className={styles.thScore}>Score</th>
                  <th className={styles.thStars}>Stars</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, i) => (
                  <tr key={entry.timestamp} className={styles.row} data-stars={entry.stars}>
                    <td className={styles.rank}>{i + 1}</td>
                    <td className={styles.name}>{entry.name}</td>
                    <td className={styles.book}>{entry.bookTitle}</td>
                    <td className={styles.score}>{entry.score}/{entry.total}</td>
                    <td className={styles.starsCell}>
                      <StarDisplay stars={entry.stars} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <button className={styles.homeBtn} onClick={() => navigate('/')}>
          ← Back to Home
        </button>
      </main>
    </div>
  )
}

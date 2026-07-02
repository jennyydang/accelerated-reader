import { useEffect, useState } from 'react'
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
        <span key={i} className={i < stars ? styles.starFilled : styles.starEmpty} aria-hidden="true">
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

  useEffect(() => { document.title = 'Scoreboard — Accelerated Reader' }, [])

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.arBadge} aria-hidden="true">AR</div>
        <h1 className={styles.headerLabel}>⭐ Gold Star Scoreboard</h1>
      </header>

      <main id="main-content" className={styles.content}>
        {entries.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyText}>No scores yet — be the first to finish a quiz!</p>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table} aria-label="Quiz results scoreboard">
              <thead>
                <tr>
                  <th className={styles.thRank} scope="col">#</th>
                  <th className={styles.thName} scope="col">Name</th>
                  <th className={styles.thBook} scope="col">Book</th>
                  <th className={styles.thScore} scope="col">Score</th>
                  <th className={styles.thStars} scope="col">Stars</th>
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

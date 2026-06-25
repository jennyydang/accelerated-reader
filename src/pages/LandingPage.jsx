import { useNavigate, useLocation } from 'react-router-dom'
import styles from './LandingPage.module.scss'

export default function LandingPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const result = location.state

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <img
          src="/images/ar-logo.png"
          alt="Accelerated Reader - two kids reading"
          className={styles.logo}
        />
        {result && (
          <div className={styles.scoreBox}>
            <p className={styles.scoreText}>
              You scored <strong>{result.score}</strong> out of <strong>{result.total}</strong>!
            </p>
          </div>
        )}
        <button className={styles.beginButton} onClick={() => navigate('/quiz')}>
          {result ? 'Try Again' : "Let's Begin"}
        </button>
      </div>
    </main>
  )
}

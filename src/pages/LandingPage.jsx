import { useNavigate } from 'react-router-dom'
import styles from './LandingPage.module.scss'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <img
          src="/images/ar-logo.png"
          alt="Accelerated Reader - two kids reading"
          className={styles.logo}
        />
        <button className={styles.beginButton} onClick={() => navigate('/books')}>
          Let's Begin
        </button>
      </div>
    </main>
  )
}

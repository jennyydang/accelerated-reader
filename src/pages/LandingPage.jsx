import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './LandingPage.module.scss'

export default function LandingPage() {
  const navigate = useNavigate()

  useEffect(() => { document.title = 'Home — Accelerated Reader' }, [])

  return (
    <main id="main-content" className={styles.page}>
      <div className={styles.card}>
        <h1 className="sr-only">Accelerated Reader</h1>
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

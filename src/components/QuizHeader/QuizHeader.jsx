import styles from './QuizHeader.module.scss'

export default function QuizHeader({ bookTitle }) {
  return (
    <header className={styles.header}>
      <div className={styles.logoMark}>AR</div>
      <h1 className={styles.bookTitle}>{bookTitle}</h1>
    </header>
  )
}

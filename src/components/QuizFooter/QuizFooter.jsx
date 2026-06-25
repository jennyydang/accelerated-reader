import styles from './QuizFooter.module.scss'

export default function QuizFooter({ currentQuestion, totalQuestions, onNext, canAdvance, isLast }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.rpBadge}>
        <span className={styles.rpLabel}>RP</span>
        <span className={styles.subLabel}>Reading Practice</span>
      </div>

      <div className={styles.questionCounter}>
        Question {currentQuestion} of {totalQuestions}
      </div>

      <button
        className={styles.nextButton}
        onClick={onNext}
        disabled={!canAdvance}
      >
        {isLast ? 'Finish' : 'Next ›'}
      </button>
    </footer>
  )
}

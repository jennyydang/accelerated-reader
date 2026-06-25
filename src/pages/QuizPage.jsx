import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import quizData from '../data/quizData.js'
import QuizHeader from '../components/QuizHeader/QuizHeader.jsx'
import QuizFooter from '../components/QuizFooter/QuizFooter.jsx'
import OptionCard from '../components/OptionCard/OptionCard.jsx'
import ProgressBar from '../components/ProgressBar/ProgressBar.jsx'
import styles from './QuizPage.module.scss'

export default function QuizPage() {
  const navigate = useNavigate()
  const { bookTitle, questions } = quizData
  const totalQuestions = questions.length

  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedLabel, setSelectedLabel] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const [score, setScore] = useState(0)

  const question = questions[currentIndex]
  const isLast = currentIndex === totalQuestions - 1

  function handleSelect(label) {
    if (revealed) return
    setSelectedLabel(label)
    setRevealed(true)
    if (label === question.correctLabel) {
      setScore(s => s + 1)
    }
  }

  function handleNext() {
    if (isLast) {
      const finalScore = selectedLabel === question.correctLabel ? score : score
      navigate('/', { state: { score: finalScore, total: totalQuestions } })
      return
    }
    setCurrentIndex(i => i + 1)
    setSelectedLabel(null)
    setRevealed(false)
  }

  return (
    <div className={styles.page}>
      <QuizHeader bookTitle={bookTitle} />
      <ProgressBar current={currentIndex + 1} total={totalQuestions} />

      <main className={styles.content}>
        <p className={styles.question}>{question.question}</p>

        <ul className={styles.options}>
          {question.options.map(option => {
            const isSelected = selectedLabel === option.label
            const isCorrect = revealed && option.label === question.correctLabel
            const isIncorrect = revealed && isSelected && option.label !== question.correctLabel

            return (
              <li key={option.label}>
                <OptionCard
                  option={option}
                  isSelected={isSelected}
                  isCorrect={isCorrect}
                  isIncorrect={isIncorrect}
                  onClick={() => handleSelect(option.label)}
                  disabled={revealed}
                />
              </li>
            )
          })}
        </ul>
      </main>

      <QuizFooter
        currentQuestion={currentIndex + 1}
        totalQuestions={totalQuestions}
        onNext={handleNext}
        canAdvance={revealed}
        isLast={isLast}
      />
    </div>
  )
}

import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useBooksContext } from '../context/BooksContext.jsx'
import QuizHeader from '../components/QuizHeader/QuizHeader.jsx'
import QuizFooter from '../components/QuizFooter/QuizFooter.jsx'
import OptionCard from '../components/OptionCard/OptionCard.jsx'
import ProgressBar from '../components/ProgressBar/ProgressBar.jsx'
import styles from './QuizPage.module.scss'

export default function QuizPage() {
  const navigate = useNavigate()
  const { bookId } = useParams()
  const { books } = useBooksContext()

  const book = books.find(b => b.id === bookId)

  useEffect(() => {
    if (!book) navigate('/books', { replace: true })
  }, [book, navigate])

  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedLabel, setSelectedLabel] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const [score, setScore] = useState(0)

  if (!book) return null

  const { title: bookTitle, questions } = book
  const totalQuestions = questions.length
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
      navigate('/books', { state: { score, total: totalQuestions, bookTitle } })
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

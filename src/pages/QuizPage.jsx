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
  const [answers, setAnswers] = useState({})

  if (!book) return null

  const { title: bookTitle, questions } = book
  const totalQuestions = questions.length
  const question = questions[currentIndex]
  const isLast = currentIndex === totalQuestions - 1
  const currentAnswer = answers[currentIndex]
  const canAdvance = currentAnswer != null

  function handleSelect(label) {
    if (currentAnswer != null) return
    setAnswers(prev => ({ ...prev, [currentIndex]: label }))
  }

  function handleNext() {
    if (isLast) {
      const score = questions.reduce((count, q, i) => {
        return answers[i] === q.correctLabel ? count + 1 : count
      }, 0)
      navigate('/results', { state: { score, total: totalQuestions, bookTitle, bookId } })
      return
    }
    setCurrentIndex(i => i + 1)
  }

  return (
    <div className={styles.page}>
      <QuizHeader bookTitle={bookTitle} />
      <ProgressBar current={currentIndex + 1} total={totalQuestions} />

      <main className={styles.content}>
        <p className={styles.question}>{question.question}</p>

        <ul className={styles.options}>
          {question.options.map(option => (
            <li key={option.label}>
              <OptionCard
                option={option}
                isSelected={currentAnswer === option.label}
                onClick={() => handleSelect(option.label)}
                disabled={canAdvance}
              />
            </li>
          ))}
        </ul>
      </main>

      <QuizFooter
        currentQuestion={currentIndex + 1}
        totalQuestions={totalQuestions}
        onNext={handleNext}
        canAdvance={canAdvance}
        isLast={isLast}
      />
    </div>
  )
}

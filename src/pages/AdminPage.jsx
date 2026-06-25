import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBooksContext } from '../context/BooksContext.jsx'
import QuestionForm from '../components/QuestionForm/QuestionForm.jsx'
import styles from './AdminPage.module.scss'

const LABELS = ['A', 'B', 'C', 'D']

function blankQuestion(id) {
  return {
    id,
    question: '',
    options: LABELS.map(label => ({ label, text: '' })),
    correctLabel: 'A',
  }
}

export default function AdminPage() {
  const navigate = useNavigate()
  const { addBook } = useBooksContext()
  const firstErrorRef = useRef(null)

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [coverImageUrl, setCoverImageUrl] = useState('')
  const [coverColor, setCoverColor] = useState('#4070C1')
  const [previewImgFailed, setPreviewImgFailed] = useState(false)
  const [questions, setQuestions] = useState([blankQuestion(1)])
  const [errors, setErrors] = useState({})
  const [nextId, setNextId] = useState(2)

  function handleCoverUrlChange(val) {
    setCoverImageUrl(val)
    setPreviewImgFailed(false)
  }

  function updateQuestion(index, updated) {
    setQuestions(qs => qs.map((q, i) => i === index ? updated : q))
  }

  function addQuestion() {
    setQuestions(qs => [...qs, blankQuestion(nextId)])
    setNextId(n => n + 1)
  }

  function removeQuestion(index) {
    setQuestions(qs => qs.filter((_, i) => i !== index))
  }

  function validate() {
    const errs = {}

    if (!title.trim()) errs.title = 'Book title is required.'
    if (!author.trim()) errs.author = 'Author name is required.'

    const qErrs = questions.map(q => {
      const qe = {}
      if (!q.question.trim()) qe.question = 'Question text is required.'
      const emptyOptions = q.options.filter(o => !o.text.trim())
      if (emptyOptions.length > 0) qe.options = 'All four answer choices must be filled in.'
      return Object.keys(qe).length ? qe : null
    })

    if (qErrs.some(Boolean)) errs.questions = qErrs

    return errs
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)

    if (Object.keys(errs).length > 0) {
      setTimeout(() => {
        const el = document.querySelector('[data-error="true"]')
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 50)
      return
    }

    const id = title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const book = {
      id: `${id}-${Date.now()}`,
      title: title.trim(),
      author: author.trim(),
      coverImage: coverImageUrl.trim() || null,
      coverColor,
      questions: questions.map((q, i) => ({ ...q, id: i + 1 })),
    }

    addBook(book)
    navigate('/books', { state: { newBook: book.title } })
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.arBadge}>AR</div>
        <span className={styles.headerLabel}>Admin — Add New Book</span>
        <button type="button" className={styles.backBtn} onClick={() => navigate('/books')}>
          ← Back to Books
        </button>
      </header>

      <main className={styles.content}>
        <form onSubmit={handleSubmit} noValidate>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Book Details</h2>

            <div className={styles.bookDetailsGrid}>
              <div className={styles.fields}>
                <div className={styles.field}>
                  <label className={styles.fieldLabel} htmlFor="title">Book Title *</label>
                  <input
                    id="title"
                    type="text"
                    className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. The Hobbit"
                    data-error={!!errors.title}
                  />
                  {errors.title && <p className={styles.errorMsg}>{errors.title}</p>}
                </div>

                <div className={styles.field}>
                  <label className={styles.fieldLabel} htmlFor="author">Author *</label>
                  <input
                    id="author"
                    type="text"
                    className={`${styles.input} ${errors.author ? styles.inputError : ''}`}
                    value={author}
                    onChange={e => setAuthor(e.target.value)}
                    placeholder="e.g. J.R.R. Tolkien"
                    data-error={!!errors.author}
                  />
                  {errors.author && <p className={styles.errorMsg}>{errors.author}</p>}
                </div>

                <div className={styles.field}>
                  <label className={styles.fieldLabel} htmlFor="coverUrl">Cover Image URL</label>
                  <input
                    id="coverUrl"
                    type="url"
                    className={styles.input}
                    value={coverImageUrl}
                    onChange={e => handleCoverUrlChange(e.target.value)}
                    placeholder="https://example.com/book-cover.jpg"
                  />
                  <p className={styles.hint}>Paste any image URL. Leave blank to use a color background.</p>
                </div>

                <div className={styles.field}>
                  <label className={styles.fieldLabel} htmlFor="coverColor">Cover Color (fallback)</label>
                  <div className={styles.colorRow}>
                    <input
                      id="coverColor"
                      type="color"
                      className={styles.colorPicker}
                      value={coverColor}
                      onChange={e => setCoverColor(e.target.value)}
                    />
                    <span className={styles.colorHex}>{coverColor}</span>
                  </div>
                </div>
              </div>

              <div className={styles.preview}>
                <p className={styles.previewLabel}>Cover Preview</p>
                <div className={styles.previewBook}>
                  {coverImageUrl && !previewImgFailed ? (
                    <img
                      src={coverImageUrl}
                      alt="Cover preview"
                      className={styles.previewImg}
                      onError={() => setPreviewImgFailed(true)}
                    />
                  ) : (
                    <div className={styles.previewColor} style={{ backgroundColor: coverColor }}>
                      {title && <span className={styles.previewTitle}>{title}</span>}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Quiz Questions</h2>
            <p className={styles.sectionHint}>Add at least one question with four answer choices. Mark the correct answer for each.</p>

            <div className={styles.questionsList}>
              {questions.map((q, i) => (
                <QuestionForm
                  key={q.id}
                  question={q}
                  index={i}
                  onChange={updated => updateQuestion(i, updated)}
                  onRemove={() => removeQuestion(i)}
                  errors={errors.questions?.[i]}
                />
              ))}
            </div>

            <button
              type="button"
              className={styles.addQuestionBtn}
              onClick={addQuestion}
            >
              + Add Another Question
            </button>
          </section>

          <div className={styles.submitRow}>
            <button type="submit" className={styles.submitBtn}>
              Submit Quiz
            </button>
          </div>

        </form>
      </main>
    </div>
  )
}

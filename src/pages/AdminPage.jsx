import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBooksContext } from '../context/BooksContext.jsx'
import BookCard from '../components/BookCard/BookCard.jsx'
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

function BookForm({ initialBook, onSave, onCancel, submitLabel }) {
  const [title, setTitle] = useState(initialBook?.title ?? '')
  const [author, setAuthor] = useState(initialBook?.author ?? '')
  const [coverImageUrl, setCoverImageUrl] = useState(initialBook?.coverImage ?? '')
  const [coverColor, setCoverColor] = useState(initialBook?.coverColor ?? '#4070C1')
  const [coverMode, setCoverMode] = useState(() =>
    initialBook?.coverImage?.startsWith('data:') ? 'upload' : 'url'
  )
  const [previewImgFailed, setPreviewImgFailed] = useState(false)
  const [questions, setQuestions] = useState(() =>
    initialBook?.questions?.length > 0 ? initialBook.questions : [blankQuestion(1)]
  )
  const [errors, setErrors] = useState({})
  const [nextId, setNextId] = useState(() =>
    initialBook?.questions?.length ? initialBook.questions.length + 1 : 2
  )

  function handleCoverUrlChange(val) {
    setCoverImageUrl(val)
    setPreviewImgFailed(false)
  }

  function handleFileUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = evt => {
      setCoverImageUrl(evt.target.result)
      setPreviewImgFailed(false)
    }
    reader.readAsDataURL(file)
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
      if (q.options.some(o => !o.text.trim())) qe.options = 'All four answer choices must be filled in.'
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

    const slugBase = title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const book = {
      id: initialBook?.id ?? `${slugBase}-${Date.now()}`,
      title: title.trim(),
      author: author.trim(),
      coverImage: coverImageUrl.trim() || null,
      coverColor,
      questions: questions.map((q, i) => ({ ...q, id: i + 1 })),
    }
    onSave(book)
  }

  return (
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
              <label className={styles.fieldLabel}>Cover Image</label>
              <div className={styles.coverModeToggle}>
                <button
                  type="button"
                  className={`${styles.coverModeBtn} ${coverMode === 'url' ? styles.coverModeBtnActive : ''}`}
                  onClick={() => setCoverMode('url')}
                >
                  URL
                </button>
                <button
                  type="button"
                  className={`${styles.coverModeBtn} ${coverMode === 'upload' ? styles.coverModeBtnActive : ''}`}
                  onClick={() => setCoverMode('upload')}
                >
                  Upload Photo
                </button>
              </div>
              {coverMode === 'url' ? (
                <>
                  <input
                    id="coverUrl"
                    type="url"
                    className={styles.input}
                    value={coverMode === 'url' ? coverImageUrl : ''}
                    onChange={e => handleCoverUrlChange(e.target.value)}
                    placeholder="https://example.com/book-cover.jpg"
                  />
                  <p className={styles.hint}>Paste any image URL. Leave blank to use a color background.</p>
                </>
              ) : (
                <>
                  <input
                    id="coverFile"
                    type="file"
                    accept="image/*"
                    className={styles.fileInput}
                    onChange={handleFileUpload}
                  />
                  {coverImageUrl && <p className={styles.hint}>Photo selected — see preview on the right.</p>}
                </>
              )}
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
        <button type="button" className={styles.addQuestionBtn} onClick={addQuestion}>
          + Add Another Question
        </button>
      </section>

      <div className={styles.submitRow}>
        <button type="button" className={styles.cancelFormBtn} onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className={styles.submitBtn}>
          {submitLabel}
        </button>
      </div>
    </form>
  )
}

export default function AdminPage() {
  const navigate = useNavigate()
  const { books, addBook, updateBook, removeBook } = useBooksContext()

  const [view, setView] = useState(() =>
    sessionStorage.getItem('adminAuth') ? 'list' : 'login'
  )
  const [editTarget, setEditTarget] = useState(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  function handleLogin(e) {
    e.preventDefault()
    if (password === 'password') {
      sessionStorage.setItem('adminAuth', '1')
      setView('list')
    } else {
      setPasswordError('Incorrect password.')
    }
  }

  function handleLogout() {
    sessionStorage.removeItem('adminAuth')
    setView('login')
    setPassword('')
    setPasswordError('')
  }

  function handleSave(book) {
    if (editTarget) {
      updateBook(editTarget.id, book)
      setSuccessMsg(`"${book.title}" has been updated.`)
    } else {
      addBook(book)
      setSuccessMsg(`"${book.title}" has been added to the library.`)
    }
    setEditTarget(null)
    setView('list')
  }

  function handleCancel() {
    setEditTarget(null)
    setView('list')
  }

  if (view === 'login') {
    return (
      <div className={styles.loginPage}>
        <div className={styles.loginCard}>
          <p className={styles.loginHeading}>Hello, Divine One. Please enter your password.</p>
          <form onSubmit={handleLogin} className={styles.loginForm}>
            <input
              type="password"
              className={styles.passwordInput}
              value={password}
              onChange={e => { setPassword(e.target.value); setPasswordError('') }}
              placeholder="Password"
              autoFocus
            />
            <button type="submit" className={styles.loginBtn}>Enter</button>
          </form>
          {passwordError && <p className={styles.loginError}>{passwordError}</p>}
        </div>
      </div>
    )
  }

  if (view === 'list') {
    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <div className={styles.arBadge}>AR</div>
          <span className={styles.headerLabel}>Admin Panel</span>
          <button type="button" className={styles.backBtn} onClick={() => navigate('/books')}>
            ← Back to Site
          </button>
          <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
            Log Out
          </button>
        </header>

        <main className={styles.content}>
          {successMsg && (
            <div className={styles.successBanner}>
              ✓ {successMsg}
            </div>
          )}

          <div className={styles.listActions}>
            <h2 className={styles.listTitle}>All Books ({books.length})</h2>
            <button
              type="button"
              className={styles.addBookBtn}
              onClick={() => { setSuccessMsg(''); setView('add') }}
            >
              + Add Book
            </button>
          </div>

          <div className={styles.adminGrid}>
            {books.map(book => (
              <div key={book.id} className={styles.bookCardWrapper}>
                <BookCard book={book} onClick={() => {}} />
                <button
                  type="button"
                  className={styles.editBtn}
                  onClick={() => { setSuccessMsg(''); setConfirmDeleteId(null); setEditTarget(book); setView('edit') }}
                >
                  Edit
                </button>
                {confirmDeleteId === book.id ? (
                  <div className={styles.confirmRow}>
                    <span className={styles.confirmText}>Sure?</span>
                    <button
                      type="button"
                      className={styles.confirmYesBtn}
                      onClick={() => { removeBook(book.id); setConfirmDeleteId(null) }}
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      className={styles.confirmNoBtn}
                      onClick={() => setConfirmDeleteId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className={styles.removeBtn}
                    onClick={() => setConfirmDeleteId(book.id)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.arBadge}>AR</div>
        <span className={styles.headerLabel}>
          {view === 'edit' ? `Editing: ${editTarget.title}` : 'Add New Book'}
        </span>
        <button type="button" className={styles.backBtn} onClick={handleCancel}>
          ← {view === 'edit' ? 'Cancel' : 'Back'}
        </button>
      </header>

      <main className={styles.content}>
        <BookForm
          key={view === 'edit' ? editTarget.id : 'new'}
          initialBook={view === 'edit' ? editTarget : null}
          onSave={handleSave}
          onCancel={handleCancel}
          submitLabel={view === 'edit' ? 'Save Changes' : 'Submit Quiz'}
        />
      </main>
    </div>
  )
}

import styles from './QuestionForm.module.scss'

const LABELS = ['A', 'B', 'C', 'D']

export default function QuestionForm({ question, index, onChange, onRemove, errors }) {
  function setQuestionText(text) {
    onChange({ ...question, question: text })
  }

  function setOptionText(label, text) {
    const options = question.options.map(o => o.label === label ? { ...o, text } : o)
    onChange({ ...question, options })
  }

  function setCorrect(label) {
    onChange({ ...question, correctLabel: label })
  }

  return (
    <div className={styles.block}>
      <div className={styles.blockHeader}>
        <h3 className={styles.blockTitle}>Question {index + 1}</h3>
        {index > 0 && (
          <button type="button" className={styles.removeBtn} onClick={onRemove} aria-label="Remove question">
            Remove
          </button>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Question text</label>
        <textarea
          className={`${styles.textarea} ${errors?.question ? styles.inputError : ''}`}
          value={question.question}
          onChange={e => setQuestionText(e.target.value)}
          placeholder="Enter the question..."
          rows={2}
        />
        {errors?.question && <p className={styles.errorMsg}>{errors.question}</p>}
      </div>

      <div className={styles.optionsGroup}>
        <p className={styles.optionsLabel}>Answer choices — select the correct answer:</p>
        {LABELS.map(label => {
          const option = question.options.find(o => o.label === label)
          const isCorrect = question.correctLabel === label
          return (
            <div
              key={label}
              className={`${styles.optionRow} ${isCorrect ? styles.optionRowCorrect : ''}`}
            >
              <span className={`${styles.letterBadge} ${isCorrect ? styles.letterBadgeCorrect : ''}`}>
                {label}
              </span>
              <input
                type="text"
                className={`${styles.optionInput} ${errors?.[`option${label}`] ? styles.inputError : ''}`}
                value={option.text}
                onChange={e => setOptionText(label, e.target.value)}
                placeholder={`Choice ${label}`}
              />
              <label className={styles.correctLabel}>
                <input
                  type="radio"
                  name={`correct-${question.id}`}
                  checked={isCorrect}
                  onChange={() => setCorrect(label)}
                  className={styles.radio}
                />
                <span className={styles.correctText}>Correct</span>
              </label>
            </div>
          )
        })}
        {errors?.options && <p className={styles.errorMsg}>{errors.options}</p>}
      </div>
    </div>
  )
}

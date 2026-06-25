import styles from './OptionCard.module.scss'

export default function OptionCard({ option, isSelected, onClick, disabled }) {
  const classes = [
    styles.card,
    isSelected && styles.selected,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      className={classes}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={isSelected}
    >
      <span className={styles.label}>{option.label}</span>
      <span className={styles.text}>{option.text}</span>
    </button>
  )
}

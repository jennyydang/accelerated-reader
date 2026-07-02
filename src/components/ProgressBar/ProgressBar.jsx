import styles from './ProgressBar.module.scss'

export default function ProgressBar({ current, total }) {
  const percent = Math.round((current / total) * 100)
  return (
    <div
      className={styles.track}
      role="progressbar"
      aria-label="Quiz progress"
      aria-valuenow={current}
      aria-valuemin={0}
      aria-valuemax={total}
    >
      <div className={styles.fill} style={{ width: `${percent}%` }} />
    </div>
  )
}

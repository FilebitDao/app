import React, { FC } from 'react'

import styles from './index.module.scss'

interface WarningProps {
  readonly tip: string
}

const Warning: FC<WarningProps> = ({ tip }: WarningProps) => (
  <div className={styles.warning}>
    <p className={styles.warningTip}>{tip}</p>
  </div>
)

export default Warning

import React, { FC, ReactElement, useMemo } from 'react'

import { ReactComponent as ErrorIcon } from 'assets/img/narwhal/state/error.svg'
import { ReactComponent as InfoIcon } from 'assets/img/narwhal/state/info.svg'
import { ReactComponent as SuccessIcon } from 'assets/img/narwhal/state/success.svg'

import styles from './index.module.scss'

export type NoticeVariant = 'info' | 'error' | 'success' | 'warning'

interface NoticeProps {
  readonly title?: string | ReactElement
  readonly description: string | ReactElement
  readonly variant?: NoticeVariant
}

const ICONSMAP = {
  error: ErrorIcon,
  info: InfoIcon,
  warning: InfoIcon,
  success: SuccessIcon
}

export const Notice: FC<NoticeProps> = ({ title, description, variant = 'info' }: NoticeProps) => {
  const renderTitle = useMemo(() => Boolean(title), [title])
  const StateIcon = ICONSMAP[variant]

  return (
    <div className={styles.root}>
      <div className={styles.stateIcon}>
        <StateIcon width={20} height={20} />
      </div>
      <div className={styles.content}>
        {renderTitle && <h3 className={styles.title}>{title}</h3>}
        <p className={styles.description}>{description}</p>
      </div>
    </div>
  )
}

export const NoticeInfo = (props: NoticeProps) => <Notice variant="info" {...props} />
export const NoticeError = (props: NoticeProps) => <Notice variant="error" {...props} />
export const NoticeWarning = (props: NoticeProps) => <Notice variant="warning" {...props} />
export const NoticeSuccess = (props: NoticeProps) => <Notice variant="success" {...props} />

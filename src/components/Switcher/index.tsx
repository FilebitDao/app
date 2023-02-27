import React, { ChangeEvent, FC, useCallback } from 'react'

import classnames from 'classnames'

import useProtectedCallback from 'hooks/useProtectedCallback'

import { noop } from 'utilities'

import styles from './index.module.scss'

interface SwitcherProps {
  readonly checked?: boolean
  readonly protect?: boolean
  readonly onEnable?: () => void
  readonly onDisable?: () => void
}

const Switcher: FC<SwitcherProps> = ({
  checked,
  protect = true,
  onEnable = noop,
  onDisable = noop
}: SwitcherProps) => {
  const safeEnable = useProtectedCallback(onEnable)
  const safeDisable = useProtectedCallback(onDisable)

  const toggle = useCallback(
    (evt: ChangeEvent<HTMLInputElement>) => {
      if (evt.target.checked) {
        if (protect) {
          safeEnable()
        } else {
          onEnable()
        }
        return
      }

      if (protect) {
        safeDisable()
      } else {
        onEnable()
      }
    },
    [safeEnable, safeDisable, protect]
  )

  return (
    <div className={styles.enableAssest}>
      <label className={classnames([styles.switch, checked && styles.enabled])}>
        <input checked={checked} className={styles.input} onChange={toggle} type="checkbox" />
        <span className={classnames([styles.slider, checked && styles.active])} />
      </label>
    </div>
  )
}

export default Switcher

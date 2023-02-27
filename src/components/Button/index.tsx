import React, { FC, PropsWithChildren, useCallback, useMemo } from 'react'

import classnames from 'classnames'

import Spiner, { SpinerTheme } from 'components/Spiner'

import useProtectedCallback from 'hooks/useProtectedCallback'

import { noop } from 'utilities'

import styles from './index.module.scss'

interface ButtonProps {
  readonly type?: 'primary'
  readonly loading?: boolean
  readonly ghost?: boolean
  readonly disabled?: boolean
  readonly protect?: boolean
  readonly small?: boolean
  readonly onClick?: () => void
}

const Button: FC<PropsWithChildren<ButtonProps>> = ({
  type = 'primary',
  onClick = noop,
  protect,
  loading,
  ghost,
  disabled,
  small,
  children
}: PropsWithChildren<ButtonProps>) => {
  const protectClick = useProtectedCallback(onClick)

  const spinerTheme = useMemo<SpinerTheme>(() => (ghost ? 'primary' : 'white'), [ghost])
  const spinerSize = useMemo(() => (small ? 14 : 24), [small])

  const clickButton = useCallback(() => {
    if (!disabled && !loading) {
      if (protect) {
        protectClick()
        return
      }
      onClick()
    }
  }, [disabled, loading, protect, protectClick])

  return (
    <div
      className={classnames([
        'button-component',
        styles.button,
        styles[`${type}Button`],
        loading && styles.loading,
        disabled && styles.disabled,
        small && styles.smallButton
      ])}
      onClick={clickButton}
    >
      <div className={classnames([styles.buttonInner, ghost && ['btn-ghost', styles.ghostButton]])}>
        {loading && <Spiner theme={spinerTheme} size={spinerSize} />}
        <span className={styles.btnText}>{children}</span>
      </div>
    </div>
  )
}

export default Button

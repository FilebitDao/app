import React, { ChangeEvent, FC, WheelEvent, useCallback, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import classnames from 'classnames'
import { nanoid } from 'nanoid'

import { noop } from 'utilities'

import styles from './index.module.scss'

interface AddtionialInfo {
  readonly label: string
  readonly value: string
}

export interface AmountInputProps {
  readonly onChange?: (value: string | number) => void
  readonly disabled?: boolean
  readonly addtionInfo?: AddtionialInfo[]
  readonly max?: number | string
  readonly value?: number | string
  readonly balance?: number | string
  readonly symbol?: string
  readonly maxLabel?: string
  readonly balanceLabel?: string
  readonly hiddenInput?: boolean
}

const AmountInput: FC<AmountInputProps> = ({
  onChange = noop,
  addtionInfo = [],
  disabled,
  max,
  value,
  balance,
  symbol,
  maxLabel,
  balanceLabel,
  hiddenInput
}: AmountInputProps) => {
  const { t } = useTranslation()
  const showAddtionial = useMemo(() => Boolean(addtionInfo.length), [addtionInfo])
  const inputRef = useRef<null | HTMLInputElement>(null)

  const onMax = useCallback(() => {
    if (max && !disabled) {
      onChange(max)
    }
  }, [max, disabled])

  const valueChanged = useCallback((evt: ChangeEvent<HTMLInputElement>) => {
    onChange(evt.target.value.trim())
  }, [])

  const disableWheel = useCallback((evt: WheelEvent<HTMLInputElement>) => {
    evt.currentTarget.blur()
  }, [])

  return (
    <div className={styles.amountInput}>
      {!hiddenInput && (
        <>
          <h1 className={styles.title}>{t('amount.amount')}</h1>
          <div className={styles.amountInputWrapper}>
            <div className={styles.amountInputContent}>
              <input
                className={classnames([
                  styles.inputEl,
                  disabled ? styles.disabled : styles.hoverable
                ])}
                type="number"
                placeholder="0.00"
                value={value}
                disabled={disabled}
                ref={inputRef}
                onChange={valueChanged}
                onWheel={disableWheel}
              />
              <div className={classnames([styles.inputLine, !disabled && styles.hoverable])} />
              {!disabled && (
                <div className={styles.max} onClick={onMax}>
                  {maxLabel || t('amount.max')}
                </div>
              )}
            </div>
          </div>
        </>
      )}
      <div className={styles.balance}>
        <label className={styles.balanceLabel}>
          {balanceLabel || t('dashboard.walletBalance')}
        </label>
        <p className={styles.balanceValue}>
          {balance} {symbol}
        </p>
      </div>
      {showAddtionial && (
        <div className={styles.addtionInfo}>
          {addtionInfo.map(info => (
            <div className={styles.addtionialRow} key={nanoid()}>
              <label className={styles.addtionialLabel}>{info.label}</label>
              <p className={styles.addtionialValue}>{info.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AmountInput

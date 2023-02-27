import React, { FC, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useWithdrawFromNaiVault } from 'clients/api'
import { useAuth } from 'clients/web3'

import AmountInput from 'components/AmountInput'
import Button from 'components/Button'

import useConvertWeiToReadableTokenString from 'hooks/useConvertWeiToReadableTokenString'
import useHandleTransactionMutation from 'hooks/useHandleTransactionMutation'

import type { Vault } from 'types'

import { convertTokensToWei, getBigNumber, unsafelyGetToken } from 'utilities'

interface WithdrawProps {
  readonly pool: Vault
}

const Withdraw: FC<WithdrawProps> = ({ pool }: WithdrawProps) => {
  const { t } = useTranslation()
  const [withdrawAmount, setWithdrawAmount] = useState<number | string>('')

  const handleTransactionMutation = useHandleTransactionMutation()

  const token = unsafelyGetToken(pool.stakedTokenId)

  const { accountAddress } = useAuth()

  const { mutateAsync: withdraw, isLoading: isWithdrawLoading } = useWithdrawFromNaiVault()

  const readableTokenBalance = useConvertWeiToReadableTokenString({
    valueWei: pool.userStakedWei,
    addSymbol: true,
    token
  })

  const maxTokenAmount = useConvertWeiToReadableTokenString({
    valueWei: pool.userStakedWei,
    addSymbol: false,
    token
  })

  const amountBiNumber = useMemo(() => getBigNumber(withdrawAmount), [withdrawAmount])
  const amountValid = useMemo(
    () => amountBiNumber.isGreaterThan(0) && amountBiNumber.isLessThanOrEqualTo(maxTokenAmount),
    [amountBiNumber, maxTokenAmount]
  )

  const buttonState = useMemo(
    () => ({
      disabled: !amountValid,
      text: amountValid ? t('stake.withdraw') : t('enable.amountInValid', { action: 'withdraw' })
    }),
    [amountValid]
  )

  const withdrawAsset = useCallback(() => {
    const amountWei = convertTokensToWei({
      value: amountBiNumber,
      token
    })

    handleTransactionMutation({
      mutate: () =>
        withdraw({
          amountWei,
          fromAccountAddress: accountAddress
        }),
      modalProps: ({ isError, message, error }) => {
        if (isError) {
          return {
            content: (message || error?.message) as string
          }
        }
      }
    })
  }, [accountAddress, amountBiNumber])

  return (
    <>
      <AmountInput
        value={withdrawAmount}
        max={maxTokenAmount}
        onChange={setWithdrawAmount}
        balance={readableTokenBalance}
        balanceLabel={t('withdrawModal.withdrawable')}
        disabled={isWithdrawLoading}
      />
      <Button onClick={withdrawAsset} loading={isWithdrawLoading} disabled={buttonState.disabled}>
        {buttonState.text}
      </Button>
    </>
  )
}

export default Withdraw

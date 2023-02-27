import React, { FC, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import isBefore from 'date-fns/isBefore'

import { useExecuteWithdrawalFromNwlVault, useGetNwlVaultLockedDeposits } from 'clients/api'
import { useAuth } from 'clients/web3'

import AmountInput from 'components/AmountInput'
import Button from 'components/Button'

import useConvertWeiToReadableTokenString from 'hooks/useConvertWeiToReadableTokenString'
import useHandleTransactionMutation from 'hooks/useHandleTransactionMutation'

import type { Vault } from 'types'

import { getBigNumber, unsafelyGetToken } from 'utilities'

interface WithdrawNwlProps {
  readonly pool: Vault
}

const WithdrawNwl: FC<WithdrawNwlProps> = ({ pool }: WithdrawNwlProps) => {
  const token = unsafelyGetToken(pool.stakedTokenId)
  const rewardToken = unsafelyGetToken(pool.rewardTokenId)

  const { t } = useTranslation()
  const [withdrawAmount, setWithdrawNwlAmount] = useState<number | string>('')

  const handleTransactionMutation = useHandleTransactionMutation()

  const { mutateAsync: withdraw, isLoading: isWithdrawLoading } = useExecuteWithdrawalFromNwlVault({
    stakedTokenId: pool.stakedTokenId
  })

  const { accountAddress } = useAuth()

  const {
    data: nwlVaultUserLockedDepositsData = {
      lockedDeposits: []
    },
    isLoading: isGetLockedDepositsLoading
  } = useGetNwlVaultLockedDeposits(
    {
      poolIndex: pool.poolIndex as number,
      rewardTokenAddress: rewardToken.address,
      accountAddress
    },
    {
      placeholderData: {
        lockedDeposits: []
      }
    }
  )

  const withdrawableWei = useMemo(() => {
    const now = Date.now()
    return nwlVaultUserLockedDepositsData.lockedDeposits.reduce(
      (acc, nwlVaultUserLockedDeposit) =>
        isBefore(nwlVaultUserLockedDeposit.unlockedAt, now)
          ? acc.plus(nwlVaultUserLockedDeposit.amountWei)
          : acc,
      getBigNumber(0)
    )
  }, [nwlVaultUserLockedDepositsData.lockedDeposits])

  const readableWithdrawableAmount = useConvertWeiToReadableTokenString({
    valueWei: withdrawableWei,
    addSymbol: true,
    token
  })

  const maxWithdrawableAmount = useConvertWeiToReadableTokenString({
    valueWei: withdrawableWei,
    addSymbol: false,
    token
  })

  const amountValid = useMemo(() => withdrawableWei.isGreaterThan(0), [withdrawableWei])

  const buttonState = useMemo(
    () => ({
      disabled: !amountValid,
      text: t('stake.withdraw')
    }),
    [amountValid]
  )

  const withdrawAsset = useCallback(() => {
    handleTransactionMutation({
      mutate: () =>
        withdraw({
          poolIndex: pool.poolIndex as number,
          fromAccountAddress: accountAddress,
          rewardTokenAddress: rewardToken.address
          // amountWei,
        }),
      modalProps: ({ isError, message, error }) => {
        if (isError) {
          return {
            content: (message || error?.message) as string
          }
        }
      }
    })
  }, [accountAddress, pool])

  const isLoading = useMemo(
    () => isGetLockedDepositsLoading || isWithdrawLoading,
    [isGetLockedDepositsLoading, isWithdrawLoading]
  )

  return (
    <>
      <AmountInput
        hiddenInput
        value={withdrawAmount}
        max={maxWithdrawableAmount}
        onChange={setWithdrawNwlAmount}
        balance={readableWithdrawableAmount}
        balanceLabel={t('withdrawModal.withdrawable')}
        disabled={isLoading}
      />
      <Button onClick={withdrawAsset} loading={isLoading} disabled={buttonState.disabled}>
        {buttonState.text}
      </Button>
    </>
  )
}

export default WithdrawNwl

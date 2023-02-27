import React, { FC, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  useGetNwlVaultLockedDeposits,
  useGetNwlVaultUserInfo,
  useRequestWithdrawalFromNwlVault
} from 'clients/api'
import { useAuth } from 'clients/web3'

import AmountInput from 'components/AmountInput'
import Button from 'components/Button'

import { TOKENS } from 'constants/tokens'

import useConvertWeiToReadableTokenString from 'hooks/useConvertWeiToReadableTokenString'
import useHandleTransactionMutation from 'hooks/useHandleTransactionMutation'

import type { Vault } from 'types'

import { convertTokensToWei, getBigNumber, stringify } from 'utilities'

import styles from './index.module.scss'

interface RequestWithdrawProps {
  readonly pool: Vault
  viewWithdrawRequestList: () => void
}

const token = TOKENS.nwl

const RequestWithdraw: FC<RequestWithdrawProps> = ({
  pool,
  viewWithdrawRequestList
}: RequestWithdrawProps) => {
  const { t } = useTranslation()
  const [requestAmount, setRequestAmount] = useState<number | string>('')

  const handleTransactionMutation = useHandleTransactionMutation()

  const { accountAddress } = useAuth()

  const { mutateAsync: requestWithdrawalFromNwlVault, isLoading } =
    useRequestWithdrawalFromNwlVault()

  const {
    data: userLockedDepositsData = {
      lockedDeposits: []
    }
  } = useGetNwlVaultLockedDeposits(
    {
      poolIndex: pool.poolIndex as number,
      rewardTokenAddress: token.address,
      accountAddress
    },
    {
      placeholderData: {
        lockedDeposits: []
      }
    }
  )

  const { data: nwlVaultUserInfo } = useGetNwlVaultUserInfo({
    poolIndex: pool.poolIndex as number,
    rewardTokenAddress: token.address,
    accountAddress
  })

  const requestableWei = useMemo(() => {
    if (!nwlVaultUserInfo?.stakedAmountWei) {
      return getBigNumber(0)
    }

    // Subtract sum of all active withdrawal requests amounts to amount of requested and in withdraw progress
    const pendingLockedDepositsSum = userLockedDepositsData.lockedDeposits.reduce(
      (acc, nwlVaultUserLockedDeposit) => acc.plus(nwlVaultUserLockedDeposit.amountWei),
      getBigNumber(0)
    )
    return nwlVaultUserInfo.stakedAmountWei.minus(pendingLockedDepositsSum)
  }, [stringify(userLockedDepositsData.lockedDeposits), stringify(nwlVaultUserInfo)])

  const readableRequestableAmount = useConvertWeiToReadableTokenString({
    valueWei: requestableWei,
    addSymbol: true,
    token
  })

  const maxWithdrawBalance = useConvertWeiToReadableTokenString({
    valueWei: requestableWei,
    addSymbol: false,
    token
  })

  const requestAmountBiNumber = useMemo(() => getBigNumber(requestAmount), [requestAmount])
  const amountValid = useMemo(
    () =>
      requestAmountBiNumber.isGreaterThan(0) &&
      requestAmountBiNumber.isLessThanOrEqualTo(getBigNumber(maxWithdrawBalance)),
    [requestAmountBiNumber, maxWithdrawBalance]
  )

  const buttonState = useMemo(
    () => ({
      disabled: !amountValid,
      text: amountValid
        ? t('withdrawModal.request')
        : t('enable.amountInValid', { action: 'request' })
    }),
    [amountValid]
  )

  const requestWithdrawal = useCallback(() => {
    handleTransactionMutation({
      mutate: () =>
        requestWithdrawalFromNwlVault({
          poolIndex: pool.poolIndex as number,
          fromAccountAddress: accountAddress,
          rewardTokenAddress: token.address,
          amountWei: convertTokensToWei({
            value: requestAmountBiNumber,
            token
          })
        }),
      modalProps: ({ isError, message, error }) => {
        if (isError) {
          return {
            content: (message || error?.message) as string
          }
        }
      }
    })
  }, [requestAmountBiNumber, accountAddress])

  return (
    <>
      <AmountInput
        value={requestAmount}
        max={maxWithdrawBalance}
        onChange={setRequestAmount}
        balance={readableRequestableAmount}
        balanceLabel={t('withdrawModal.withdrawable')}
        disabled={isLoading}
        addtionInfo={[
          {
            label: t('withdrawModal.lockingPeriod'),
            value: '5 minutes'
          }
        ]}
      />
      <Button loading={isLoading} onClick={requestWithdrawal} disabled={buttonState.disabled}>
        {buttonState.text}
      </Button>
      <div className={styles.viewRequestList}>
        <span onClick={viewWithdrawRequestList} className={styles.viewText}>
          {t('withdrawModal.requestList')}
        </span>
      </div>
    </>
  )
}

export default RequestWithdraw

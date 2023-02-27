import React, { FC, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useGetBalanceOf, useStakeInNaiVault, useStakeInNwlVault } from 'clients/api'
import { useAuth } from 'clients/web3'

import AmountInput from 'components/AmountInput'
import Button from 'components/Button'

import { TOKENS } from 'constants/tokens'

import useConvertWeiToReadableTokenString from 'hooks/useConvertWeiToReadableTokenString'
import useHandleTransactionMutation from 'hooks/useHandleTransactionMutation'

import type { Vault } from 'types'

import { convertTokensToWei, getBigNumber, unsafelyGetToken } from 'utilities'

interface StakeAssetProps {
  readonly pool: Vault
}

const StakeAsset: FC<StakeAssetProps> = ({ pool }: StakeAssetProps) => {
  const { t } = useTranslation()
  const [stakeAmount, setStakeAmount] = useState<number | string>('')

  const handleTransactionMutation = useHandleTransactionMutation()

  const token = unsafelyGetToken(pool.stakedTokenId)
  const rewardToken = unsafelyGetToken(pool.rewardTokenId)

  const { accountAddress } = useAuth()
  const { data: tokenBalance } = useGetBalanceOf({
    accountAddress,
    token
  })

  const readableTokenBalance = useConvertWeiToReadableTokenString({
    valueWei: tokenBalance?.balanceWei,
    addSymbol: true,
    token
  })

  const maxTokenAmount = useConvertWeiToReadableTokenString({
    valueWei: tokenBalance?.balanceWei,
    addSymbol: false,
    token
  })

  const { mutateAsync: stakeInNwlVault, isLoading: isStakeInNwlVaultLoading } = useStakeInNwlVault({
    stakedTokenId: token.id
  })

  const { mutateAsync: stakeInNaiVault, isLoading: isStakeInNaiVaultLoading } = useStakeInNaiVault()

  const amountBiNumber = useMemo(() => getBigNumber(stakeAmount), [stakeAmount])
  const amountValid = useMemo(
    () =>
      amountBiNumber.isGreaterThan(0) &&
      amountBiNumber.isLessThanOrEqualTo(tokenBalance?.balanceWei ?? getBigNumber(0)),
    [amountBiNumber, tokenBalance]
  )

  const buttonState = useMemo(
    () => ({
      disabled: !amountValid,
      text: amountValid ? t('stake.stake') : t('enable.amountInValid', { action: 'stake' })
    }),
    [amountValid]
  )

  const stakeAsset = useCallback(() => {
    const amountWei = convertTokensToWei({
      value: amountBiNumber,
      token
    })

    handleTransactionMutation({
      mutate: () => {
        if (token.address === TOKENS.nwl.address) {
          return stakeInNwlVault({
            fromAccountAddress: accountAddress,
            rewardTokenAddress: rewardToken.address,
            poolIndex: pool.poolIndex as number,
            amountWei
          })
        }
        return stakeInNaiVault({
          fromAccountAddress: accountAddress,
          amountWei
        })
      },
      modalProps: ({ isError, message, error }) => {
        if (isError) {
          return {
            content: (message || error?.message) as string
          }
        }
      }
    })
  }, [accountAddress, amountBiNumber])

  const isLoading = useMemo(
    () => isStakeInNwlVaultLoading || isStakeInNaiVaultLoading,
    [isStakeInNwlVaultLoading, isStakeInNaiVaultLoading]
  )

  return (
    <>
      <AmountInput
        value={stakeAmount}
        max={maxTokenAmount}
        onChange={setStakeAmount}
        balance={readableTokenBalance}
        balanceLabel={t('stakeModal.available')}
        disabled={isLoading}
      />
      <Button onClick={stakeAsset} loading={isLoading} disabled={buttonState.disabled}>
        {buttonState.text}
      </Button>
    </>
  )
}

export default StakeAsset

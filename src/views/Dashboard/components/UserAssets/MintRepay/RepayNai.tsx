import React, { FC, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useModal } from 'react-modal-better-hooks'

import BigNumber from 'bignumber.js'

import { useGetBalanceOf, useGetMintedNai, useRepayNai } from 'clients/api'
import { useAuth } from 'clients/web3'

import AmountInput from 'components/AmountInput'
import ApproveToken from 'components/ApproveToken'
import Button from 'components/Button'
import ConnectWrapper from 'components/ConnectWrapper'

import { BLOCK_TIME_MS } from 'constants/bsc'
import { TOKENS } from 'constants/tokens'

import useConvertWeiToReadableTokenString from 'hooks/useConvertWeiToReadableTokenString'
import useHandleTransactionMutation from 'hooks/useHandleTransactionMutation'

import { ConnectWalletId } from 'modals/ConectWallet'

import { convertTokensToWei, convertWeiToTokens, getBigNumber, getContractAddress } from 'utilities'

import styles from './index.module.scss'

const naiUnitrollerContractAddress = getContractAddress('naiUnitroller')

const RepayNai: FC = () => {
  const { t } = useTranslation()
  const [repayAmount, setRepayAmount] = useState<number | string>('')
  const [, { open }] = useModal(ConnectWalletId)

  const { accountAddress } = useAuth()

  const { mutateAsync: contractRepayNai, isLoading: isRepayNaiLoading } = useRepayNai()

  const { data: userNaiBalanceData } = useGetBalanceOf(
    {
      accountAddress,
      token: TOKENS.nai
    },
    {
      enabled: Boolean(accountAddress),
      refetchInterval: BLOCK_TIME_MS
    }
  )

  const { data: userMintedVaiData } = useGetMintedNai(
    {
      accountAddress
    },
    {
      enabled: Boolean(accountAddress)
    }
  )

  const userBalanceWei = useMemo(() => userNaiBalanceData?.balanceWei, [userNaiBalanceData])
  const userMintedWei = useMemo(() => userMintedVaiData?.mintedNaiWei, [userMintedVaiData])

  const unRepayNaiable = useMemo(() => userMintedWei?.eq(0), [userMintedWei])
  const repayBigNumber = useMemo(() => getBigNumber(repayAmount), [repayAmount])

  const amountValid = useMemo(
    () =>
      !(
        repayBigNumber.isGreaterThan(getBigNumber(userBalanceWei)) ||
        repayBigNumber.isZero() ||
        repayBigNumber.isNaN()
      ),
    [repayBigNumber, userBalanceWei]
  )

  const handleTransactionMutation = useHandleTransactionMutation()

  const limitTokens = useMemo(() => {
    const limitWei =
      userBalanceWei && userMintedWei
        ? BigNumber.minimum(userBalanceWei, userMintedWei)
        : new BigNumber(0)

    return convertWeiToTokens({ valueWei: limitWei, token: TOKENS.nai }).toFixed()
  }, [userBalanceWei?.toFixed(), userMintedWei?.toFixed()])

  const readableRepayableNai = useConvertWeiToReadableTokenString({
    valueWei: userMintedWei,
    token: TOKENS.nai
  })

  const readableNaiBalance = useConvertWeiToReadableTokenString({
    valueWei: userBalanceWei,
    token: TOKENS.nai
  })

  const repayNai = useCallback(() => {
    const amountWei = convertTokensToWei({
      value: new BigNumber(repayAmount),
      token: TOKENS.nai
    })

    handleTransactionMutation({
      mutate: () =>
        contractRepayNai({
          fromAccountAddress: accountAddress,
          amountWei: amountWei.toFixed()
        }),
      modalProps: ({ isError, error, message }) => {
        setRepayAmount('')
        if (isError) {
          return {
            content: (message || error?.message) as string
          }
        }
      }
    })
  }, [accountAddress, repayAmount])

  const buttonState = useMemo(() => {
    if (unRepayNaiable) {
      return {
        disabled: true,
        text: t('dashboard.repay')
      }
    }

    return {
      disabled: !amountValid,
      text: amountValid ? t('dashboard.repay') : t('enable.amountInValid', { action: 'repay' })
    }
  }, [amountValid, unRepayNaiable])

  return (
    <div className={styles.mintRepayPart}>
      <ApproveToken
        desc={t('mintRepayVai.repayVai.enableToken')}
        asset={TOKENS.nai}
        spenderAddress={naiUnitrollerContractAddress}
      >
        <div className={styles.mintRepayContent}>
          <AmountInput
            value={repayAmount}
            onChange={setRepayAmount}
            disabled={isRepayNaiLoading || unRepayNaiable}
            max={limitTokens}
            balance={readableNaiBalance}
            addtionInfo={[
              {
                label: t('amount.availableLimit', { token: 'NAI' }),
                value: readableRepayableNai
              }
            ]}
          />
          <ConnectWrapper
            unConnected={
              <Button type="primary" onClick={open} ghost>
                {t('connect.connectWallet')}
              </Button>
            }
          >
            <Button onClick={repayNai} loading={isRepayNaiLoading} disabled={buttonState.disabled}>
              {buttonState.text}
            </Button>
          </ConnectWrapper>
        </div>
      </ApproveToken>
    </div>
  )
}

export default RepayNai

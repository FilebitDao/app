import React, { FC, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useModal } from 'react-modal-better-hooks'

import {
  useGetBalanceOf,
  useGetMintableNai,
  useGetNaiTreasuryPercentage,
  useMintNai
} from 'clients/api'
import { useAuth } from 'clients/web3'

import AmountInput from 'components/AmountInput'
import ApproveToken from 'components/ApproveToken'
import Button from 'components/Button'
import ConnectWrapper from 'components/ConnectWrapper'

import { BLOCK_TIME_MS } from 'constants/fil'
import PLACEHOLDER_KEY from 'constants/placeholderKey'
import { TOKENS } from 'constants/tokens'

import useConvertWeiToReadableTokenString from 'hooks/useConvertWeiToReadableTokenString'
import useHandleTransactionMutation from 'hooks/useHandleTransactionMutation'

import { ConnectWalletId } from 'modals/ConectWallet'

import { convertTokensToWei, convertWeiToTokens, getBigNumber, getContractAddress } from 'utilities'

import getReadableFeeNai from './getReadableFeeNai'
import styles from './index.module.scss'

const naiUnitrollerContractAddress = getContractAddress('naiUnitroller')

export const MintNai: FC = () => {
  const { t } = useTranslation()
  const [mintAmount, setMintAmount] = useState<number | string>('')
  const { mutateAsync: contractMintNai, isLoading: isMintNaiLoading } = useMintNai()
  const [, { open }] = useModal(ConnectWalletId)

  const { accountAddress } = useAuth()

  const { data: balanceOfNai } = useGetBalanceOf(
    {
      token: TOKENS.nai,
      accountAddress
    },
    {
      enabled: Boolean(accountAddress),
      refetchInterval: BLOCK_TIME_MS
    }
  )

  const { data: getUserMintableNaiWeiData } = useGetMintableNai(
    {
      accountAddress
    },
    {
      enabled: Boolean(accountAddress),
      refetchInterval: BLOCK_TIME_MS
    }
  )

  const { data: naiTreasuryPercentageData } = useGetNaiTreasuryPercentage()

  const limitWei = useMemo(
    () => getUserMintableNaiWeiData?.mintableVaiWei,
    [getUserMintableNaiWeiData]
  )
  const mintFeePercentage = useMemo(
    () => naiTreasuryPercentageData?.percentage,
    [naiTreasuryPercentageData]
  )

  const handleTransactionMutation = useHandleTransactionMutation()

  const limitTokens = useMemo(
    () =>
      limitWei ? convertWeiToTokens({ valueWei: limitWei, token: TOKENS.nai }).toFixed() : '0',
    [limitWei?.toFixed()]
  )

  const readableNaiLimit = useConvertWeiToReadableTokenString({
    valueWei: limitWei,
    token: TOKENS.nai
  })

  const readableNaiBalance = useConvertWeiToReadableTokenString({
    valueWei: balanceOfNai?.balanceWei,
    token: TOKENS.nai
  })

  const mintBigNumber = useMemo(() => getBigNumber(mintAmount), [mintAmount])

  const mintWei = useMemo(
    () =>
      convertTokensToWei({
        value: mintBigNumber,
        token: TOKENS.nai
      }),
    [mintBigNumber]
  )

  const unMintAble = useMemo(() => limitWei?.eq(0), [limitWei])

  const amountValid = useMemo(
    () =>
      !(
        mintBigNumber.isGreaterThan(getBigNumber(limitWei)) ||
        mintBigNumber.isZero() ||
        mintBigNumber.isNaN()
      ),
    [mintBigNumber, limitWei]
  )

  const mintFee = useMemo(() => {
    if (!mintFeePercentage) {
      return PLACEHOLDER_KEY
    }

    const readableFeeVai = getReadableFeeNai({
      valueWei: mintWei,
      mintFeePercentage
    })

    return `${readableFeeVai} (${mintFeePercentage}%)`
  }, [mintWei, mintFeePercentage])

  const handleMint = useCallback(() => {
    handleTransactionMutation({
      mutate: () =>
        contractMintNai({
          amountWei: mintWei,
          fromAccountAddress: accountAddress
        }),
      modalProps: ({ isError, error, message }) => {
        setMintAmount('')
        if (isError) {
          return {
            content: (message || error?.message) as string
          }
        }
      }
    })
  }, [mintWei, accountAddress])

  const buttonState = useMemo(() => {
    if (unMintAble) {
      return {
        disabled: true,
        text: t('dashboard.mint')
      }
    }

    return {
      disabled: !amountValid,
      text: amountValid ? t('dashboard.mint') : t('enable.amountInValid', { action: 'mint' })
    }
  }, [amountValid, unMintAble])

  return (
    <div className={styles.mintRepayPart}>
      <ApproveToken
        desc={t('mintRepayVai.mintVai.enableToken')}
        asset={TOKENS.nai}
        spenderAddress={naiUnitrollerContractAddress}
      >
        <div className={styles.mintRepayContent}>
          <AmountInput
            value={mintAmount}
            disabled={isMintNaiLoading || unMintAble}
            onChange={setMintAmount}
            max={limitTokens}
            balance={readableNaiBalance}
            addtionInfo={[
              {
                label: t('amount.availableLimit', { token: 'NAI' }),
                value: readableNaiLimit
              },
              {
                label: t('amount.mintFee'),
                value: mintFee
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
            <Button onClick={handleMint} loading={isMintNaiLoading} disabled={buttonState.disabled}>
              {buttonState.text}
            </Button>
          </ConnectWrapper>
        </div>
      </ApproveToken>
    </div>
  )
}

export default MintNai

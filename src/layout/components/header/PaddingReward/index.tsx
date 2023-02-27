import React, { FC, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { useClaimNwlReward, useGetNwlReward } from 'clients/api'
import { useAuth } from 'clients/web3'

import Spiner from 'components/Spiner'

import { MIN_CLAIMBLE_AMOUNT } from 'constants/minClaimableAmount'
import { TOKENS } from 'constants/tokens'

import useConvertWeiToReadableTokenString from 'hooks/useConvertWeiToReadableTokenString'
import useHandleTransactionMutation from 'hooks/useHandleTransactionMutation'

import { ReactComponent as PendingClaim } from 'assets/img/narwhal/pending-claim.svg'

import styles from './index.module.scss'

const PaddingReward: FC = () => {
  const { t } = useTranslation()
  const { accountAddress } = useAuth()

  const { data: nwlRewardData } = useGetNwlReward(
    { accountAddress },
    { enabled: Boolean(accountAddress) }
  )

  const handleTransactionMutation = useHandleTransactionMutation()

  const readableAmount = useConvertWeiToReadableTokenString({
    valueWei: nwlRewardData?.nwlRewardWei,
    token: TOKENS.nwl,
    minimizeDecimals: true,
    shortenLargeValue: true
  })

  const { mutateAsync: claimNwlReward, isLoading } = useClaimNwlReward()

  const handleClick = useCallback(() => {
    if (
      !nwlRewardData?.nwlRewardWei ||
      nwlRewardData.nwlRewardWei.isLessThan(MIN_CLAIMBLE_AMOUNT)
    ) {
      return
    }

    handleTransactionMutation({
      mutate: () =>
        claimNwlReward({
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
  }, [nwlRewardData?.nwlRewardWei, accountAddress])

  if (nwlRewardData?.nwlRewardWei?.isZero()) {
    return null
  }

  return (
    <>
      <div className={styles.paddingReward} onClick={handleClick}>
        <PendingClaim width={18} height={18} />
        {t('dashboard.pendingClaim')}: {readableAmount}
        {isLoading && <Spiner theme="white" inButton={false} size={18} />}
      </div>
    </>
  )
}

export default PaddingReward

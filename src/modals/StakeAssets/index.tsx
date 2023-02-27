import React, { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { ModalBasicProps } from 'react-modal-better-hooks'

import Stake from './components/Stake'
import ApproveToken from 'components/ApproveToken'
import BaseModal from 'components/Modal'

import { TOKENS } from 'constants/tokens'

import type { Vault } from 'types'

import { getContractAddress, unsafelyGetToken } from 'utilities'

export interface StakeAssetProps {
  readonly pool: Vault
}

export const StakeAssetId = 'StakeAssetId'

const StakeAsset: FC<ModalBasicProps<StakeAssetProps>> = ({
  visible,
  pool
}: ModalBasicProps<StakeAssetProps>) => {
  const { t } = useTranslation()

  const token = unsafelyGetToken(pool.stakedTokenId)
  const spenderAddress = useMemo(
    () =>
      token.address === TOKENS.nwl.address
        ? getContractAddress('nwlVaultProxy')
        : getContractAddress('naiVault'),
    []
  )

  const desc = useMemo(
    () =>
      t('dashboard.needApprove', {
        action: 'stake',
        direction: 'to',
        symbol: token.symbol
      }),
    []
  )

  return (
    <BaseModal
      large
      opened={visible}
      modalId={StakeAssetId}
      title={t('stakeModal.stake', { symbol: token.symbol })}
    >
      <ApproveToken desc={desc} asset={token} spenderAddress={spenderAddress}>
        <Stake pool={pool} />
      </ApproveToken>
    </BaseModal>
  )
}

export default StakeAsset

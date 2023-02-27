import React, { FC, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ModalBasicProps, useModal } from 'react-modal-better-hooks'

import { useEnterMarkets } from 'clients/api'
import { useAuth } from 'clients/web3'

import Button from 'components/Button'
import BaseModal from 'components/Modal'
import { toast } from 'components/Toast'

import type { Asset, Token } from 'types'

import { unsafelyGetNToken } from 'utilities'

import styles from './index.module.scss'

export interface EnableAsCollateralProps {
  readonly asset: Asset
}

export const EnableAsCollateralId = 'EnableAsCollateralId'

const EnableAsCollateral: FC<ModalBasicProps<EnableAsCollateralProps>> = ({
  visible,
  asset
}: ModalBasicProps<EnableAsCollateralProps>) => {
  const { t } = useTranslation()
  const [, { close }] = useModal(EnableAsCollateralId)

  const nToken = useMemo<Token>(() => unsafelyGetNToken(asset.token.id), [asset.token.id])

  const { mutateAsync: enterMarkets, isLoading } = useEnterMarkets()
  const { accountAddress } = useAuth()

  const enableAssest = useCallback(async () => {
    try {
      await enterMarkets({ nTokenAddresses: [nToken.address], accountAddress })
      close()
    } catch (e) {
      toast.error({
        message: t('dashboard.errors.collateralDisableError', {
          assetName: asset.token.symbol
        })
      })
    }
  }, [nToken, accountAddress, asset])

  return (
    <BaseModal
      large
      opened={visible}
      modalId={EnableAsCollateralId}
      title={t('enable.title', { symbol: asset?.token?.symbol })}
    >
      <div className={styles.enalbeAssest}>
        <p className={styles.desc}>{t('enable.description')}</p>
        <a className={styles.more}>{t('enable.more')}</a>
        <Button protect loading={isLoading} onClick={enableAssest}>
          {t('enable.button')}
        </Button>
      </div>
    </BaseModal>
  )
}

export default EnableAsCollateral

import React, { FC, useCallback, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { useFaucetClaim, useGetBalanceOfAll } from 'clients/api'
import { useAuth } from 'clients/web3'

import Button from 'components/Button'
import Symbol from 'components/Symbol'
import TableContainer from 'components/Table'

import { FIL_FAUCET_URL } from 'constants/bsc'
import { TOKENS } from 'constants/tokens'
import { FAUCETING_STATE, FAUCET_LIMIT } from 'constants/tokens/faucet'

import { Token } from 'types'

import { convertWeiToTokens, getBigNumber, openUrl, stringify } from 'utilities'

import styles from './index.module.scss'

interface FaucetAssetRow {
  readonly token: Token
  readonly balance: string
  readonly limit: string
}

const Faucet: FC = () => {
  const { t } = useTranslation()
  const { mutate: faucetClaim } = useFaucetClaim()
  const { accountAddress } = useAuth()
  const { data: allBalance } = useGetBalanceOfAll({
    accountAddress
  })
  const faucetLoading = useRef(FAUCETING_STATE)

  const assets = useMemo(
    () =>
      Object.values(TOKENS).map(token => ({
        token,
        limit: FAUCET_LIMIT[token.id],
        balance: convertWeiToTokens({
          valueWei: allBalance?.[token.id] || getBigNumber(0),
          returnInReadableFormat: true,
          shortenLargeValue: false,
          addSymbol: true,
          token
        })
      })),
    [stringify(allBalance)]
  )

  const faucetToken = useCallback(
    async (token: Token) => {
      if (token.isNative) {
        openUrl(FIL_FAUCET_URL)
        return
      }

      faucetLoading.current[token.id] = true
      await faucetClaim({
        accountAddress,
        symbol: token.symbol
      })
      faucetLoading.current[token.id] = false
    },
    [accountAddress]
  )

  const faucetColumns = [
    {
      label: t('market.assest'),
      render: (row: FaucetAssetRow) => (
        <Symbol symbol={row.token.symbol} icon={row.token.asset} iconSize={30} />
      )
    },
    {
      label: t('dashboard.walletBalance'),
      dataIndex: 'balance'
    },
    {
      label: t('faucet.limitTitle'),
      render: (row: FaucetAssetRow) =>
        row.token.isNative
          ? '-'
          : t('faucet.limitAmount', {
              symbol: row.token.symbol,
              amount: row.limit
            })
    },
    {
      render: (row: FaucetAssetRow) => (
        <Button
          onClick={() => faucetToken(row.token)}
          protect={!row.token.isNative}
          loading={faucetLoading.current[row.token.id]}
          small
          ghost
        >
          {t('faucet.claim')}
        </Button>
      )
    }
  ]

  return (
    <div className={styles.faucet}>
      <h1 className={styles.title}>{t('faucet.title')}</h1>
      <TableContainer<FaucetAssetRow> columns={faucetColumns} data={assets} />
    </div>
  )
}

export default Faucet

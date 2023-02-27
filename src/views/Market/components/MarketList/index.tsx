import React, { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import BigNumber from 'bignumber.js'

import Accordion from 'components/Accordion'
import Symbol from 'components/Symbol'

import type { Market, Token } from 'types'

import { stringify, unsafelyGetToken } from 'utilities'

import DetailCard from './DetailCard'
import styles from './index.module.scss'

interface MarketListProps {
  readonly markets: Market[]
}

interface MarketRow extends Market {
  readonly token: Token
  readonly depositTotalApyValue: BigNumber
  readonly borrowTotalApyValue: BigNumber
}

const MarketList: FC<MarketListProps> = ({ markets }: MarketListProps) => {
  const { t } = useTranslation()

  const marketsData = useMemo<MarketRow[]>(
    () =>
      markets.map(market => ({
        ...market,
        depositTotalApyValue: market.supplyApy.plus(market.supplyNarwhalApy),
        borrowTotalApyValue: market.borrowApy.plus(market.borrowNarwhalApy),
        token: unsafelyGetToken(market.id)
      })),
    [stringify(markets)]
  )

  return (
    <div className={styles.markets}>
      <Accordion<MarketRow>
        title={t('market.markets')}
        data={marketsData}
        getId={row => row.token.address}
        summaryRender={row => <Symbol symbol={row.token.symbol} icon={row.token.asset} />}
        detailRender={row => <DetailCard market={row} />}
      />
    </div>
  )
}

export default MarketList

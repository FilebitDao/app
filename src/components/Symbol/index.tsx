import React, { FC } from 'react'

import classnames from 'classnames'

import { ReactComponent as EthLogo } from 'assets/img/narwhal/eth-logo.svg'

import styles from './index.module.scss'

interface SymbolProps {
  readonly symbol: string
  readonly icon?: string
  readonly iconSize?: number
}

const Symbol: FC<SymbolProps> = ({ symbol, icon, iconSize = 24 }: SymbolProps) => (
  <div className={classnames(['symbol-component', styles.symbol])}>
    {icon ? (
      <img src={icon} width={iconSize} height={iconSize} />
    ) : (
      <EthLogo width={iconSize} height={iconSize} />
    )}
    <span className={classnames(['symbol-name', styles.symbolName])}>{symbol}</span>
  </div>
)

export default Symbol

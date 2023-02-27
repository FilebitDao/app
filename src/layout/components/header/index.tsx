import React, { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, matchPath, useLocation } from 'react-router-dom'

import classnames from 'classnames'

import { useAuth } from 'clients/web3'

import Path from 'constants/path'

import useTheme from 'hooks/useTheme'

import { ReactComponent as LogoLight } from 'assets/img/narwhal/logo-dark.svg'
import { ReactComponent as LogoDark } from 'assets/img/narwhal/logo-light.svg'
import { ReactComponent as PlainLogo } from 'assets/img/narwhal/plain-logo.svg'

import AddToken from './AddToken'
import ConnectWallet from './ConnectWallet'
import DrawerMenu from './DrawerMenu'
import PaddingReward from './PaddingReward'
import Settings from './Settings'
import styles from './index.module.scss'

const Header: FC = () => {
  const { pathname } = useLocation()
  const { t } = useTranslation()
  const { isDark } = useTheme()
  const { connected } = useAuth()

  const linkActive = useMemo(
    () => ({
      market:
        pathname === Path.MARKETS ||
        matchPath(pathname, {
          path: Path.MARKET_DETAILS,
          exact: true,
          strict: true
        }),
      dashboard: pathname === Path.ROOT,
      stake: pathname === Path.STAKE,
      faucet: pathname === Path.FAUCET
    }),
    [pathname]
  )

  return (
    <div className={styles.header}>
      <div className={styles.links}>
        <a className={styles.richLogo} href={process.env.REACT_APP_LANDING_PAGE}>
          {isDark ? <LogoLight /> : <LogoDark />}
        </a>
        <a className={styles.plainLogo} href={process.env.REACT_APP_LANDING_PAGE}>
          <PlainLogo width={38} height={29} />
        </a>
        <div className={styles.linksWrapper}>
          <Link
            to={Path.ROOT}
            className={classnames([styles.linkItem, linkActive.dashboard ? styles.activeLink : ''])}
          >
            {t('header.dashboard')}
          </Link>
          <Link
            to={Path.MARKETS}
            className={classnames([styles.linkItem, linkActive.market ? styles.activeLink : ''])}
          >
            {t('header.market')}
          </Link>
          <Link
            to={Path.STAKE}
            className={classnames([styles.linkItem, linkActive.stake ? styles.activeLink : ''])}
          >
            {t('header.stake')}
          </Link>
          <Link
            to={Path.FAUCET}
            className={classnames([styles.linkItem, linkActive.faucet ? styles.activeLink : ''])}
          >
            {t('header.faucet')}
          </Link>
        </div>
      </div>
      <div className={styles.functions}>
        <AddToken />
        {connected && linkActive.dashboard && <PaddingReward />}
        <ConnectWallet />
        <Settings />
        <DrawerMenu />
      </div>
    </div>
  )
}

export default Header

import React, { FC, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, matchPath, useLocation } from 'react-router-dom'

import { Drawer } from '@mui/material'
import classnames from 'classnames'

import Path from 'constants/path'

import useTheme from 'hooks/useTheme'

import { ReactComponent as CloseIcon } from 'assets/img/narwhal/close.svg'
import { ReactComponent as ToDark } from 'assets/img/narwhal/dark.svg'
import { ReactComponent as ToLight } from 'assets/img/narwhal/light.svg'
import { ReactComponent as MenuTrigger } from 'assets/img/narwhal/menu-trigger.svg'

import styles from './index.module.scss'

const DrawerMenu: FC = () => {
  const { pathname } = useLocation()
  const { t } = useTranslation()
  const [open, setOpen] = useState<boolean>(false)

  const { isDark, toggleTheme } = useTheme()

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

  useEffect(() => {
    setOpen(() => false)
  }, [pathname])

  return (
    <>
      <div className={styles.menuTrigger} onClick={() => setOpen(true)}>
        <MenuTrigger width={16} height={16} />
      </div>
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <div className={styles.drawerMenu}>
          <div className={styles.close} onClick={() => setOpen(false)}>
            <CloseIcon width={14} height={14} />
          </div>
          <div className={styles.linksWrapper}>
            <Link
              to={Path.ROOT}
              className={classnames([
                styles.linkItem,
                linkActive.dashboard ? styles.activeLink : ''
              ])}
            >
              <span className={styles.linkText}>{t('header.dashboard')}</span>
            </Link>
            <Link
              to={Path.MARKETS}
              className={classnames([styles.linkItem, linkActive.market ? styles.activeLink : ''])}
            >
              <span className={styles.linkText}>{t('header.market')}</span>
            </Link>
            <Link
              to={Path.STAKE}
              className={classnames([styles.linkItem, linkActive.stake ? styles.activeLink : ''])}
            >
              <span className={styles.linkText}>{t('header.stake')}</span>
            </Link>
            <Link
              to={Path.FAUCET}
              className={classnames([styles.linkItem, linkActive.faucet ? styles.activeLink : ''])}
            >
              <span className={styles.linkText}>{t('header.faucet')}</span>
            </Link>
          </div>
          <div className={styles.themeSwitcher} onClick={toggleTheme}>
            {isDark ? <ToLight width={24} height={24} /> : <ToDark width={24} height={24} />}
          </div>
        </div>
      </Drawer>
    </>
  )
}

export default DrawerMenu

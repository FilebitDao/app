import { useWeb3React } from '@web3-react/core'
import React, { FC, MouseEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Fade, Menu } from '@mui/material'

import { useAuth } from 'clients/web3'

import Button from 'components/Button'

import useConnectWallet from 'hooks/useConnectWallet'
import useCopyToClipboard from 'hooks/useCopyToClipboard'

import { truncateAddress } from 'utilities'

import { ReactComponent as AccountAvatar } from 'assets/img/narwhal/account.svg'

import styles from './index.module.scss'

const ConnectWallet: FC = () => {
  const { t } = useTranslation()
  const [position, setPosition] = useState<{
    top: number
    left: number
  }>({
    top: 0,
    left: 0
  })
  const [anchorEl, setAnchorEl] = useState<null | HTMLDivElement>(null)

  const opened = useMemo(() => Boolean(anchorEl), [anchorEl])
  const id = useMemo(() => (opened ? 'account-menu-popover' : undefined), [opened])

  const { chainId } = useWeb3React()
  const { connected, accountAddress, logOut } = useAuth()
  const connectWallet = useConnectWallet()

  const shortenedAddress = useMemo(() => truncateAddress(accountAddress), [accountAddress])

  const openWallet = useCallback(
    (evt: MouseEvent<HTMLDivElement>) => {
      if (!connected) {
        connectWallet()
        return
      }

      setAnchorEl(evt.currentTarget)
    },
    [connected]
  )

  const closeMenu = useCallback(() => setAnchorEl(null), [])
  const disconnect = useCallback(() => {
    logOut()
    closeMenu()
  }, [])

  const copy = useCopyToClipboard(closeMenu)

  useEffect(() => {
    if (opened) {
      const rect = anchorEl?.getBoundingClientRect()

      if (rect) {
        setPosition({
          top: rect.top + rect.height + 5,
          left: rect.left + 90
        })
      }
    }
  }, [opened, anchorEl])

  return (
    <>
      <div className={styles.connectWallet} onClick={openWallet}>
        {connected ? shortenedAddress : t('connect.connectWallet')}
      </div>
      <Menu
        id={id}
        open={opened}
        anchorEl={anchorEl}
        elevation={0}
        aria-controls={opened ? 'fade-menu' : undefined}
        aria-expanded={opened ? 'true' : undefined}
        anchorReference="anchorPosition"
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        anchorPosition={position}
        className={styles.accountMenu}
        onClose={closeMenu}
        TransitionComponent={Fade}
      >
        <div className={styles.menuContent}>
          <div className={styles.userAddress}>
            <AccountAvatar width={30} height={30} />
            <span className={styles.address}>{shortenedAddress}</span>
            <span className={styles.copy} onClick={() => copy(accountAddress)}>
              {t('connect.copy')}
            </span>
          </div>
          <div className={styles.network}>
            {t('connect.network')}
            <span className={styles.networkId}>{chainId}</span>
          </div>
          <Button small ghost onClick={disconnect}>
            {t('connect.disconnect')}
          </Button>
        </div>
      </Menu>
    </>
  )
}

export default ConnectWallet

import React, { FC, MouseEvent, useCallback, useEffect, useMemo, useState } from 'react'
import SwipeableViews from 'react-swipeable-views'

import { Fade, Menu } from '@mui/material'

import { ReactComponent as SettingsIcon } from 'assets/img/narwhal/settings.svg'

import InitialCard from './InitialCard'
import SelectLocaleCard from './SelectLocaleCard'
import { PANEL_ENUMS } from './enum'
import styles from './index.module.scss'

const Settings: FC = () => {
  const [position, setPosition] = useState<{
    top: number
    left: number
  }>({
    top: 0,
    left: 0
  })
  const [anchorEl, setAnchorEl] = useState<null | HTMLSpanElement>(null)
  const [panel, setPanel] = useState<PANEL_ENUMS>(PANEL_ENUMS.INITIAL_PANEL)

  const opened = useMemo(() => Boolean(anchorEl), [anchorEl])
  const id = useMemo(() => (opened ? 'settings-popover' : undefined), [opened])
  const viewIndex = useMemo(() => Number(panel !== PANEL_ENUMS.INITIAL_PANEL), [panel])

  const toggleMenu = useCallback(
    (evt: MouseEvent<HTMLSpanElement>) => {
      if (opened) {
        setAnchorEl(null)
        return
      }
      setAnchorEl(evt.currentTarget)
    },
    [opened]
  )

  useEffect(() => {
    if (opened) {
      const rect = anchorEl?.getBoundingClientRect()

      if (rect) {
        setPosition({
          top: rect.top + rect.height + 5,
          left: rect.left + 20
        })
      }
    }
  }, [opened, anchorEl])

  return (
    <>
      <span className={styles.settings} onClick={toggleMenu}>
        <SettingsIcon width={20} height={20} />
      </span>
      <Menu
        id={id}
        open={opened}
        anchorEl={anchorEl}
        elevation={0}
        aria-controls={opened ? 'fade-menu' : undefined}
        aria-expanded={opened ? 'true' : undefined}
        onClose={toggleMenu}
        anchorReference="anchorPosition"
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        anchorPosition={position}
        className={styles.settingsMenu}
        TransitionComponent={Fade}
      >
        <div className={styles.menuContent}>
          <SwipeableViews autoPlay={false} index={viewIndex} className={styles.swipeAbleViews}>
            <InitialCard updatePanel={setPanel} />
            <SelectLocaleCard updatePanel={setPanel} />
          </SwipeableViews>
        </div>
      </Menu>
    </>
  )
}

export default Settings

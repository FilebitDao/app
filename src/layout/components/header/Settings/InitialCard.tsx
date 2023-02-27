import React, { FC, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'

import classnames from 'classnames'

import Switcher from 'components/Switcher'

import useTheme from 'hooks/useTheme'

import { ReactComponent as ArrowRight } from 'assets/img/narwhal/arrow-right.svg'

import { PANEL_ENUMS } from './enum'
import styles from './index.module.scss'

interface InitialCardProps {
  updatePanel: (panel: SetStateAction<PANEL_ENUMS>) => void
}

const InitialCard: FC<InitialCardProps> = ({ updatePanel }: InitialCardProps) => {
  const { t } = useTranslation()
  const { isDark, toggleTheme } = useTheme()

  return (
    <div className={styles.settingsCard}>
      <div className={classnames([styles.settingsRow, styles.noMargin])}>
        {t('settings.darkMode')}
        <Switcher checked={isDark} protect={false} onEnable={toggleTheme} onDisable={toggleTheme} />
      </div>
      <div
        className={classnames([styles.settingsRow, styles.localeRow])}
        onClick={() => updatePanel(PANEL_ENUMS.SELECT_LOCALE)}
      >
        {t('settings.language')}
        <div className={styles.currentLocale}>
          English
          <ArrowRight width={13} height={9} />
        </div>
      </div>
    </div>
  )
}

export default InitialCard

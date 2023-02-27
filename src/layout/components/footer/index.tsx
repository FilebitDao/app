import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { ReactComponent as Discord } from 'assets/img/narwhal/discord.svg'
import { ReactComponent as Mail } from 'assets/img/narwhal/mail.svg'
import { ReactComponent as Telegram } from 'assets/img/narwhal/telegram.svg'
import { ReactComponent as Twitter } from 'assets/img/narwhal/twitter.svg'

import styles from './index.module.scss'

const Footer: FC = () => {
  const { t } = useTranslation()

  return (
    <div className={styles.footer}>
      <div className={styles.logoContainer}>
        <div className={styles.logo} />
        {t('footer.copy')}
      </div>
      <div className={styles.textIcons}>
        <span className={styles.service}>{t('footer.termOfService')}</span>
        <a className={styles.iconWrapper}>
          <Twitter />
        </a>
        <a className={styles.iconWrapper}>
          <Telegram />
        </a>
        <a className={styles.iconWrapper}>
          <Discord />
        </a>
        <a className={styles.iconWrapper}>
          <Mail />
        </a>
      </div>
    </div>
  )
}

export default Footer

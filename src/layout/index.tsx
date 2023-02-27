import React, { FC } from 'react'
import type { PropsWithChildren } from 'react'

import Footer from './components/footer'
import Header from './components/header'

import styles from './index.module.scss'

type LayoutProps = PropsWithChildren<unknown>

const Layout: FC<LayoutProps> = ({ children }: LayoutProps) => (
  <div className={styles.layout}>
    <div className={styles.layoutNested}>
      <Header />
      <div className={styles.pageContainer}>{children}</div>
    </div>
    <Footer />
  </div>
)

export default Layout

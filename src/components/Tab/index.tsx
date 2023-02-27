import React, { FC, ReactElement, cloneElement, useCallback, useMemo, useState } from 'react'

import classnames from 'classnames'
import { nanoid } from 'nanoid'

import styles from './index.module.scss'

interface TabProps {
  readonly tabs: string[]
  readonly content: ReactElement[]
  readonly initialTab?: number
  readonly small?: boolean
}

export interface TabContentProps {
  readonly tabMounted?: boolean
}

const Tab: FC<TabProps> = ({ tabs, content, initialTab, small }: TabProps) => {
  const [tab, setTab] = useState<number>(initialTab ?? 0)

  const tabContent = useMemo<ReactElement>(() => content[tab], [tab, content])

  const switchTab = useCallback(
    (index: number) => {
      if (tab === index) {
        return
      }

      setTab(() => index)
    },
    [tab]
  )

  return (
    <div className={classnames(['tab-component', styles.tabs])}>
      <div className={classnames(['tab-switcher', styles.tabSwitcher])}>
        {tabs.map((item: string, index: number) => (
          <div
            key={nanoid()}
            onClick={() => switchTab(index)}
            className={classnames([
              'tab-item',
              index === tab && 'tab-active-item',
              small && styles.smallTabItem,
              styles.tabItem,
              index === tab && styles.tabItemActive
            ])}
          >
            {item}
          </div>
        ))}
      </div>
      <div className={classnames(['tab-content', styles.tabContent])}>
        {cloneElement(tabContent, {
          tabMounted: true
        })}
      </div>
    </div>
  )
}

export default Tab

import React, { ReactNode, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  Accordion as MuiAccordion,
  AccordionDetails as MuiAccordionDetails,
  AccordionSummary as MuiAccordionSummary
} from '@mui/material'
import classnames from 'classnames'

import { ReactComponent as CollapseIcon } from 'assets/img/narwhal/collapse-accroding.svg'

import styles from './index.module.scss'

interface AccordionProps<T> {
  readonly title: string
  readonly data: T[]
  readonly getId: (row: T) => string
  readonly summaryRender: (row: T) => ReactNode
  readonly detailRender: (row: T) => ReactNode
}

const Accordion = <T extends unknown>({
  title,
  data,
  getId,
  summaryRender,
  detailRender
}: AccordionProps<T>) => {
  const [expandedId, setExpanded] = useState<string | boolean>(false)
  const isEmpty = useMemo(() => data.length === 0, [data])

  const { t } = useTranslation()

  return (
    <div className={classnames(['accordion', styles.accordion])}>
      <h1 className={styles.title}>{title}</h1>
      <div>
        {data.map((row: T) => {
          const id: string = getId(row)

          return (
            <MuiAccordion
              TransitionProps={{ unmountOnExit: true }}
              expanded={expandedId === id}
              onChange={() => setExpanded(expanded => (expanded === id ? false : id))}
              key={id}
            >
              <MuiAccordionSummary expandIcon={<CollapseIcon />}>
                {summaryRender(row)}
              </MuiAccordionSummary>
              <MuiAccordionDetails>{detailRender(row)}</MuiAccordionDetails>
            </MuiAccordion>
          )
        })}
        {isEmpty && (
          <div className={styles.empty}>
            <div className={styles.icon} />
            <p className={styles.tip}>{t('noData')}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Accordion

import React, { FC, ReactNode, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import type { TableCellProps } from '@mui/material/TableCell'
import BigNumber from 'bignumber.js'
import classnames from 'classnames'
import { nanoid } from 'nanoid'

import { ReactComponent as AscActiveIcon } from 'assets/img/narwhal/asc-active.svg'
import { ReactComponent as AscIcon } from 'assets/img/narwhal/asc.svg'
import { ReactComponent as CollapseIcon } from 'assets/img/narwhal/collapse.svg'
import { ReactComponent as DscActiveIcon } from 'assets/img/narwhal/dsc-active.svg'
import { ReactComponent as DscIcon } from 'assets/img/narwhal/dsc.svg'

import styles from './index.module.scss'

export type ColumnType<T> = {
  key?: string
  label?: string
  dataIndex?: string
  sortable?: boolean
  className?: string
  value?: string
  render?: (row: T) => ReactNode
}

interface SortProps {
  readonly activeMethod?: 'asc' | 'desc'
}

interface TableProps<T> {
  readonly title?: string
  readonly columns: ColumnType<T>[]
  readonly cellProps?: TableCellProps
  readonly rowKey?: $TSFixMe
  readonly collapse?: boolean
  readonly initialOrder?: {
    orderBy: string
    orderDirection: 'asc' | 'desc'
  }
  readonly data: T[]
  readonly onRowClick?: (row: T) => void
}

const Sort: FC<SortProps> = ({ activeMethod }: SortProps) => (
  <div className={styles.sort}>
    {activeMethod === 'asc' ? (
      <AscActiveIcon width={8} height={4} />
    ) : (
      <AscIcon width={8} height={4} />
    )}
    {activeMethod === 'desc' ? (
      <DscActiveIcon width={8} height={4} />
    ) : (
      <DscIcon width={8} height={4} />
    )}
  </div>
)

const TableContainer = <T extends unknown>({
  title,
  columns,
  data,
  cellProps,
  rowKey,
  collapse,
  initialOrder,
  onRowClick
}: TableProps<T>) => {
  const [collapsed, setCollapse] = useState(collapse)
  const [orderBy, setOrderBy] = useState(initialOrder?.orderBy)
  const [orderDirection, setOrderDirection] = useState(initialOrder?.orderDirection)

  const { t } = useTranslation()

  const rows = useMemo<T[]>(() => {
    if (!orderBy) {
      return data
    }
    const newRows = [...data]
    newRows.sort((prev, next) => {
      const prevValue = prev[orderBy]
      const nextValue = next[orderBy]

      const isCompareBigNumber = prevValue instanceof BigNumber

      if (isCompareBigNumber) {
        if (prevValue.isLessThan(nextValue)) {
          return orderDirection === 'asc' ? -1 : 1
        }
        if (prevValue.isGreaterThan(nextValue)) {
          return orderDirection === 'asc' ? 1 : -1
        }
      } else {
        if (prevValue < nextValue) {
          return orderDirection === 'asc' ? -1 : 1
        }
        if (prevValue > nextValue) {
          return orderDirection === 'asc' ? 1 : -1
        }
      }
      return 0
    })
    return newRows
  }, [data, orderBy, orderDirection])

  const rowClickable = useMemo(() => typeof onRowClick === 'function', [onRowClick])

  const clickRow = useCallback(
    (row: T) => {
      if (!rowClickable) {
        return
      }

      onRowClick?.(row)
    },
    [rowClickable]
  )

  const onRequestOrder = useCallback(
    (property, sortable) => {
      if (!sortable) {
        return
      }

      if (property === orderBy && orderDirection === 'desc') {
        setOrderBy(undefined)
        setOrderDirection(undefined)
        return
      }

      let newOrder: 'asc' | 'desc' = 'asc'
      if (property === orderBy) {
        newOrder = orderDirection === 'asc' ? 'desc' : 'asc'
      }

      setOrderBy(property)
      setOrderDirection(newOrder)
    },
    [orderBy, orderDirection]
  )

  const collapseTable = useCallback(() => {
    if (!collapsed) {
      setCollapse(true)
      setOrderBy(initialOrder?.orderBy)
      setOrderBy(initialOrder?.orderDirection)
      return
    }

    setCollapse(false)
  }, [collapsed, initialOrder])

  const isEmpty = useMemo(() => data.length === 0, [data])

  return (
    <div className={classnames([styles.table, 'table-component'])}>
      {Boolean(title) && <h1 className={styles.title}>{title}</h1>}
      <Table>
        <TableHead>
          <TableRow>
            {columns.map(column => {
              const { sortable } = column
              const sorting = orderBy === column.key
              const canSort = !collapsed && sortable && !isEmpty

              return (
                <TableCell
                  key={nanoid()}
                  {...cellProps}
                  className={classnames([
                    'table-header-cell',
                    cellProps?.className,
                    column.className
                  ])}
                >
                  <div className={styles.cellContainer}>
                    <div
                      className={classnames([styles.tableHeadCell, canSort && styles.sortable])}
                      onClick={() => onRequestOrder(column.key, column.sortable)}
                    >
                      {column.label}
                      {/* eslint no-nested-ternary: 0 */}
                      {canSort ? sorting ? <Sort activeMethod={orderDirection} /> : <Sort /> : null}
                    </div>
                  </div>
                </TableCell>
              )
            })}
          </TableRow>
          {collapse && (
            <div
              onClick={collapseTable}
              className={classnames([styles.collapse, { [styles.collapsed]: collapsed }])}
            >
              <CollapseIcon width={16} height={28} />
            </div>
          )}
        </TableHead>
        {!collapsed && (
          <TableBody>
            {rows.map(row => {
              const rowId = row[rowKey] ?? nanoid()

              return (
                <TableRow
                  key={rowId}
                  className={classnames([rowClickable && styles.rowClickable])}
                  onClick={() => clickRow(row)}
                >
                  {columns.map(column => (
                    <TableCell
                      key={nanoid()}
                      {...cellProps}
                      className={classnames([
                        'table-body-cell',
                        cellProps?.className,
                        column.className
                      ])}
                    >
                      <div className={styles.cellContainer}>
                        {column.render ? column.render(row) : row[column.dataIndex as keyof T]}
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              )
            })}
          </TableBody>
        )}
      </Table>
      {isEmpty && (
        <div className={styles.empty}>
          <div className={styles.icon} />
          <p className={styles.tip}>{t('noData')}</p>
        </div>
      )}
    </div>
  )
}

export default TableContainer

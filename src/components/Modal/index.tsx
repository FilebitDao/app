import { animated, useSpring } from '@react-spring/web'
import React, { FC, PropsWithChildren, ReactElement, ReactNode, forwardRef } from 'react'
import { useModal } from 'react-modal-better-hooks'

import { Modal as MuiModal } from '@mui/material'
import classnames from 'classnames'

import { noop } from 'utilities'

import { ReactComponent as CloseIcon } from 'assets/img/narwhal/close.svg'

import styles from './index.module.scss'

interface ModalProps {
  readonly opened: boolean
  readonly title: string | ReactNode | ReactElement
  readonly modalId?: string
  readonly closeable?: boolean
  readonly titleCenter?: boolean
  readonly large?: boolean
  readonly onClose?: $TsFixMeFunction
}

interface AnimatedProps {
  readonly in: boolean
}

const Animated = forwardRef<HTMLDivElement, PropsWithChildren<AnimatedProps>>(
  ({ in: open, children, ...restProps }, ref) => {
    const style = useSpring({
      from: {
        opacity: 0,
        transform: 'translateY(100%)'
      },
      to: {
        opacity: open ? 1 : 0,
        transform: open ? 'translateY(0)' : 'translateY(100%)'
      },
      config: {
        tension: 120,
        friction: 14
      }
    })

    return (
      <animated.div ref={ref} style={style} {...restProps}>
        {children}
      </animated.div>
    )
  }
)

const Modal: FC<PropsWithChildren<ModalProps>> = ({
  title,
  modalId,
  children,
  opened,
  titleCenter,
  large,
  onClose = noop,
  closeable = true
}: PropsWithChildren<ModalProps>) => {
  const [, { close }] = useModal(modalId || '')

  return (
    <MuiModal open={opened} onClose={modalId ? close : onClose}>
      <Animated in={opened}>
        <div className={classnames([styles.modal, large && styles.modalLarge])}>
          <div className={classnames([styles.modalTitle, titleCenter && styles.titleCenter])}>
            <h1 className={styles.title}>{title}</h1>
            {closeable && (
              <span className={styles.modalClose} onClick={modalId ? close : onClose}>
                <CloseIcon width={15} />
              </span>
            )}
          </div>
          <div className={styles.modalContent}>{children}</div>
        </div>
      </Animated>
    </MuiModal>
  )
}

export default Modal

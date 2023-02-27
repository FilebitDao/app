import React, { FC } from 'react'
import { ToastOptions, toast as toastify } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'

import { Notice, NoticeVariant } from 'components/Notice'

import { ReactComponent as CloseIcon } from 'assets/img/narwhal/close.svg'

import styles from './index.module.scss'

interface ToastArgs {
  message: string
}
interface ToastProps extends ToastArgs {
  type: NoticeVariant
}
interface CloseButtonProps {
  closeToast: () => void
}

const CloseButton: FC<CloseButtonProps> = ({ closeToast }: CloseButtonProps) => (
  <div className={styles.closeIcon} onClick={closeToast}>
    <CloseIcon width={12} height={12} />
  </div>
)

const ToastComponent: FC<ToastProps> = ({ message, type = 'info' }: ToastProps) => (
  <>
    <Notice description={message} variant={type} />
  </>
)

const defaultOptions: ToastOptions = {
  position: 'top-right',
  hideProgressBar: true,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: false,
  progress: undefined,
  autoClose: 3000,
  closeButton: CloseButton as ToastOptions['closeButton']
}

export const toast = ({ message, type = 'info' }: ToastProps, options?: ToastOptions) => {
  toastify(<ToastComponent message={message} type={type} />, {
    ...defaultOptions,
    ...options
  })
}

toast.info = (content: ToastArgs, options?: ToastOptions) =>
  toast({ ...content, type: 'info' }, options)

toast.error = (content: ToastArgs, options?: ToastOptions) =>
  toast({ ...content, type: 'error' }, options)

toast.success = (content: ToastArgs, options?: ToastOptions) =>
  toast({ ...content, type: 'success' }, options)

toast.warning = (content: ToastArgs, options?: ToastOptions) =>
  toast({ ...content, type: 'warning' }, options)

toast.update = toastify.update

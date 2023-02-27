import { useTranslation } from 'react-i18next'

import copyToClipboard from 'copy-to-clipboard'

import { toast } from 'components/Toast'

import { noop } from 'utilities'

const useCopyToClipboard = (callback = noop) => {
  const { t } = useTranslation()
  return (str: string) => {
    copyToClipboard(str)
    toast.success({
      message: t('interactive.copyToClipboard')
    })
    callback()
  }
}

export default useCopyToClipboard

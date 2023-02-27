import config from 'config'

import unsafelyGetToken from './unsafelyGetToken'

export type UrlType = 'address' | 'token' | 'tx'

export const generateFilScanUrl = <T extends UrlType = 'address'>(
  identifier: string,
  urlType?: T
) => {
  const safeUrlType = urlType || 'address'

  let suffix: string = identifier
  if (safeUrlType === 'token') {
    suffix = unsafelyGetToken(identifier).address
  }

  return `${config.filScanUrl}/${safeUrlType}/${suffix}?network=${process.env.REACT_APP_NETWORK_NAME}`
}

export default generateFilScanUrl

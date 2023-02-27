import { NFRC20_TOKENS } from 'constants/tokens'

import { Token } from 'types'

const getNTokenByAddress = (address: string) => {
  let token: Token | undefined

  Object.keys(NFRC20_TOKENS)
    .filter(key => Object.prototype.hasOwnProperty.call(NFRC20_TOKENS, key))
    .forEach(tokenId => {
      const currentToken = NFRC20_TOKENS[tokenId as keyof typeof NFRC20_TOKENS]
      if (currentToken?.address.toLowerCase() === address.toLowerCase()) {
        token = currentToken
      }
    })

  return token
}

export default getNTokenByAddress

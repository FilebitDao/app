import { TOKENS } from 'constants/tokens'

import { Token } from 'types'

const getTokenByAddress = (address: string) => {
  let token: Token | undefined

  Object.keys(TOKENS)
    .filter(key => Object.prototype.hasOwnProperty.call(TOKENS, key))
    .forEach(tokenId => {
      const currentToken = TOKENS[tokenId as keyof typeof TOKENS]
      if (currentToken?.address === address) {
        token = currentToken
      }
    })

  return token
}

export default getTokenByAddress

import { TOKENS } from 'constants/tokens'

const ASSETS_TO_ADD = [TOKENS.fil, TOKENS.nai, TOKENS.nwl, TOKENS.wbtc, TOKENS.weth]

const watchAddest = options =>
  window.ethereum?.request?.({
    method: 'wallet_watchAsset',
    params: {
      type: 'ERC20',
      options
    }
  })

const useAddToken = () => {
  const addToken = () => {
    ASSETS_TO_ADD.forEach(token =>
      watchAddest({
        address: token.address,
        symbol: token.symbol,
        decimals: token.decimals,
        image: ''
      })
    )
  }

  return addToken
}

export default useAddToken

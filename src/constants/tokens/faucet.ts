import { TOKENS } from 'constants/tokens'

export const FAUCET_LIMIT = {
  [TOKENS.wbtc.id]: '0.1',
  [TOKENS.weth.id]: '0.5',
  [TOKENS.fil.id]: '100',
  [TOKENS.nwl.id]: '200',
  [TOKENS.nai.id]: '200'
}

export const FAUCETING_STATE = {
  [TOKENS.wbtc.id]: false,
  [TOKENS.weth.id]: false,
  [TOKENS.fil.id]: false,
  [TOKENS.nwl.id]: false,
  [TOKENS.nai.id]: false
}

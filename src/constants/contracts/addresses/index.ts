import { FilChainId } from 'types'

export { default as MAIN_CONTRACT_ADDRESS } from './main.json'
export { default as NFrc20_TOKEN_ADDRESSES } from './nFrc20Tokens.json'
export { default as TOKEN_ADDRESSES } from './tokens.json'

export const MUTLICALL_CONTRACT = {
  [FilChainId.TESTNET]: '0x21763a7151c2B4C498d8a51355e99b49AC749d52',
  [FilChainId.MAINNET]: ''
}

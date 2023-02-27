import { FilChainId } from 'types'

export const BLOCK_TIME_MS = 3e4
// 20 blocks a minute, 60 minutes an hour, 24 hours a day
export const BLOCKS_PER_DAY = (60 / (BLOCK_TIME_MS / 1000)) * 60 * 24

export const FIL_FAUCET_URL = 'https://hyperspace.yoga/#faucet'

// https://explorer.glif.io/tx/0x985885a226f6a41abcae6a9bb077f06026d676fd9e0042694a5ef670d92f320c/?network=hyperspace

export const FIL_SCAN_URLS = {
  [FilChainId.MAINNET]: 'https://bscscan.com',
  [FilChainId.TESTNET]: 'https://explorer.glif.io'
}

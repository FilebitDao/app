import { FilChainId } from 'types'

export const API_ENDPOINT_URLS = {
  [FilChainId.MAINNET]: 'https://api.narwhale-protocol.xyz/api',
  [FilChainId.TESTNET]: 'https://api.narwhale-protocol.xyz/api'
}

export const RPC_URLS: {
  [key: string]: string[]
} = {
  [FilChainId.MAINNET]: [
    'https://bsc-dataseed1.ninicoin.io',
    'https://bsc-dataseed1.defibit.io',
    'https://bsc-dataseed.binance.org'
  ],
  [FilChainId.TESTNET]: ['https://api.hyperspace.node.glif.io/rpc/v1']
}

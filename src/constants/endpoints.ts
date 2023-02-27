import { FilChainId } from 'types'

export const API_ENDPOINT_URLS = {
  [FilChainId.MAINNET]: 'https://narwhal-proxy-api.vercel.app/api',
  [FilChainId.TESTNET]: 'https://narwhal-proxy-api.vercel.app/api'
}

export const RPC_URLS: {
  [key: string]: string[]
} = {
  [FilChainId.MAINNET]: [
    'https://bsc-dataseed1.ninicoin.io',
    'https://bsc-dataseed1.defibit.io',
    'https://bsc-dataseed.binance.org'
  ],
  [FilChainId.TESTNET]: ['https://api.hyperspace.node.glif.io/rpc/v0']
}

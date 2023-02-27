/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" />
/// <reference types="react-scripts" />

interface Window {
  ethereum?: Record<string, any>
  BinanceChain?: unknown
}

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production'
    readonly PUBLIC_URL: string
    readonly REACT_APP_CHAIN_ID: string
    readonly REACT_APP_NETWORK_NAME: string
    readonly REACT_APP_LANDING_PAGE: string
  }
}

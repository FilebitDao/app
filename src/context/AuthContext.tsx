import React from 'react'

import { Connector, useAuth } from 'clients/web3'

import { noop } from 'utilities'

export interface Account {
  address: string
  connector?: Connector
}

export interface AuthContextValue {
  login: (connector: Connector) => Promise<void>
  logOut: () => void
  account?: Account
}

export const AuthContext = React.createContext<AuthContextValue>({
  login: noop,
  logOut: noop
})

export const AuthProvider: React.FC = ({ children }) => {
  const { login, accountAddress, logOut, connectedConnector } = useAuth()

  const account = accountAddress
    ? {
        address: accountAddress,
        connector: connectedConnector
      }
    : undefined

  return (
    <AuthContext.Provider
      value={{
        account,
        login,
        logOut
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

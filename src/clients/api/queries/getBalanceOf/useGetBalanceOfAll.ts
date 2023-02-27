import { QueryObserverOptions, useQuery } from 'react-query'

import BigNumber from 'bignumber.js'

import { GetBalanceOfInput, getBalanceOf } from 'clients/api'
import { useWeb3 } from 'clients/web3'

import FunctionKey from 'constants/functionKey'
import { TOKENS } from 'constants/tokens'

interface BalanceOfAllOutPut {
  [key: string]: BigNumber
}

type Options = QueryObserverOptions<
  BalanceOfAllOutPut,
  Error,
  BalanceOfAllOutPut,
  BalanceOfAllOutPut,
  [
    FunctionKey.GET_BALANCE_OFALL,
    {
      accountAddress: string
    }
  ]
>

const useGetBalanceOfAll = (
  { accountAddress }: Omit<GetBalanceOfInput, 'web3' | 'token'>,
  options?: Options
) => {
  const web3 = useWeb3()

  return useQuery(
    [
      FunctionKey.GET_BALANCE_OFALL,
      {
        accountAddress
      }
    ],
    async () => {
      const balances = await Promise.all(
        Object.values(TOKENS).map(token => getBalanceOf({ web3, accountAddress, token }))
      )
      const result = {}
      balances.forEach(balance => {
        result[balance.tokenId] = balance.balanceWei
      })
      return result
    },
    options
  )
}

export default useGetBalanceOfAll

import { UseQueryOptions, UseQueryResult, useQueries } from 'react-query'

import { GetBalanceOfOutput, getBalanceOf } from 'clients/api'
import { useWeb3 } from 'clients/web3'

import { DEFAULT_REFETCH_INTERVAL_MS } from 'constants/defaultRefetchInterval'
import FunctionKey from 'constants/functionKey'

import { Token } from 'types'

import { getContractAddress, getTokenByAddress } from 'utilities'

const NWL_VAULT_PROXY_CONTRACT_ADDRESS = getContractAddress('nwlVaultProxy')

export interface UseGetNwlVaultPoolBalancesInput {
  stakedTokenAddresses: (string | undefined)[]
}

export type UseGetNwlVaultPoolBalancesOutput = UseQueryResult<GetBalanceOfOutput>[]

const useGetNwlVaultPoolBalances = ({
  stakedTokenAddresses
}: UseGetNwlVaultPoolBalancesInput): UseGetNwlVaultPoolBalancesOutput => {
  const web3 = useWeb3()

  // Fetch total amount of tokens staked in each pool
  const queries: UseQueryOptions<GetBalanceOfOutput>[] = stakedTokenAddresses.map(
    stakedTokenAddress => {
      const stakedToken = stakedTokenAddress ? getTokenByAddress(stakedTokenAddress) : undefined

      return {
        queryFn: () =>
          getBalanceOf({
            web3,
            token: stakedToken as Token,
            accountAddress: NWL_VAULT_PROXY_CONTRACT_ADDRESS
          }),
        queryKey: [
          FunctionKey.GET_BALANCE_OF,
          {
            accountAddress: NWL_VAULT_PROXY_CONTRACT_ADDRESS,
            tokenAddress: stakedToken?.address
          }
        ],
        enabled: !!stakedToken,
        refetchInterval: DEFAULT_REFETCH_INTERVAL_MS
      }
    }
  )

  return useQueries(queries)
}

export default useGetNwlVaultPoolBalances

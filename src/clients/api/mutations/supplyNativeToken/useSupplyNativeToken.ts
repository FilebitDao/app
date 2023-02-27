import { MutationObserverOptions, useMutation } from 'react-query'

import supplyNativeToken, {
  SupplyNativeTokenInput,
  SupplyNativeTokenOutput
} from 'clients/api/mutations/supplyNativeToken'
import queryClient from 'clients/api/queryClient'
import { useNTokenContract } from 'clients/contracts/hooks'
import { useWeb3 } from 'clients/web3'

import FunctionKey from 'constants/functionKey'
import { TOKENS } from 'constants/tokens'

import { NFilToken } from 'types/contracts'

export type SupplyNativeTokenParams = Omit<
  SupplyNativeTokenInput,
  'tokenContract' | 'account' | 'web3'
>

const useSupplyNativeToken = (
  { account }: { account: string },
  options?: MutationObserverOptions<SupplyNativeTokenOutput, Error, SupplyNativeTokenParams>
) => {
  const nNativeTokenContract = useNTokenContract<'fil'>('fil')
  const web3 = useWeb3()
  return useMutation(
    FunctionKey.SUPPLY_NATIVE_TOKEN,
    params =>
      supplyNativeToken({
        tokenContract: nNativeTokenContract as NFilToken,
        web3,
        account,
        ...params
      }),
    {
      ...options,
      onSuccess: (...onSuccessParams) => {
        queryClient.invalidateQueries(FunctionKey.GET_N_TOKEN_BALANCES_ALL)
        queryClient.invalidateQueries([
          FunctionKey.GET_N_TOKEN_BALANCE,
          {
            accountAddress: account,
            nTokenId: TOKENS.fil.id
          }
        ])
        queryClient.invalidateQueries(FunctionKey.GET_ASSETS_IN_ACCOUNT)
        queryClient.invalidateQueries(FunctionKey.GET_MARKETS)
        queryClient.invalidateQueries(FunctionKey.GET_N_TOKEN_DAILY_NWL)

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams)
        }
      }
    }
  )
}

export default useSupplyNativeToken

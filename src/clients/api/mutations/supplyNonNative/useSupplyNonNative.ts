import { MutationObserverOptions, useMutation } from 'react-query'

import supplyNonNative, {
  SupplyNonNativeInput,
  SupplyNonNativeOutput
} from 'clients/api/mutations/supplyNonNative'
import queryClient from 'clients/api/queryClient'
import { useNTokenContract } from 'clients/contracts/hooks'

import FunctionKey from 'constants/functionKey'

import { NFrc20 } from 'types/contracts'

export type SupplyNonBnbParams = Omit<SupplyNonNativeInput, 'tokenContract' | 'account'>

const useSupply = (
  { assetId, account }: { assetId: string; account: string },
  // TODO: use custom error type https://app.clickup.com/t/2rvwhnt
  options?: MutationObserverOptions<SupplyNonNativeOutput, Error, SupplyNonBnbParams>
) => {
  const tokenContract = useNTokenContract<string>(assetId)

  return useMutation(
    [FunctionKey.SUPPLY, assetId],
    params =>
      supplyNonNative({
        tokenContract: tokenContract as NFrc20,
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
            nTokenId: assetId
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

export default useSupply

import { useCallback, useMemo } from 'react'

import { useApproveToken, useGetAllowance } from 'clients/api'

import { Token } from 'types'
import type { TransactionReceipt } from 'web3-core/types'

interface UseTokenApprovalInput {
  token: Token
  spenderAddress: string
  accountAddress?: string
}

interface UseTokenApprovalOutput {
  isTokenApproved: boolean | undefined
  isTokenApprovalStatusLoading: boolean
  approveToken: () => Promise<TransactionReceipt | undefined>
  isApproveTokenLoading: boolean
}

const useTokenApproval = ({
  token,
  spenderAddress,
  accountAddress = ''
}: UseTokenApprovalInput): UseTokenApprovalOutput => {
  const { data: getTokenAllowanceData, isLoading: isTokenApprovalStatusLoading } = useGetAllowance(
    {
      accountAddress,
      spenderAddress,
      token
    },
    {
      enabled: Boolean(accountAddress) && !token.isNative
    }
  )

  const isTokenApproved = useMemo(() => {
    if (token.isNative) {
      return true
    }

    if (!getTokenAllowanceData) {
      return undefined
    }

    return getTokenAllowanceData.allowanceWei.isGreaterThan(0)
  }, [token.isNative, getTokenAllowanceData])

  const { mutateAsync: approveTokenMutation, isLoading: isApproveTokenLoading } = useApproveToken({
    token
  })

  const approveToken = useCallback(async () => {
    if (accountAddress) {
      return approveTokenMutation({
        accountAddress,
        spenderAddress
      })
    }
  }, [accountAddress, spenderAddress])

  return {
    isTokenApproved,
    isTokenApprovalStatusLoading,
    approveToken,
    isApproveTokenLoading
  }
}

export default useTokenApproval

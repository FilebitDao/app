import { useMemo } from 'react'

import { Multicall } from 'ethereum-multicall'

import config from 'config'
import { useWeb3 } from 'clients/web3'
import { MUTLICALL_CONTRACT } from 'constants/contracts/addresses'

const useMulticall = () => {
  const web3 = useWeb3()
  return useMemo(() => new Multicall({ web3Instance: web3, tryAggregate: true, multicallCustomContractAddress: '0x21763a7151c2B4C498d8a51355e99b49AC749d52' }), [web3])
}

export default useMulticall

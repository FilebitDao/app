import config from 'config'

import { MAIN_CONTRACT_ADDRESS } from 'constants/contracts/addresses'

const getContractAddress = (contractId: keyof typeof MAIN_CONTRACT_ADDRESS) =>
  MAIN_CONTRACT_ADDRESS[contractId][config.chainId]

export default getContractAddress

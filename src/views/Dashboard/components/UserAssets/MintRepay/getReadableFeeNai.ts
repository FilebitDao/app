import BigNumber from 'bignumber.js'

import { TOKENS } from 'constants/tokens'

import { convertWeiToTokens } from 'utilities'

const getReadableFeeNai = ({
  valueWei,
  mintFeePercentage
}: {
  valueWei: BigNumber
  mintFeePercentage: number | string
}) => {
  const feeWei = new BigNumber(valueWei || 0).multipliedBy(mintFeePercentage).dividedBy(100)
  return convertWeiToTokens({
    valueWei: feeWei,
    token: TOKENS.nai,
    returnInReadableFormat: true
  })
}

export default getReadableFeeNai

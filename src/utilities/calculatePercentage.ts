export interface CalculatePercentageInput {
  numerator: number
  denominator: number
  base?: number
}

const calculatePercentage = ({ numerator, denominator, base = 100 }: CalculatePercentageInput) => {
  if (denominator === 0) {
    return 0
  }

  return (numerator * base) / denominator
}

export default calculatePercentage

import { NFRC20_TOKENS } from 'constants/tokens'

export const unsafelyGetNToken = (id: string) => NFRC20_TOKENS[id as keyof typeof NFRC20_TOKENS]

export default unsafelyGetNToken

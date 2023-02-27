import { TailwindConfigTypes } from 'types/tailwind'

const TAILWINDCONFIG: $TSFixMe = JSON.parse(process.env.TAILWIND || '{}')

const useTailwind = () => TAILWINDCONFIG?.theme?.extend?.backgroundColor as TailwindConfigTypes

export default useTailwind

import React, { FC, useMemo } from 'react'
import LottiePlayer from 'react-lottie-player'

import useTheme from 'hooks/useTheme'

import black from 'assets/lottie/black-spiner.json'
import primary from 'assets/lottie/primary-spiner.json'
import white from 'assets/lottie/white-spiner.json'

import styles from './index.module.scss'

type AnimationType = typeof primary | typeof white

export type SpinerTheme = 'primary' | 'white'

interface SpinerProps {
  readonly theme?: SpinerTheme
  readonly inButton?: boolean
  readonly size?: number
  readonly text?: string
  readonly asBlock?: boolean
}

const Spiner: FC<SpinerProps> = ({
  theme = 'primary',
  size = 50,
  inButton = true,
  text,
  asBlock
}: SpinerProps) => {
  const { isDark } = useTheme()
  const animation = useMemo<AnimationType>(() => {
    if (inButton) {
      return theme === 'primary' ? primary : white
    }

    if (theme !== 'primary') {
      return isDark ? white : black
    }

    return primary
  }, [theme, inButton, isDark])
  const style = useMemo(
    () => ({
      width: size,
      height: size
    }),
    [size]
  )

  if (asBlock) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingContent}>
          <LottiePlayer animationData={animation} style={style} loop play />
          {Boolean(text) && <p className={styles.text}>{text}</p>}
        </div>
      </div>
    )
  }

  return (
    <>
      <LottiePlayer animationData={animation} style={style} loop play />
    </>
  )
}

export default Spiner

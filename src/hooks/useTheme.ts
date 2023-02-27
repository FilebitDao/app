import { useCallback, useContext, useMemo } from 'react'

import { THEME, ThemeContext } from 'context/Theme'

const useTheme = () => {
  const { theme, setTheme } = useContext(ThemeContext)
  const isDark = useMemo(() => theme === THEME.DARK, [theme])

  const toggleTheme = useCallback(() => {
    setTheme(isDark ? THEME.LIGHT : THEME.DARK)
  }, [isDark])

  return {
    theme,
    isDark,
    toggleTheme
  }
}

export default useTheme

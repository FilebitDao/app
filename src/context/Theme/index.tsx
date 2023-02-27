import React, { FC, createContext, useEffect, useState } from 'react'
import type { PropsWithChildren } from 'react'
import { Theme, ToastContainer } from 'react-toastify'

import { noop } from 'utilities'

const THEME_STORAGE_KEY = 'NARWHAL_THEME'

export enum THEME {
  DARK = 'dark',
  LIGHT = 'light'
}

export interface ThemeContextValue {
  theme: THEME | null
  setTheme: (theme: THEME) => void
}

export const ThemeContext = createContext<ThemeContextValue>({
  theme: null,
  setTheme: noop
})

export const ThemeProvider: FC<PropsWithChildren<unknown>> = ({
  children
}: PropsWithChildren<unknown>) => {
  const [theme, setTheme] = useState<THEME | null>(localStorage[THEME_STORAGE_KEY])

  useEffect(() => {
    const rootElement = window.document.documentElement
    rootElement.classList.remove(THEME.DARK)
    rootElement.classList.remove(THEME.LIGHT)
    rootElement.classList.add(theme as string)
    localStorage.setItem(THEME_STORAGE_KEY, theme as string)
  }, [theme])

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme
      }}
    >
      <>
        <ToastContainer theme={theme as Theme} />
        {children}
      </>
    </ThemeContext.Provider>
  )
}

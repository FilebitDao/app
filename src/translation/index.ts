import { initReactI18next } from 'react-i18next'

import { format as formatDate, formatDistanceToNowStrict, isDate } from 'date-fns'
import { enUS } from 'date-fns/locale'
import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import EnLocales from './translations/en.json'

const init = () => {
  i18next
    .use(initReactI18next)
    .use(LanguageDetector)
    .init({
      resources: {
        en: {
          translation: EnLocales
        }
      },
      lng: 'en',
      fallbackLng: 'en',
      detection: {
        caches: ['localStorage', 'sessionStorage', 'cookie']
      },
      interpolation: {
        escapeValue: false,
        format: (value, format, lng) => {
          const locales = { en: enUS }

          if (isDate(value)) {
            const locale = lng && lng in locales ? locales[lng as keyof typeof locales] : locales.en
            if (format === 'distanceToNow') {
              return formatDistanceToNowStrict(value, { locale })
            }

            return formatDate(value, format || 'dd MMM yyyy HH:mm a', { locale })
          }
          return value
        }
      }
    })
  i18next.loadNamespaces('errors')
  return i18next
}

init()

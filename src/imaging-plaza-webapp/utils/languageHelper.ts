import {defaultLanguage, supportedLanguage} from '../constants/intl'

export const getSupportedLanguage = (lang: string) => {
  let language = defaultLanguage
  if (Object.values(supportedLanguage).includes(lang as unknown as supportedLanguage)) {
    language = lang as supportedLanguage
  }
  return language
}

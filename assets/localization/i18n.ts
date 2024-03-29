import i18n from 'i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initReactI18next } from 'react-i18next';
import Constants from 'expo-constants';
import { LANGUAGES, STORAGE_KEYS } from '@/constants/common';

interface LanguageDetectorType {
  type: 'languageDetector';
  async: boolean;
  detect: (callback: (lng: string) => void) => void;
  init: () => void;
  cacheUserLanguage: () => void;
}

const languageDetector: LanguageDetectorType = {
  type: 'languageDetector',
  async: true,
  detect: async (callback) => {
    const storedLanguage = await AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE);
    if (storedLanguage) {
      callback(storedLanguage);
      return;
    }

    const deviceLanguage =
      Constants.deviceLanguage ||
      Constants.systemLanguage ||
      Constants.deviceLocale ||
      LANGUAGES.ENGLISH;

    callback(deviceLanguage);
  },
  init: () => {},
  cacheUserLanguage: () => {}
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: LANGUAGES.ENGLISH,
    debug: false,
    compatibilityJSON: 'v3',

    resources: {
      en: {
        translation: require('./translations/en.json')
      },
      sk: {
        translation: require('./translations/sk.json')
      }
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;

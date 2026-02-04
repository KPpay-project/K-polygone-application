import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { en } from './translations/en';
import { ar } from './translations/ar';
import { fil } from './translations/fil';
import { id } from './translations/id';
import { pt } from './translations/pt';
import { es } from './translations/es';

const resources = {
  en: {
    translation: en,
  },
  ar: {
    translation: ar,
  },
  fil: {
    translation: fil,
  },
  id: {
    translation: id,
  },
  pt: {
    translation: pt,
  },
  es: {
    translation: es,
  },
};

const i18n = i18next.use(initReactI18next);

if (!i18n.isInitialized) {
  i18n.init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });
}

export default i18next;

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "../locales/en.json";
import es from "../locales/es.json";

// Initialize i18n. compatibilityJSON must match the library types; use 'v4' or omit.
i18n.use(initReactI18next).init({
  compatibilityJSON: "v4",
  resources: {
    en: { translation: en },
    es: { translation: es },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

export default i18n;

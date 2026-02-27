import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import translationEN from './en.json';
import translationTH from './th.json';

// สร้าง resources object
export const resources = {
  en: {
    translation: translationEN,
  },
  th: {
    translation: translationTH,
  },
} as const; // ใช้ 'as const' เพื่อให้ TS รู้ค่าที่แน่นอนข้างใน

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    // lng: 'th', // แนะนำให้เอาออกถ้าใช้ LanguageDetector
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
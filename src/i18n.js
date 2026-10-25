import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { translations } from '../src/assets/js/translations';

const resources = {};
Object.keys(translations).forEach(lang => {
    resources[lang] = {
        translation: translations[lang]
    };
});

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
        }
    });

// Handle RTL direction and lang attribute
i18n.on('languageChanged', (lng) => {
    const isRtl = lng === 'ar';
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
});

export default i18n;

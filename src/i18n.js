import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

// the translations
const userLang = navigator.language || navigator.userLanguage;
const defaultLocale = userLang.substring(0, 2);
// const module_name = 'bam'

i18n
    // load translation using http -> see /public/locales
    // learn more: https://github.com/i18next/i18next-http-backend
    .use(Backend)
    // detect user language
    // learn more: https://github.com/i18next/i18next-browser-languageDetector
    .use(LanguageDetector)
    // pass the i18n instance to react-i18next.
    .use(initReactI18next)
    // init i18next
    // for all options read: https://www.i18next.com/overview/configuration-options
    .init({
        // resources,
        lng: defaultLocale,
        fallbackLng: 'en_US',
        debug: true,

        interpolation: {
            escapeValue: false,
        },
        react: {
            wait: true,
            useSuspense: true
        },
        backend: {
            // for all available options read the backend's repository readme file
            loadPath: `${process.env.REACT_APP_CONTEXT_PATH}/locales/{{lng}}/{{ns}}/constants.json`
            // loadPath: `${process.env.REACT_APP_CONTEXT_PATH}/locales/{{lng}}/${module_name}/constants.json`
        }
    });

export default i18n;
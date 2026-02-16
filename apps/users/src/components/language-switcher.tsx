import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'k-polygon-assets/components';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { Globe } from 'lucide-react';
import { Typography } from '@ui/index';
import { useUserCountry } from '@repo/common';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸', nativeName: 'English' },
  { code: 'fr', name: 'Français', flag: '🇫🇷', nativeName: 'Français' },
  { code: 'es', name: 'Español', flag: '🇪🇸', nativeName: 'Español' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪', nativeName: 'Deutsch' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', nativeName: 'العربية' }
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isInitialized, setIsInitialized] = useState(false);
  const { countryCode, loading: countryLoading } = useUserCountry();

  useEffect(() => {
    if (isInitialized) return;
    const storedLanguage = typeof window !== 'undefined' ? localStorage.getItem('preferred-language') : null;
    if (storedLanguage && languages.some((lang) => lang.code === storedLanguage)) {
      i18n.changeLanguage(storedLanguage);
      setIsInitialized(true);
      return;
    }
    if (countryLoading) return;
    if (countryCode) {
      const countryToLanguage: Record<string, string> = {
        NG: 'en',
        US: 'en',
        GB: 'en',
        FR: 'fr',
        ES: 'es',
        DE: 'de',
        SA: 'ar',
        AE: 'ar'
      };
      const mapped = countryToLanguage[countryCode.toUpperCase()];
      if (mapped && languages.some((lang) => lang.code === mapped)) {
        i18n.changeLanguage(mapped);
        localStorage.setItem('preferred-language', mapped);
        setIsInitialized(true);
        return;
      }
    }
    const browserLang = typeof navigator !== 'undefined' ? navigator.language.split('-')[0] : 'en';
    const supportedLang = languages.find((lang) => lang.code === browserLang);
    if (supportedLang) {
      i18n.changeLanguage(supportedLang.code);
      localStorage.setItem('preferred-language', supportedLang.code);
    }
    setIsInitialized(true);
  }, [i18n, isInitialized, countryCode, countryLoading]);

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    localStorage.setItem('preferred-language', languageCode);
  };

  const currentLanguage = languages.find((lang) => lang.code === i18n.language) || languages[0];

  return (
    <Select value={i18n.language} onValueChange={handleLanguageChange}>
      <SelectTrigger
        className="group relative h-10 min-w-[140px] 
      rounded-lg border border-gray-200  px-3 !shadow-none transition-all duration-200 hover:border-gray-300 hover:shadow-md focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600"
      >
        <SelectValue>
          <div className="flex items-center gap-2.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 text-base transition-transform duration-200 group-hover:scale-110 dark:from-blue-900/30 dark:to-indigo-900/30">
              {currentLanguage.flag}
            </div>
            <Typography variant={'small'}>{currentLanguage.nativeName}</Typography>
            <Globe className="ml-auto h-4 w-4 text-gray-400 transition-colors duration-200 group-hover:text-blue-500" />
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="min-w-[200px] rounded-lg border border-gray-200 bg-white p-1 shadow-xl dark:border-gray-700 dark:bg-gray-800">
        {languages.map((language) => {
          const isSelected = language.code === i18n.language;
          return (
            <SelectItem
              key={language.code}
              value={language.code}
              className={`
                cursor-pointer rounded-md px-3 py-2.5 transition-all duration-150
                hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50
                dark:hover:from-blue-900/20 dark:hover:to-indigo-900/20
                ${isSelected ? 'bg-blue-50 dark:bg-blue-900/30' : ''}
              `}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`
                  flex h-8 w-8 items-center justify-center rounded-full text-lg transition-all duration-200
                  ${
                    isSelected
                      ? 'bg-gradient-to-br from-blue-100 to-indigo-100 ring-2 ring-blue-500/30 dark:from-blue-800/50 dark:to-indigo-800/50'
                      : 'bg-gray-50 dark:bg-gray-700/50'
                  }
                `}
                >
                  {language.flag}
                </div>
                <div className="flex flex-col">
                  <span
                    className={`
                    text-sm font-medium transition-colors duration-150
                    ${isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-200'}
                  `}
                  >
                    {language.nativeName}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{language.name}</span>
                </div>
                {isSelected && (
                  <div className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}

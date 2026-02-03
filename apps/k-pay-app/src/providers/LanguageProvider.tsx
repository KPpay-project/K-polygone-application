import i18n from '../i18n';
import React, { useEffect, ReactNode } from 'react';
import { useLanguageStore } from '../store/language-store';

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const { selectedLanguage } = useLanguageStore();

  useEffect(() => {
    // Only change language if i18n is ready and language is different
    if (i18n.isInitialized && i18n.language !== selectedLanguage) {
      i18n.changeLanguage(selectedLanguage).catch((error) => {
        console.error('Failed to change language:', error);
      });
    }
  }, [selectedLanguage]);

  return <>{children}</>;
};

import i18n from '../i18n';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Language {
  id: string;
  name: string;
  code: string;
  flag: string;
}

interface LanguageStore {
  selectedLanguage: string;
  setSelectedLanguage: (languageCode: string) => Promise<void>;
  getSelectedLanguage: () => string;
  languages: Language[];
}

const languages: Language[] = [
  { id: '1', name: 'English', code: 'en', flag: '🇺🇸' },
  { id: '2', name: 'العربية', code: 'ar', flag: '🇸🇦' },
  { id: '3', name: 'Français', code: 'fr', flag: '🇫🇷' },
  { id: '4', name: 'Kiswahili', code: 'sw', flag: '🇹🇿' },
  { id: '5', name: 'Filipino', code: 'fil', flag: '🇵🇭' },
  { id: '6', name: 'Bahasa Indonesia', code: 'id', flag: '🇮🇩' },
  { id: '7', name: 'Português', code: 'pt', flag: '🇵🇹' },
  { id: '8', name: 'Español', code: 'es', flag: '🇪🇸' },
];

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set, get) => ({
      selectedLanguage: 'en',
      languages,

      setSelectedLanguage: async (languageCode: string) => {
        try {
          await i18n.changeLanguage(languageCode);

          set({ selectedLanguage: languageCode });
        } catch (error) {
          console.error('Failed to change language:', error);
        }
      },

      getSelectedLanguage: () => {
        return get().selectedLanguage;
      },
    }),
    {
      storage: createJSONStorage(() => AsyncStorage),
      name: 'language-store',
      version: 1,
      partialize: (state) => ({
        selectedLanguage: state.selectedLanguage,
      }),
    }
  )
);

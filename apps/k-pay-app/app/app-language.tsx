import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Typography, CheckCircle, Checkbox } from '@/components/ui';
import { getColor, getSpacing } from '@/theme';
import { useLanguageStore } from '@/store/language-store';
import { useTranslation } from 'react-i18next';
import { ScreenContainer } from '@/layout/safe-area-layout';
import { HeaderWithTitle } from '@/components';

export default function AppLanguageScreen() {
  const { t } = useTranslation();
  const { selectedLanguage, setSelectedLanguage, languages } =
    useLanguageStore();
  const [isChanging, setIsChanging] = useState(false);

  const handleLanguageSelect = async (languageCode: string) => {
    if (isChanging || languageCode === selectedLanguage) return;

    setIsChanging(true);
    try {
      await setSelectedLanguage(languageCode);
      // Small delay to show the change has been applied
      setTimeout(() => {
        setIsChanging(false);
      }, 500);
    } catch (error) {
      console.error('Failed to change language:', error);
      setIsChanging(false);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <ScreenContainer useSafeArea={true}>
      <View
        style={{
          flex: 1,
          backgroundColor: getColor('background'),
        }}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: getSpacing('lg'),
            paddingTop: getSpacing('xl'),
            paddingBottom: getSpacing('md'),
            backgroundColor: getColor('background'),
          }}
        >
          <HeaderWithTitle title={t('appLanguage') || 'App Language'} />
        </View>
        <ScrollView
          style={{
            flex: 1,
            paddingHorizontal: getSpacing('lg'),
          }}
          showsVerticalScrollIndicator={false}
        >
          <View className="p-6">
            {languages.map((language) => (
              <TouchableOpacity
                key={language.id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingVertical: getSpacing('lg'),
                  marginBottom: getSpacing('md'),
                  borderBottomWidth: 1,
                  borderBottomColor: getColor('border'),
                  opacity: isChanging ? 0.6 : 1,
                }}
                onPress={() => handleLanguageSelect(language.code)}
                disabled={isChanging}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Typography
                    variant="body"
                    style={{
                      marginRight: getSpacing('xs'),
                      fontSize: 20,
                    }}
                  >
                    {language.flag}
                  </Typography>
                  <Typography
                    variant="body"
                    weight="medium"
                    style={{
                      color: getColor('gray.900'),
                    }}
                  >
                    {language.name}
                  </Typography>
                </View>
                <Checkbox
                  checked={selectedLanguage === language.code}
                  onPress={() => handleLanguageSelect(language.code)}
                  size="medium"
                  variant="primary"
                />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}

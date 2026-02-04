import { View, ScrollView, KeyboardAvoidingView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Typography } from '@/components/ui';

import { SafeAreaView } from 'react-native-safe-area-context';

const AuthLayout = () => {
  const { t } = useTranslation();
  return (
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView className="flex-1" behavior="padding">
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <View className="flex-1 justify-center items-center">
              <Typography variant="h3" className="text-gray-900 mb-2">
                {t('welcomeToKPay')}
              </Typography>
              <Typography variant="body" className="text-gray-600">
                {t('pleaseLogInToContinue')}
              </Typography>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

export default AuthLayout;

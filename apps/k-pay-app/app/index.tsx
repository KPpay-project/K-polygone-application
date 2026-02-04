import React, { useEffect } from 'react';
import { router } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../src/contexts/auth-context';
import { usePinCheckRedirect } from '../src/hooks/use-pin-check-redirect';

export default function App() {
  const { isAuthenticated, loading: authLoading } = useAuth();

  const { isChecking } = usePinCheckRedirect({ enabled: isAuthenticated });

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      router.replace('/onboarding');
    }
  }, [isAuthenticated, authLoading]);

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <ActivityIndicator size="large" color="#2563eb" />
    </View>
  );
}

import React, { useEffect, useMemo, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer } from '@/layout/safe-area-layout';
import { HeaderWithTitle } from '@/components';
import { Typography } from '@/components/ui';
import { getSpacing } from '@/theme';
import Toast from 'react-native-toast-message';
import { NativeModulesProxy } from 'expo-modules-core';

type ScanResult = {
  walletCode: string;
  amount?: string;
  description?: string;
};

const parseScanData = (data: string): ScanResult | null => {
  const trimmed = (data || '').trim();
  if (!trimmed) return null;

  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    try {
      const parsed = JSON.parse(trimmed) as any;
      const walletCode =
        parsed?.walletCode ||
        parsed?.receiversWalletCode ||
        parsed?.receiverWalletCode ||
        parsed?.toWalletCode ||
        '';
      if (typeof walletCode !== 'string' || !walletCode.trim()) return null;
      return {
        walletCode: walletCode.trim(),
        amount: typeof parsed?.amount === 'string' ? parsed.amount : undefined,
        description:
          typeof parsed?.description === 'string' ? parsed.description : undefined,
      };
    } catch {
      return null;
    }
  }

  return { walletCode: trimmed };
};

export default function ScanToPayScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  const cameraSupported = useMemo(() => {
    return Boolean((NativeModulesProxy as any)?.ExpoCamera);
  }, []);

  const CameraModule = useMemo(() => {
    if (!cameraSupported) return null;
    try {
      return require('expo-camera') as any;
    } catch {
      return null;
    }
  }, [cameraSupported]);

  useEffect(() => {
    (async () => {
      if (!CameraModule) {
        setHasPermission(false);
        return;
      }
      try {
        const request =
          CameraModule?.requestCameraPermissionsAsync ||
          CameraModule?.Camera?.requestCameraPermissionsAsync;
        if (!request) {
          setHasPermission(false);
          return;
        }
        const result = await request();
        setHasPermission(Boolean(result?.granted));
      } catch {
        setHasPermission(false);
      }
    })();
  }, [CameraModule]);

  const handleScan = (event: any) => {
    if (scanned) return;
    const data = typeof event?.data === 'string' ? event.data : '';
    const parsed = parseScanData(data);
    if (!parsed?.walletCode) {
      Toast.show({
        type: 'error',
        text1: 'Invalid QR code',
      });
      return;
    }
    setScanned(true);
    router.replace({
      pathname: '/send-money/wallet-transfer',
      params: {
        walletCode: parsed.walletCode,
        amount: parsed.amount || '',
        description: parsed.description || '',
      },
    });
  };

  if (!cameraSupported) {
    return (
      <ScreenContainer useSafeArea className="bg-gray-50">
        <HeaderWithTitle px={8} title="Scan to Pay" description="Scan a QR code to pay" />
        <View style={{ paddingHorizontal: getSpacing('xl') }}>
          <View className="bg-white rounded-2xl border border-gray-100 p-4">
            <Typography className="text-gray-900 font-semibold mb-2">
              Camera not available
            </Typography>
            <Typography variant="caption" className="text-gray-600">
              Install and rebuild with expo-camera to enable scanning.
            </Typography>
          </View>
        </View>
      </ScreenContainer>
    );
  }

  if (hasPermission === null) {
    return (
      <ScreenContainer useSafeArea className="bg-gray-50">
        <HeaderWithTitle px={8} title="Scan to Pay" description="Scan a QR code to pay" />
        <View style={{ paddingHorizontal: getSpacing('xl') }}>
          <View className="bg-white rounded-2xl border border-gray-100 p-4">
            <Typography className="text-gray-900 font-semibold">
              Requesting camera permission...
            </Typography>
          </View>
        </View>
      </ScreenContainer>
    );
  }

  if (hasPermission === false || !CameraModule) {
    return (
      <ScreenContainer useSafeArea className="bg-gray-50">
        <HeaderWithTitle px={8} title="Scan to Pay" description="Scan a QR code to pay" />
        <View style={{ paddingHorizontal: getSpacing('xl') }}>
          <View className="bg-white rounded-2xl border border-gray-100 p-4">
            <Typography className="text-gray-900 font-semibold mb-2">
              Camera permission denied
            </Typography>
            <Typography variant="caption" className="text-gray-600">
              Enable camera permission in settings to scan QR codes.
            </Typography>
          </View>
        </View>
      </ScreenContainer>
    );
  }

  const CameraView = CameraModule?.CameraView || CameraModule?.Camera || null;

  return (
    <ScreenContainer useSafeArea className="bg-black">
      <HeaderWithTitle
        px={8}
        title="Scan to Pay"
        description="Point your camera at a QR code"
        showDescription={false}
      />

      <View style={{ flex: 1 }}>
        {CameraView ? (
          <CameraView
            style={{ flex: 1 }}
            onBarcodeScanned={scanned ? undefined : handleScan}
            onBarCodeScanned={scanned ? undefined : handleScan}
          />
        ) : (
          <View className="flex-1 items-center justify-center px-6">
            <Typography className="text-white font-semibold mb-2">
              Camera view unavailable
            </Typography>
            <Typography variant="caption" className="text-gray-200 text-center">
              Please install and rebuild with a compatible expo-camera version.
            </Typography>
          </View>
        )}

        {scanned ? (
          <View className="absolute bottom-10 left-0 right-0 px-6">
            <TouchableOpacity
              onPress={() => setScanned(false)}
              activeOpacity={0.85}
              className="bg-white rounded-xl py-4"
            >
              <Typography className="text-gray-900 text-center font-semibold">
                Tap to scan again
              </Typography>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </ScreenContainer>
  );
}


import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
  Platform,
  ActivityIndicator,
} from 'react-native';
// @ts-ignore - expo-av types are available at runtime
import { Audio } from 'expo-av';
import { SecuritySafe } from 'iconsax-react-nativejs';
import { Ionicons } from '@expo/vector-icons';
import { useMutation } from '@apollo/client';
import {
  SETUP_PIN_MUTATION,
  SetupPaymentPinInput,
} from '@/lib/graphql/mutations/pin-mutation';
import { StatusScreen } from '@/components/fallbacks/status-screen';

interface SetupPinActionProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const SetupPinAction: React.FC<SetupPinActionProps> = ({
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState<'create' | 'confirm' | 'result'>('create');
  const [pin, setPin] = useState<string[]>(['', '', '', '']);
  const [confirmPin, setConfirmPin] = useState<string[]>(['', '', '', '']);
  const [mutationResult, setMutationResult] = useState<{
    status: 'success' | 'failed';
    message: string;
  } | null>(null);

  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const soundObject = useRef<Audio.Sound | null>(null);

  const [setupPin, { loading }] = useMutation(SETUP_PIN_MUTATION, {
    onCompleted: (data) => {
      if (data.setupPaymentPin.success) {
        setMutationResult({
          status: 'success',
          message:
            data.setupPaymentPin.message || 'Payment PIN set up successfully!',
        });
      } else {
        setMutationResult({
          status: 'failed',
          message: data.setupPaymentPin.message || 'Failed to set up PIN',
        });
      }
      setStep('result');
    },
    onError: (error) => {
      setMutationResult({
        status: 'failed',
        message: error.message || 'An error occurred while setting up PIN',
      });
      setStep('result');
    },
  });

  useEffect(() => {
    const loadSound = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          {
            uri: 'data:audio/wav;base64,UklGRiIAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAACAgICAgICAg==',
          },
          { volume: 0.3 }
        );
        soundObject.current = sound;
      } catch (error) {
        console.log('Sound not available', error);
      }
    };

    if (Platform.OS !== 'web') {
      loadSound();
    }

    return () => {
      soundObject.current?.unloadAsync();
    };
  }, []);

  const playSound = useCallback(async () => {
    if (soundObject.current && Platform.OS !== 'web') {
      try {
        await soundObject.current.replayAsync();
      } catch (e) {
        // Sound playback failed, ignore silently
      }
    }
  }, []);

  const triggerShake = () => {
    shakeAnimation.setValue(0);
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 80,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 80,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 80,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 80,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const currentPin = step === 'create' ? pin : confirmPin;
  const setCurrentPin = step === 'create' ? setPin : setConfirmPin;

  const handleKeyPress = (value: string) => {
    if (loading) return;
    playSound();

    const emptyIndex = currentPin.findIndex((d) => d === '');
    if (emptyIndex !== -1) {
      const newPin = [...currentPin];
      newPin[emptyIndex] = value;
      setCurrentPin(newPin);
    }
  };

  const handleDelete = () => {
    if (loading) return;
    playSound();

    const lastFilledIndex = currentPin.findLastIndex((d) => d !== '');
    if (lastFilledIndex !== -1) {
      const newPin = [...currentPin];
      newPin[lastFilledIndex] = '';
      setCurrentPin(newPin);
    }
  };

  const handleSubmit = async () => {
    const pinString = currentPin.join('');
    if (pinString.length !== 4) {
      triggerShake();
      return;
    }

    if (step === 'create') {
      setStep('confirm');
      return;
    }

    if (step === 'confirm') {
      const originalPin = pin.join('');
      const confirmedPin = confirmPin.join('');

      if (originalPin !== confirmedPin) {
        triggerShake();
        setConfirmPin(['', '', '', '']);
        return;
      }

      const input: SetupPaymentPinInput = {
        paymentPin: originalPin,
        paymentPinConfirmation: confirmedPin,
      };
      await setupPin({ variables: { input } });
    }
  };

  const handleBack = () => {
    if (step === 'confirm') {
      setConfirmPin(['', '', '', '']);
      setStep('create');
    } else {
      onClose();
    }
  };

  const handleResultAction = () => {
    if (mutationResult?.status === 'success') {
      onSuccess?.();
      onClose();
    } else {
      setStep('create');
      setPin(['', '', '', '']);
      setConfirmPin(['', '', '', '']);
      setMutationResult(null);
    }
  };

  const isPinComplete = currentPin.every((d) => d !== '');

  const keypadNumbers = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['', '0', 'delete'],
  ];

  const translateX = shakeAnimation.interpolate({
    inputRange: [-10, 10],
    outputRange: [-10, 10],
  });

  if (step === 'result' && mutationResult) {
    return (
      <StatusScreen
        status={mutationResult.status}
        title={
          mutationResult.status === 'success'
            ? 'PIN Set Up Successfully'
            : 'PIN Setup Failed'
        }
        message={mutationResult.message}
        buttonText={mutationResult.status === 'success' ? 'Done' : 'Try Again'}
        onPress={handleResultAction}
      />
    );
  }

  const title =
    step === 'create' ? 'Create Payment PIN' : 'Confirm Payment PIN';
  const description =
    step === 'create'
      ? 'Enter a 4-digit PIN to secure your transactions'
      : 'Re-enter your 4-digit PIN to confirm';

  return (
    <View className="flex-1 px-6 bg-white justify-center items-center">
      {/* Header */}
      <View className="items-center mb-8">
        <View className="w-20 h-20 bg-blue-100 rounded-full items-center justify-center mb-4">
          <SecuritySafe size={36} color="blue" variant="Bulk" />
        </View>
        <Text className="text-xl font-bold text-gray-900 text-center">
          {title}
        </Text>
        <Text className="text-sm text-gray-500 text-center mt-2 max-w-[85%]">
          {description}
        </Text>
      </View>

      {/* PIN Indicators */}
      <Animated.View style={{ transform: [{ translateX }] }} className="mb-8">
        <View className="flex-row justify-center gap-6">
          {currentPin.map((digit, index) => (
            <View
              key={index}
              className={`w-4 h-4 rounded-full border-2 ${
                digit
                  ? 'bg-blue-600 border-blue-600'
                  : 'border-gray-300 bg-transparent'
              }`}
            />
          ))}
        </View>
      </Animated.View>

      {/* Keypad */}
      <View className="items-center mb-8">
        {keypadNumbers.map((row, rIdx) => (
          <View key={rIdx} className="flex-row justify-center gap-6 mb-4">
            {row.map((key, cIdx) => {
              if (key === '') {
                return (
                  <View key={`${rIdx}-${cIdx}`} className="w-[60px] h-[60px]" />
                );
              }

              if (key === 'delete') {
                return (
                  <TouchableOpacity
                    key={`${rIdx}-${cIdx}`}
                    onPress={handleDelete}
                    disabled={loading || currentPin.every((d) => d === '')}
                    activeOpacity={0.7}
                    className="w-[60px] h-[60px] bg-gray-100 rounded-full items-center justify-center border border-gray-300"
                    style={{
                      opacity:
                        loading || currentPin.every((d) => d === '') ? 0.4 : 1,
                    }}
                  >
                    <Ionicons
                      name="backspace-outline"
                      size={28}
                      color="#6b7280"
                    />
                  </TouchableOpacity>
                );
              }

              return (
                <TouchableOpacity
                  key={`${rIdx}-${cIdx}`}
                  onPress={() => handleKeyPress(key)}
                  disabled={loading || isPinComplete}
                  activeOpacity={0.7}
                  className="w-[60px] h-[60px] bg-white rounded-full items-center justify-center border border-gray-300"
                  style={{ opacity: loading || isPinComplete ? 0.4 : 1 }}
                >
                  <Text className="text-3xl font-semibold text-gray-800">
                    {key}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>

      {/* Buttons */}
      <View className="flex-row gap-4 w-full">
        <TouchableOpacity
          onPress={handleBack}
          disabled={loading}
          activeOpacity={0.7}
          className="flex-1 h-12 rounded-xl border border-gray-300 items-center justify-center"
        >
          <Text className="text-base font-medium text-gray-700">
            {step === 'create' ? 'Cancel' : 'Back'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={!isPinComplete || loading}
          activeOpacity={0.7}
          className={`flex-1 h-12 rounded-xl items-center justify-center ${
            isPinComplete ? 'bg-blue-600' : 'bg-gray-200'
          }`}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text
              className={`text-base font-medium ${isPinComplete ? 'text-white' : 'text-gray-400'}`}
            >
              {step === 'create' ? 'Continue' : 'Set PIN'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SetupPinAction;

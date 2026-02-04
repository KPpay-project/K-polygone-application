import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import { Audio } from 'expo-av';
import { SecuritySafe } from 'iconsax-react-nativejs';
import { Ionicons } from '@expo/vector-icons';

interface VerifyTransactionPinProps {
  onClose: () => void;
  onSuccess: (pin: string) => void;
  title?: string;
  description?: string;
  loading?: boolean;
}

const VerifyTransactionPin: React.FC<VerifyTransactionPinProps> = ({
  onClose,
  onSuccess,
  title = 'Verify Transaction PIN',
  description = 'Enter your 4-digit PIN to authorize this transaction',
  loading = false,
}) => {
  const [pin, setPin] = useState<string[]>(['', '', '', '']);
  const [shuffledKeys, setShuffledKeys] = useState<string[]>([]);
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const soundObject = useRef<Audio.Sound | null>(null);

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
        console.log('Sound not available (probably web)', error);
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
      } catch {
        // ignore
      }
    }
  }, []);

  // Shuffle keypad on mount
  useEffect(() => {
    const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
    for (let i = digits.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [digits[i], digits[j]] = [digits[j], digits[i]];
    }
    setShuffledKeys(digits);
    setPin(['', '', '', '']);
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

  const handleKeyPress = (value: string) => {
    if (loading) return;
    playSound();

    const emptyIndex = pin.findIndex((d) => d === '');
    if (emptyIndex !== -1) {
      const newPin = [...pin];
      newPin[emptyIndex] = value;
      setPin(newPin);
    }
  };

  const handleDelete = () => {
    if (loading) return;
    playSound();

    const lastFilledIndex = pin.findLastIndex((d) => d !== '');
    if (lastFilledIndex !== -1) {
      const newPin = [...pin];
      newPin[lastFilledIndex] = '';
      setPin(newPin);
    }
  };

  const handleSubmit = () => {
    const pinString = pin.join('');
    if (pinString.length !== 4) {
      triggerShake();
      return;
    }
    onSuccess(pinString);
  };

  const isPinComplete = pin.every((d) => d !== '');

  if (shuffledKeys.length === 0) return null;

  const keypadNumbers = [
    shuffledKeys.slice(0, 3),
    shuffledKeys.slice(3, 6),
    shuffledKeys.slice(6, 9),
    ['', shuffledKeys[9], 'delete'],
  ];

  const translateX = shakeAnimation.interpolate({
    inputRange: [-10, 10],
    outputRange: [-10, 10],
  });

  return (
    <View className="flex-1 px-6 pt-8 bg-white">
      {/* Header */}
      <View className="items-center mb-8">
        <View className="w-[50px] h-[50px] bg-orange-100 rounded-full items-center justify-center mb-4">
          <SecuritySafe size={36} color="#FF8A65" variant="Bulk" />
        </View>
        <Text className="text-xl font-bold text-gray-900 text-center">
          {title}
        </Text>
        <Text className="text-sm text-gray-500 text-center mt-2 max-w-[85%]">
          {description}
        </Text>
      </View>

      {/* PIN Indicators */}
      <Animated.View style={{ transform: [{ translateX }] }} className="mb-10">
        <View className="flex-row justify-center gap-6">
          {pin.map((digit, index) => (
            <View
              key={index}
              className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                digit
                  ? 'bg-blue-600 border-blue-600'
                  : 'border-gray-300 bg-transparent'
              }`}
            />
          ))}
        </View>
      </Animated.View>

      {/* Keypad */}
      <View className="max-w-[320px] mx-auto mb-10">
        {keypadNumbers.map((row, rIdx) => (
          <View key={rIdx} className="flex-row justify-center gap-6 mb-6">
            {row.map((key, cIdx) => {
              if (key === '') {
                return <View key={`${rIdx}-${cIdx}`} className="w-20 h-20" />;
              }

              if (key === 'delete') {
                return (
                  <TouchableOpacity
                    key={`${rIdx}-${cIdx}`}
                    onPress={handleDelete}
                    disabled={loading || pin.every((d) => d === '')}
                    activeOpacity={0.7}
                    className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center border border-gray-300 disabled:opacity-40"
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
                  className="w-20 h-20 bg-white rounded-full items-center justify-center border border-gray-300 disabled:opacity-40"
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

      {/* Action Buttons */}
      <View className="flex-row gap-4 px-4">
        <TouchableOpacity
          onPress={onClose}
          disabled={loading}
          activeOpacity={0.7}
          className="flex-1 h-12 rounded-xl border border-gray-300 items-center justify-center"
        >
          <Text className="text-base font-medium text-gray-700">Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={!isPinComplete || loading}
          activeOpacity={0.7}
          className={`flex-1 h-12 rounded-xl items-center justify-center ${
            isPinComplete ? 'bg-blue-600' : 'bg-gray-200'
          }`}
        >
          <Text
            className={`text-base font-medium ${isPinComplete ? 'text-white' : 'text-gray-400'}`}
          >
            {loading ? 'Verifying...' : 'Verify PIN'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default VerifyTransactionPin;

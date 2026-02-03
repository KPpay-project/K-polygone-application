import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { View, TextInput } from 'react-native';
import { Typography } from '../typography/typography';

interface OTPInputProps {
  length?: number;
  value: string[];
  onChange: (code: string[]) => void;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export interface OTPInputRef {
  focus: (index?: number) => void;
  clear: () => void;
}

export const OTPInput = forwardRef<OTPInputRef, OTPInputProps>(
  (
    { length = 6, value, onChange, error, disabled = false, className = '' },
    ref
  ) => {
    const inputRefs = useRef<(TextInput | null)[]>([]);

    useImperativeHandle(ref, () => ({
      focus: (index = 0) => {
        inputRefs.current[index]?.focus();
      },
      clear: () => {
        const newCode = new Array(length).fill('');
        onChange(newCode);
        inputRefs.current[0]?.focus();
      },
    }));

    const handleCodeChange = (text: string, index: number) => {
      const newCode = [...value];
      newCode[index] = text;
      onChange(newCode);

      // Auto-focus next input
      if (text && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    };

    const handleKeyPress = (key: string, index: number) => {
      if (key === 'Backspace' && !value[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    };

    return (
      <View className={className}>
        {/* OTP Input */}
        <View className="flex-row justify-between mb-6" style={{ gap: 12 }}>
          {Array.from({ length }, (_, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                inputRefs.current[index] = ref;
              }}
              style={{
                width: 48,
                height: 56,
                textAlign: 'center',
                textAlignVertical: 'center',
                fontSize: 18,
                fontWeight: '600',
                color: '#1F2937',
                borderWidth: 1.5,
                borderRadius: 8,
                paddingHorizontal: 0,
                paddingVertical: 0,
                borderColor: value[index]
                  ? '#3B82F6' // primary-500 when filled
                  : error
                    ? '#EF4444' // red-500 when error
                    : '#E5E7EB', // gray-200 when empty
                backgroundColor: '#FFFFFF',
              }}
              value={value[index] || ''}
              onChangeText={(text) => handleCodeChange(text, index)}
              onKeyPress={({ nativeEvent }) =>
                handleKeyPress(nativeEvent.key, index)
              }
              keyboardType="numeric"
              maxLength={1}
              selectTextOnFocus
              editable={!disabled}
            />
          ))}
        </View>

        {/* Error Message */}
        {error && (
          <View className="mb-4">
            <Typography variant="body" className="text-red-500 text-center">
              {error}
            </Typography>
          </View>
        )}
      </View>
    );
  }
);

OTPInput.displayName = 'OTPInput';

import React from 'react';
import {
  TextInput,
  TextInputProps,
  StyleProp,
  TextStyle,
  View,
} from 'react-native';
import { Typography } from '../ui';

interface CustomTextInputProps extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: TextInputProps['keyboardType'];
  autoCapitalize?: TextInputProps['autoCapitalize'];
  autoCorrect?: boolean;
  editable?: boolean;
  hasError?: boolean;
  className?: string;
  placeholderTextColor?: string;
  style?: StyleProp<TextStyle>;
  testID?: string;
  secureTextEntry?: boolean;
  maxLength?: number;
  multiline?: boolean;
  numberOfLines?: number;
  label?: string;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  autoCapitalize = 'none',
  autoCorrect = false,
  editable = true,
  hasError = false,
  className = '',
  placeholderTextColor = '#9CA3AF',
  style,
  testID,
  secureTextEntry = false,
  maxLength,
  multiline = false,
  numberOfLines,
  label,
  ...rest
}) => {
  return (
    <View>
      <Typography variant="small" className="mb-2 text-xs" weight="400">
        {label}
      </Typography>
      <TextInput
        className={`w-full px-4 py-4 rounded-xl border ${
          hasError ? 'border-red-500' : 'border-gray-200'
        } text-gray-900 ${className}`}
        style={style}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        editable={editable}
        secureTextEntry={secureTextEntry}
        maxLength={maxLength}
        multiline={multiline}
        numberOfLines={numberOfLines}
        testID={testID}
        {...rest}
      />
    </View>
  );
};

export default CustomTextInput;

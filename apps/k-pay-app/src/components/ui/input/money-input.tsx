import React, { useState, useMemo, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Typography } from '../typography/typography';

type Currency = 'USD' | 'NGN' | 'EUR' | 'GBP';

type NumberInputProps = {
  value?: number;
  onChange?: (value: number) => void;
  currency?: Currency;
  placeholder?: string;
  style?: object;
  label?: string;
  balance?: string;
  error?: string;
  className?: string;
};

const currencySymbols: Record<string, string> = {
  USD: '$',
  NGN: '₦',
  EUR: '€',
  GBP: '£',
};

const getPlaceValue = (num: number, t: any) => {
  if (num >= 1_000_000_000) return t('billion');
  if (num >= 1_000_000) return t('million');
  if (num >= 1_000) return t('thousand');
  return '';
};

const NumberInput: React.FC<NumberInputProps> = ({
  value = 0,
  onChange,
  currency,
  placeholder,
  style,
  label,
  balance,
  error,
  className,
}) => {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState(value.toLocaleString());
  const [tooltipPos, setTooltipPos] = useState(0);

  const symbol = currency ? currencySymbols[currency] || '' : '';

  const placeValue = useMemo(() => {
    const plainNumber = Number(inputValue.replace(/,/g, ''));
    return getPlaceValue(plainNumber, t);
  }, [inputValue, t]);

  const handleChange = (text: string) => {
    const rawValue = text.replace(/,/g, '').replace(/[^\d]/g, '');
    const num = Number(rawValue);
    if (!isNaN(num)) {
      setInputValue(num.toLocaleString());
      onChange?.(num);
    } else {
      setInputValue('');
      onChange?.(0);
    }
  };

  useEffect(() => {
    const charWidth = 2.1;
    setTooltipPos(inputValue.length * charWidth);
  }, [inputValue]);

  return (
    <View className={`mb-6 ${className || ''}`}>
      {(label || balance) && (
        <View className="flex-row items-center justify-between mb-2">
          {label && (
            <Typography variant="subtitle" className="text-gray-900">
              {label}
            </Typography>
          )}
          {balance && (
            <Typography variant="caption" className="text-gray-500">
              {t('balance')}: {balance}
            </Typography>
          )}
        </View>
      )}

      <View style={[styles.container, style]}>
        <View style={[styles.inputWrapper, error && styles.inputError]}>
          {symbol ? <Text style={styles.symbol}>{symbol}</Text> : null}
          <TextInput
            value={inputValue}
            onChangeText={handleChange}
            placeholder={placeholder || t('enterAmount')}
            style={styles.input}
            keyboardType="numeric"
          />
        </View>

        {placeValue ? (
          <View style={[styles.tooltip, { left: tooltipPos }]}>
            <Text style={styles.tooltipText}>{placeValue}</Text>
            <View style={styles.pointer} />
          </View>
        ) : null}
      </View>

      {error && (
        <Typography variant="caption" className="text-red-500 mt-1">
          {error}
        </Typography>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%' },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#fff',
  },
  inputError: { borderColor: '#ef4444' },
  symbol: { marginRight: 6, color: '#555', fontWeight: 'bold', fontSize: 16 },
  input: { flex: 1, fontSize: 16, color: '#000' },
  tooltip: {
    position: 'absolute',
    top: -5,
    backgroundColor: '#333',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tooltipText: { color: '#fff', fontSize: 10, letterSpacing: 0.5 },
  pointer: {
    position: 'absolute',
    bottom: -3,
    left: '50%',
    marginLeft: -4,
    width: 0,
    height: 0,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 4,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#333',
  },
});

export { NumberInput };
export { NumberInput as MoneyInput };
export type { Currency };

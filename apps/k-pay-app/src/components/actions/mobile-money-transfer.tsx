import React, { useState } from 'react';
import { View, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { Typography } from '@/components/ui';

type FormData = {
  amount: string;
  destination: string;
  currency: string;
};

type FormErrors = {
  amount?: string;
  destination?: string;
  currency?: string;
};

interface TransferFormProps {
  selectedMethod: string;
  selectedCard: string | null;
  formData: { amount: string; destination: string; currency: string };
  savedCards: Array<{ id: string; lastFour: string }>;
}

export const MobileMoneyTransferAction = ({
  selectedMethod,
  selectedCard,
  formData,
  savedCards,
}: TransferFormProps) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [saveCard, setSaveCard] = useState(false);
  const [form, setForm] = useState<FormData>({
    amount: formData.amount,
    destination: formData.destination,
    currency: formData.currency || 'USD',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleAmountChange = (value: string) => {
    setForm((prev) => ({ ...prev, amount: value }));
  };

  const handleDestinationChange = (value: string) => {
    setForm((prev) => ({ ...prev, destination: value }));
  };

  const handleCurrencyChange = (value: string) => {
    setForm((prev) => ({ ...prev, currency: value }));
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="px-6 pt-6" showsVerticalScrollIndicator={false}>
        <View className="space-y-6">
          <View>
            <Typography className="text-sm font-medium text-gray-700 mb-2">
              Amount
            </Typography>
            <TextInput
              className={`w-full px-4 py-4 rounded-xl border ${
                errors.amount ? 'border-red-500' : 'border-gray-200'
              } text-gray-900`}
              placeholder="Enter amount"
              value={form.amount}
              onChangeText={handleAmountChange}
              keyboardType="decimal-pad"
            />
            {errors.amount && (
              <Typography className="text-red-500 text-xs mt-1">
                {errors.amount}
              </Typography>
            )}
          </View>

          <View>
            <Typography className="text-sm font-medium text-gray-700 mb-2">
              Currency
            </Typography>
            <TextInput
              className={`w-full px-4 py-4 rounded-xl border ${
                errors.currency ? 'border-red-500' : 'border-gray-200'
              } text-gray-900`}
              placeholder="Enter currency (e.g., USD)"
              value={form.currency}
              onChangeText={handleCurrencyChange}
              autoCapitalize="characters"
            />
            {errors.currency && (
              <Typography className="text-red-500 text-xs mt-1">
                {errors.currency}
              </Typography>
            )}
          </View>

          <View>
            <Typography className="text-sm font-medium text-gray-700 mb-2">
              {selectedMethod === 'bank' ? 'Mobile money phone' : 'Destination'}
            </Typography>
            <TextInput
              className={`w-full px-4 py-4 rounded-xl border ${
                errors.destination ? 'border-red-500' : 'border-gray-200'
              } text-gray-900`}
              placeholder={
                selectedMethod === 'bank'
                  ? '+2348134044405'
                  : 'Enter destination'
              }
              value={form.destination}
              onChangeText={handleDestinationChange}
            />
            {errors.destination && (
              <Typography className="text-red-500 text-xs mt-1">
                {errors.destination}
              </Typography>
            )}
          </View>

          {selectedMethod === 'card' && !selectedCard && (
            <>
              <View>
                <Typography className="text-sm font-medium text-gray-700 mb-2">
                  Card Number
                </Typography>
                <TextInput
                  className="w-full px-4 py-4 rounded-xl border border-gray-200 text-gray-900"
                  value={cardNumber}
                  onChangeText={setCardNumber}
                  placeholder="0000 0000 0000 0000"
                />
              </View>
              <View className="flex-row gap-4">
                <View>
                  <Typography className="text-sm font-medium text-gray-700 mb-2">
                    Expiry Date
                  </Typography>
                  <TextInput
                    className="w-full px-4 py-4 rounded-xl border border-gray-200 text-gray-900"
                    value={expiryDate}
                    onChangeText={setExpiryDate}
                    placeholder="MM/YY"
                  />
                </View>
                <View>
                  <Typography className="text-sm font-medium text-gray-700 mb-2">
                    CVV
                  </Typography>
                  <TextInput
                    className="w-full px-4 py-4 rounded-xl border border-gray-200 text-gray-900"
                    value={cvv}
                    onChangeText={setCvv}
                    placeholder="123"
                    maxLength={3}
                  />
                </View>
              </View>
              <View className="flex-row items-center space-x-3">
                <TouchableOpacity
                  className={`w-6 h-6 rounded-md border-2 ${
                    saveCard
                      ? 'bg-blue-600 border-blue-600'
                      : 'bg-white border-gray-300'
                  } items-center justify-center`}
                  onPress={() => setSaveCard(!saveCard)}
                >
                  {saveCard && (
                    <View className="w-4 h-4">
                      <Typography className="text-white text-xs">✓</Typography>
                    </View>
                  )}
                </TouchableOpacity>
                <Typography className="text-sm text-gray-600">
                  Save card
                </Typography>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

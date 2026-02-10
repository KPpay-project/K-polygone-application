import React, { useState, useMemo } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
} from 'react-native';
import { ScreenContainer } from '@/layout/safe-area-layout';
import { Typography } from '@/components/ui';
import { ReusableButton } from '@/components/ui/button/reusable-button';
import { router } from 'expo-router';
import type { DropdownOption } from '@/components/ui';
import { ArrowDown2, ArrowUp2, SearchNormal1 } from 'iconsax-react-nativejs';
import type { CreateWalletFormErrors } from '../src/validations/types';
import { useMutation } from '@apollo/client';
import { CREATE_WALLET } from '@/lib/graphql/mutations';
import { StatusScreen } from '@/components/fallbacks/status-screen';
import { HeaderWithTitle } from '@/components';
import { useCurrencies } from '@/hooks/use-currencies';
import { BottomSheetModal } from '@/components/ui/modal/bottom-sheet-modal';

interface CreateWalletResponse {
  createWallet: {
    id: string;
    status: string;
  };
}

interface CustomDropdownProps {
  options: DropdownOption[];
  selectedValue: string;
  onSelect: (option: DropdownOption) => void;
  placeholder: string;
  searchable?: boolean;
  disabled?: boolean;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  options,
  selectedValue,
  onSelect,
  placeholder,
  searchable = false,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState('');

  const filteredOptions = useMemo(() => {
    if (!searchText) return options;
    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(searchText.toLowerCase()) ||
        option.value.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [options, searchText]);

  const selectedOption = options.find(
    (option) => option.value === selectedValue
  );

  const handleSelect = (option: DropdownOption) => {
    onSelect(option);
    setIsOpen(false);
    setSearchText('');
  };

  return (
    <View className="relative">
      <TouchableOpacity
        className={`w-full px-4 py-4 rounded-xl border ${
          disabled ? 'border-gray-200 bg-gray-50' : 'border-gray-200 bg-white'
        } flex-row items-center justify-between`}
        onPress={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <View className="flex-1">
          {selectedOption ? (
            <View>
              <Typography variant="body" className="text-gray-900 font-medium">
                {selectedOption.label}
              </Typography>
              {selectedOption.subtitle && (
                <Typography variant="caption" className="text-gray-500 mt-1">
                  {selectedOption.subtitle}
                </Typography>
              )}
            </View>
          ) : (
            <Typography variant="body" className="text-gray-500">
              {placeholder}
            </Typography>
          )}
        </View>
        {isOpen ? (
          <ArrowUp2 size={20} color="#6B7280" />
        ) : (
          <ArrowDown2 size={20} color="#6B7280" />
        )}
      </TouchableOpacity>

      <BottomSheetModal visible={isOpen} onClose={() => setIsOpen(false)}>
        <View className="mb-4">
          <Typography variant="h5" className="text-gray-900 font-semibold">
            Select Currency
          </Typography>
        </View>

        <View className="">
          {searchable && (
            <View className="mb-4">
              <View className="flex-row items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                <SearchNormal1 size={20} color="#6B7280" />
                <TextInput
                  className="flex-1 ml-2 text-gray-900"
                  placeholder="Search currencies..."
                  value={searchText}
                  onChangeText={setSearchText}
                  autoCapitalize="none"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>
          )}

          <FlatList
            data={filteredOptions}
            keyExtractor={(item) => item.value}
            maxToRenderPerBatch={10}
            windowSize={10}
            style={{ maxHeight: 400 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                className={`py-4 px-4 mb-2 rounded-xl ${
                  item.value === selectedValue ? 'bg-blue-50' : 'bg-gray-50'
                }`}
                onPress={() => handleSelect(item)}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Typography
                      variant="body"
                      className={`font-medium ${
                        item.value === selectedValue
                          ? 'text-blue-600'
                          : 'text-gray-900'
                      }`}
                    >
                      {item.label}
                    </Typography>
                    {item.subtitle && (
                      <Typography
                        variant="caption"
                        className={`mt-1 ${
                          item.value === selectedValue
                            ? 'text-blue-500'
                            : 'text-gray-500'
                        }`}
                      >
                        {item.subtitle}
                      </Typography>
                    )}
                  </View>
                  {item.value === selectedValue && (
                    <View className="w-5 h-5 rounded-full bg-blue-500 items-center justify-center">
                      <Typography
                        variant="small"
                        className="text-white font-bold"
                      >
                        ✓
                      </Typography>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View className="py-8">
                <Typography
                  variant="body"
                  className="text-gray-500 text-center"
                >
                  No currencies found
                </Typography>
              </View>
            }
          />
        </View>
      </BottomSheetModal>
    </View>
  );
};

export default function CreateNewWalletScreen() {
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [errors, setErrors] = useState<CreateWalletFormErrors>({});
  const [isCreating, setIsCreating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successCurrency, setSuccessCurrency] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    apiCurrencies,
    loading: currenciesLoading,
    error: currenciesError,
    getCurrencySymbol,
  } = useCurrencies();

  const currencyOptions: DropdownOption[] = useMemo(() => {
    console.log('🔍 Raw apiCurrencies:', apiCurrencies);
    console.log('🔍 apiCurrencies type:', typeof apiCurrencies);
    console.log('🔍 apiCurrencies is array:', Array.isArray(apiCurrencies));

    if (!apiCurrencies || apiCurrencies.length === 0) {
      console.log('❌ No currencies available');
      return [];
    }

    const options = apiCurrencies
      .filter((currency: any) => {
        console.log('🔍 Filtering currency:', currency);
        return currency.isActive !== false;
      })
      .map((currency: any) => {
        const option = {
          label: `${currency.name} (${currency.code})`,
          value: currency.code,
          subtitle: currency.symbol,
        };
        console.log('🔍 Created option:', option);
        return option;
      });

    console.log('✅ Generated currency options:', options.length, options);
    return options;
  }, [apiCurrencies]);

  const [createWallet, { loading }] = useMutation<
    CreateWalletResponse,
    { input: { currencyCode: string } }
  >(CREATE_WALLET, {
    onCompleted: () => {
      setShowSuccess(true);
      setSuccessCurrency(selectedCurrency);
      setSelectedCurrency('');
      setErrorMessage('');
    },
    onError: (error) => {
      setErrorMessage(error.message || 'Wallet creation failed.');
      setShowSuccess(true);
    },
  });

  const validateForm = () => {
    if (!selectedCurrency) {
      setErrors({ currency: 'Please select a currency.' });
      return false;
    }
    setErrors({});
    return true;
  };

  const handleCreateWallet = async () => {
    if (!validateForm()) return;

    setIsCreating(true);
    try {
      await createWallet({
        variables: { input: { currencyCode: selectedCurrency } },
      });
    } catch {
      setErrorMessage('Wallet creation failed.');
      setShowSuccess(true);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCurrencySelect = (option: DropdownOption) => {
    console.log('Currency selected:', option);
    setSelectedCurrency(option.value);
    if (errors.currency) {
      setErrors((prev) => ({ ...prev, currency: undefined }));
    }
  };

  const handleStatusClose = () => {
    setShowSuccess(false);
    router.replace('/(tabs)/home');
  };

  return (
    <ScreenContainer useSafeArea className="bg-white">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
      >
        <HeaderWithTitle px={8} title="Create New Wallet" />

        <View className="px-6">
          <View className="mb-8">
            <Typography
              variant="body"
              className="text-gray-900 font-medium mb-3"
            >
              Select Currency
            </Typography>

            {currenciesLoading ? (
              <View className="w-full px-4 py-4 rounded-xl border border-gray-200 bg-gray-50">
                <Typography variant="body" className="text-gray-500">
                  Loading currencies...
                </Typography>
              </View>
            ) : currenciesError ? (
              <View className="w-full px-4 py-4 rounded-xl border border-red-200 bg-red-50">
                <Typography variant="body" className="text-red-500">
                  Error loading currencies
                </Typography>
              </View>
            ) : currencyOptions.length === 0 ? (
              <View className="w-full px-4 py-4 rounded-xl border border-orange-200 bg-orange-50">
                <Typography variant="body" className="text-orange-700 mb-2">
                  No currencies available
                </Typography>
                <Typography variant="caption" className="text-orange-600">
                  Debug: API returned {apiCurrencies?.length || 0} currencies
                </Typography>
                {apiCurrencies
                  ?.slice(0, 3)
                  .map((currency: any, index: number) => (
                    <Typography
                      key={index}
                      variant="caption"
                      className="text-orange-500 block"
                    >
                      {index + 1}. {currency.name} ({currency.code}) - Active:{' '}
                      {String(currency.isActive)}
                    </Typography>
                  ))}
              </View>
            ) : (
              <CustomDropdown
                options={currencyOptions}
                selectedValue={selectedCurrency}
                onSelect={handleCurrencySelect}
                placeholder="Select currency"
                searchable
                disabled={currencyOptions.length === 0}
              />
            )}

            {errors.currency && (
              <Text style={{ color: 'red', marginTop: 4 }}>
                {errors.currency}
              </Text>
            )}
          </View>
        </View>
      </ScrollView>

      <View className="px-6 pb-6">
        <ReusableButton
          onPress={handleCreateWallet}
          showArrow
          className="bg-brandBlue-500"
          disabled={
            !selectedCurrency ||
            currenciesLoading ||
            currencyOptions.length === 0
          }
          loading={isCreating || loading}
        >
          <Typography variant="body" className="!text-white">
            Create Wallet
          </Typography>
        </ReusableButton>
      </View>

      {showSuccess && (
        <StatusScreen
          status={errorMessage ? 'failed' : 'success'}
          title={errorMessage ? 'Wallet Creation Failed' : 'Wallet Created'}
          message={
            errorMessage
              ? errorMessage
              : `Your ${successCurrency} wallet has been created successfully.`
          }
          buttonText="Back to Dashboard"
          onPress={handleStatusClose}
        />
      )}
    </ScreenContainer>
  );
}

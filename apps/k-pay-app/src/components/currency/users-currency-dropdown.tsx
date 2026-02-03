import React, { useMemo, useState, useCallback } from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ListRenderItem,
} from 'react-native';
import { useProfileStore } from '@/store/profile-store';
import { Input } from '@/components/ui/input/input';
import { Typography } from '@/components/ui/typography/typography';
import { CloseCircle, ArrowDown2 } from 'iconsax-react-nativejs';
import { twMerge } from 'tailwind-merge';

export type CurrencyOption = {
  currencyCode: string;
  balanceId: string;
  walletId: string;
};

export type UsersCurrencyDropdownProps = {
  name?: string;
  value?: CurrencyOption | null;
  placeholder?: string;
  disabled?: boolean;
  dedupeByCurrency?: boolean;
  onChange?: (option: CurrencyOption | null) => void;
  className?: string;
  label?: string;
  selectedCurrency?: string;
  onCurrencyChange?: (currencyCode: string) => void;
};

const UsersCurrencyDropdown: React.FC<UsersCurrencyDropdownProps> = ({
  name = 'currency',
  value,
  placeholder = 'Select currency',
  disabled = false,
  dedupeByCurrency = false,
  onChange,
  className,
  label = 'Select currency',
  selectedCurrency,
  onCurrencyChange,
}) => {
  const profileData = useProfileStore((state) => state.profile);
  const userWallets = profileData?.wallets ?? [];
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [internalSelectedCurrency, setInternalSelectedCurrency] =
    useState<string>('');

  const options: CurrencyOption[] = useMemo(() => {
    if (!Array.isArray(userWallets)) return [];
    const out: CurrencyOption[] = [];

    for (const w of userWallets) {
      const walletId: string = (w as any).id ?? '';
      const balances = Array.isArray((w as any).balances)
        ? (w as any).balances
        : [];

      for (const b of balances) {
        const currencyObj = (b as any).currency;
        const currencyCodeFromObj: string =
          currencyObj && typeof currencyObj === 'object'
            ? String((currencyObj as any).code ?? '')
            : '';
        const currencyCode: string =
          currencyCodeFromObj ||
          String((b as any).currencyCode ?? '') ||
          (typeof (b as any).currency === 'string'
            ? String((b as any).currency)
            : '');
        const balanceId: string = String((b as any).id ?? '');

        if (!currencyCode || !balanceId || !walletId) continue;
        out.push({ currencyCode, balanceId, walletId });
      }
    }

    if (!dedupeByCurrency) return out;

    const seen = new Set<string>();
    const deduped: CurrencyOption[] = [];
    for (const opt of out) {
      if (seen.has(opt.currencyCode)) continue;
      seen.add(opt.currencyCode);
      deduped.push(opt);
    }
    return deduped;
  }, [userWallets, dedupeByCurrency]);

  const filteredOptions = useMemo(() => {
    if (!search) return options;
    return options.filter((opt) =>
      opt.currencyCode.toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search]);

  // Determine the currently selected option based on props or internal state
  const selectedOption = useMemo(() => {
    // 1. Try matching by selectedCurrency prop (string)
    if (selectedCurrency) {
      return options.find((o) => o.currencyCode === selectedCurrency);
    }
    // 2. Try matching by value prop (object)
    if (value) {
      return (
        options.find(
          (o) =>
            o.currencyCode === value.currencyCode &&
            o.walletId === value.walletId &&
            o.balanceId === value.balanceId
        ) || value
      );
    }
    // 3. Fallback to internal state
    if (internalSelectedCurrency) {
      return options.find((o) => o.currencyCode === internalSelectedCurrency);
    }
    return undefined;
  }, [selectedCurrency, value, internalSelectedCurrency, options]);

  const handleSelect = useCallback(
    (option: CurrencyOption) => {
      setInternalSelectedCurrency(option.currencyCode);

      if (onCurrencyChange) {
        onCurrencyChange(option);
      }

      onChange?.(option);

      setModalVisible(false);
      setSearch('');
    },
    [onChange, onCurrencyChange]
  );

  const renderItem: ListRenderItem<CurrencyOption> = useCallback(
    ({ item: opt }) => {
      const isSelected =
        selectedOption?.currencyCode === opt.currencyCode &&
        selectedOption?.walletId === opt.walletId &&
        selectedOption?.balanceId === opt.balanceId;

      return (
        <TouchableOpacity
          onPress={() => handleSelect(opt)}
          className={twMerge(
            'flex-row items-center justify-between py-4 border-b border-gray-50',
            isSelected && 'bg-blue-50/50 -mx-6 px-6'
          )}
        >
          <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mr-3">
              <Typography variant="h5" className="text-gray-600">
                {opt.currencyCode.charAt(0)}
              </Typography>
            </View>
            <View>
              <Typography
                variant="body"
                className={twMerge(
                  'font-medium',
                  isSelected ? 'text-blue-600' : 'text-gray-900'
                )}
              >
                {opt.currencyCode}
              </Typography>
            </View>
          </View>
          {isSelected && <View className="w-2 h-2 rounded-full bg-blue-600" />}
        </TouchableOpacity>
      );
    },
    [selectedOption, handleSelect]
  );

  return (
    <View className={twMerge('my-3', className)}>
      {label && (
        <Typography variant="body" className="text-gray-900 font-medium mb-2">
          {label}
        </Typography>
      )}

      {/* Trigger */}
      <TouchableOpacity
        onPress={() => !disabled && setModalVisible(true)}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel="Select currency"
        accessibilityState={{ disabled, expanded: modalVisible }}
        className={twMerge(
          'flex-row items-center justify-between px-4 py-3 bg-white rounded-xl border border-gray-200',
          'shadow-xs',
          disabled && 'opacity-60'
        )}
      >
        <View className="flex-row items-center gap-2">
          <View className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center">
            <Typography variant="body" className="text-gray-600 font-semibold">
              {selectedOption ? selectedOption.currencyCode.charAt(0) : '?'}
            </Typography>
          </View>

          <View>
            <Typography variant="caption" className="text-gray-500">
              Currency
            </Typography>

            {selectedOption ? (
              <View className="mt-0.5">
                <View className="flex-row items-center">
                  <View className="px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200">
                    <Typography
                      variant="body"
                      className="text-blue-700 font-medium"
                    >
                      {selectedOption.currencyCode}
                    </Typography>
                  </View>
                </View>
              </View>
            ) : (
              <Typography variant="body" className="text-gray-500 font-medium">
                {placeholder}
              </Typography>
            )}
          </View>
        </View>

        <ArrowDown2 size={18} color={disabled ? '#9CA3AF' : '#6B7280'} />
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View className="flex-1 justify-end bg-black/50">
              <TouchableWithoutFeedback>
                <View className="bg-white rounded-t-3xl h-[70%] w-full overflow-hidden">
                  {/* Header */}
                  <View className="flex-row items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
                    <Typography
                      variant="h4"
                      className="text-gray-900 font-semibold"
                    >
                      Select Currency
                    </Typography>
                    <TouchableOpacity
                      onPress={() => setModalVisible(false)}
                      className="p-1"
                    >
                      <CloseCircle
                        size={24}
                        color="#6B7280"
                        variant="Outline"
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Search */}
                  <View className="px-6 py-4">
                    <Input
                      placeholder="Search currency..."
                      value={search}
                      onChangeText={setSearch}
                      className="mb-0"
                    />
                  </View>

                  {/* List */}
                  <FlatList
                    data={filteredOptions}
                    renderItem={renderItem}
                    keyExtractor={(item) =>
                      `${item.walletId}:${item.balanceId}`
                    }
                    contentContainerStyle={{
                      paddingBottom: 40,
                      paddingHorizontal: 24,
                    }}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                      <View className="py-8 items-center">
                        <Typography variant="body" className="text-gray-500">
                          No results found
                        </Typography>
                      </View>
                    }
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

export default UsersCurrencyDropdown;

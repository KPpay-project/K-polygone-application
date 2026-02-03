import React, { useState } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { Typography } from '@/components/ui';
import CountryFlag from 'react-native-country-flag';
import { HeaderWithTitle } from '@/components/header';
import { SearchInput } from '@/components/input/search-input';
import { ReusableModal } from '@/components/ui';
import { useTranslation } from 'react-i18next';

const countries = [
  {
    name: 'Angola',
    isoCode: 'AO',
    currencies: ['NGN', 'USD', 'GBP', 'EUR', 'BRL'],
  },
  {
    name: 'Nigeria',
    isoCode: 'NG',
    currencies: ['NGN', 'USD'],
  },
  {
    name: 'Rwanda',
    isoCode: 'RW',
    currencies: ['NGN', 'USD'],
  },
  {
    name: 'Gabon',
    isoCode: 'GA',
    currencies: ['NGN', 'USD'],
  },
  {
    name: 'Ghana',
    isoCode: 'GH',
    currencies: ['NGN', 'USD', 'GHS'],
  },
  {
    name: 'Cameroon',
    isoCode: 'CM',
    currencies: ['NGN', 'USD', 'GHS'],
  },
  {
    name: 'Niger',
    isoCode: 'NE',
    currencies: ['NGN', 'USD', 'GHS'],
  },
  {
    name: 'Morocco',
    isoCode: 'MA',
    currencies: ['NGN', 'USD', 'GHS'],
  },
];

export default function SendToNewBeneficiary() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedCountry, setSelectedCountry] = useState<any>(null);

  const currencies = [
    { label: t('allCurrencies'), active: true },
    { label: 'XOF' },
    { label: 'USD' },
  ];

  const filteredBeneficiaries = countries.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenModal = (country: any) => {
    setSelectedCountry(country);
    setModalVisible(true);
  };

  return (
    <View className="flex-1 bg-white">
      <View className="px-6 pt-6">
        <HeaderWithTitle
          title={t('sendMoneyToBankAccount')}
          description={t('sendToNewOrPreviousRecipient')}
        />

        <View className="my-6">
          <SearchInput
            placeholder={t('searchBeneficiaries')}
            iconPosition="right"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <ScrollView>
          <View className="gap-8">
            {filteredBeneficiaries.map((b, idx) => (
              <TouchableOpacity
                key={idx}
                className="flex-row items-center gap-5"
                onPress={() => handleOpenModal(b)}
              >
                <View
                  className="rounded-full overflow-hidden items-center justify-center"
                  style={{ width: 30, height: 30 }}
                >
                  <CountryFlag isoCode={b.isoCode} size={30} />
                </View>

                <View className="flex-1">
                  <Typography weight="700" className="text-gray-900">
                    {b.name}
                  </Typography>
                  <View className="flex-row items-center gap-2">
                    <Typography className="!text-gray-500" variant="body">
                      {b?.currencies.map((currency, index) => (
                        <React.Fragment key={index}>
                          {currency}
                          {index < b.currencies.length - 1 && ', '}
                        </React.Fragment>
                      ))}
                    </Typography>
                  </View>
                </View>
              </TouchableOpacity>
            ))}

            {filteredBeneficiaries.length === 0 && (
              <Typography className="text-gray-500 text-center mt-4">
                {t('noBeneficiariesFound')}
              </Typography>
            )}
          </View>
        </ScrollView>
      </View>

      <ReusableModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={selectedCountry?.name}
        variant="bottom"
        showCloseButton={false}
      >
        <View className="flex-row justify-between">
          <Typography>{t('selectCurrencyToSend')}</Typography>

          <CountryFlag isoCode={selectedCountry?.isoCode} size={18} />
        </View>
      </ReusableModal>
    </View>
  );
}

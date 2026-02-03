import React, { useState } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { Typography } from '@/components/ui';
import { ProfileAdd } from 'iconsax-react-nativejs';
import CountryFlag from 'react-native-country-flag';
import { HeaderWithTitle } from '@/components/header';
import { SearchInput } from '@/components/input/search-input';
import { Map } from 'iconsax-react-nativejs';
import { useTranslation } from 'react-i18next';

const beneficiaries = [
  {
    initials: 'BB',
    name: 'Boma Agina-obu',
    bank: 'Kuda Bank',
    account: '00405513756',
    isoCode: 'NG',
  },
  {
    initials: 'JW',
    name: 'John West',
    bank: 'Chase Bank',
    account: '00405513756',
    isoCode: 'US',
  },
  {
    initials: 'OT',
    name: 'Owas Tams',
    bank: 'Area Bank',
    account: '00405513756',
    isoCode: 'ZM',
  },
  {
    initials: 'AK',
    name: 'Aisha Karim',
    bank: 'GTBank',
    account: '01489236721',
    isoCode: 'NG',
  },
  {
    initials: 'MS',
    name: 'Maria Sanchez',
    bank: 'Banco Santander',
    account: 'ES9820385778983000760236',
    isoCode: 'ES',
  },
  {
    initials: 'HL',
    name: 'Hiroshi Tanaka',
    bank: 'Mizuho Bank',
    account: '1234567890',
    isoCode: 'JP',
  },
  {
    initials: 'CM',
    name: 'Chloe Martin',
    bank: 'BNP Paribas',
    account: 'FR7630006000011234567890189',
    isoCode: 'FR',
  },
  {
    initials: 'PK',
    name: 'Priya Kapoor',
    bank: 'State Bank of India',
    account: '202201223344',
    isoCode: 'IN',
  },
  {
    initials: 'AL',
    name: 'Alexei Lebedev',
    bank: 'Sberbank',
    account: '40817810099910004312',
    isoCode: 'RU',
  },
  {
    initials: 'LS',
    name: 'Liam Smith',
    bank: 'HSBC UK',
    account: 'GB29NWBK60161331926819',
    isoCode: 'GB',
  },
  {
    initials: 'CF',
    name: 'Carlos Fernandez',
    bank: 'BBVA',
    account: 'MX123456789012345678',
    isoCode: 'MX',
  },
  {
    initials: 'ZT',
    name: 'Zanele Thabo',
    bank: 'First National Bank',
    account: '12345678901',
    isoCode: 'ZA',
  },
];

export default function SendFundsToUsersScreen() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');

  const currencies = [
    { label: t('allCurrencies'), active: true },
    { label: 'XOF' },
    { label: 'USD' },
  ];

  const filteredBeneficiaries = beneficiaries.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.bank.toLowerCase().includes(search.toLowerCase()) ||
      b.account.includes(search)
  );

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
          <View className="gap-10">
            {filteredBeneficiaries.map((b, idx) => (
              <View key={idx} className="flex-row items-center gap-5 mb-2 ">
                <View>
                  <View className="w-[44px] h-[44px] rounded-full bg-gray-100 items-center justify-center">
                    <Typography className="!text-gray-700" weight="500">
                      {b.initials}
                    </Typography>
                  </View>
                  <View
                    className="absolute -right-2 bottom-0 rounded-full border-[1px] border-gray-300 overflow-hidden"
                    style={{ width: 20, height: 20 }}
                  >
                    <CountryFlag isoCode={b.isoCode} size={20} />
                  </View>
                </View>

                <View className="flex-1">
                  <Typography weight="700" className="text-gray-900">
                    {b.name}
                  </Typography>
                  <View className="flex-row items-center gap-2">
                    <Typography className="!text-gray-500" variant="body">
                      {b.account}
                    </Typography>
                  </View>
                </View>
              </View>
            ))}
            {filteredBeneficiaries.length === 0 && (
              <Typography className="text-gray-500 text-center mt-4">
                {t('noBeneficiariesFound')}
              </Typography>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

import BillsPaymentForm from '@/components/modules/bill-payment/form.tsx';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CountrySelector } from '@/components/common/country-selector';
import { useQuery } from '@apollo/client';
import { FLUTTERWAVE_BILL_CATEGORIES, FLUTTERWAVE_BILLERS, FLUTTERWAVE_BILL_ITEMS } from '@repo/api';
import { InputWithSearch } from '@repo/ui';

type FlutterwaveBillCategory = {
  code: string;
  country: string;
  id: string;
  name: string;
};

type FlutterwaveBiller = {
  billerCode: string;
  category: string;
  country: string;
  id: string;
  isActive: boolean | null;
  name: string;
};

type FlutterwaveBillItem = {
  amount: string;
  billerCode: string;
  country: string;
  currency: string | null;
  id: string;
  isAmountFixed: boolean | null;
  itemCode: string;
  name: string;
};

const BillPayment = () => {
  const { t } = useTranslation();
  const [selectedCategoryCode, setSelectedCategoryCode] = useState<string | null>(null);
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('NG');
  const [selectedBillerId, setSelectedBillerId] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const { data: categoriesData } = useQuery<{ flutterwaveBillCategories: FlutterwaveBillCategory[] }>(
    FLUTTERWAVE_BILL_CATEGORIES,
    {
      variables: { countryCode: selectedCountryCode },
      skip: !selectedCountryCode
    }
  );

  const { data: billersData } = useQuery<{ flutterwaveBillers: FlutterwaveBiller[] }>(FLUTTERWAVE_BILLERS, {
    variables: {
      category: selectedCategoryCode,
      countryCode: selectedCountryCode
    },
    skip: !selectedCategoryCode || !selectedCountryCode
  });

  const { data: billItemsData } = useQuery<{ flutterwaveBillItems: FlutterwaveBillItem[] }>(FLUTTERWAVE_BILL_ITEMS, {
    variables: {
      billerCode: (billersData?.flutterwaveBillers || []).find((item) => item.id === selectedBillerId)?.billerCode,
      countryCode: selectedCountryCode
    },
    skip: !selectedBillerId || !selectedCountryCode
  });

  useEffect(() => {
    setSelectedBillerId(null);
    setSelectedItemId(null);
  }, [selectedCategoryCode, selectedCountryCode]);

  const availableBillers = useMemo(() => {
    return billersData?.flutterwaveBillers || [];
  }, [billersData]);

  const availableBillerOptions = useMemo(() => {
    return availableBillers.map((biller) => ({
      value: biller.id,
      label: biller.name
    }));
  }, [availableBillers]);

  const availableBillItemOptions = useMemo(() => {
    return (billItemsData?.flutterwaveBillItems || []).map((item) => ({
      value: item.id,
      label: `${item.name}${item.amount ? ` - ${item.amount}` : ''} (${item.itemCode})`
    }));
  }, [billItemsData]);

  const categoryOptions = useMemo(() => {
    return (categoriesData?.flutterwaveBillCategories || []).map((category) => ({
      value: category.code,
      label: category.name
    }));
  }, [categoriesData]);

  const selectedCategory = useMemo(
    () => (categoriesData?.flutterwaveBillCategories || []).find((item) => item.code === selectedCategoryCode) || null,
    [categoriesData, selectedCategoryCode]
  );

  const selectedBiller = useMemo(
    () => availableBillers.find((item) => item.id === selectedBillerId) || null,
    [availableBillers, selectedBillerId]
  );

  const selectedItem = useMemo(
    () => (billItemsData?.flutterwaveBillItems || []).find((item) => item.id === selectedItemId) || null,
    [billItemsData, selectedItemId]
  );

  return (
    <div className="min-h-screen bg-[#F6F6F6] p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex gap-6 lg:gap-8 transition-all duration-500 ease-in-out">
          {/* Left Card - Services Selection */}
          <div
            className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 transition-all duration-500 ease-in-out ${
              selectedCategoryCode ? 'w-1/2 transform translate-x-0' : 'w-full mx-auto max-w-2xl'
            }`}
          >
            <h1 className="text-xl sm:text-xl font-semibold text-gray-900 mb-6 sm:mb-8">{t('billPayment.title')}</h1>

            <div className="mb-6 sm:mb-8">
              <InputWithSearch
                options={categoryOptions}
                value={selectedCategoryCode || ''}
                onChange={(value) => setSelectedCategoryCode(value || null)}
                placeholder={t('placeholders.searchBillType') || 'Select bill category'}
                searchPlaceholder={t('placeholders.searchBillType') || 'Search bill category'}
                emptyMessage="No bill category found"
                width="w-full"
                className="!h-12 !border-gray-200 !bg-white"
              />
            </div>

            {/* Country Selector */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-medium text-gray-700">{t('billPayment.form.country') || 'Country'}</h2>
              </div>
              <CountrySelector
                value={selectedCountryCode}
                onValueChange={(_, country) => {
                  // Use country.code as the canonical ISO code
                  setSelectedCountryCode(country.code);
                }}
                placeholder={t('placeholders.selectCountry') || 'Select country'}
                hasFlag
                showPrefix={false}
                className="max-h-[300px] overflow-y-auto"
              />
            </div>

            {categoryOptions.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No services found for this country.</p>
              </div>
            )}

            {/* Brands available for selected country and service */}
            {selectedCategoryCode && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  {t('billPayment.availableBrands') || 'Available brands'}
                </h3>
                {availableBillerOptions.length > 0 ? (
                  <div className="space-y-2">
                    <InputWithSearch
                      options={availableBillerOptions}
                      value={selectedBillerId || ''}
                      onChange={(value) => {
                        setSelectedBillerId(value || null);
                        setSelectedItemId(null);
                      }}
                      placeholder={t('placeholders.selectNetwork') || 'Select biller'}
                      searchPlaceholder={t('placeholders.searchBillType') || 'Search biller'}
                      emptyMessage="No biller found"
                      width="w-full"
                      className="!h-12 !border-gray-200 !bg-white"
                    />
                    {selectedBillerId ? (
                      <InputWithSearch
                        options={availableBillItemOptions}
                        value={selectedItemId || ''}
                        onChange={(value) => setSelectedItemId(value || null)}
                        placeholder="Select bill item"
                        searchPlaceholder="Search bill item"
                        emptyMessage="No bill item found"
                        width="w-full"
                        className="!h-12 !border-gray-200 !bg-white"
                      />
                    ) : null}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">
                    {t('billPayment.noBrands') || 'No brands available for this selection.'}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Right Card - Payment Form */}
          <div
            className={`transition-all duration-500 ease-in-out ${
              selectedCategoryCode
                ? 'w-1/2 opacity-100 transform translate-x-0'
                : 'w-0 opacity-0 transform translate-x-full overflow-hidden'
            }`}
          >
            {selectedCategoryCode && (
              <div className="flex justify-center">
                <BillsPaymentForm
                  selectedCategory={selectedCategory}
                  selectedBiller={selectedBiller}
                  selectedItem={selectedItem}
                  countryCode={selectedCountryCode}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillPayment;

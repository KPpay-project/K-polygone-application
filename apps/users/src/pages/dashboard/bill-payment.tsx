import BillsPaymentForm from '@/components/modules/bill-payment/form.tsx';
import { ServiceItem } from '@/components/modules/bill-payment/service-item';
import { billPaymentServices } from '@/data/bill-payment-services';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CountrySelector } from '@/components/common/country-selector';
import { useQuery } from '@apollo/client';
import {
  FLUTTERWAVE_BILL_CATEGORIES,
  FLUTTERWAVE_BILLERS,
  FLUTTERWAVE_BILL_ITEMS
} from '@repo/api';
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

const SERVICE_TO_CATEGORY_CODE: Record<string, string> = {
  airtime: 'AIRTIME',
  data: 'MOBILEDATA',
  cabletv: 'CABLEBILLS',
  electricity: 'UTILITYBILLS',
  betting: 'TRANSLOG'
};

const CATEGORY_CODE_TO_SERVICE: Record<string, string> = Object.fromEntries(
  Object.entries(SERVICE_TO_CATEGORY_CODE).map(([service, category]) => [category, service])
);

const BillPayment = () => {
  const { t } = useTranslation();
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('NG');
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null);

  const { data: categoriesData } = useQuery<{ flutterwaveBillCategories: FlutterwaveBillCategory[] }>(
    FLUTTERWAVE_BILL_CATEGORIES,
    {
      variables: { countryCode: selectedCountryCode },
      skip: !selectedCountryCode
    }
  );

  const selectedCategoryCode = selectedService ? SERVICE_TO_CATEGORY_CODE[selectedService] : undefined;

  const { data: billersData } = useQuery<{ flutterwaveBillers: FlutterwaveBiller[] }>(FLUTTERWAVE_BILLERS, {
    variables: {
      category: selectedCategoryCode,
      countryCode: selectedCountryCode
    },
    skip: !selectedCategoryCode || !selectedCountryCode
  });

  const { data: billItemsData } = useQuery<{ flutterwaveBillItems: FlutterwaveBillItem[] }>(
    FLUTTERWAVE_BILL_ITEMS,
    {
      variables: {
        billerCode: selectedNetwork,
        countryCode: selectedCountryCode
      },
      skip: !selectedNetwork || !selectedCountryCode
    }
  );

  const handleServiceSelect = (serviceId: string) => {
    console.log('Selected service:', serviceId);
    setSelectedService(serviceId);
  };

  const allowedServiceIdsFromApi = useMemo(() => {
    return (
      categoriesData?.flutterwaveBillCategories
        ?.map((category) => CATEGORY_CODE_TO_SERVICE[category.code])
        .filter(Boolean) || []
    );
  }, [categoriesData]);

  const filteredServices = billPaymentServices.filter((service) =>
    allowedServiceIdsFromApi.length ? allowedServiceIdsFromApi.includes(service.id) : true
  );

  const selectedServiceData = billPaymentServices.find((service) => service.id === selectedService);

  useEffect(() => {
    setSelectedNetwork(null);
  }, [selectedService, selectedCountryCode]);

  const availableBillers = useMemo(() => {
    const list = billersData?.flutterwaveBillers || [];
    const uniqueByCode = new Map<string, FlutterwaveBiller>();
    list.forEach((item) => {
      if (!uniqueByCode.has(item.billerCode)) {
        uniqueByCode.set(item.billerCode, item);
      }
    });
    return Array.from(uniqueByCode.values());
  }, [billersData]);

  const availableBillerOptions = useMemo(() => {
    return availableBillers.map((biller) => ({
      value: biller.billerCode,
      label: biller.name
    }));
  }, [availableBillers]);

  const serviceOptions = useMemo(() => {
    return filteredServices.map((service) => ({
      value: service.id,
      label: t(service.labelKey)
    }));
  }, [filteredServices, t]);

  return (
    <div className="min-h-screen bg-[#F6F6F6] p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex gap-6 lg:gap-8 transition-all duration-500 ease-in-out">
          {/* Left Card - Services Selection */}
          <div
            className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 transition-all duration-500 ease-in-out ${
              selectedService ? 'w-1/2 transform translate-x-0' : 'w-full mx-auto max-w-2xl'
            }`}
          >
            <h1 className="text-xl sm:text-xl font-semibold text-gray-900 mb-6 sm:mb-8">{t('billPayment.title')}</h1>

            <div className="mb-6 sm:mb-8">
              <InputWithSearch
                options={serviceOptions}
                value={selectedService || ''}
                onChange={(value) => handleServiceSelect(value)}
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

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4">
              {filteredServices.map((item) => (
                <ServiceItem
                  key={item.id}
                  item={item}
                  onClick={handleServiceSelect}
                  isSelected={selectedService === item.id}
                />
              ))}
            </div>

            {filteredServices.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No services found for this country.</p>
              </div>
            )}

            {/* Brands available for selected country and service */}
            {selectedService && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  {t('billPayment.availableBrands') || 'Available brands'}
                </h3>
                {availableBillerOptions.length > 0 ? (
                  <div className="space-y-2">
                    <InputWithSearch
                      options={availableBillerOptions}
                      value={selectedNetwork || ''}
                      onChange={(value) => setSelectedNetwork(value || null)}
                      placeholder={t('placeholders.selectNetwork') || 'Select biller'}
                      searchPlaceholder={t('placeholders.searchBillType') || 'Search biller'}
                      emptyMessage="No biller found"
                      width="w-full"
                      className="!h-12 !border-gray-200 !bg-white"
                    />
                    {selectedNetwork && billItemsData?.flutterwaveBillItems?.length ? (
                      <p className="text-xs text-gray-500">
                        {billItemsData.flutterwaveBillItems.length} bill item(s) found for selected biller.
                      </p>
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
              selectedService
                ? 'w-1/2 opacity-100 transform translate-x-0'
                : 'w-0 opacity-0 transform translate-x-full overflow-hidden'
            }`}
          >
            {selectedService && (
              <div className="flex justify-center">
                <BillsPaymentForm
                  selectedService={selectedServiceData}
                  countryCode={selectedCountryCode}
                  selectedNetwork={selectedNetwork}
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

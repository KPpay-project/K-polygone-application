import BillsPaymentForm from '@/components/modules/bill-payment/form.tsx';
import { SearchBar } from '@/components/modules/search-bar';
import { ServiceItem } from '@/components/modules/bill-payment/service-item';
import { billPaymentServices } from '@/data/bill-payment-services';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CountrySelector } from '@/components/common/country-selector';
import { getBrandsFor } from '@/data/bill-payment-brands';

const BillPayment = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('NG');
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null);

  const handleServiceSelect = (serviceId: string) => {
    console.log('Selected service:', serviceId);
    setSelectedService(serviceId);
  };

  const filteredServices = billPaymentServices.filter((service) =>
    t(service.labelKey).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedServiceData = billPaymentServices.find((service) => service.id === selectedService);

  useEffect(() => {
    setSelectedNetwork(null);
  }, [selectedService, selectedCountryCode]);

  const availableBrands = useMemo(() => {
    if (!selectedService) return [];
    return getBrandsFor(selectedCountryCode, selectedService);
  }, [selectedCountryCode, selectedService]);

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
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder={t('placeholders.searchBillType')}
                variant="default"
                size="md"
                searchIconPosition="right"
                className="border-1 border-primary-800"
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

            {filteredServices.length === 0 && searchQuery && (
              <div className="text-center py-8">
                <p className="text-gray-500">No services found matching "{searchQuery}"</p>
              </div>
            )}

            {/* Brands available for selected country and service */}
            {selectedService && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  {t('billPayment.availableBrands') || 'Available brands'}
                </h3>
                {availableBrands.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {availableBrands.map((brand) => (
                      <button
                        key={`${brand.id}-${brand.name}`}
                        type="button"
                        onClick={() => setSelectedNetwork(brand.networkValue || brand.id)}
                        className={`flex items-center gap-3 p-3 rounded-xl border transition hover:shadow-sm ${
                          selectedNetwork === (brand.networkValue || brand.id)
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 bg-gray-50'
                        }`}
                        title={brand.name}
                      >
                        {brand.logoUrl ? (
                          <img
                            src={brand.logoUrl}
                            alt={brand.name}
                            className="w-8 h-8 rounded object-contain"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded bg-gray-200 flex items-center justify-center text-gray-700 text-sm font-semibold">
                            {brand.name[0]}
                          </div>
                        )}
                        <span className="text-sm font-medium text-gray-900">{brand.name}</span>
                      </button>
                    ))}
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

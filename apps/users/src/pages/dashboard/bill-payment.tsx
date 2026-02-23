import BillsPaymentForm from '@/components/modules/bill-payment/form.tsx';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';
import {
  FLUTTERWAVE_BILL_CATEGORIES,
  FLUTTERWAVE_BILLERS,
  FLUTTERWAVE_BILL_ITEMS,
  GET_FLUTTERWAVE_COUNTRIES
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

type FlutterwaveCountry = {
  id: string;
  code: string;
  name: string;
  countryFlag: string | null;
  active: boolean;
  insertedAt: string;
  updatedAt: string;
};

type CountriesResponse = {
  countries: {
    entries: FlutterwaveCountry[];
    totalEntries: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
  };
};

const BillPayment = () => {
  const { t } = useTranslation();
  const [selectedCategoryCode, setSelectedCategoryCode] = useState<string | null>(null);
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('NG');
  const [selectedBillerId, setSelectedBillerId] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const { data: countriesData } = useQuery<CountriesResponse>(GET_FLUTTERWAVE_COUNTRIES, {
    variables: {
      page: 1,
      perPage: 250,
      sortBy: 'name',
      sortDirection: 'asc'
    }
  });

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

  const countryOptions = useMemo(() => {
    return (countriesData?.countries?.entries || [])
      .filter((country) => country.active)
      .map((country) => ({
        value: country.code,
        label: `${country.name} (${country.code})`
      }));
  }, [countriesData]);

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
    <div className="min-h-screen bg-[radial-gradient(1300px_450px_at_top,_#EFF6FF,_#F3F4F6,_#F6F6F6)] p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-5">
        <div className="rounded-3xl border border-slate-200/80 bg-white/85 px-5 py-4 shadow-sm backdrop-blur-sm sm:px-6 sm:py-5">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">{t('billPayment.title')}</h1>
          <p className="mt-1 text-sm text-gray-600">Select category, biller, and item details to continue payment.</p>
        </div>

        <div className="flex gap-6 lg:gap-8 transition-all duration-500 ease-in-out">
          <div
            className={`rounded-3xl border border-slate-200/80 bg-white/95 shadow-[0_10px_40px_rgba(15,23,42,0.06)] p-4 sm:p-6 transition-all duration-500 ease-in-out ${
              selectedCategoryCode ? 'w-full lg:w-1/2 transform translate-x-0' : 'w-full mx-auto max-w-3xl'
            }`}
          >
            <div className="mb-4 flex items-center gap-2 text-xs font-medium text-slate-600">
              <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-blue-600 px-2 text-[11px] text-white">
                1
              </span>
              <span>Choose destination and service</span>
            </div>

            <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5">
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  {t('billPayment.form.country') || 'Country'}
                </div>
                <InputWithSearch
                  options={countryOptions}
                  value={selectedCountryCode}
                  onChange={(value) => setSelectedCountryCode(value || 'NG')}
                  placeholder={t('placeholders.selectCountry') || 'Select country'}
                  searchPlaceholder={t('placeholders.searchCountry') || 'Search country'}
                  emptyMessage="No country found"
                  width="w-full"
                  className="!h-11 !border-slate-200 !bg-white"
                />
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5">
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  {t('placeholders.searchBillType') || 'Bill category'}
                </div>
                <InputWithSearch
                  options={categoryOptions}
                  value={selectedCategoryCode || ''}
                  onChange={(value) => setSelectedCategoryCode(value || null)}
                  placeholder={t('placeholders.searchBillType') || 'Select bill category'}
                  searchPlaceholder={t('placeholders.searchBillType') || 'Search bill category'}
                  emptyMessage="No bill category found"
                  width="w-full"
                  className="!h-11 !border-slate-200 !bg-white"
                />
              </div>
            </div>

            {categoryOptions.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                No services found for this country.
              </div>
            )}

            {selectedCategoryCode && (
              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5">
                  <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    {t('billPayment.availableBrands') || 'Available brands'}
                  </div>
                  {availableBillerOptions.length > 0 ? (
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
                      className="!h-11 !border-slate-200 !bg-white"
                    />
                  ) : (
                    <p className="text-sm text-slate-500">
                      {t('billPayment.noBrands') || 'No brands available for this selection.'}
                    </p>
                  )}
                </div>

                {selectedBillerId ? (
                  <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5">
                    <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      Bill item
                    </div>
                    <InputWithSearch
                      options={availableBillItemOptions}
                      value={selectedItemId || ''}
                      onChange={(value) => setSelectedItemId(value || null)}
                      placeholder="Select bill item"
                      searchPlaceholder="Search bill item"
                      emptyMessage="No bill item found"
                      width="w-full"
                      className="!h-11 !border-slate-200 !bg-white"
                    />
                  </div>
                ) : null}

                <div className="flex flex-wrap gap-2 pt-1">
                  {selectedCategory ? (
                    <span className="rounded-full bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 border border-blue-100">
                      Category: {selectedCategory.name}
                    </span>
                  ) : null}
                  {selectedBiller ? (
                    <span className="rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium px-3 py-1 border border-emerald-100">
                      Biller: {selectedBiller.name}
                    </span>
                  ) : null}
                  {selectedItem ? (
                    <span className="rounded-full bg-amber-50 text-amber-700 text-xs font-medium px-3 py-1 border border-amber-100">
                      Item: {selectedItem.itemCode}
                    </span>
                  ) : null}
                </div>
              </div>
            )}
          </div>

          <div
            className={`transition-all duration-500 ease-in-out ${
              selectedCategoryCode
                ? 'w-full lg:w-1/2 opacity-100 transform translate-x-0'
                : 'w-0 opacity-0 transform translate-x-full overflow-hidden'
            }`}
          >
            {selectedCategoryCode && (
              <div className="rounded-3xl border border-slate-200/80 bg-white/95 p-2 shadow-[0_10px_40px_rgba(15,23,42,0.06)]">
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

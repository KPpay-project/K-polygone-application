import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { ResponsiveTable, TableColumn } from '@/components/common/responsive-table';
import HeaderTitle from '@/components/misc/header-title';
import AddCurrencyAction from '@/components/actions/add-currency-action';

import { useQuery } from '@apollo/client';
import { GET_CURRENCIES } from '@repo/api';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface Currency {
  __typename: string;
  id: string;
  code: string;
  countryCode: string;
  exchangeRateUsd: string;
  isActive?: boolean;
  name?: string;
  symbol?: string;
}

const getCurrencyName = (code: string) => {
  const names: { [key: string]: string } = {
    XOF: 'West African CFA Franc',
    XAF: 'Central African CFA Franc',
    ZAR: 'South African Rand',
    NGN: 'Nigerian Naira',
    KES: 'Kenyan Shilling',
    GHS: 'Ghanaian Cedi',
    UGX: 'Ugandan Shilling',
    TZS: 'Tanzanian Shilling',
    MAD: 'Moroccan Dirham',
    EGP: 'Egyptian Pound',
    SDG: 'Sudanese Pound',
    RWF: 'Rwandan Franc',
    BWP: 'Botswanan Pula',
    MZN: 'Mozambican Metical',
    ZMW: 'Zambian Kwacha',
    LSL: 'Lesotho Loti',
    SZL: 'Swazi Lilangeni',
    DJF: 'Djiboutian Franc',
    SOS: 'Somali Shilling',
    MGA: 'Malagasy Ariary',
    SCR: 'Seychellois Rupee',
    CVE: 'Cape Verdean Escudo',
    USD: 'United States Dollar',
    EUR: 'Euro',
    GBP: 'British Pound Sterling',
    CHF: 'Swiss Franc',
    CNY: 'Chinese Yuan',
    INR: 'Indian Rupee'
  };
  return names[code] || code;
};

const getCurrencySymbol = (code: string) => {
  const symbols: { [key: string]: string } = {
    XOF: 'CFA / Fr',
    XAF: 'FCFA',
    ZAR: 'R',
    NGN: '₦',
    KES: 'KSh',
    GHS: 'GH₵',
    UGX: 'USh',
    TZS: 'TSh',
    MAD: 'MAD',
    EGP: '£E',
    SDG: 'SDG',
    RWF: 'RF',
    BWP: 'P',
    MZN: 'MT',
    ZMW: 'ZK',
    LSL: 'L',
    SZL: 'E',
    DJF: 'Fdj',
    SOS: 'S',
    MGA: 'Ar',
    SCR: '₨',
    CVE: '$',
    USD: '$',
    EUR: '€',
    GBP: '£',
    CHF: 'CHF',
    CNY: '¥',
    INR: '₹'
  };
  return symbols[code] || code;
};

const CurrencyPage = () => {
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const { data, loading, error } = useQuery(GET_CURRENCIES);

  const processedCurrencies = useMemo(() => {
    if (!data?.currencies) return [];

    return data.currencies.map((currency: Currency) => ({
      id: currency.id,
      name: getCurrencyName(currency.code),
      code: currency.code,
      symbol: getCurrencySymbol(currency.code),
      countryCode: currency.countryCode,
      exchangeRateUsd: currency.exchangeRateUsd,
      icon: (
        <img
          src={`https://flagcdn.com/24x18/${currency.countryCode.toLowerCase()}.png`}
          alt={currency.code}
          className="w-6 h-4 rounded-sm"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAyNCAxOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjE4IiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjEyIiB5PSIxMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9ImNlbnRyYWwiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSI4IiBmaWxsPSIjNkI3MjgwIj4ke2N1cnJlbmN5LmNvZGV9PC90ZXh0Pgo8L3N2Zz4K`;
          }}
        />
      ),
      status: currency.isActive ?? true
    }));
  }, [data?.currencies]);

  const columns: TableColumn[] = [
    {
      key: 'name',
      label: 'Currency Name',
      accessor: 'name',
      width: '25'
    },
    {
      key: 'code',
      label: 'Code',
      accessor: 'code',
      width: '15'
    },
    {
      key: 'symbol',
      label: 'Symbol',
      accessor: 'symbol',
      width: '15'
    },
    {
      key: 'icon',
      label: 'Icon',
      accessor: (row: any) => row.icon,
      width: '15'
    }
    // {
    //   key: 'status',
    //   label: 'Status',
    //   accessor: (row: any) => (
    //     <Switch
    //       checked={row.status}
    //       onCheckedChange={() => handleToggleStatus(row.id)}
    //       className="data-[state=checked]:bg-blue-600"
    //     />
    //   ),
    //   width: '15'
    // }
  ];

  const filteredCurrencies = useMemo(() => {
    return processedCurrencies.filter((currency) => {
      const matchesSearch =
        search === '' ||
        currency.name.toLowerCase().includes(search.toLowerCase()) ||
        currency.code.toLowerCase().includes(search.toLowerCase()) ||
        currency.symbol.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Active' && currency.status) ||
        (statusFilter === 'Inactive' && !currency.status);

      return matchesSearch && matchesStatus;
    });
  }, [processedCurrencies, search, statusFilter]);

  const tableData = loading || error ? [] : filteredCurrencies;

  const pageInfo = {
    pageNumber: page,
    pageSize: perPage,
    totalEntries: data?.currencies?.length || 0,
    totalPages: Math.ceil((data?.currencies?.length || 0) / perPage)
  };

  if (error) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-red-500">Error loading currencies: {error.message}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <HeaderTitle
          title="Currency Management"
          count={data?.currencies?.length || 0}
          onSearch={(value) => {
            setSearch(value);
            setPage(1);
          }}
          onFilter={(status) => {
            setStatusFilter(status);
            setPage(1);
          }}
          filterStatus={statusFilter}
          filterOptions={['All', 'Active', 'Inactive']}
        >
          <Sheet>
            <SheetTrigger>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                + Add New Currency
              </Button>
            </SheetTrigger>
            <SheetContent>
              <AddCurrencyAction />
            </SheetContent>
          </Sheet>
        </HeaderTitle>
      </div>

      <div>
        <ResponsiveTable
          data={tableData}
          columns={columns}
          showCheckbox
          loading={loading}
          page={pageInfo?.pageNumber ?? page}
          perPage={pageInfo?.pageSize ?? perPage}
          totalEntries={pageInfo?.totalEntries ?? 0}
          totalPages={pageInfo?.totalPages ?? 1}
          onPageChange={(p) => setPage(p)}
          onPerPageChange={(n) => {
            setPerPage(n);
            setPage(1);
          }}
        />
      </div>
    </div>
  );
};

export default CurrencyPage;

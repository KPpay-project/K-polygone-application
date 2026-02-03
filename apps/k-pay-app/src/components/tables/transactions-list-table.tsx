import React, { useState, useEffect, JSX } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { Typography, TransactionSkeleton } from '@/components/ui';
import { SearchInput } from '@/components/input/search-input';
import TransactionsSection from '@/modules/home/transactions-history';
import { useUserWalletsTransactionHistory } from '@/hooks/api/use-user-wallets-transaction-history';
import { WalletTransaction } from '@/types/graphql';
import { ReceiveSquare2, Bank, Send, Receipt } from 'iconsax-react-nativejs';
import { getSymbolFromCode } from 'currency-code-symbol-map';

interface Transaction {
  id: string;
  name: string;
  amount: string;
  time: string;
  date: string;
  icon: string;
  type: 'expense' | 'income';
  category: string;
  status: 'completed' | 'pending' | 'failed';
}

const getTransactionIcon = (transactionType: string): JSX.Element => {
  if (transactionType?.includes('deposit'))
    return <ReceiveSquare2 size={20} color="#10B981" />;
  if (transactionType?.includes('withdrawal'))
    return <Bank size={20} color="#EF4444" />;
  if (transactionType?.includes('transfer'))
    return <Send size={20} color="#3B82F6" />;
  return <Receipt size={20} color="#6B7280" />;
};

const mapTransactionStatus = (
  status: string
): 'completed' | 'pending' | 'failed' => {
  const statusLower = status.toLowerCase();
  if (
    statusLower.includes('approved') ||
    statusLower.includes('completed') ||
    statusLower.includes('success')
  ) {
    return 'completed';
  }
  if (statusLower.includes('pending') || statusLower.includes('processing')) {
    return 'pending';
  }
  return 'failed';
};

interface TransactionsListProps {
  length?: number;
  showFilters?: boolean;
  withPagination?: boolean;
}

export function TransactionsList({
  length = 10,
  showFilters = false,
  withPagination = false,
}: TransactionsListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showFilterBar, setShowFilterBar] = useState(showFilters);
  const [currentPage, setCurrentPage] = useState(1);

  const { transactions, pagination, loading, refetch } =
    useUserWalletsTransactionHistory({
      page: currentPage,
      perPage: length,
      search: searchQuery || undefined,
      type: selectedFilter !== 'all' ? selectedFilter : undefined,
    });

  const filterOptions = [
    { label: 'All', value: 'all' },
    { label: 'Deposit', value: 'deposit' },
    { label: 'Withdrawal', value: 'withdrawal' },
    { label: 'Transfer', value: 'transfer' },
  ];

  const mappedTransactions: Transaction[] = transactions?.map(
    (tx: WalletTransaction) => {
      const date = tx.insertedAt;
      const transactionType = tx.transactionType.toLowerCase();
      const isExpense =
        transactionType.includes('withdrawal') ||
        transactionType.includes('transfer');
      const amount = Math.abs(Number(tx.amount));

      let displayName = tx.transactionType;
      if (tx.provider) {
        displayName = tx.provider;
      } else if (tx.description) {
        displayName = tx.description.split(' - ')[0] || tx.transactionType;
      }

      return {
        id: tx.id,
        name: displayName,
        amount: `${isExpense ? '-' : '+'}${getSymbolFromCode(tx.currency.code)}${amount.toFixed(2)} `,
        time: date,
        date: date,
        icon: getTransactionIcon(transactionType),
        type: isExpense ? 'expense' : 'income',
        category: tx.transactionType,
        status: mapTransactionStatus(tx.status),
      };
    }
  );

  const filteredTransactions = mappedTransactions;

  useEffect(() => {
    refetch();
  }, [searchQuery, selectedFilter, currentPage, refetch]);

  if (loading) {
    return <TransactionSkeleton itemsCount={length} />;
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View>
        {showFilters && (
          <View className="px-6 py-4">
            <SearchInput
              placeholder="Search transactions"
              onChangeText={setSearchQuery}
              value={searchQuery}
              iconPosition="right"
            />
          </View>
        )}

        {/* {showFilterBar && (
          <View className="px-6 pb-4 gap-2">
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row space-x-3">
                {filterOptions.map((filter) => (
                  <TouchableOpacity
                    key={filter.value}
                    onPress={() => {
                      setSelectedFilter(filter.value);
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-2 rounded-full ${
                      selectedFilter === filter.value
                        ? 'bg-red-600'
                        : 'bg-gray-100'
                    }`}
                  >
                    <Typography
                      variant="caption"
                      className={`font-medium ${
                        selectedFilter === filter.value
                          ? 'text-white'
                          : 'text-gray-600'
                      }`}
                    >
                      {filter.label}
                    </Typography>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        )} */}

        <TransactionsSection transactions={filteredTransactions} />

        {withPagination && pagination.totalPages > 1 && (
          <View className="px-6 py-4">
            <View className="flex-row items-center justify-between">
              <TouchableOpacity
                onPress={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg border ${
                  currentPage === 1
                    ? 'bg-gray-100 border-gray-200'
                    : 'bg-white border-gray-300'
                }`}
              >
                <Typography
                  variant="caption"
                  className={
                    currentPage === 1 ? 'text-gray-400' : 'text-gray-700'
                  }
                >
                  Previous
                </Typography>
              </TouchableOpacity>

              <View className="flex-row items-center gap-2">
                <Typography variant="caption" className="text-gray-600">
                  Page {pagination.page} of {pagination.totalPages}
                </Typography>
                <Typography variant="caption" className="text-gray-400">
                  ({pagination.totalEntries} total)
                </Typography>
              </View>

              <TouchableOpacity
                onPress={() =>
                  setCurrentPage((prev) =>
                    Math.min(prev + 1, pagination.totalPages)
                  )
                }
                disabled={currentPage === pagination.totalPages}
                className={`px-4 py-2 rounded-lg border ${
                  currentPage === pagination.totalPages
                    ? 'bg-gray-100 border-gray-200'
                    : 'bg-white border-gray-300'
                }`}
              >
                <Typography
                  variant="caption"
                  className={
                    currentPage === pagination.totalPages
                      ? 'text-gray-400'
                      : 'text-gray-700'
                  }
                >
                  Next
                </Typography>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

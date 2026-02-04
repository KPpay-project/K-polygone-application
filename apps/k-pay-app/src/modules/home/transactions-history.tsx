import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Typography } from '@/components/ui';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

import { EmptyState } from '@/components/fallbacks/empty-state';
import { truncateCharacters } from '@/utils/misc';

interface Transaction {
  id: string;
  name: string;
  amount: string;
  time: string;
  icon: string;
  type: 'expense' | 'income';
}

interface TransactionsSectionProps {
  transactions: Transaction[];
  backgroundColors?: string[];
  textColors?: string[];
  onTransactionPress?: (transaction: Transaction) => void;
  seeAllTransactions?: boolean;
}

export default function TransactionsSection({
  transactions,
  backgroundColors = ['bg-blue-200', 'bg-purple-200', 'bg-green-200'],
  textColors = ['text-blue-700', 'text-purple-700', 'text-green-700'],
  onTransactionPress,
  seeAllTransactions = false,
}: TransactionsSectionProps) {
  const { t } = useTranslation();
  const navigateToTransactions = () => {
    router.push('/transactions/preview-transactions');
  };

  const handleTransactionPress = (transaction: Transaction) => {
    if (onTransactionPress) {
      onTransactionPress(transaction);
    } else {
      const safeTransaction = {
        id: transaction.id,
        name: transaction.name,
        amount: transaction.amount,
        time: transaction.time,
        type: transaction.type,
        icon: typeof transaction.icon === 'string' ? transaction.icon : '',
      };
      const transactionData = encodeURIComponent(
        JSON.stringify(safeTransaction)
      );
      router.push(`/transactions/preview-transactions?data=${transactionData}`);
    }
  };

  return (
    <View className="px-6">
      <View className="flex-row items-center justify-between mb-4">
        <Typography variant="h5" className="text-gray-900 " weight="500">
          {t('transactions')}
        </Typography>
        {seeAllTransactions && (
          <TouchableOpacity onPress={navigateToTransactions}>
            <Typography variant="body" className="text-blue-600 font-medium">
              {t('seeAll')}
            </Typography>
          </TouchableOpacity>
        )}
      </View>

      {transactions?.length === 0 ? (
        <View className="py-4 px-4 my-[5em] bg-white rounded-xl sssss xx">
          <EmptyState
            title={t('noTransactionsAvailable') || 'No Transactions'}
            description={
              t('noTransactionsDescription') || 'No transactions found.'
            }
          />
        </View>
      ) : (
        transactions?.map((transaction, index) => {
          const isCredit = transaction.type === 'income';
          const bgColor = isCredit ? 'bg-green-50' : 'bg-blue-50';
          const textColor = isCredit ? 'text-green-600' : 'text-blue-600';
          return (
            <TouchableOpacity
              key={`${transaction.id}-${index}`}
              onPress={() => handleTransactionPress(transaction)}
              className="flex-row items-center justify-between py-4 px-4 mb-3 bg-white rounded-2xl border border-gray-200 shadow-0"
            >
              <View className="flex-row items-center flex-1">
                <View
                  className={`w-12 h-12 ${bgColor} rounded-full items-center justify-center mr-3`}
                >
                  <Typography
                    variant="body"
                    className={`${textColor} font-bold`}
                  >
                    {transaction.icon}
                  </Typography>
                </View>
                <View className="flex-1">
                  <Typography
                    variant="caption"
                    weight="500"
                    className="text-gray-900 font-semibold "
                  >
                    {truncateCharacters(transaction.name, 20)}
                  </Typography>
                  <Typography variant="small" className="text-gray-500">
                    {moment(transaction.time).format('MMM Do, h:mmA')}
                  </Typography>
                </View>
              </View>
              <Typography variant="small" weight="600" color="">
                {transaction.amount}
              </Typography>
            </TouchableOpacity>
          );
        })
      )}
    </View>
  );
}

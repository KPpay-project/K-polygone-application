//@ts-nocheck
import React from 'react';
import { UserWalletTransaction as WalletTransaction } from '@repo/types';
import { Button } from 'k-polygon-assets/components';
import { cn } from '@/lib/utils';
import { getStatusColor } from '@/data/transactions';
import { Printer } from 'iconsax-reactjs';
import { CardReceive } from 'iconsax-reactjs';
import { Link } from '@tanstack/react-router';

interface ViewTransactionProps {
  transaction: WalletTransaction;
  onPrint?: (tx: WalletTransaction) => void;
  onCreateDispute?: (tx: WalletTransaction) => void;
  className?: string;
}

const formatMoney = (amount?: string, code?: string) => {
  if (amount == null) return '-';
  const n = Number(amount);
  if (Number.isNaN(n)) return `${amount} ${code ?? ''}`.trim();
  try {
    return `${new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(n)}${code ? ' ' + code : ''}`;
  } catch {
    return `${n}${code ? ' ' + code : ''}`;
  }
};

const ViewTransaction: React.FC<ViewTransactionProps> = ({ transaction, className }) => {
  const amount = formatMoney(transaction.amount, transaction.currency?.code);
  const fee = formatMoney(transaction.feeAmount, transaction.feeCurrency?.code ?? transaction.currency?.code);
  const totalNum = (Number(transaction.amount) || 0) + (Number(transaction.feeAmount) || 0);
  const total = formatMoney(String(totalNum), transaction.currency?.code);
  const date = new Date(transaction.insertedAt);

  return (
    <div className={cn('pb-6', className)}>
      <div className="flex items-center justify-between my-8 bg-blue-50 rounded-xl px-4 py-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-blue-700 flex items-center justify-center text-blue-600 font-semibold">
            <CardReceive color={'white'} size={20} />
          </div>
          <div className="text-blue-700 font-medium">{transaction.transactionType || 'Transaction'}</div>
        </div>
        <div className="text-blue-700 font-semibold">{amount}</div>
      </div>

      <div className="mt-6 space-y-4">
        <div className="grid grid-cols-2 gap-y-3 text-sm">
          <div className="text-gray-500">Deposited By</div>
          <div className="text-right text-gray-900 truncate">
            {transaction.counterpartyWallet?.ownerId || transaction.wallet?.ownerId || '-'}
          </div>

          <div className="text-gray-500">Transaction ID</div>
          <div className="text-right text-gray-900 break-all">{transaction.id}</div>

          <div className="text-gray-500">Transaction Fee</div>
          <div className="text-right text-gray-900">{fee}</div>

          <div className="text-gray-500">Currency</div>
          <div className="text-right text-gray-900">{transaction.currency?.code || '-'}</div>

          <div className="text-gray-500">Status</div>
          <div className="text-right">
            <span
              className={cn(
                'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap',
                getStatusColor(transaction.status)
              )}
            >
              {transaction.status}
            </span>
          </div>

          <div className="text-gray-500">Date</div>
          <div className="text-right text-gray-900">
            <div>{date.toLocaleDateString()}</div>
            <div className="text-xs text-gray-500">{date.toLocaleTimeString()}</div>
          </div>

          <div className="text-gray-500">Payment Method</div>
          <div className="text-right text-gray-900">{transaction.provider || '-'}</div>

          <div className="text-gray-900 font-semibold">Total</div>
          <div className="text-right text-gray-900 font-semibold">{total}</div>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <Button className="w-full" onClick={() => window.print()}>
          Print
          <Printer size={22} />
        </Button>
        {/* @ts-nocheck */}
        <Link to={`/ticket?trxnId=${transaction?.id}`}>
          <Button className="w-full  mt-4 border-red-600 text-primary " variant="outline">
            Create Dispute
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ViewTransaction;

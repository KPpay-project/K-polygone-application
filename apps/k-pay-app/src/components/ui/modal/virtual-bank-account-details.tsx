import React from 'react';
import { View } from 'react-native';
import { Typography } from '@/components/ui';

interface BankDetails {
  accountName?: string;
  accountNumber?: string;
  bankName?: string;
  currency?: string;
  expiresAt?: string | Date | null;
}

interface Props {
  bankDetails: BankDetails | null;
  onCopy: (text: string) => void;
}

const DetailRow = ({
  label,
  value,
  onCopy,
}: {
  label: string;
  value?: string;
  onCopy?: () => void;
}) => (
  <View className="flex-row justify-between items-center mb-2">
    <Typography variant="caption" className="font-medium text-gray-500 ">
      {label}
    </Typography>

    <View className="flex-row items-center gap-2">
      <Typography
        variant={'caption'}
        className={`${
          label === 'Account Number' ? 'font-bold' : 'font-semibold'
        } text-gray-900`}
      >
        {value ?? '—'}
      </Typography>
      {/* 
            {value && onCopy && (
                <TouchableOpacity onPress={onCopy} className="p-1">
                    <Copy size={20} color="#6B7280" variant="Bold" />
                </TouchableOpacity>
            )} */}
    </View>
  </View>
);

export const ViewVirtualBankDetails = ({ bankDetails, onCopy }: Props) => {
  return (
    <View className="space-y-4">
      <Typography
        variant="caption"
        style={{
          textAlign: 'center',
        }}
      >
        Use the details below to make a transfer. Your wallet will be credited
        automatically.
      </Typography>

      <View className="rounded-xl border border-gray-200 p-4 space-y-3 bg-gray-50 mt-6">
        {/* <DetailRow label="Account Name" value={bankDetails?.accountName} /> */}

        <Typography variant="caption" weight="600" className="text-center mb-9">
          {bankDetails?.accountName}
        </Typography>

        <DetailRow
          label="Account Number"
          value={bankDetails?.accountNumber}
          onCopy={
            bankDetails?.accountNumber
              ? () => onCopy(bankDetails.accountNumber!)
              : undefined
          }
        />

        <DetailRow label="Bank" value={bankDetails?.bankName} />

        <DetailRow label="Currency" value={bankDetails?.currency} />

        {bankDetails?.expiresAt && (
          <DetailRow
            label="Expires At"
            value={new Date(bankDetails.expiresAt).toLocaleString()}
          />
        )}
      </View>
    </View>
  );
};

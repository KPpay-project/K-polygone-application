import React, { useEffect, useState } from 'react';
import { View, Share } from 'react-native';
import { useApolloClient, useMutation, gql } from '@apollo/client';
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-toast-message';

import { ScreenContainer } from '@/layout/safe-area-layout';
import { ReusableButton } from '@/components/ui';
import UsersCurrencyDropdown from '@/components/currency/users-currency-dropdown';
import { ReusableModal } from '@/components/ui/modal/modal';
import { DEPOSIT_VIA_BANK_MUTATION } from '@/lib/graphql/flutterwave';
import { ViewVirtualBankDetails } from '@/components/ui/modal/virtual-bank-account-details';
import { HeaderWithTitle } from '@/components';
import { BottomSheetModal } from '@/components/ui/modal/bottom-sheet-modal';

type BankResp = {
  accountName?: string | null;
  accountNumber?: string | null;
  bankName?: string | null;
  currency?: string | null;
  expiresAt?: string | null;
  isPermanent?: boolean | null;
  message?: string | null;
  success?: boolean | null;
};

const GET_CACHED_BANK_DETAILS = gql`
  query GetCachedBankDetails {
    bankDetails @client
  }
`;

function DepositViaBank() {
  const apollo = useApolloClient();

  const [form, setForm] = useState({
    currencyCode: '',
    walletId: '',
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [bankDetails, setBankDetails] = useState<BankResp | null>(null);

  const [mutate, { loading }] = useMutation(DEPOSIT_VIA_BANK_MUTATION);

  useEffect(() => {
    try {
      const cached = apollo.readQuery<{ bankDetails: BankResp }>({
        query: GET_CACHED_BANK_DETAILS,
      });

      if (cached?.bankDetails) {
        const d = cached.bankDetails;

        if (d.isPermanent) {
          setBankDetails(d);
          setModalOpen(true);
        } else if (
          d.expiresAt &&
          Date.now() < new Date(d.expiresAt).getTime()
        ) {
          setBankDetails(d);
          setModalOpen(true);
        }
      }
    } catch {}
  }, []);

  const handleSubmit = async () => {
    if (!form.currencyCode || !form.walletId) {
      Toast.show({ type: 'error', text1: 'Please select a currency' });
      return;
    }

    try {
      const { data } = await mutate({
        variables: {
          input: {
            currencyCode: form.currencyCode,
            walletId: form.walletId,
          },
        },

        update(cache, { data }) {
          if (data?.depositViaBank) {
            cache.writeQuery({
              query: GET_CACHED_BANK_DETAILS,
              data: {
                bankDetails: data.depositViaBank,
              },
            });
          }
        },
      });

      const resp: BankResp = data?.depositViaBank;
      const success = Boolean(resp?.success);

      if (!success) {
        Toast.show({
          type: 'error',
          text1: resp?.message || 'Unable to process request',
        });
        return;
      }

      setBankDetails(resp);
      setModalOpen(true);
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1:
          err?.message ||
          err?.networkError?.message ||
          'Unable to process deposit via bank at the moment.',
      });
    }
  };

  const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text);
    Toast.show({ type: 'success', text1: 'Copied to clipboard' });
  };

  const shareMessage = () => {
    if (!bankDetails) return 'Bank deposit details unavailable.';

    const expiresText = bankDetails.expiresAt
      ? `Expires At: ${new Date(bankDetails.expiresAt).toLocaleString()}\n`
      : '';

    return (
      `Bank Deposit Details\n\n` +
      `Account Name: ${bankDetails.accountName ?? '—'}\n` +
      `Account Number: ${bankDetails.accountNumber ?? '—'}\n` +
      `Bank: ${bankDetails.bankName ?? '—'}\n` +
      `Currency: ${bankDetails.currency ?? '—'}\n` +
      expiresText
    ).trim();
  };

  const handleShare = () => {
    Share.share({
      title: 'Bank Deposit Details',
      message: shareMessage(),
    });
  };

  return (
    <ScreenContainer useSafeArea paddingHorizontal={15}>
      <HeaderWithTitle />

      <View className="flex-1">
        <UsersCurrencyDropdown
          label="Select currency"
          selectedCurrency={form.currencyCode}
          onChange={(opt) =>
            setForm((s) => ({
              ...s,
              walletId: opt?.walletId ?? '',
              currencyCode: opt?.currencyCode ?? '',
            }))
          }
        />

        <View className="mt-6">
          <ReusableButton
            text={loading ? 'Processing...' : 'Deposit Via Bank'}
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
          />
        </View>
      </View>

      <BottomSheetModal
        visible={modalOpen}
        onClose={() => setModalOpen(false)}
        // title="Bank Deposit Details"
        // variant="bottom"
      >
        <ViewVirtualBankDetails
          bankDetails={bankDetails}
          onCopy={copyToClipboard}
        />

        <View className="mt-6">
          <ReusableButton text="Share" onPress={handleShare} />
        </View>
      </BottomSheetModal>
    </ScreenContainer>
  );
}

export default DepositViaBank;

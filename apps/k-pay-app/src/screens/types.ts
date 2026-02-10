import { SupportedProviders } from '@/types/graphql';

type FormData = {
  amount: string;
  phoneNumber: string;
  transactionId: string;
};

type FormErrors = {
  amount?: string;
  phoneNumber?: string;
  transactionId?: string;
};

type TransactionStatus = 'idle' | 'processing' | 'success' | 'failed';

interface DepositViaBankScreenProps {
  title: string;
  provider: SupportedProviders;
}

export { DepositViaBankScreenProps, FormData, FormErrors, TransactionStatus };

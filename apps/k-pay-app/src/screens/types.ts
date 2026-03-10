import { SupportedProviders } from '@/types/graphql';

type FormErrors = {
  amount?: string;
  phoneNumber?: string;
};

type TransactionStatus = 'idle' | 'processing' | 'success' | 'failed';

interface DepositViaMnoScreenProps {
  title: string;
  provider: SupportedProviders;
}

export { DepositViaMnoScreenProps, FormErrors, TransactionStatus };

import { useMutation } from '@apollo/client';
import {
  DEPOSIT_VIA_BANK_MUTATION,
  DEPOSIT_VIA_CARD_MUTATION,
} from '@/lib/graphql/flutterwave';

type DepositBankInput = {
  currencyCode: string | null;
  walletId: string | null;
};

type DepositMutationState<TData = any> = {
  data: TData | undefined;
  loading: boolean;
  error: Error | undefined;
};

const useFlutterWave = () => {
  const [depositViaBankMutate, bankState] = useMutation(
    DEPOSIT_VIA_BANK_MUTATION
  );
  const [depositViaCardMutate, cardState] = useMutation(
    DEPOSIT_VIA_CARD_MUTATION
  );

  const depositBank = async (input: DepositBankInput) => {
    const variables = {
      currencyCode: input.currencyCode ?? null,
      walletId: input.walletId ?? null,
    };

    return depositViaBankMutate({ variables });
  };

  const depositCard = async (variables?: Record<string, unknown>) => {
    return depositViaCardMutate({ variables });
  };

  return {
    depositBank,
    depositCard,

    depositViaBankMutate,
    depositViaCardMutate,

    bank: {
      data: bankState.data,
      loading: bankState.loading,
      error: bankState.error as Error | undefined,
    } as DepositMutationState,
    card: {
      data: cardState.data,
      loading: cardState.loading,
      error: cardState.error as Error | undefined,
    } as DepositMutationState,
  };
};

export default useFlutterWave;

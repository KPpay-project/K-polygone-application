import { useMutation, useQuery } from '@apollo/client';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { CREATE_BILL_PAYMENT, VERIFY_BILL_PAYMENT, GET_BILL_PAYMENT_FEES } from '@/lib/graphql/mutations/bill-payment';
import {
  CreateBillPaymentVariables,
  CreateBillPaymentResult,
  VerifyBillPaymentVariables,
  VerifyBillPaymentResult,
  GetBillPaymentFeesVariables,
  GetBillPaymentFeesResult
} from '@repo/types';

export const useBillPayment = () => {
  const { t } = useTranslation();

  const [createBillPayment, { loading: creating, error: createError }] = useMutation<
    CreateBillPaymentResult,
    CreateBillPaymentVariables
  >(CREATE_BILL_PAYMENT, {
    onCompleted: () => {
      toast.success(t('billPayment.paymentInitiated'));
    },
    onError: (error) => {
      toast.error(error.message || t('billPayment.paymentFailed'));
    }
  });

  const [verifyBillPayment, { loading: verifying, error: verifyError }] = useMutation<
    VerifyBillPaymentResult,
    VerifyBillPaymentVariables
  >(VERIFY_BILL_PAYMENT, {
    onCompleted: (data) => {
      if (data.verifyBillPayment.verificationStatus === 'verified') {
        toast.success(t('billPayment.paymentVerified'));
      } else {
        toast.info(t('billPayment.verificationPending'));
      }
    },
    onError: (error) => {
      toast.error(error.message || t('billPayment.verificationFailed'));
    }
  });

  return {
    createBillPayment,
    verifyBillPayment,
    creating,
    verifying,
    createError,
    verifyError
  };
};

export const useBillPaymentFees = (variables: GetBillPaymentFeesVariables) => {
  const { t } = useTranslation();

  const { data, loading, error, refetch } = useQuery<GetBillPaymentFeesResult, GetBillPaymentFeesVariables>(
    GET_BILL_PAYMENT_FEES,
    {
      variables,
      skip: !variables.service || !variables.amount || variables.amount <= 0,
      onError: (error) => {
        toast.error(error.message || t('billPayment.feeCalculationFailed'));
      }
    }
  );

  return {
    fees: data?.billPaymentFees,
    loading,
    error,
    refetch
  };
};

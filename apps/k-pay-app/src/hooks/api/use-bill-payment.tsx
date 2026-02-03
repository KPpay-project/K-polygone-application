import { useMutation, useQuery } from '@apollo/client';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';
import {
  CREATE_BILL_PAYMENT,
  VERIFY_BILL_PAYMENT,
  GET_BILL_PAYMENT_FEES,
} from '@/lib/graphql/mutations/bill-payment';
import {
  CreateBillPaymentVariables,
  CreateBillPaymentResult,
  VerifyBillPaymentVariables,
  VerifyBillPaymentResult,
  GetBillPaymentFeesVariables,
  GetBillPaymentFeesResult,
} from '@/types/bill-payment';

export const useBillPayment = () => {
  const { t } = useTranslation();

  const [createBillPayment, { loading: creating, error: createError }] =
    useMutation<CreateBillPaymentResult, CreateBillPaymentVariables>(
      CREATE_BILL_PAYMENT,
      {
        onCompleted: () => {
          Toast.show({
            type: 'success',
            text1: t('billPayment.paymentInitiated'),
          });
        },
        onError: (error) => {
          Toast.show({
            type: 'error',
            text1: error.message || t('billPayment.paymentFailed'),
          });
        },
      }
    );

  const [verifyBillPayment, { loading: verifying, error: verifyError }] =
    useMutation<VerifyBillPaymentResult, VerifyBillPaymentVariables>(
      VERIFY_BILL_PAYMENT,
      {
        onCompleted: (data) => {
          if (data.verifyBillPayment.verificationStatus === 'verified') {
            Toast.show({
              type: 'success',
              text1: t('billPayment.paymentVerified'),
            });
          } else {
            Toast.show({
              type: 'info',
              text1: t('billPayment.verificationPending'),
            });
          }
        },
        onError: (error) => {
          Toast.show({
            type: 'error',
            text1: error.message || t('billPayment.verificationFailed'),
          });
        },
      }
    );

  return {
    createBillPayment,
    verifyBillPayment,
    creating,
    verifying,
    createError,
    verifyError,
  };
};

export const useBillPaymentFees = (variables: GetBillPaymentFeesVariables) => {
  const { t } = useTranslation();

  const { data, loading, error, refetch } = useQuery<
    GetBillPaymentFeesResult,
    GetBillPaymentFeesVariables
  >(GET_BILL_PAYMENT_FEES, {
    variables,
    skip: !variables.service || !variables.amount || variables.amount <= 0,
    onError: (error) => {
      Toast.show({
        type: 'error',
        text1: error.message || t('billPayment.feeCalculationFailed'),
      });
    },
  });

  return {
    fees: data?.billPaymentFees,
    loading,
    error,
    refetch,
  };
};

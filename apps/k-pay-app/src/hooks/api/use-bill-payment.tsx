import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';
import {
  PAY_FLUTTERWAVE_BILL,
  VERIFY_BILL_PAYMENT,
  GET_BILL_PAYMENT_FEES,
  VALIDATE_FLUTTERWAVE_BILL_CUSTOMER,
  FLUTTERWAVE_BILL_PAYMENT_STATUS,
} from '@repo/api';
import {
  VerifyBillPaymentVariables,
  VerifyBillPaymentResult,
  GetBillPaymentFeesVariables,
  GetBillPaymentFeesResult,
  PayFlutterwaveBillVariables,
  PayFlutterwaveBillResult,
  ValidateFlutterwaveBillCustomerVariables,
  ValidateFlutterwaveBillCustomerResult,
  FlutterwaveBillPaymentStatusVariables,
  FlutterwaveBillPaymentStatusResult,
} from '@/types/bill-payment';

export const useBillPayment = () => {
  const { t } = useTranslation();

  const [createBillPayment, { loading: creating, error: createError }] =
    useMutation<PayFlutterwaveBillResult, PayFlutterwaveBillVariables>(
      PAY_FLUTTERWAVE_BILL,
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

  const [
    validateFlutterwaveBillCustomer,
    { loading: validatingCustomer, error: validateCustomerError },
  ] = useLazyQuery<
    ValidateFlutterwaveBillCustomerResult,
    ValidateFlutterwaveBillCustomerVariables
  >(VALIDATE_FLUTTERWAVE_BILL_CUSTOMER, {
    fetchPolicy: 'no-cache',
  });

  const [
    getFlutterwaveBillPaymentStatus,
    { loading: checkingPaymentStatus, error: paymentStatusError },
  ] = useLazyQuery<
    FlutterwaveBillPaymentStatusResult,
    FlutterwaveBillPaymentStatusVariables
  >(FLUTTERWAVE_BILL_PAYMENT_STATUS, {
    fetchPolicy: 'no-cache',
  });

  return {
    createBillPayment,
    verifyBillPayment,
    validateFlutterwaveBillCustomer,
    getFlutterwaveBillPaymentStatus,
    creating,
    verifying,
    validatingCustomer,
    checkingPaymentStatus,
    createError,
    verifyError,
    validateCustomerError,
    paymentStatusError,
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

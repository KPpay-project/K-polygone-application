import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import {
  PAY_FLUTTERWAVE_BILL,
  VERIFY_BILL_PAYMENT,
  GET_BILL_PAYMENT_FEES,
  VALIDATE_FLUTTERWAVE_BILL_CUSTOMER,
  FLUTTERWAVE_BILL_PAYMENT_STATUS
} from '@repo/api';
import {
  PayFlutterwaveBillVariables,
  PayFlutterwaveBillResult,
  VerifyBillPaymentVariables,
  VerifyBillPaymentResult,
  GetBillPaymentFeesVariables,
  GetBillPaymentFeesResult
} from '@repo/types';

export const useBillPayment = () => {
  const { t } = useTranslation();

  const [createBillPayment, { loading: creating, error: createError }] = useMutation<
    PayFlutterwaveBillResult,
    PayFlutterwaveBillVariables
  >(PAY_FLUTTERWAVE_BILL, {
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

  const [validateFlutterwaveBillCustomer, { loading: validatingCustomer, error: validateCustomerError }] =
    useLazyQuery<
      {
        validateFlutterwaveBillCustomer: {
          customerName: string | null;
          message: string;
          status: string;
          valid: boolean;
        };
      },
      { customerId: string; itemCode: string }
    >(VALIDATE_FLUTTERWAVE_BILL_CUSTOMER, {
      fetchPolicy: 'no-cache'
    });

  const [getFlutterwaveBillPaymentStatus, { loading: checkingPaymentStatus, error: paymentStatusError }] = useLazyQuery<
    {
      flutterwaveBillPaymentStatus: {
        amount: string | number | null;
        billPaymentId: string | null;
        currency: string | null;
        flutterwaveReference: string | null;
        message: string | null;
        providerStatus: string | null;
        reference: string | null;
        status: string | null;
        success: boolean;
      };
    },
    { reference: string }
  >(FLUTTERWAVE_BILL_PAYMENT_STATUS, {
    fetchPolicy: 'no-cache'
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
    paymentStatusError
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

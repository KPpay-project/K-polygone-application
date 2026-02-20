export interface BillPaymentInput {
  service: string;
  network?: string;
  amount: number;
  currency: string;
  account: string;
  country: string;
  paymentMethod: string;
  walletId: string;
  description?: string;
}

export interface FlutterwaveBillPaymentInput {
  amount: number;
  billerCode: string;
  billerId: string;
  callbackUrl?: string;
  countryCode: string;
  currencyCode: string;
  customerId: string;
  description?: string;
  itemCode: string;
  narration?: string;
  reference?: string;
  walletId: string;
}

export interface FlutterwaveBillPaymentResponse {
  amount: number | string;
  billPaymentId: string;
  currency: string;
  flutterwaveReference?: string | null;
  message?: string | null;
  providerStatus?: string | null;
  reference: string;
  status: string;
  success: boolean;
}

export interface BillPaymentResponse {
  id: string;
  amount: number;
  currency: string;
  service: string;
  network?: string;
  account: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  reference: string;
  fee: number;
  total: number;
  createdAt: string;
  updatedAt: string;
  transaction: {
    id: string;
    amount: number;
    currency: string;
    transactionType: string;
    status: string;
    description: string;
    reference: string;
    walletId: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface BillPaymentFees {
  serviceFee: number;
  networkFee: number;
  totalFee: number;
  exchangeRate?: number;
}

export interface CreateBillPaymentVariables {
  input: BillPaymentInput;
}

export interface CreateBillPaymentResult {
  createBillPayment: BillPaymentResponse;
}

export interface VerifyBillPaymentVariables {
  reference: string;
}

export interface VerifyBillPaymentResult {
  verifyBillPayment: {
    id: string;
    status: string;
    verificationStatus: 'verified' | 'pending' | 'failed';
    verifiedAt?: string;
  };
}

export interface GetBillPaymentFeesVariables {
  service: string;
  network?: string;
  amount: number;
}

export interface GetBillPaymentFeesResult {
  billPaymentFees: BillPaymentFees;
}

export interface PayFlutterwaveBillVariables {
  input: FlutterwaveBillPaymentInput;
}

export interface PayFlutterwaveBillResult {
  payFlutterwaveBill: FlutterwaveBillPaymentResponse;
}

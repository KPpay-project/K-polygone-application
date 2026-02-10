import { gql } from '@apollo/client';

export interface TransferInput {
  amount: string;
  currencyCode: string;
  description?: string | null;
  fromWalletId: string;
  toWalletId: string;
}

export interface MomoDisbursementInput {
  amount: string;
  currencyCode: string;
  description?: string | null;
  recipientPhone: string;
  walletId: string;
}

export interface WalletToWalletInput {
  sendersWalletId: string;
  receiversWalletCode: string;
  amount: string;
  description?: string | null;
  quoteId?: string | null;
  paymentPin?: string;
}

const TRANSFER = gql`
  mutation Transfer($input: TransferInput!) {
    transfer(input: $input) {
      success
      message
      fromBalance {
        availableBalance
      }
      toBalance {
        availableBalance
      }
      outTransaction {
        status
        reference
      }
      inTransaction {
        status
        reference
      }
    }
  }
`;

const MOMO_TRANSFER = gql`
  mutation MomoTransfer($input: MomoDisbursementInput!) {
    transferMomo(input: $input) {
      success
      message
      fromBalance {
        availableBalance
      }
      transaction {
        status
        provider
        providerStatus
        reference
      }
    }
  }
`;

const WALLET_TO_WALLET_TRANSFER = gql`
  mutation WalletToWalletTransfer($input: WalletToWalletInput!) {
    walletToWalletTransfer(input: $input) {
      success
      message
      fromBalance {
        availableBalance
      }
      toBalance {
        availableBalance
      }
      outTransaction {
        status
        reference
      }
      inTransaction {
        status
        reference
      }
    }
  }
`;

const GET_USER_WALLET_CODE = gql`
  query GetUserByWalletCode($walletCode: String!) {
    getUserByWalletCode(walletCode: $walletCode) {
      id
      user {
        firstName
        lastName
      }
    }
  }
`;

const TRANSFER_QUOTE_MUTATION = gql`
  mutation TransferQuote($input: TransferQuoteInput!) {
    transferQuote(input: $input) {
      amount
      applies
      currencyCode
      expiresAt
      feeAmount
      feeCurrencyCode
      paymentType
      quoteId
      tier
      totalDebit
    }
  }
`;

const TRANSFER_TO_KPAY_USER = gql`
  mutation TransferToKpayUser($input: TransferToKpayUserInput!) {
    transferToKpayUser(input: $input) {
      success
      message
      jobId
      reference
      status
    }
  }
`;

export interface TransferToKpayUserInput {
  amount: string;
  currencyCode: string;
  description?: string | null;
  recipientEmail: string;
}

export interface TransferQuoteInput {
  amount: string;
  currencyCode: string;
  fromWalletId: string;
  paymentType: string;
  toWalletCode: string;
}
export {
  TRANSFER,
  MOMO_TRANSFER,
  WALLET_TO_WALLET_TRANSFER,
  GET_USER_WALLET_CODE,
  TRANSFER_QUOTE_MUTATION,
  TRANSFER_TO_KPAY_USER,
};

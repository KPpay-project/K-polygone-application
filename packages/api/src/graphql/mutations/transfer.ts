import { gql } from '@apollo/client';
import { DEPOSIT_VIA_CARD, VALIDATE_CARD_PAYMENT } from './deposit';
import { FLW_BANKS, FLW_CARD_DEPOSIT_QUOTE } from './services/flutterwave';

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
  amount: string;
  description?: string | null;
  quoteId?: string | null;
  receiversWalletCode: string;
  sendersWalletId: string;
  paymentPin: string;
}

export interface TransferToKpayUserInput {
  amount: string; // Decimal!
  currencyCode: string; // String!
  description?: string | null; // String
  recipientEmail: string; // String!
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

export interface TransferQuoteInput {
  amount: string; // Decimal as string
  currencyCode: string; // e.g., "USD"
  fromWalletId: string; // sender wallet id
  paymentType: string; // e.g., "WALLET_TO_WALLET"
  toWalletCode: string; // receiver wallet code
}

const TRANSFER_QUOTE = gql`
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

const WALLET_TO_WALLET_TRANSFER = gql`
  mutation WalletToWalletTransfer($input: WalletToWalletInput!) {
    walletToWalletTransfer(input: $input) {
      expiresAt
      message
      success
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

const RESOLVE_BANK_ACCOUNT = gql`
  query VerifyAccount($accountNumber: String!, $bankCode: String!) {
    resolveBankAccountName(accountNumber: $accountNumber, accountBank: $bankCode) {
      accountNumber
      accountName
      bankCode
    }
  }
`;

const FLW_BANK_WITHDRAWAL_QUOTE = gql`
  mutation GetWithdrawalQuote($input: FlutterwaveBankWithdrawalQuoteInput!) {
    flutterwaveBankWithdrawalQuote(input: $input) {
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

const WITHDRAW_TO_BANK = gql`
  mutation WithdrawToBank($input: FlutterwaveBankWithdrawalInput!) {
    withdrawToBank(input: $input) {
      fee
      flutterwaveTransferId
      message
      reference
      status
      success
    }
  }
`;

export {
  TRANSFER,
  MOMO_TRANSFER,
  TRANSFER_TO_KPAY_USER,
  TRANSFER_QUOTE,
  WALLET_TO_WALLET_TRANSFER,
  GET_USER_WALLET_CODE,
  TRANSFER_QUOTE as WALLET_TRANSFER_QUOTE,
  FLW_CARD_DEPOSIT_QUOTE,
  DEPOSIT_VIA_CARD,
  VALIDATE_CARD_PAYMENT,
  FLW_BANKS,
  RESOLVE_BANK_ACCOUNT,
  FLW_BANK_WITHDRAWAL_QUOTE,
  WITHDRAW_TO_BANK
};

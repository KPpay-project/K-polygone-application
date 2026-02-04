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
  senders_wallet_id: string;
  receivers_wallet_code: string;
  currency_id: string;
  amount: string;
  description?: string;
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

export { TRANSFER, MOMO_TRANSFER, WALLET_TO_WALLET_TRANSFER };

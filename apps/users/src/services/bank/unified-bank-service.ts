import { PaystackBankService } from '../paystack';
import { FlutterwaveBankService } from '../flutterwave';

export type BankProvider = 'paystack' | 'flutterwave';

export interface BankServiceConfig {
  provider: BankProvider;
  country?: string;
}

export interface UnifiedBank {
  code: string;
  name: string;
  provider: BankProvider;
}

export interface UnifiedAccountDetails {
  accountNumber: string;
  accountName: string;
  bankCode: string;
  provider: BankProvider;
}

export class UnifiedBankService {
  private config: BankServiceConfig;

  constructor(config: BankServiceConfig) {
    this.config = config;
  }

  async fetchBanks(): Promise<UnifiedBank[]> {
    try {
      switch (this.config.provider) {
        case 'paystack': {
          const banks = await PaystackBankService.fetchBanks();
          return banks.map((bank) => ({
            code: bank.code,
            name: bank.name,
            provider: 'paystack'
          }));
        }
        case 'flutterwave': {
          const banks = await FlutterwaveBankService.fetchBanks();
          return banks.map((bank) => ({
            code: bank.code,
            name: bank.name,
            provider: 'flutterwave'
          }));
        }
        default:
          throw new Error('Unsupported bank provider');
      }
    } catch (error) {
      console.error('Error fetching banks:', error);
      throw error;
    }
  }

  async resolveBankAccount(accountNumber: string, bankCode: string): Promise<UnifiedAccountDetails | null> {
    try {
      switch (this.config.provider) {
        case 'paystack': {
          const details = await PaystackBankService.resolveBankAccount(accountNumber, bankCode);
          if (!details) return null;
          return {
            accountNumber: details.account_number,
            accountName: details.account_name,
            bankCode: bankCode,
            provider: 'paystack'
          };
        }
        case 'flutterwave': {
          const details = await FlutterwaveBankService.resolveBankAccount(accountNumber, bankCode);
          if (!details) return null;
          return {
            accountNumber: details.account_number,
            accountName: details.account_name,
            bankCode: details.bank_code,
            provider: 'flutterwave'
          };
        }
        default:
          throw new Error('Unsupported bank provider');
      }
    } catch (error) {
      console.error('Error resolving bank account:', error);
      return null;
    }
  }
}

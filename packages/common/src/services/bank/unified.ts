import { FlutterwaveBankService } from './flutterwave';
import { PaystackBankService } from './paystack';
import { BankServiceConfig, UnifiedAccountDetails, UnifiedBank } from './types';
import { BANK_SERVICE_PROVIDER_ENUM } from '../../enums/service-enums';


export class UnifiedBankService {
  private config: BankServiceConfig;
  private flutterwaveService: FlutterwaveBankService;
  private paystackService: PaystackBankService;

  constructor(config: BankServiceConfig) {
    this.config = config;
    this.flutterwaveService = new FlutterwaveBankService(config.secretKey);
    this.paystackService = new PaystackBankService(config.secretKey);
  }

  async fetchBanks(): Promise<UnifiedBank[]> {
    try {
      switch (this.config.provider) {
        case BANK_SERVICE_PROVIDER_ENUM.PAYSTACK:
          return await this.paystackService.fetchBanks();
        case BANK_SERVICE_PROVIDER_ENUM.FLUTTERWAVE:
          return await this.flutterwaveService.fetchBanks(this.config.country || 'NG');
        default:
          throw new Error('Unsupported bank provider');
      }
    } catch (error) {
      console.error('Error fetching banks:', error);
      throw error;
    }
  }

  async resolveBankAccount(
    accountNumber: string,
    bankCode: string,
  ): Promise<UnifiedAccountDetails | null> {
    try {
      switch (this.config.provider) {
        case 'paystack':
          return await this.paystackService.resolveBankAccount(accountNumber, bankCode);
        case 'flutterwave':
          return await this.flutterwaveService.resolveBankAccount(accountNumber, bankCode);
        default:
          throw new Error('Unsupported bank provider');
      }
    } catch (error) {
      console.error('Error resolving bank account:', error);
      return null;
    }
  }
}

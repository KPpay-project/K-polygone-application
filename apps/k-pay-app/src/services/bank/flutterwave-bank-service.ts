import { FLUTTERWAVE_API } from '@/constant/bank';
import { UnifiedBank, UnifiedAccountDetails } from './unified-bank-service';

interface FlutterwaveBank {
  id: number;
  code: string;
  name: string;
}

interface FlutterwaveAccountResponse {
  status: string;
  message: string;
  data: {
    account_number: string;
    account_name: string;
  };
}

export class FlutterwaveBankService {
  private readonly baseUrl: string;
  private readonly headers: Record<string, string>;

  constructor() {
    this.baseUrl = FLUTTERWAVE_API.BASE_URL;
    this.headers = FLUTTERWAVE_API.HEADERS;
  }

  async fetchBanks(countryCode: string = 'NG'): Promise<UnifiedBank[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}${FLUTTERWAVE_API.ENDPOINTS.BANKS(countryCode)}`,
        {
          method: 'GET',
          headers: this.headers,
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch banks');
      }

      const data = await response.json();
      return data.data.map((bank: FlutterwaveBank) => ({
        code: bank.code,
        name: bank.name,
      }));
    } catch (error) {
      console.error('Error fetching banks:', error);
      return [];
    }
  }

  async resolveBankAccount(
    accountNumber: string,
    bankCode: string
  ): Promise<UnifiedAccountDetails | null> {
    try {
      const response = await fetch(
        `${this.baseUrl}${FLUTTERWAVE_API.ENDPOINTS.RESOLVE_ACCOUNT}`,
        {
          method: 'POST',
          headers: this.headers,
          body: JSON.stringify({
            account_number: accountNumber,
            account_bank: bankCode,
          }),
        }
      );

      if (!response.ok) {
        return null;
      }

      const data = (await response.json()) as FlutterwaveAccountResponse;

      if (data.status !== 'success') {
        return null;
      }

      return {
        accountName: data.data.account_name,
        accountNumber: data.data.account_number,
        bankCode,
        provider: 'flutterwave',
      };
    } catch (error) {
      console.error('Error resolving bank account:', error);
      return null;
    }
  }
}

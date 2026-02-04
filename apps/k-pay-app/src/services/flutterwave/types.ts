export interface FlutterwaveBank {
  id: number;
  code: string;
  name: string;
  is_active?: boolean;
  provider_type: string;
}

export interface FlutterwaveAccountDetails {
  account_number: string;
  account_name: string;
  bank_code: string;
}

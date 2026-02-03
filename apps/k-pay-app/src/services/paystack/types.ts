export interface Bank {
  id: number;
  name: string;
  code: string;
  longcode: string;
  gateway?: string | null;
  active: boolean;
  country: string;
  currency: string;
  type: string;
  is_deleted: boolean;
}

export interface BankAccountDetails {
  account_number: string;
  account_name: string;
  bank_id: number;
}

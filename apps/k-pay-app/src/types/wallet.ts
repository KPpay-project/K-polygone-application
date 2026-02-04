export interface Wallet {
  id: string;
  name: string;
  code: string;
  balance: string;
  icon: string;
  color: string;
}

export interface Transaction {
  id: string;
  name: string;
  amount: string;
  time: string;
  icon: string;
  type: 'expense' | 'income';
}

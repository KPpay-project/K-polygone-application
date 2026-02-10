export interface Beneficiary {
  name: string;
  lastPay: Date;
  amount: number;
}

export const beneficiariesData: Beneficiary[] = [
  {
    name: 'Merchant Solutions',
    lastPay: new Date('2025-07-15'),
    amount: 12000.5
  },
  {
    name: 'UBA Bank',
    lastPay: new Date('2025-06-30'),
    amount: 8500.75
  },
  {
    name: 'Moniepoint',
    lastPay: new Date('2025-07-22'),
    amount: 4500.2
  },
  {
    name: 'Global Ventures',
    lastPay: new Date('2025-05-10'),
    amount: 20000.0
  },
  {
    name: 'Paystack',
    lastPay: new Date('2025-07-01'),
    amount: 6700.3
  },
  {
    name: 'Flutterwave',
    lastPay: new Date('2025-06-15'),
    amount: 15000.45
  },
  {
    name: 'Zenith Bank',
    lastPay: new Date('2025-07-28'),
    amount: 9800.6
  }
];

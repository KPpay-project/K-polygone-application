const exchangeRates: Record<string, number> = {
  USD: 1,
  EUR: 0.85,
  GBP: 0.73,
  XOF: 590,
  XAF: 590,
  NGN: 780,
  ZMW: 22,
  GHS: 12,
  KES: 140,
  ZAR: 18.5,
  EGP: 31,
  MAD: 10,
  TZS: 2350,
  UGX: 3650,
  RWF: 1250,
  BWP: 13.5,
  MZN: 64,
  LSL: 18.5,
  SZL: 18.5,
  DJF: 178,
  SOS: 568,
  MGA: 4500,
  SCR: 13.4,
  CVE: 99,
  SDG: 601,
  CHF: 0.88,
  CNY: 7.2,
  INR: 83
};

export const convertCurrency = (amount: number, fromCurrency: string, toCurrency: string): number => {
  if (fromCurrency === toCurrency) return amount;

  const amountInUSD = amount / exchangeRates[fromCurrency];
  const convertedAmount = amountInUSD * exchangeRates[toCurrency];

  return convertedAmount;
};

export const formatCurrencyAmount = (amount: number, currencyCode: string, symbol?: string): string => {
  const formattedAmount = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);

  return `${symbol || currencyCode} ${formattedAmount}`;
};

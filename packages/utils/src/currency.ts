
export function formatCurrency(
  amount: number | string,
  currency: string = 'USD',
  locale: string = 'en-US',
  options?: Intl.NumberFormatOptions,
): string {
  const numericAmount = typeof amount === 'number' ? amount : Number(amount);
  if (!Number.isFinite(numericAmount)) {
    return '';
  }

  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options,
  });

  return formatter.format(numericAmount);
}

export const parseCurrency = (value: string): number => {
  const cleaned = value.replace(/[^\d.-]/g, '');
  return Number.parseFloat(cleaned) || 0;
};

export const convertCurrency = (amount: number, fromRate: number, toRate: number): number => {
  return (amount / fromRate) * toRate;
};

export const formatBalance = (balance: number): string => {
  if (Math.abs(balance) >= 1e9) {
    return `${(balance / 1e9).toFixed(1)}B`;
  }
  if (Math.abs(balance) >= 1e6) {
    return `${(balance / 1e6).toFixed(1)}M`;
  }
  if (Math.abs(balance) >= 1e3) {
    return `${(balance / 1e3).toFixed(1)}K`;
  }
  return balance.toFixed(2);
};

export const calculateInterest = (principal: number, rate: number, time: number): number => {
  return (principal * rate * time) / 100;
};

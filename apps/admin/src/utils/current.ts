export const formatCurrency = (amount: number, currency = 'USD', locale = 'en-US'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
};

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

export const calculateInterest = (principal: number, rate: number, time: number, compound = false): number => {
  if (compound) {
    return principal * (1 + rate / 100) ** time - principal;
  }
  return (principal * rate * time) / 100;
};

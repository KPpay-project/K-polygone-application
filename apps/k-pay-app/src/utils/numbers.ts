export const formatNumberWithCommas = (value: string | number): string => {
  const cleanValue = value.toString().replace(/,/g, '');
  if (isNaN(Number(cleanValue))) {
    return value.toString();
  }
  return Number(cleanValue).toLocaleString();
};

export const formatCurrencyWithCommas = (
  amount: string | number,
  currency: string = ''
): string => {
  const formattedAmount = formatNumberWithCommas(amount);
  return currency ? `${currency} ${formattedAmount}` : formattedAmount;
};

export const formatCurrencyByCode = (
  amount: string | number,
  currencyCode: string,
  locale: string = 'en-US'
): string => {
  const cleanValue = amount.toString().replace(/,/g, '');
  if (isNaN(Number(cleanValue))) {
    return amount.toString();
  }
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(cleanValue));
};

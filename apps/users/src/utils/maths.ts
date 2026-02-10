function parseAmountStringToNumber(value: string | number | null | undefined): number {
  if (value === null || value === undefined) return 0;
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  const normalized = value.replace(/,/g, '').trim();
  const num = Number(normalized);
  return Number.isFinite(num) ? num : 0;
}

function formatNumberFixed(value: number, decimals = 2): string {
  if (!Number.isFinite(value)) return '0';
  return value.toFixed(decimals);
}

const formatMoney = (value: string | number, minimumFractionDigits = 2, maximumFractionDigits = 2): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (!Number.isFinite(num)) return '0.00';

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits,
    maximumFractionDigits,
    style: 'decimal'
  }).format(num);
};

export { parseAmountStringToNumber, formatNumberFixed, formatMoney };

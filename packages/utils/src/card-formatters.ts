export const formatCardNumber = (value: string): string => {
  const digits = value.replace(/\D/g, '');

  return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
};

export const formatExpiryDate = (value: string): string => {
  const digits = value.replace(/\D/g, '');

  if (digits.length <= 2) {
    return digits;
  }
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
};

export const formatCVV = (value: string): string => {
  return value.replace(/\D/g, '').slice(0, 3);
};

export const getCardType = (cardNumber: string): string => {
  const digits = cardNumber.replace(/\D/g, '');
  const firstTwo = parseInt(digits.slice(0, 2), 10);
  const firstFour = parseInt(digits.slice(0, 4), 10);

  if (digits.startsWith('4')) return 'Visa';
  if (firstTwo >= 51 && firstTwo <= 55) return 'Mastercard';
  if (firstTwo === 34 || firstTwo === 37) return 'American Express';
  if (firstFour >= 2221 && firstFour <= 2720) return 'Mastercard';
  if (digits.startsWith('6')) return 'Discover';

  return '';
};

export const validateExpiryDate = (value: string): boolean => {
  if (!value) return true;

  const [month, year] = value.split('/');
  if (!month || !year) return false;

  const monthNum = parseInt(month, 10);
  const yearNum = parseInt(year, 10);

  if (monthNum < 1 || monthNum > 12) return false;
  if (yearNum < 0 || yearNum > 99) return false;

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100;
  const currentMonth = currentDate.getMonth() + 1;

  if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) {
    return false;
  }

  return true;
};

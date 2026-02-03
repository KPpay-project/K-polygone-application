import type { Currency } from '@/components/ui';

// Country code to currency mapping
export const countryCurrencyMap: Record<string, Currency> = {
  US: 'USD',
  NG: 'NGN',
  GH: 'USD', // Ghana uses GHS, but using USD as fallback since GHS not supported
  KE: 'USD', // Kenya uses KES, but using USD as fallback
  ZA: 'USD', // South Africa uses ZAR, but using USD as fallback
  GB: 'GBP',
  CA: 'USD',
  AU: 'USD', // Australia uses AUD, but using USD as fallback
  DE: 'EUR',
  FR: 'EUR',
  IN: 'USD', // India uses INR, but using USD as fallback
  BR: 'USD', // Brazil uses BRL, but using USD as fallback
  MX: 'USD', // Mexico uses MXN, but using USD as fallback
  JP: 'USD', // Japan uses JPY, but using USD as fallback
  CN: 'USD', // China uses CNY, but using USD as fallback
  EG: 'USD', // Egypt uses EGP, but using USD as fallback
  AE: 'USD', // UAE uses AED, but using USD as fallback
  SA: 'USD', // Saudi Arabia uses SAR, but using USD as fallback
};

/**
 * Get the currency for a given country code
 * @param countryCode - The ISO country code (e.g., 'US', 'NG')
 * @returns The currency code for the country, defaults to 'USD' if not found
 */
export function getCurrencyForCountry(countryCode: string): Currency {
  return countryCurrencyMap[countryCode] || 'USD';
}

/**
 * Get all supported currencies
 * @returns Array of unique currency codes
 */
export function getSupportedCurrencies(): Currency[] {
  const uniqueCurrencies = Array.from(
    new Set(Object.values(countryCurrencyMap))
  );
  return uniqueCurrencies as Currency[];
}

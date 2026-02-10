export const africanCountries = [
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', prefix: '+234', bankProviders: ['paystack', 'flutterwave'] },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭', prefix: '+233', bankProviders: ['paystack'] },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', prefix: '+254', bankProviders: ['flutterwave'] },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', prefix: '+27', bankProviders: ['flutterwave'] },
  { code: 'UG', name: 'Uganda', flag: '🇺🇬', prefix: '+256', bankProviders: ['flutterwave'] },
  { code: 'TZ', name: 'Tanzania', flag: '🇹🇿', prefix: '+255', bankProviders: ['flutterwave'] },
  { code: 'RW', name: 'Rwanda', flag: '🇷🇼', prefix: '+250', bankProviders: ['flutterwave'] },
  { code: 'ET', name: 'Ethiopia', flag: '🇪🇹', prefix: '+251', bankProviders: ['flutterwave'] },
  { code: 'CI', name: 'Ivory Coast', flag: '🇨🇮', prefix: '+225', bankProviders: ['flutterwave'] },
  { code: 'SN', name: 'Senegal', flag: '🇸🇳', prefix: '+221', bankProviders: ['flutterwave'] }
] as const;

export type AfricanCountryCode = (typeof africanCountries)[number]['code'];
export type BankProvider = 'paystack' | 'flutterwave';

export interface AfricanCountry {
  code: AfricanCountryCode;
  name: string;
  flag: string;
  prefix: string;
  bankProviders: BankProvider[];
}

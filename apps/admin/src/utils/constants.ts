export const ENV = {
  APP_NAME: import.meta.env.VITE_PUBLIC_APP_NAME,
  API_URL: import.meta.env.VITE_PUBLIC_API_URL
};

export const countries = [
  { code: 'US', name: 'United States', flag: '🇺🇸', prefix: '+1' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', prefix: '+44' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', prefix: '+1' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', prefix: '+61' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', prefix: '+234' },
  { code: 'IN', name: 'India', flag: '🇮🇳', prefix: '+91' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', prefix: '+49' },
  { code: 'FR', name: 'France', flag: '🇫🇷', prefix: '+33' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', prefix: '+81' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', prefix: '+55' }
];

export const genders = [
  {
    label: 'Male',
    value: 'male'
  },
  {
    label: 'Female',
    value: 'female'
  }
];

// Country code mapping for flag display
export const getCountryCode = (countryName: string): string => {
  if (!countryName) return 'xx';

  // First check specific overrides/mappings
  const countryCodeMap: Record<string, string> = {
    Nigeria: 'ng',
    Ghana: 'gh',
    Rwanda: 'rw',
    'South Africa': 'za',
    Benin: 'bj',
    Gabon: 'ga',
    Kenya: 'ke',
    Uganda: 'ug',
    Tanzania: 'tz',
    Cameroon: 'cm'
  };

  if (countryCodeMap[countryName]) {
    return countryCodeMap[countryName];
  }

  // Then check the countries array
  const foundCountry = countries.find((c) => c.name.toLowerCase() === countryName.toLowerCase());
  if (foundCountry) {
    return foundCountry.code.toLowerCase();
  }

  // If it looks like a country code (2 letters), use it
  if (countryName.length === 2) {
    return countryName.toLowerCase();
  }

  return 'xx'; // fallback to generic flag
};

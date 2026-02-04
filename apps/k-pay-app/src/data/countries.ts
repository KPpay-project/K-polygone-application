export interface Country {
  code: string;
  name: string;
  flag: string;
  phoneCode: string;
}

export const countries: Country[] = [
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', phoneCode: '+234' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭', phoneCode: '+233' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', phoneCode: '+254' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', phoneCode: '+27' },
  { code: 'UG', name: 'Uganda', flag: '🇺🇬', phoneCode: '+256' },
  { code: 'TZ', name: 'Tanzania', flag: '🇹🇿', phoneCode: '+255' },
  { code: 'ZM', name: 'Zambia', flag: '🇿🇲', phoneCode: '+260' },
  { code: 'MW', name: 'Malawi', flag: '🇲🇼', phoneCode: '+265' },

  { code: 'SN', name: 'Senegal', flag: '🇸🇳', phoneCode: '+221' },
  { code: 'CI', name: "Côte d'Ivoire", flag: '🇨🇮', phoneCode: '+225' },
  { code: 'ML', name: 'Mali', flag: '🇲🇱', phoneCode: '+223' },
  { code: 'NE', name: 'Niger', flag: '🇳🇪', phoneCode: '+227' },
  { code: 'TG', name: 'Togo', flag: '🇹🇬', phoneCode: '+228' },
  { code: 'BF', name: 'Burkina Faso', flag: '🇧🇫', phoneCode: '+226' },
  { code: 'BJ', name: 'Benin', flag: '🇧🇯', phoneCode: '+229' },
  { code: 'GN', name: 'Guinea', flag: '🇬🇳', phoneCode: '+224' },

  { code: 'CM', name: 'Cameroon', flag: '🇨🇲', phoneCode: '+237' },
  { code: 'GA', name: 'Gabon', flag: '🇬🇦', phoneCode: '+241' },
  { code: 'CG', name: 'Republic of the Congo', flag: '🇨🇬', phoneCode: '+242' },
  {
    code: 'CD',
    name: 'Democratic Republic of the Congo',
    flag: '🇨🇩',
    phoneCode: '+243',
  },
  {
    code: 'CF',
    name: 'Central African Republic',
    flag: '🇨🇫',
    phoneCode: '+236',
  },
  { code: 'TD', name: 'Chad', flag: '🇹🇩', phoneCode: '+235' },

  { code: 'MA', name: 'Morocco', flag: '🇲🇦', phoneCode: '+212' },
  { code: 'DZ', name: 'Algeria', flag: '🇩🇿', phoneCode: '+213' },
  { code: 'TN', name: 'Tunisia', flag: '🇹🇳', phoneCode: '+216' },
  { code: 'MR', name: 'Mauritania', flag: '🇲🇷', phoneCode: '+222' },
];

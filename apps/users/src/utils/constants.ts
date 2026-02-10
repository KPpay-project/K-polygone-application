export const ENV = {
  APP_NAME: import.meta.env.VITE_PUBLIC_APP_NAME || 'KPay',
  API_URL: import.meta.env.VITE_PUBLIC_API_URL || 'http://localhost:3000',
  CLOUDFLARE_SITE_KEY: import.meta.env.VITE_CLOUDFLARE_SITE_KEY || '0x4AAAAAACHEd2TsfRhCJfAi'
};

export const countries = [
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', prefix: '+234' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭', prefix: '+233' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', prefix: '+254' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', prefix: '+27' },
  { code: 'UG', name: 'Uganda', flag: '🇺🇬', prefix: '+256' },
  { code: 'TZ', name: 'Tanzania', flag: '🇹🇿', prefix: '+255' },
  { code: 'ZM', name: 'Zambia', flag: '🇿🇲', prefix: '+260' },
  { code: 'MW', name: 'Malawi', flag: '🇲🇼', prefix: '+265' },

  { code: 'SN', name: 'Senegal', flag: '🇸🇳', prefix: '+221' },
  { code: 'CI', name: "Côte d'Ivoire", flag: '🇨🇮', prefix: '+225' },
  { code: 'ML', name: 'Mali', flag: '🇲🇱', prefix: '+223' },
  { code: 'NE', name: 'Niger', flag: '🇳🇪', prefix: '+227' },
  { code: 'TG', name: 'Togo', flag: '🇹🇬', prefix: '+228' },
  { code: 'BF', name: 'Burkina Faso', flag: '🇧🇫', prefix: '+226' },
  { code: 'BJ', name: 'Benin', flag: '🇧🇯', prefix: '+229' },
  { code: 'GN', name: 'Guinea', flag: '🇬🇳', prefix: '+224' },

  { code: 'CM', name: 'Cameroon', flag: '🇨🇲', prefix: '+237' },
  { code: 'GA', name: 'Gabon', flag: '🇬🇦', prefix: '+241' },
  { code: 'CG', name: 'Republic of the Congo', flag: '🇨🇬', prefix: '+242' },
  { code: 'CD', name: 'Democratic Republic of the Congo', flag: '🇨🇩', prefix: '+243' },
  { code: 'CF', name: 'Central African Republic', flag: '🇨🇫', prefix: '+236' },
  { code: 'TD', name: 'Chad', flag: '🇹🇩', prefix: '+235' },

  { code: 'MA', name: 'Morocco', flag: '🇲🇦', prefix: '+212' },
  { code: 'DZ', name: 'Algeria', flag: '🇩🇿', prefix: '+213' },
  { code: 'TN', name: 'Tunisia', flag: '🇹🇳', prefix: '+216' },
  { code: 'MR', name: 'Mauritania', flag: '🇲🇷', prefix: '+222' }
];

export const countryStates: Record<string, string[]> = {
  NG: [
    'Abia',
    'Adamawa',
    'Akwa Ibom',
    'Anambra',
    'Bauchi',
    'Bayelsa',
    'Benue',
    'Borno',
    'Cross River',
    'Delta',
    'Ebonyi',
    'Edo',
    'Ekiti',
    'Enugu',
    'Federal Capital Territory',
    'Gombe',
    'Imo',
    'Jigawa',
    'Kaduna',
    'Kano',
    'Katsina',
    'Kebbi',
    'Kogi',
    'Kwara',
    'Lagos',
    'Nasarawa',
    'Niger',
    'Ogun',
    'Ondo',
    'Osun',
    'Oyo',
    'Plateau',
    'Rivers',
    'Sokoto',
    'Taraba',
    'Yobe',
    'Zamfara'
  ],

  GH: ['Accra', 'Kumasi', 'Tamale', 'Takoradi', 'Cape Coast'],

  KE: ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret'],

  ZA: ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria', 'Port Elizabeth'],

  UG: ['Kampala', 'Entebbe', 'Jinja', 'Mbarara', 'Gulu'],

  TZ: ['Dar es Salaam', 'Dodoma', 'Mwanza', 'Arusha', 'Zanzibar'],

  ZM: ['Lusaka', 'Ndola', 'Kitwe', 'Livingstone', 'Chipata'],

  MW: ['Lilongwe', 'Blantyre', 'Mzuzu', 'Zomba'],

  SN: ['Dakar', 'Thiès', 'Saint-Louis', 'Kaolack'],

  CI: ['Abidjan', 'Bouaké', 'Daloa', 'Yamoussoukro'],

  ML: ['Bamako', 'Sikasso', 'Mopti', 'Kayes'],

  NE: ['Niamey', 'Zinder', 'Maradi', 'Agadez'],

  TG: ['Lomé', 'Sokodé', 'Kara'],

  BF: ['Ouagadougou', 'Bobo-Dioulasso', 'Koudougou'],

  BJ: ['Cotonou', 'Porto-Novo', 'Parakou'],

  GN: ['Conakry', 'Kankan', 'Labé'],

  CM: ['Yaoundé', 'Douala', 'Bamenda', 'Garoua'],

  GA: ['Libreville', 'Port-Gentil', 'Franceville'],

  CG: ['Brazzaville', 'Pointe-Noire'],

  CD: ['Kinshasa', 'Lubumbashi', 'Mbuji-Mayi', 'Goma'],

  CF: ['Bangui', 'Bimbo', 'Berbérati'],

  TD: ["N'Djamena", 'Moundou', 'Sarh'],

  MA: ['Casablanca', 'Rabat', 'Marrakesh', 'Fes'],

  DZ: ['Algiers', 'Oran', 'Constantine', 'Annaba'],

  TN: ['Tunis', 'Sfax', 'Sousse'],

  MR: ['Nouakchott', 'Nouadhibou']
};

export interface State {
  name: string;
}

export const getStatesByCountry = (countryCode: string): State[] => {
  const states = countryStates[countryCode] || [];
  return states.map((name) => ({ name }));
};

export const professions = [
  'Accountant',
  'Actor',
  'Architect',
  'Artist',
  'Author',
  'Banker',
  'Business Analyst',
  'Chef',
  'Civil Engineer',
  'Consultant',
  'Content Creator',
  'Customer Service Representative',
  'Data Analyst',
  'Data Scientist',
  'Designer',
  'Developer',
  'Doctor',
  'Economist',
  'Electrician',
  'Entrepreneur',
  'Farmer',
  'Financial Advisor',
  'Human Resources Specialist',
  'Journalist',
  'Lawyer',
  'Lecturer',
  'Manager',
  'Marketing Specialist',
  'Mechanic',
  'Musician',
  'Nurse',
  'Pharmacist',
  'Photographer',
  'Pilot',
  'Plumber',
  'Police Officer',
  'Product Manager',
  'Project Manager',
  'Researcher',
  'Salesperson',
  'Scientist',
  'Software Engineer',
  'Student',
  'Teacher',
  'Technician',
  'UI/UX Designer',
  'Web Developer',
  'Writer',
  'Other'
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

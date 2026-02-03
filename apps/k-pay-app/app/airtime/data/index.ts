import type { NetworkOption } from '../types';
import { countries } from '@/data/countries';
import type { DropdownOption } from '@/components/ui';

export const networkOptions: NetworkOption[] = [
  {
    id: 'mtn',
    name: 'MTN',
    logo: require('../../../assets/images/networks/mtn-logo.png'),
    color: '#FFCC00',
  },
  {
    id: 'airtel',
    name: 'Airtel',
    logo: require('../../../assets/images/networks/airtel-logo.svg'),
    color: '#FF0000',
  },
  {
    id: 'glo',
    name: 'Glo',
    logo: require('../../../assets/images/networks/glo-logo.svg'),
    color: '#00A651',
  },
  {
    id: '9mobile',
    name: '9mobile',
    logo: require('../../../assets/images/networks/9mobile-logo.svg'),
    color: '#00A86B',
  },
];

export const getCountryOptions = (): DropdownOption[] =>
  countries.map((country) => ({
    value: country.code,
    label: country.name,
    icon: null, // Will be set in component
  }));

// Default export required by Expo Router
export default function AirtimeData() {
  return null;
}

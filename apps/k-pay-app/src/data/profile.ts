import { UserAccount } from '@/store/user-store';

export const mockUserAccount: UserAccount = {
  id: '1',
  role: 'user',
  status: 'active',
  user: {
    id: '1',
    firstName: 'Boma',
    lastName: 'Agina-obu.',
    email: 'boma@example.com',
    phone: '+2348012345678',
  },
};

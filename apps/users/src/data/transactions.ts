export interface Transaction {
  id: string;
  type: string;
  transactionId: string;
  paymentMethod: string;
  amount: string;
  date: string;
  time: string;
  status: string;
}

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'Deposit',
    transactionId: 'TRX-12345',
    paymentMethod: 'Bank Transfer',
    amount: '$1,250.00',
    date: '15-06-2023',
    time: '10:30 AM',
    status: 'Approved'
  },
  {
    id: '2',
    type: 'Withdrawal',
    transactionId: 'TRX-67890',
    paymentMethod: 'ATM',
    amount: '$500.00',
    date: '12-06-2023',
    time: '02:15 PM',
    status: 'Pending'
  },
  {
    id: '3',
    type: 'Bill Payment',
    transactionId: 'TRX-24680',
    paymentMethod: 'Online',
    amount: '$75.50',
    date: '10-06-2023',
    time: '09:45 AM',
    status: 'Approved'
  },
  {
    id: '4',
    type: 'Transfer',
    transactionId: 'TRX-13579',
    paymentMethod: 'Mobile App',
    amount: '$350.00',
    date: '08-06-2023',
    time: '04:20 PM',
    status: 'Failed'
  },
  {
    id: '5',
    type: 'Exchange',
    transactionId: 'TRX-97531',
    paymentMethod: 'Currency Exchange',
    amount: '$2,000.00',
    date: '05-06-2023',
    time: '11:05 AM',
    status: 'Approved'
  }
];

export const getStatusColor = (status: string): string => {
  if (!status) return 'bg-gray-100 text-gray-800';

  const normalized = status.toLowerCase();

  const successStatuses = ['approved', 'completed', 'resolved', 'success'];
  const warningStatuses = ['pending', 'processing', 'in-progress'];
  const errorStatuses = ['failed', 'declined', 'rejected', 'error'];

  if (successStatuses.includes(normalized)) {
    return 'bg-green-100 text-green-800';
  }

  if (warningStatuses.includes(normalized)) {
    return 'bg-yellow-100 text-yellow-800';
  }

  if (errorStatuses.includes(normalized)) {
    return 'bg-red-100 text-red-800';
  }

  return 'bg-gray-100 text-gray-800';
};

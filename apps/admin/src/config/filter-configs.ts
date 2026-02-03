import { FilterConfig } from '@/components/common/modular-filter-modal';
import { Option } from '@/components/ui/custom-selector';

// User List Filter Configuration
const roleOptions: Option[] = [
  { value: 'all', label: 'All Roles' },
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'country_manager', label: 'Country Manager' },
  { value: 'regional_admin', label: 'Regional Admin' },
  { value: 'support_staff', label: 'Support Staff' }
];

const statusOptions: Option[] = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active', color: 'text-green-600' },
  { value: 'inactive', label: 'Inactive', color: 'text-yellow-600' },
  { value: 'suspended', label: 'Suspended', color: 'text-red-600' }
];

export const userListFilterConfig: FilterConfig = {
  fields: [
    {
      key: 'date',
      label: 'Date Range',
      type: 'date-range'
    },
    {
      key: 'role',
      label: 'Role',
      type: 'select',
      options: roleOptions,
      placeholder: 'Select role'
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: statusOptions,
      placeholder: 'Select status'
    }
  ],
  defaultValues: {
    dateFrom: '',
    dateTo: '',
    role: 'all',
    status: 'all'
  }
};

// Activity Log Filter Configuration
const activityTypeOptions: Option[] = [
  { value: 'all', label: 'All Activities' },
  { value: 'login', label: 'Login', color: 'text-blue-600' },
  { value: 'transfers', label: 'Transfers', color: 'text-green-600' },
  { value: 'withdraw', label: 'Withdraw', color: 'text-orange-600' },
  { value: 'bills', label: 'Bills', color: 'text-purple-600' },
  { value: 'kyc', label: 'KYC', color: 'text-indigo-600' },
  { value: 'dispute', label: 'Dispute', color: 'text-red-600' }
];

const activityStatusOptions: Option[] = [
  { value: 'all', label: 'All Status' },
  { value: 'success', label: 'Success', color: 'text-green-600' },
  { value: 'pending', label: 'Pending', color: 'text-yellow-600' },
  { value: 'failed', label: 'Failed', color: 'text-red-600' }
];

export const activityLogFilterConfig: FilterConfig = {
  fields: [
    {
      key: 'date',
      label: 'Date Range',
      type: 'date-range'
    },
    {
      key: 'activityType',
      label: 'Activity Type',
      type: 'select',
      options: activityTypeOptions,
      placeholder: 'Select activity type'
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: activityStatusOptions,
      placeholder: 'Select status'
    }
  ],
  defaultValues: {
    dateFrom: '',
    dateTo: '',
    activityType: 'all',
    status: 'all'
  }
};

// Admin List Filter Configuration (similar to users but without role filter)
export const adminListFilterConfig: FilterConfig = {
  fields: [
    {
      key: 'date',
      label: 'Date Range',
      type: 'date-range'
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: statusOptions,
      placeholder: 'Select status'
    }
  ],
  defaultValues: {
    dateFrom: '',
    dateTo: '',
    status: 'all'
  }
};

// Transaction Filter Configuration
const transactionTypeOptions: Option[] = [
  { value: 'all', label: 'All Transactions' },
  { value: 'deposit', label: 'Deposit', color: 'text-green-600' },
  { value: 'withdrawal', label: 'Withdrawal', color: 'text-red-600' },
  { value: 'transfer', label: 'Transfer', color: 'text-blue-600' },
  { value: 'payment', label: 'Payment', color: 'text-purple-600' }
];

const transactionStatusOptions: Option[] = [
  { value: 'all', label: 'All Status' },
  { value: 'completed', label: 'Completed', color: 'text-green-600' },
  { value: 'pending', label: 'Pending', color: 'text-yellow-600' },
  { value: 'failed', label: 'Failed', color: 'text-red-600' },
  { value: 'cancelled', label: 'Cancelled', color: 'text-gray-600' }
];

export const transactionFilterConfig: FilterConfig = {
  fields: [
    {
      key: 'date',
      label: 'Date Range',
      type: 'date-range'
    },
    {
      key: 'transactionType',
      label: 'Transaction Type',
      type: 'select',
      options: transactionTypeOptions,
      placeholder: 'Select transaction type'
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: transactionStatusOptions,
      placeholder: 'Select status'
    }
  ],
  defaultValues: {
    dateFrom: '',
    dateTo: '',
    transactionType: 'all',
    status: 'all'
  }
};

// Biller List Filter Configuration
const channelOptions: Option[] = [
  { value: 'all', label: 'All Channels' },
  { value: 'web', label: 'Web', color: 'text-blue-600' },
  { value: 'mobile', label: 'Mobile', color: 'text-green-600' }
];

export const billerListFilterConfig: FilterConfig = {
  fields: [
    {
      key: 'date',
      label: 'Date Range',
      type: 'date-range'
    },
    {
      key: 'channel',
      label: 'Channel',
      type: 'select',
      options: channelOptions,
      placeholder: 'Select channel'
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: statusOptions,
      placeholder: 'Select status'
    }
  ],
  defaultValues: {
    dateFrom: '',
    dateTo: '',
    channel: 'all',
    status: 'all'
  }
};

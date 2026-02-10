import { useQuery } from '@apollo/client';
import { useState } from 'react';
import { GET_ACTIVITY_LOGS } from '@repo/api';

interface ActivityLog {
  entries?: {
    id: string;
    activity: string;
    deviceInfo?: string;
    insertedAt: string;
    ipAddress?: string;
    location?: string;
    status: string;
    updatedAt: string;
    userAccount?: {
      id: string;
      role: string;
      status: string;
      signInCount?: number;
      signInIp?: string;
      currentSignInAt?: string;
      currentSignInIp?: string;
      lastSignInAt?: string;
      lastSignInIp?: string;
      walletCode?: string;
      admin?: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone?: string;
        role: string;
        status: string;
      };
      user?: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone?: string;
        country?: string;
      };
      merchant?: {
        id: string;
        businessName: string;
        businessType?: string;
        businessDescription?: string;
        email: string;
        phone?: string;
        country?: string;
        logoUrl?: string;
        status: string;
      };
    };
    transaction?: {
      id: string;
      amount: number;
      description?: string;
      status: string;
      transactionType: string;
      reference: string;
      externalReference?: string;
      exchangeRate?: number;
      feeAmount?: number;
      provider?: string;
      providerStatus?: string;
      providerMessage?: string;
      customerPhone?: string;
      currency?: {
        id: string;
        code: string;
        name: string;
        symbol: string;
        precision: number;
        exchangeRateUsd?: number;
      };
      wallet?: {
        id: string;
        ownerId: string;
        ownerType: string;
        status: string;
      };
    };
    kycApplication?: {
      id: string;
      status: string;
      kycClientId?: string;
      kycClientType?: string;
      personalInfoStatus?: string;
      contactInfoStatus?: string;
      identityStatus?: string;
      financialInfoStatus?: string;
      bankInfoStatus?: string;
      message?: string;
      errors?: any;
      rejectionReason?: string;
      personalInfo?: {
        firstName?: string;
        lastName?: string;
        email?: string;
        nationality?: string;
        occupation?: string;
      };
    };
  };
  pageNumber?: number;
  pageSize?: number;
  totalEntries?: number;
  totalPages?: number;
}

interface ActivityLogsFilters {
  status?: string;
  ipAddress?: string;
}

interface UseActivityLogsParams {
  search?: string;
  statusFilter?: string;
  page?: number;
  perPage?: number;
  sortBy?: string;
  sortDirection?: string;
  fromDate?: string;
  toDate?: string;
  filters?: ActivityLogsFilters;
}

interface UseActivityLogsReturn {
  data: ActivityLog['entries'];
  loading: boolean;
  error: any;
  refetch: () => void;
  filteredData: ActivityLog[];
  updateFilters: (params: UseActivityLogsParams) => void;
  totalEntries: ActivityLog['totalEntries'];
  pageInfo: Pick<ActivityLog, 'pageNumber' | 'pageSize' | 'totalEntries' | 'totalPages'>;
}

const useActivityLogs = (initialParams?: UseActivityLogsParams): UseActivityLogsReturn => {
  const [filters, setFilters] = useState<UseActivityLogsParams>({
    page: 1,
    perPage: 15,
    sortBy: 'activity',
    sortDirection: 'asc',
    ...initialParams
  });

  const { data, loading, error, refetch } = useQuery(GET_ACTIVITY_LOGS, {
    variables: {
      page: filters.page,
      perPage: filters.perPage,
      sortBy: filters.sortBy,
      sortDirection: filters.sortDirection,
      search: filters.search,
      fromDate: filters.fromDate,
      toDate: filters.toDate,
      filters: filters.filters
    },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });

  const activityLogs: ActivityLog[] = data?.getActivityLogs?.entries || [];
  const pageInfo = {
    pageNumber: data?.getActivityLogs?.pageNumber || filters.page || 1,
    pageSize: data?.getActivityLogs?.pageSize || filters.perPage || 15,
    totalEntries: data?.getActivityLogs?.totalEntries || 0,
    totalPages: data?.getActivityLogs?.totalPages || 1
  };

  const filteredData = activityLogs.filter((log: ActivityLog) => {
    if (!log.entries) {
      return false;
    }
    let matchesSearch = true;
    let matchesStatus = true;

    if (filters.search && filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase();
      const userEmail =
        log.entries.userAccount?.user?.email ||
        log.entries.userAccount?.admin?.email ||
        log.entries.userAccount?.merchant?.email ||
        '';
      const userName =
        `${log.entries.userAccount?.user?.firstName || ''} ${log.entries.userAccount?.user?.lastName || ''}`.trim() ||
        `${log.entries.userAccount?.admin?.firstName || ''} ${log.entries.userAccount?.admin?.lastName || ''}`.trim() ||
        log.entries.userAccount?.merchant?.businessName ||
        '';

      matchesSearch =
        log.entries.activity.toLowerCase().includes(searchTerm) ||
        userEmail.toLowerCase().includes(searchTerm) ||
        userName.toLowerCase().includes(searchTerm) ||
        (!!log.entries.ipAddress && log.entries.ipAddress.includes(searchTerm)) ||
        (!!log.entries.location && log.entries.location.toLowerCase().includes(searchTerm)) ||
        (!!log.entries.transaction?.reference && log.entries.transaction.reference.toLowerCase().includes(searchTerm));
    }

    if (filters.statusFilter && filters.statusFilter !== 'All') {
      const filterStatus = filters.statusFilter.toLowerCase();
      const logStatus = log.entries.status.toLowerCase();

      matchesStatus =
        logStatus === filterStatus ||
        (filterStatus === 'successful' && (logStatus === 'success' || logStatus === 'completed')) ||
        (filterStatus === 'failed' && (logStatus === 'error' || logStatus === 'failed')) ||
        (filterStatus === 'pending' && (logStatus === 'pending' || logStatus === 'processing'));
    }

    return matchesSearch && matchesStatus;
  });

  const updateFilters = (newParams: UseActivityLogsParams) => {
    setFilters((prev) => ({
      ...prev,
      ...newParams
    }));
  };

  return {
    data: data?.getActivityLogs?.entries || [],
    loading,
    error,
    refetch,
    filteredData,
    updateFilters,
    totalEntries: pageInfo.totalEntries,
    pageInfo
  };
};

export default useActivityLogs;
export type { ActivityLog, UseActivityLogsParams };

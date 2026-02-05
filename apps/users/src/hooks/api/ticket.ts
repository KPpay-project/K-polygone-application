import { useMutation, useQuery } from '@apollo/client';
import { 
  GET_TICKET_BY_ID, 
  CREATE_TICKET_MESSAGE, 
  CREATE_TICKET, 
  GET_CUSTOMER_TICKETS,
  safeGraphQLOperation, 
  type SafeResult
} from '@repo/api';
import { useProfileStore } from '@/store/profile-store';

export interface CreateTicketParams {
  ticketType: 'CUSTOM' | 'SYSTEM' | string;
  ticketSubject: string;
  ticketAttachment?: any | null;
  priority: 'HIGH' | 'MEDIUM' | 'LOW' | string;
  message: string;
}

export function useCreateTicket() {
  const [mutate, { loading }] = useMutation<any, { input: CreateTicketParams }>(CREATE_TICKET);

  const createTicket = async (
    input: CreateTicketParams
  ): Promise<SafeResult<{ id: string; ticketNumber: string; subject: string; status: string; message: string }>> => {
    return safeGraphQLOperation(mutate, {
      variables: { input },
      payloadPath: 'createTicket',
      friendlyMessages: {
        VALIDATION_ERROR: 'Unable to create ticket. Please fix the highlighted errors.',
        UNKNOWN: 'Something went wrong while creating the ticket.'
      }
    });
  };

  return { createTicket, loading };
}

export function useGetTicketById(ticketId: string) {
  return useQuery(GET_TICKET_BY_ID, {
    variables: { ticketId },
    skip: !ticketId,
    fetchPolicy: 'cache-first',
    errorPolicy: 'all'
  });
}

export const useCreateTicketMessage = () => {
  const [mutate, { loading }] = useMutation(CREATE_TICKET_MESSAGE);
  const createTicketMessage = async (input: { ticketId: string; message: string }) => {
    return mutate({ variables: { input } });
  };
  return { createTicketMessage, loading };
};

export type TicketItem = {
  id: string;
  insertedAt: string;
  message: string;
  priority: string;
  resolvedAt?: string | null;
  status: string;
  ticketNumber: string;
  ticketSubject: string;
  ticketType: string;
  updatedAt: string;
};

export function useGetTicketsByCustomerId(customerId?: string) {
  const { data, loading, error, refetch, fetchMore } = useQuery(GET_CUSTOMER_TICKETS, {
    variables: { customerId },
    skip: !customerId
  });

  return {
    tickets: (data?.getTicketByCustomerId as TicketItem[]) ?? [],
    loading,
    error,
    refetch,
    fetchMore
  };
}

export function useCustomerTickets() {
  const customerId = useProfileStore((s) => s.profile?.id || s.profile?.user?.id);
  return useGetTicketsByCustomerId(customerId);
}

export const useGetCustomersTickets = () => {
  return useQuery(GET_CUSTOMER_TICKETS, {
    errorPolicy: 'all',
    fetchPolicy: 'cache-first'
  });
};

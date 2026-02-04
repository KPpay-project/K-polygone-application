export interface TicketMessage {
  id: string;
  message: string;
  senderType: 'customer' | 'admin';
  insertedAt: string;
  updatedAt: string;
  user?: {
    id: string;
    firstname: string;
    lastname: string;
  };
}

export interface Ticket {
  id: string;
  ticketNumber: string;
  ticketSubject: string;
  message: string;
  status: 'done' | 'in_progress' | 'pending';
  priority: 'high' | 'medium' | 'low';
  ticketType: string;
  insertedAt: string;
  updatedAt: string;
  comments?: number;
  messages?: TicketMessage[];
}

export const ticketStatusColors: Record<Ticket['status'], string> = {
  done: 'bg-green-100 text-green-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  pending: 'bg-gray-100 text-gray-800'
};

export const ticketPriorityColors: Record<Ticket['priority'], { dot: string; text: string }> = {
  high: { dot: 'bg-red-500', text: 'text-red-500' },
  medium: { dot: 'bg-blue-500', text: 'text-blue-500' },
  low: { dot: 'bg-gray-500', text: 'text-gray-500' }
};

export const mockTickets: Ticket[] = [
  {
    id: '1',
    ticketNumber: '544B542D0F813C1CDF',
    ticketSubject: 'Trying again',
    message: 'Testing out TIcket',
    status: 'pending',
    priority: 'high',
    ticketType: 'custom',
    insertedAt: '2025-09-17T07:08:50Z',
    updatedAt: '2025-09-17T07:08:50Z'
  },
  {
    id: '2',
    ticketNumber: '#2356777888',
    ticketSubject: 'Payment issue',
    message: 'I experienced an issue while trying to make a payment on your platform. I attempted to pay using kpay',
    status: 'in_progress',
    priority: 'high',
    insertedAt: '2023-07-14T09:15:00Z',
    updatedAt: '2023-07-14T16:30:00Z',
    ticketType: 'custom'
  },
  {
    id: '3',
    ticketNumber: '#2356777888',
    ticketSubject: 'Payment issue',
    message: 'I experienced an issue while trying to make a payment on your platform. I attempted to pay using kpay',
    status: 'in_progress',
    priority: 'high',
    insertedAt: '2023-07-13T14:20:00Z',
    updatedAt: '2023-07-13T18:45:00Z',
    ticketType: 'custom'
  },
  {
    id: '4',
    ticketNumber: '#2356777888',
    ticketSubject: 'Payment issue',
    message: 'I experienced an issue while trying to make a payment on your platform. I attempted to pay using kpay',
    status: 'in_progress',
    priority: 'high',
    insertedAt: '2023-07-12T11:10:00Z',
    updatedAt: '2023-07-12T15:30:00Z',
    ticketType: 'custom'
  },
  {
    id: '5',
    ticketNumber: '#2356777888',
    ticketSubject: 'Payment issue',
    message: 'I experienced an issue while trying to make a payment on your platform. I attempted to pay using kpay',
    status: 'in_progress',
    priority: 'high',
    insertedAt: '2023-07-11T08:45:00Z',
    updatedAt: '2023-07-11T13:20:00Z',
    ticketType: 'custom'
  }
];

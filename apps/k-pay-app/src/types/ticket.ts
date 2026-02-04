export interface Ticket {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  status: 'done' | 'in_progress' | 'pending';
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
  updatedAt: string;
  assignee?: string;
  comments?: number;
  attachments?: number;
}

export const ticketStatusColors: Record<Ticket['status'], string> = {
  done: 'bg-green-100 text-green-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  pending: 'bg-gray-100 text-gray-800',
};

export const ticketPriorityColors: Record<Ticket['priority'], string> = {
  high: 'bg-red-100 text-red-800',
  medium: 'bg-blue-100 text-blue-800',
  low: 'bg-gray-100 text-gray-800',
};

export const mockTickets: Ticket[] = [
  {
    id: '1',
    ticketNumber: '#2356777888',
    title: 'Payment issue',
    description:
      'I experienced an issue while trying to make a payment on your platform. I attempted to pay using kpay',
    status: 'done',
    priority: 'high',
    createdAt: '2023-07-15T10:30:00Z',
    updatedAt: '2023-07-15T14:45:00Z',
    assignee: 'Praise',
    comments: 3,
    attachments: 3,
  },
  {
    id: '2',
    ticketNumber: '#2356777888',
    title: 'Payment issue',
    description:
      'I experienced an issue while trying to make a payment on your platform. I attempted to pay using kpay',
    status: 'in_progress',
    priority: 'high',
    createdAt: '2023-07-14T09:15:00Z',
    updatedAt: '2023-07-14T16:30:00Z',
    assignee: 'Praise',
    comments: 3,
    attachments: 3,
  },
  {
    id: '3',
    ticketNumber: '#2356777888',
    title: 'Payment issue',
    description:
      'I experienced an issue while trying to make a payment on your platform. I attempted to pay using kpay',
    status: 'in_progress',
    priority: 'high',
    createdAt: '2023-07-13T14:20:00Z',
    updatedAt: '2023-07-13T18:45:00Z',
    assignee: 'Praise',
    comments: 3,
    attachments: 3,
  },
  {
    id: '4',
    ticketNumber: '#2356777888',
    title: 'Payment issue',
    description:
      'I experienced an issue while trying to make a payment on your platform. I attempted to pay using kpay',
    status: 'in_progress',
    priority: 'high',
    createdAt: '2023-07-12T11:10:00Z',
    updatedAt: '2023-07-12T15:30:00Z',
    assignee: 'Praise',
    comments: 3,
    attachments: 3,
  },
  {
    id: '5',
    ticketNumber: '#2356777888',
    title: 'Payment issue',
    description:
      'I experienced an issue while trying to make a payment on your platform. I attempted to pay using kpay',
    status: 'in_progress',
    priority: 'high',
    createdAt: '2023-07-11T08:45:00Z',
    updatedAt: '2023-07-11T13:20:00Z',
    assignee: 'Praise',
    comments: 3,
    attachments: 3,
  },
];

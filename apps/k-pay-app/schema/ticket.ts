import { z } from 'zod';

export const ticketSchema = z.object({
  subject: z.string().min(3, { message: 'Subject is required' }),
  priority: z.string().min(1, { message: 'Priority is required' }),
  // Allow File or null/undefined; validate with Zustand and UI rather than Zod here
  attachment: z.any().optional().nullable(),
  message: z
    .string()
    .min(10, { message: 'Please provide more details about your issue' }),
});

export type TicketFormValues = z.infer<typeof ticketSchema>;

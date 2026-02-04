import { zodResolver } from '@hookform/resolvers/zod';
import { ticketSchema, TicketFormValues } from '@/schema/ticket';
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea
} from 'k-polygon-assets/components';
import { IconArrowRight } from 'k-polygon-assets/icons';
import { X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useCreateTicket } from '@/hooks/api/ticket';
import { PRIORITY_ENUM, TICKET_TYPE_ENUM } from '@/enums';
import { useTicketFormStore } from '@/store/ticket-form-store';
import { DISPUTE_SUBJECTS } from '@/constant';

interface CreateTicketActionProps {
  onClose?: () => void;
  onSubmit?: (data: TicketFormValues) => void;
  onTicketCreated?: () => void;
}

const CreateTicketAction = ({ onClose, onSubmit, onTicketCreated }: CreateTicketActionProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createTicket, loading } = useCreateTicket();
  const { attachmentError, setAttachmentError, reset } = useTicketFormStore();

  const form = useForm<TicketFormValues>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      subject: '',
      priority: 'high',
      attachment: null,
      message: ''
    }
  });

  const onSubmitForm = async (data: TicketFormValues) => {
    try {
      setIsSubmitting(true);
      const priorityKey = String(data.priority || 'high').toUpperCase() as keyof typeof PRIORITY_ENUM;
      const trxnId = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('trxnId') : null;
      const input = {
        ticketType: trxnId ? TICKET_TYPE_ENUM.TRANSACTION : TICKET_TYPE_ENUM.CUSTOM,
        ticketSubject: data.subject,
        ticketAttachment: (data as any).attachment ?? null,
        priority: PRIORITY_ENUM[priorityKey] ?? PRIORITY_ENUM.HIGH,
        message: data.message,
        ...(trxnId ? { transactionId: trxnId } : {})
      };
      const res = await createTicket(input);
      if (res.ok) {
        onSubmit?.(data);
        onTicketCreated?.();
        reset();
        form.reset({ subject: '', priority: 'high', attachment: null, message: '' });
      } else {
        //
      }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to create ticket');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) {
      form.setValue('attachment', null);
      setAttachmentError(null);
      return;
    }
    const allowed = [
      'image/',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    const isAllowed = allowed.some((t) => (t.endsWith('/') ? file.type.startsWith(t) : file.type === t));
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (!isAllowed) {
      setAttachmentError('Unsupported file type. Allowed: images, PDF, DOC, DOCX');
      form.setValue('attachment', null);
      return;
    }
    if (file.size > maxSize) {
      setAttachmentError('File is too large. Max size is 5MB.');
      form.setValue('attachment', null);
      return;
    }
    setAttachmentError(null);

    (form as any).setValue('attachment', file);
  };

  const priorityOptions = [
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg">
      <div className="flex justify-between items-center mb-6">
        {onClose && (
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 transition-colors" aria-label="Close">
            <X size={20} />
          </button>
        )}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmitForm)} className="space-y-4">
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="!text-black">Ticket Subject</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="rounded-lg">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {DISPUTE_SUBJECTS.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="!text-black">Priority</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="rounded-lg">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {priorityOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel className="!text-black">Attachment</FormLabel>
            <FormControl>
              <Input
                type="file"
                accept="image/*,.pdf,.doc,.docx"
                className="rounded-lg"
                onChange={handleAttachmentChange}
              />
            </FormControl>
            {attachmentError ? <FormMessage>{attachmentError}</FormMessage> : null}
          </FormItem>

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="!text-black">Message</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Explain what happened"
                    className="min-h-[100px] resize-none rounded-lg"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-[#FF0032] hover:bg-[#E00029] text-white"
            icon={<IconArrowRight />}
            disabled={isSubmitting || loading}
          >
            {isSubmitting || loading ? 'Submitting…' : 'Submit Ticket'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateTicketAction;

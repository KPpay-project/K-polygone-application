import { useMutation } from '@apollo/client';
import { toast } from 'sonner';
import { CREATE_TICKET_MESSAGE } from '@repo/api';
import type { CreateTicketMessageInput, CreateTicketMessageResponse, CreateTicketMessageVariables } from '@repo/types';

export const useCreateTicketMessage = () => {
  const [createTicketMessage, { loading, error }] = useMutation<
    CreateTicketMessageResponse,
    CreateTicketMessageVariables
  >(CREATE_TICKET_MESSAGE, {
    onCompleted: (data) => {
      if (data.createTicketMessage.success) {
        toast.success(data.createTicketMessage.message || 'Message sent successfully');
      } else {
        toast.error(data.createTicketMessage.errors?.[0] || 'Failed to send message');
      }
    },
    onError: (error) => {
      toast.error(error.message || 'An error occurred while sending the message');
    }
  });

  const sendMessage = async (input: CreateTicketMessageInput) => {
    try {
      const response = await createTicketMessage({
        variables: { input }
      });
      return response.data?.createTicketMessage;
    } catch (err) {
      console.error('Error sending ticket message:', err);
      throw err;
    }
  };

  return {
    sendMessage,
    loading,
    error
  };
};

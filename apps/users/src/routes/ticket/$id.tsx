import DashboardLayout from '@/components/layouts/dashboard-layout';
import { StatusBadge } from '@/components/common/badge/status-badge';
import { ModularCard } from '@/components/sub-modules/card/card';
import { createFileRoute } from '@tanstack/react-router';
import { AddCircle, ArrowLeft, Link } from 'iconsax-reactjs';
import { ticketPriorityColors, Ticket } from '@repo/types';
import { cn } from '@/lib/utils';
import { Button } from 'k-polygon-assets';
import { useGetTicketById, useCreateTicketMessage } from '@/hooks/api/ticket';
import { useUser } from '@/store';

export const Route = createFileRoute('/ticket/$id')({
  component: TicketDetailsRoute
});

import { useState } from 'react';
import moment from 'moment';

function TicketDetailsRoute() {
  const { id } = Route.useParams();
  const { data, loading, error, refetch } = useGetTicketById(id);
  const ticket: Ticket | undefined = data?.getTicketById;
  const { user } = useUser();

  const [comment, setComment] = useState('');
  const [commentError, setCommentError] = useState<string | null>(null);
  const { createTicketMessage, loading: sending } = useCreateTicketMessage();

  const handleSendComment = async () => {
    setCommentError(null);
    if (!comment.trim()) {
      setCommentError('Comment cannot be empty');
      return;
    }
    try {
      const res = await createTicketMessage({ ticketId: ticket!.id, message: comment });
      if (res.data?.createTicketMessage?.success) {
        setComment('');
        setCommentError(null);
        refetch();
      } else {
        setCommentError(res.data?.createTicketMessage?.message || 'Failed to send comment');
      }
    } catch (err: any) {
      setCommentError(err?.message || 'Failed to send comment');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="w-full text-center py-10">Loading ticket...</div>
      </DashboardLayout>
    );
  }
  if (error) {
    return <div className="w-full text-center py-10 text-red-500">Error loading ticket: {error.message}</div>;
  }
  if (!ticket) {
    return <div className="w-full text-center py-10 text-gray-500">Ticket not found.</div>;
  }

  const goBack = () => {
    window.history.back();
  };

  return (
    <DashboardLayout>
      <ModularCard>
        <div className="">
          <div className="flex items-center gap-2 cursor-pointer" onClick={goBack}>
            <ArrowLeft size={16} className="text-gray-600" />
            <div className="w-6 h-6 bg-blue-700 rounded-full flex items-center justify-center">
              <AddCircle size={16} className="text-white" />
            </div>
            <div className="truncate">
              <div className="text-sm font-medium text-gray-600 truncate">TICKET #{ticket.ticketNumber}</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 my-4">
          <StatusBadge
            status={ticket.status === 'in_progress' ? 'in-progress' : ticket.status}
            showIcon
            iconPosition="left"
          />
          <div className="flex items-center gap-1 justify-beween">
            <div className={cn(ticketPriorityColors[ticket.priority].dot, 'w-2 h-2 rounded-full')} />
            <span className={cn(ticketPriorityColors[ticket.priority].text)}>{ticket.priority}</span>
          </div>
        </div>

        <div className="my-5 w-full lg:w-[500px]">
          <p className="text-sm">{ticket.message}</p>
        </div>

        <div className="space-y-4">
          {ticket.messages?.map((message) => (
            <div key={message.id} className="bg-[#F7F7F7] p-4 rounded-lg text-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  {message.senderType === 'customer'
                    ? message.user?.id === user?.id
                      ? 'Y'
                      : message.user?.firstname?.[0] || 'U'
                    : 'A'}
                </div>
                <div>
                  <h4 className="text-sm">
                    {message.senderType === 'customer' ? (
                      message.user?.id === user?.id ? (
                        <span className="font-semibold text-blue-700">You</span>
                      ) : (
                        <span className="text-gray-700">
                          {message.user?.firstname} {message.user?.lastname}
                        </span>
                      )
                    ) : (
                      <span className="font-semibold text-blue-700">Admin</span>
                    )}
                  </h4>
                  <span className="text-xs text-gray-500">{moment(message.insertedAt).fromNow()}</span>
                </div>
              </div>
              <p className="text-sm">{message.message}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 border border-blue-700 rounded-lg p-4">
          <textarea
            className="w-full h-24 p-2 rounded-md"
            placeholder="Add comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={sending}
          />
          {commentError && <div className="text-xs text-red-500 mt-1">{commentError}</div>}
          <div className="flex items-center justify-between mt-2">
            <div className="cursor-pointer">
              <Link size={15} />
            </div>
            <Button className="bg-blue-700 px-6" onClick={handleSendComment} disabled={sending}>
              {sending ? 'Sending...' : 'Comment'}
            </Button>
          </div>
        </div>
      </ModularCard>
    </DashboardLayout>
  );
}

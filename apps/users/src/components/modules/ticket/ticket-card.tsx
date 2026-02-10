import React from 'react';
import { Ticket, ticketPriorityColors } from '@repo/types';
import { AddCircle, Message } from 'iconsax-reactjs';

import { StatusBadge } from '@/components/common/badge/status-badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useProfile } from '@/store/profile-store';
import { cn } from '@/lib/utils';
import { useNavigate } from '@tanstack/react-router';

interface TicketCardProps {
  ticket: Ticket;
  onClick: (ticket: Ticket) => void;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket }) => {
  const profile = useProfile();
  const navigate = useNavigate();
  const firstName = profile?.user?.firstName || '';
  const lastName = profile?.user?.lastName || '';

  const openTicket = () => {
    navigate({
      to: '/ticket/$id',
      params: { id: ticket.id }
    });
  };

  return (
    <div
      key={ticket.id}
      className="bg-[#F7F7F7]  rounded-xl px-4 py-5 sm:px-6 sm:py-8 w-full hover:border-gray-200 transition-colors cursor-pointer"
      onClick={() => openTicket()}
    >
      <div className="flex items-center justify-between flex-wrap gap-y-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 bg-blue-700 rounded-full flex items-center justify-center">
            <AddCircle size={16} className="text-white" />
          </div>
          <div className="truncate">
            <div className="text-sm font-medium text-gray-600 truncate">TICKET #{ticket.ticketNumber}</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-start lg:items-center mt-3 gap-4 w-full">
        <div className="text-sm text-gray-500 line-clamp-2 w-full lg:w-[70%] truncate">{ticket.message}</div>
        <div className="flex flex-wrap items-center gap-4 w-full lg:w-[40%] justify-start lg:justify-between">
          <div className="flex items-center gap-2 ">
            <Avatar className="w-8 h-8">
              <AvatarImage
                src={`https://api.dicebear.com/9.x/initials/svg?seed=${firstName} ${lastName}`}
                alt={`@${firstName} ${lastName}`}
              />
              <AvatarFallback>{firstName.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-gray-700 truncate">
              {firstName} {lastName}
            </span>
          </div>

          <StatusBadge
            status={ticket.status === 'in_progress' ? 'in-progress' : ticket.status}
            showIcon
            iconPosition="left"
          />

          <div className="flex items-center gap-1 justify-beween">
            <div className={cn(ticketPriorityColors[ticket.priority].dot, 'w-2 h-2 rounded-full')} />
            <span className={cn(ticketPriorityColors[ticket.priority].text)}>{ticket.priority}</span>
          </div>
          <span className="flex gap-2">
            <Message size={18} />
            <span className="text-xs font-medium">{ticket?.messages?.length ?? 0}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;

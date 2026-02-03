import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Typography, ReusableButton } from '@/components/ui';
import { ContainerLayout } from '@/layout/safe-area-layout';
import { HeaderWithTitle } from '@/components';
import { AddCircle, Message, FolderOpen } from 'iconsax-react-nativejs';
import { router } from 'expo-router';

interface TicketData {
  id: string;
  ticketNumber: string;
  description: string;
  status: 'done' | 'pending' | 'in-progress';
  priority: 'high' | 'medium' | 'low';
  commentsCount: number;
  attachmentsCount: number;
}

const TicketCard = ({ ticket }: { ticket: TicketData }) => {
  const getStatusConfig = () => {
    switch (ticket.status) {
      case 'done':
        return {
          label: 'Done',
          bgColor: 'bg-green-50',
          textColor: 'text-green-600',
          dotColor: 'bg-green-600',
        };
      case 'pending':
        return {
          label: 'Pending',
          bgColor: 'bg-yellow-50',
          textColor: 'text-yellow-600',
          dotColor: 'bg-yellow-600',
        };
      default:
        return {
          label: 'In Progress',
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-600',
          dotColor: 'bg-blue-600',
        };
    }
  };

  const getPriorityConfig = () => {
    switch (ticket.priority) {
      case 'high':
        return {
          label: 'High',
          dotColor: 'bg-red-500',
          textColor: 'text-red-500',
        };
      case 'medium':
        return {
          label: 'Medium',
          dotColor: 'bg-yellow-500',
          textColor: 'text-yellow-500',
        };
      default:
        return {
          label: 'Low',
          dotColor: 'bg-green-500',
          textColor: 'text-green-500',
        };
    }
  };

  const statusConfig = getStatusConfig();
  const priorityConfig = getPriorityConfig();

  return (
    <TouchableOpacity
      className="bg-gray-50 rounded-2xl p-4 mb-4"
      onPress={() => router.push(`/ticket/${ticket.id}`)}
    >
      <View className="flex-row items-center mb-3">
        <View className="w-12 h-12 bg-blue-600 rounded-full items-center justify-center mr-3">
          <AddCircle size={24} color="#fff" variant="Bold" />
        </View>
        <Typography variant="body" weight="600" className="text-gray-900">
          Ticket #{ticket.ticketNumber}
        </Typography>
      </View>

      <Typography variant="caption" className="text-gray-600 mb-4 leading-5">
        {ticket.description}
      </Typography>

      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          {/* Status Badge */}
          <View
            className={`${statusConfig.bgColor} px-3 py-1.5 rounded-full flex-row items-center gap-1.5`}
          >
            <View className={`w-2 h-2 rounded-full ${statusConfig.dotColor}`} />
            <Typography
              variant="small"
              weight="500"
              className={statusConfig.textColor}
            >
              {statusConfig.label}
            </Typography>
          </View>

          {/* Priority Badge */}
          <View className="flex-row items-center gap-1.5">
            <View
              className={`w-2 h-2 rounded-full ${priorityConfig.dotColor}`}
            />
            <Typography
              variant="small"
              weight="500"
              className={priorityConfig.textColor}
            >
              {priorityConfig.label}
            </Typography>
          </View>
        </View>

        <View className="flex-row items-center gap-4">
          {/* Comments */}
          <View className="flex-row items-center gap-1.5">
            <Message size={18} color="#6B7280" variant="Outline" />
            <Typography variant="small" className="text-gray-600">
              {ticket.commentsCount}
            </Typography>
          </View>

          {/* Attachments */}
          <View className="flex-row items-center gap-1.5">
            <FolderOpen size={18} color="#6B7280" variant="Outline" />
            <Typography variant="small" className="text-gray-600">
              {ticket.attachmentsCount}
            </Typography>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const Ticket = () => {
  const mockTickets: TicketData[] = [
    {
      id: '1',
      ticketNumber: '23567778888',
      description:
        'I experienced an issue while trying to make a payment on your platform. I attempted to pay using kpay',
      status: 'done',
      priority: 'high',
      commentsCount: 3,
      attachmentsCount: 3,
    },
    {
      id: '2',
      ticketNumber: '23567778888',
      description:
        'I experienced an issue while trying to make a payment on your platform. I attempted to pay using kpay',
      status: 'done',
      priority: 'high',
      commentsCount: 3,
      attachmentsCount: 3,
    },
    {
      id: '3',
      ticketNumber: '23567778888',
      description:
        'I experienced an issue while trying to make a payment on your platform. I attempted to pay using kpay',
      status: 'done',
      priority: 'high',
      commentsCount: 3,
      attachmentsCount: 3,
    },
  ];

  return (
    <ContainerLayout>
      <View className="flex-1 px-6 pt-6">
        <HeaderWithTitle title="Tickets" />

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {mockTickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </ScrollView>

        <View className="absolute bottom-6 left-6 right-6">
          <ReusableButton
            text="Create Ticket"
            className="w-full bg-[#FF0033] border-0"
            textClassName="text-white font-semibold"
            onPress={() => {
              router.push('/ticket/create-ticket');
            }}
          />
        </View>
      </View>
    </ContainerLayout>
  );
};

export default Ticket;

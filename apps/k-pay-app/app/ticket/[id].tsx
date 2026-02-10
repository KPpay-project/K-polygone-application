import {
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { Typography, ReusableButton } from '@/components/ui';
import { ContainerLayout } from '@/layout/safe-area-layout';
import { HeaderWithTitle } from '@/components';
import {
  AddCircle,
  DocumentText,
  EmojiHappy,
  Gallery,
} from 'iconsax-react-nativejs';
import { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';

const PreviewTicket = () => {
  const params = useLocalSearchParams();
  const [comment, setComment] = useState('');

  // Mock ticket data - replace with actual data from API
  const ticketData = {
    ticketNumber: '23567778888',
    status: 'in-progress',
    priority: 'high',
    message: `Hello Support Team,

I experienced an issue while trying to make a payment on your platform. Please find the details below:
• Full Name:
• Email/Phone Number:
• Transaction Reference ID:
• Payment Method Used (Card, Bank Transfer, Mobile Money, etc.):
• Date & Time of Transaction:
• Issue Experienced (e.g., payment declined, double debit, not credited, timeout):
• Amount Paid:

Kindly assist me in resolving this issue as soon as possible. Thank you.`,
    supportingDocuments: [
      {
        name: 'Failed transfer.pdf',
        size: '23.5MB',
      },
    ],
    adminResponse: {
      name: 'Praise',
      role: 'Admin',
      avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Praise',
      message: `Thank you for reaching out to us and providing the details of your payment issue. We sincerely apologize for the inconvenience caused.

We have received your transaction details and are currently reviewing them with our payment processor. Please allow up to 24-72 hours for the payment status to be confirmed. If the payment was debited from your account but not credited to your order/wallet, the amount will either be automatically reversed by your bank or we will ensure it is applied correctly once verified.`,
    },
  };

  const getStatusConfig = () => {
    switch (ticketData.status) {
      case 'in-progress':
        return {
          label: 'In Progress',
          bgColor: 'bg-yellow-50',
          textColor: 'text-yellow-600',
          dotColor: 'bg-yellow-600',
        };
      case 'done':
        return {
          label: 'Done',
          bgColor: 'bg-green-50',
          textColor: 'text-green-600',
          dotColor: 'bg-green-600',
        };
      default:
        return {
          label: 'Pending',
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-600',
          dotColor: 'bg-gray-600',
        };
    }
  };

  const getPriorityConfig = () => {
    switch (ticketData.priority) {
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

  const handleComment = () => {
    console.log('Comment:', comment);
    setComment('');
  };

  return (
    <ContainerLayout>
      <ScrollView
        className="flex-1 px-6 pt-6"
        showsVerticalScrollIndicator={false}
      >
        <HeaderWithTitle title="" showTitle={false} />

        {/* Ticket Header */}
        <View className="flex-row items-center mb-4">
          <View className="w-10 h-10 bg-blue-600 rounded-full items-center justify-center mr-3">
            <AddCircle size={20} color="#fff" variant="Bold" />
          </View>
          <Typography variant="body" weight="600" className="text-gray-900">
            Ticket #{ticketData.ticketNumber}
          </Typography>
        </View>

        {/* Status and Priority Badges */}
        <View className="flex-row items-center gap-3 mb-6">
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

        {/* Ticket Message */}
        <View className="mb-6">
          <Typography variant="caption" className="text-gray-700 leading-6">
            {ticketData.message}
          </Typography>
        </View>

        {/* Supporting Documents */}
        {ticketData.supportingDocuments.length > 0 && (
          <View className="mb-6">
            <Typography
              variant="body"
              weight="600"
              className="text-gray-900 mb-3"
            >
              Supporting Documents
            </Typography>
            {ticketData.supportingDocuments.map((doc, index) => (
              <TouchableOpacity
                key={index}
                className="bg-gray-50 rounded-xl p-4 flex-row items-center mb-2"
              >
                <View className="w-10 h-10 bg-red-100 rounded-lg items-center justify-center mr-3">
                  <DocumentText size={20} color="#EF4444" variant="Bold" />
                </View>
                <View className="flex-1">
                  <Typography
                    variant="body"
                    weight="500"
                    className="text-gray-900"
                  >
                    {doc.name}
                  </Typography>
                  <Typography variant="small" className="text-gray-500">
                    {doc.size}
                  </Typography>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Admin Response */}
        {ticketData.adminResponse && (
          <View className="bg-gray-50 rounded-2xl p-4 mb-6">
            <View className="flex-row items-center mb-3">
              <Image
                source={{ uri: ticketData.adminResponse.avatar }}
                className="w-10 h-10 rounded-full mr-3"
              />
              <View className="flex-1">
                <Typography
                  variant="body"
                  weight="600"
                  className="text-gray-900"
                >
                  {ticketData.adminResponse.name}
                </Typography>
              </View>
              <View className="bg-blue-100 px-3 py-1 rounded-full">
                <Typography
                  variant="small"
                  weight="500"
                  className="text-blue-600"
                >
                  {ticketData.adminResponse.role}
                </Typography>
              </View>
            </View>
            <Typography variant="caption" className="text-gray-700 leading-6">
              {ticketData.adminResponse.message}
            </Typography>
          </View>
        )}

        {/* Add Comment Section */}
        <View className="bg-white border border-gray-200 rounded-2xl p-4 mb-8">
          <Typography
            variant="body"
            weight="600"
            className="text-gray-900 mb-3"
          >
            Add Comment
          </Typography>
          <View className="flex-row items-center gap-3">
            <View className="flex-1 bg-gray-50 rounded-xl px-4 py-3 flex-row items-center">
              <TextInput
                value={comment}
                onChangeText={setComment}
                placeholder="Type your comment..."
                placeholderTextColor="#9CA3AF"
                className="flex-1 text-gray-900"
                style={{ fontSize: 14 }}
              />
              <View className="flex-row items-center gap-2 ml-2">
                <TouchableOpacity>
                  <Gallery size={20} color="#6B7280" variant="Outline" />
                </TouchableOpacity>
                <TouchableOpacity>
                  <EmojiHappy size={20} color="#6B7280" variant="Outline" />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              onPress={handleComment}
              className="bg-blue-600 px-6 py-3 rounded-xl"
            >
              <Typography variant="body" weight="600" className="text-white">
                Comment
              </Typography>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ContainerLayout>
  );
};

export default PreviewTicket;

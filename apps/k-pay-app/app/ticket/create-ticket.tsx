import { View, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Typography, ReusableButton } from '@/components/ui';
import { ContainerLayout } from '@/layout/safe-area-layout';
import { HeaderWithTitle } from '@/components';
import { ArrowDown2, DocumentUpload } from 'iconsax-react-nativejs';
import { useState } from 'react';
import { router } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';

const CreateTicketPage = () => {
  const [subject, setSubject] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('high');
  const [message, setMessage] = useState('');
  const [attachment, setAttachment] = useState<any>(null);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);

  const priorities = [
    { label: 'High', value: 'high' as const },
    { label: 'Medium', value: 'medium' as const },
    { label: 'Low', value: 'low' as const },
  ];

  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setAttachment(result.assets[0]);
      }
    } catch (error) {
      console.error('Error picking document:', error);
    }
  };

  const handleCreateTicket = () => {
    // Handle ticket creation logic here
    console.log({ subject, priority, message, attachment });
    router.back();
  };

  return (
    <ContainerLayout>
      <ScrollView
        className="flex-1 px-6 pt-6"
        showsVerticalScrollIndicator={false}
      >
        <HeaderWithTitle title="Create ticket" />

        <View className="mb-6">
          <Typography
            variant="body"
            weight="600"
            className="text-gray-900 mb-3"
          >
            Ticket Subject
          </Typography>
          <TextInput
            value={subject}
            onChangeText={setSubject}
            placeholder="Mobile Money"
            placeholderTextColor="#9CA3AF"
            className="bg-white border border-gray-200 rounded-xl px-4 py-4 text-gray-900"
            style={{ fontSize: 16 }}
          />
        </View>

        <View className="mb-6">
          <Typography
            variant="body"
            weight="600"
            className="text-gray-900 mb-3"
          >
            Priority
          </Typography>
          <TouchableOpacity
            onPress={() => setShowPriorityDropdown(!showPriorityDropdown)}
            className="bg-white border border-gray-200 rounded-xl px-4 py-4 flex-row items-center justify-between"
          >
            <Typography variant="body" className="text-gray-900">
              {priorities.find((p) => p.value === priority)?.label}
            </Typography>
            <ArrowDown2 size={20} color="#6B7280" />
          </TouchableOpacity>

          {showPriorityDropdown && (
            <View className="bg-white border border-gray-200 rounded-xl mt-2 overflow-hidden">
              {priorities.map((item) => (
                <TouchableOpacity
                  key={item.value}
                  onPress={() => {
                    setPriority(item.value);
                    setShowPriorityDropdown(false);
                  }}
                  className="px-4 py-3 border-b border-gray-100"
                >
                  <Typography
                    variant="body"
                    className={
                      priority === item.value
                        ? 'text-blue-600'
                        : 'text-gray-900'
                    }
                  >
                    {item.label}
                  </Typography>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View className="mb-6">
          <Typography
            variant="body"
            weight="600"
            className="text-gray-900 mb-3"
          >
            Attachment
          </Typography>
          <TouchableOpacity
            onPress={handleFileUpload}
            className="bg-white border border-gray-200 rounded-xl px-4 py-4 flex-row items-center"
          >
            <View className="bg-blue-50 p-2 rounded-lg mr-3">
              <DocumentUpload size={20} color="#3B82F6" />
            </View>
            <View className="flex-1">
              <Typography variant="body" className="text-blue-600 font-medium">
                Choose File
              </Typography>
            </View>
            <Typography variant="body" className="text-gray-500">
              {attachment ? attachment.name : 'No File Chosen'}
            </Typography>
          </TouchableOpacity>
        </View>

        <View className="mb-8">
          <Typography
            variant="body"
            weight="600"
            className="text-gray-900 mb-3"
          >
            Message
          </Typography>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Explain what happened"
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={8}
            textAlignVertical="top"
            className="bg-white border border-gray-200 rounded-xl px-4 py-4 text-gray-900"
            style={{ fontSize: 16, minHeight: 200 }}
          />
        </View>

        <View className="mb-8">
          <ReusableButton
            text="Create ticket"
            className="w-full bg-[#FF0033] border-0"
            textClassName="text-white font-semibold"
            onPress={handleCreateTicket}
          />
        </View>
      </ScrollView>
    </ContainerLayout>
  );
};

export default CreateTicketPage;

import { View, TouchableOpacity, ScrollView } from 'react-native';
import { Typography, ReusableButton } from '@/components/ui';
import { CloseSquare } from 'iconsax-react-nativejs';
import { router } from 'expo-router';
import { TRANSFER_PROVIDERS_ARRAY } from '@/constants';

interface MobileMoneyOptionsProps {
  closeModal: () => void;
}

const MobileMoneyOptions = ({ closeModal }: MobileMoneyOptionsProps) => {
  return (
    <View className="flex-1 justify-end bg-black/50 ">
      <View className="bg-white rounded-t-3xl px-6 pb-8 pt-4 max-h-[80%]">
        <View className="flex-row items-center justify-between mb-6 mt-4">
          <Typography
            variant="h5"
            weight="500"
            className=" text-gray-900 w-[60%]"
          >
            Select the medium you want to send to
          </Typography>
          <TouchableOpacity onPress={closeModal} className="p-2">
            <CloseSquare size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="space-y-4 gap-3">
            {TRANSFER_PROVIDERS_ARRAY.map((provider) => (
              <TouchableOpacity
                key={provider.key}
                onPress={() => {
                  closeModal();
                  router.push(
                    `/send-money/send-with-mobile-money?provider=${provider.key}`
                  );
                }}
                className="flex-row items-center p-4 bg-gray-50 rounded-xl"
              >
                <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-4">
                  <Typography
                    variant="caption"
                    className="font-bold text-gray-600"
                  >
                    {provider.label.substring(0, 3).toUpperCase()}
                  </Typography>
                </View>
                <View className="flex-1">
                  <Typography
                    variant="body"
                    className="font-semibold text-gray-900"
                  >
                    {provider.label}
                  </Typography>
                  <Typography variant="caption" className="text-gray-600">
                    {provider.description}
                  </Typography>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <View className="mt-6">
          <ReusableButton
            text="Cancel"
            onPress={closeModal}
            className="bg-gray-200"
          />
        </View>
      </View>
    </View>
  );
};

export default MobileMoneyOptions;

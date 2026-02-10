import { ScreenContainer } from '@/layout/safe-area-layout';
import { HeaderWithTitle } from '@/components';
import { ProfileCircle, Bank, Copy, ExportCurve } from 'iconsax-react-nativejs';
import { router } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';
import { Typography } from '@/components/ui';
import { Share } from 'react-native';

function AddMoney() {
  const accountDetails = {
    name: 'John Doe',
    bank: 'KPay Bank',
    number: '1234567890',
  };

  const handleShare = async () => {
    try {
      const message = `Account Details:
      \nName: ${accountDetails.name}
      \nBank: ${accountDetails.bank}
      \nAccount Number: ${accountDetails.number}`;

      await Share.share({
        message,
      });
    } catch (error) {
      //
    }
  };

  return (
    <ScreenContainer useSafeArea={true} paddingHorizontal={15}>
      <HeaderWithTitle
        title="Send Money"
        description="What mode are you adding from?"
      />

      <View className="border-[1px] border-gray-300 rounded-lg p-4 mt-8 p-2 flex gap-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Typography variant="caption" className="font-medium text-xs mb-1">
              Account holder
            </Typography>
            <Typography variant="caption" className="text-black" weight="600">
              {accountDetails.name}
            </Typography>
          </View>
          <Copy size="15" color="black" />
        </View>

        <View className="flex-row items-center justify-between">
          <View>
            <Typography variant="caption" className="font-medium text-xs mb-1">
              Bank
            </Typography>
            <Typography variant="caption" className="text-black" weight="600">
              {accountDetails.bank}
            </Typography>
          </View>
          <Copy size="15" color="black" />
        </View>

        <View className="flex-row items-center justify-between">
          <View>
            <Typography variant="caption" className="font-medium text-xs mb-1">
              Account Number
            </Typography>
            <Typography variant="caption" className="text-black" weight="600">
              {accountDetails.number}
            </Typography>
          </View>
          <Copy size="15" color="black" />
        </View>

        {/* Share Button */}
        <TouchableOpacity
          onPress={handleShare}
          className="flex-row w-40 mx-auto gap-2 items-center mt-4"
        >
          <ExportCurve size={15} color="blue" className="ml-2" />
          <Typography
            variant="caption"
            className="text-blue-700 text-center text-blue-500"
          >
            Share details
          </Typography>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}

export default AddMoney;

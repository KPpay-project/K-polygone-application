import { HeaderWithTitle } from '@/components';
import { DebitCard } from '@/components/card/debit-card';
import CustomTextInput from '@/components/input';
import { Typography } from '@/components/ui';
import { ReusableButton } from '@/components/ui/button/reusable-button';
import { ScreenContainer } from '@/layout/safe-area-layout';
import { useState } from 'react';
import { View } from 'react-native';

function CreateCard() {
  const [cardDetails, setCardDetails] = useState({
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    color: '#2D42FE',
  });
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateCard = async () => {
    setIsCreating(true);
    try {
      // Simulate card creation process
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      console.error('Card creation failed:', error);
    } finally {
      setIsCreating(false);
    }
  };
  return (
    <ScreenContainer useSafeArea={true} paddingHorizontal={15}>
      <HeaderWithTitle showDescription={false} showTitle={false} />
      <View className="mt-8 mb-4  items-end text-right ">
        <View className="items-center flex-row gap-2">
          <Typography weight="600">Card Creation fee</Typography>
          <View className="bg-green-100/50  w-[35px] items-center rounded-full w-[45px] h-[22px]">
            <Typography className="text-blue-600 font-semibold">$4</Typography>
          </View>
        </View>
      </View>
      <DebitCard
        title="Debit Card"
        card_name={cardDetails.cardholderName}
        color={cardDetails.color}
      />

      <View className="mt-4 gap-3 flex">
        <CustomTextInput
          label="Cardholder Name"
          placeholder="Enter card number name"
          value={cardDetails.cardholderName}
          onChangeText={(text) => {
            setCardDetails({ ...cardDetails, cardholderName: text });
          }}
        />

        <Typography weight="600">Choose Colour</Typography>
        <View
          className="gap-3 flex-row align-center justify-center
           border border-gray-300 rounded-md p-2"
        >
          {[
            '#A12A1A',
            '#A12AA1',
            '#2A3AA1',
            '#2A1AA1',
            '#1AA12A',
            '#FFA12A',
            '#FFA12A',
          ].map((color, idx) => (
            <View
              key={idx}
              className="w-11 h-11 rounded-xl"
              style={{ backgroundColor: color }}
              onTouchEnd={() => setCardDetails({ ...cardDetails, color })}
            />
          ))}
        </View>
      </View>

      <View className="mt-[10em]">
        <ReusableButton
          text="Create virtual card"
          showArrow
          onPress={handleCreateCard}
          loading={isCreating}
          disabled={!cardDetails.cardholderName.trim()}
        />
      </View>
    </ScreenContainer>
  );
}

export default CreateCard;

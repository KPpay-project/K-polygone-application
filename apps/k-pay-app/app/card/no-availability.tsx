import { View, Image } from 'react-native';
import { Typography } from '@/components/ui';
import { ReusableButton } from '@/components/ui/button/reusable-button';
import { ScreenContainer } from '@/layout/safe-area-layout';
import { Link } from 'expo-router';
import { useState } from 'react';

function CardNotAvailable() {
  const [isJoining, setIsJoining] = useState(false);

  return (
    <ScreenContainer useSafeArea paddingHorizontal={16}>
      <View className="flex-1 justify-between">
        <View className="px-6 pt-[5rem] w-[318px] mx-auto text-center gap-4 ">
          <Image
            source={require('../../assets/no_card.png')}
            className="w-[100px] h-[100px] mx-auto mb-4"
            resizeMode="contain"
          />
          <Typography variant="h3" weight="600" className="text-center">
            Our Card aren’t available in Nigeria
          </Typography>
          <Typography className="text-center text-black/60">
            Join our wait list to be the first to hear when our card becomes
            available
          </Typography>
        </View>
        <View className=" items-center justify-center gap-3">
          <ReusableButton
            text="Join our waitlist"
            showArrow
            loading={isJoining}
          />
          <Link href={'/card/learn-more'}>
            <Typography className="text-underline">Learn more</Typography>
          </Link>
        </View>
      </View>
    </ScreenContainer>
  );
}
export default CardNotAvailable;

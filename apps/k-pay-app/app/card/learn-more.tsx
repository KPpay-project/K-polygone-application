import { HeaderWithTitle } from '@/components';
import { Typography } from '@/components/ui';
import { ReusableButton } from '@/components/ui/button/reusable-button';
import { ScreenContainer } from '@/layout/safe-area-layout';
import { Link } from 'expo-router';
import { CardAdd, CardRemove, BagCross } from 'iconsax-react-nativejs';
import { View } from 'react-native';
Link;
function LearnMoreScreen() {
  const items = [
    {
      icon: <CardAdd size={32} color="#4F8EF7" />,
      bg: 'bg-blue-100/40',
      title: 'Card Creation fee',
      value: '$4.00',
      valueClass: `text-green-500 bg-green-100 w-[51px] h-[22px] 
    rounded-xl flex items-center justify-center`,
    },
    {
      icon: <BagCross size={32} color="#F87171" />,
      bg: 'bg-red-100/30',
      title: 'Cross - border charges',
      desc: 'The use of your card will incure cross border charges',
    },
    {
      icon: <CardRemove size={32} color="#FBBF24" />,
      bg: 'bg-yellow-100/30',
      title: 'Card Termination',
      desc: 'Your card will be terminated whwn you have multiple failed transaction',
    },
  ];
  return (
    <ScreenContainer useSafeArea paddingHorizontal={16}>
      <HeaderWithTitle
        title="How it works"
        description="kindly review how our card works"
      />
      <View className="my-[3em]">
        <View className="space-y-9 gap-5 ">
          {items.map((item, idx) => (
            <View
              key={idx}
              className="border-[1px] border-gray-400/30 rounded-xl flex-row items-center gap-4 px-4 py-5"
            >
              <View
                className={`w-14 h-14 ${item.bg} rounded-full items-center justify-center`}
              >
                {item.icon}
              </View>
              <View className="flex-1">
                <Typography weight="600">{item.title}</Typography>
                {item.value && (
                  <View className={item.valueClass}>
                    <Typography variant="caption">{item.value}</Typography>
                  </View>
                )}
                {item.desc && <Typography color="gray">{item.desc}</Typography>}
              </View>
            </View>
          ))}
        </View>
        <View className="flex-row items-center mt-8 gap-2 w-[90%]">
          <View className="w-6 h-6 rounded-lg border-2 border-gray-900 items-center justify-center">
            <View className="w-4 h-4 rounded-sm bg-gray-900" />
          </View>
          <Typography className="text-base font-medium">
            Click the button below to accept{' '}
            <Typography color="red">Terms and conditions</Typography>
          </Typography>
        </View>
      </View>

      <View className="mt-10">
        <Link href="/card/create-card" asChild>
          <ReusableButton
            className="mt-4"
            text="Create virtual Card"
            showArrow
          />
        </Link>
      </View>
    </ScreenContainer>
  );
}

export default LearnMoreScreen;

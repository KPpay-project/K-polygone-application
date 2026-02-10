import { useState } from 'react';
import { Typography } from '@/components/ui';
import { View } from 'react-native';
import { DebitCard } from '@/components/card/debit-card';
import { ScreenContainer } from '@/layout/safe-area-layout';
import { ReusableButton } from '@/components/ui/button/reusable-button';
import { Copy } from 'iconsax-react-nativejs';
import * as Clipboard from 'expo-clipboard';
import { HeaderWithTitle } from '@/components';

function ViewCardDetails() {
  const [showDetails, setShowDetails] = useState(false);
  return (
    <ScreenContainer paddingHorizontal={16}>
      <HeaderWithTitle title="Card" showIcon={false} />
      <View className="mt-4">
        <DebitCard />
        {showDetails && (
          <View className="mt-6 space-y-4 gap-4 w-[50%] ml-4">
            {[
              { label: 'Card Number', value: '9105403011957133' },
              { label: 'Expiry Date', value: '12/25' },
              { label: 'CVV', value: '125' },
            ].map((item, idx) => (
              <View key={idx} className="mt-5">
                <View className="flex-row items-center justify-between">
                  <Typography weight="600">{item.label}</Typography>
                  <View className="w-6 h-6 rounded-full bg-gray-100 items-center justify-center">
                    <Copy
                      size={18}
                      color="#222"
                      onPress={() => Clipboard.setStringAsync(item.value)}
                    />
                  </View>
                </View>
                <Typography>{item.value}</Typography>
              </View>
            ))}
          </View>
        )}
        <View className="mt-5 w-1/2">
          <ReusableButton
            textColor="#000"
            iconColor="#000"
            className="!bg-brand-muted"
            size="sm"
            text={showDetails ? 'Hide card details' : 'Show Details'}
            showArrow
            onPress={() => setShowDetails((v) => !v)}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}
export default ViewCardDetails;

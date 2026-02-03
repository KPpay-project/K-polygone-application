import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { ScreenContainer } from '@/layout/safe-area-layout';
import { Typography } from '@/components/ui';

import { DebitCard } from '@/components/card/debit-card';
import { ReusableButton } from '@/components/ui/button/reusable-button';
import { Link } from 'expo-router';
import ViewCardDetails from 'app/card/view-card-details';
import CreateCard from 'app/card/create-card';
import CardNotAvailable from 'app/card/no-availability';
import CardIntro from 'app/card/card-intro';

export default function CardScreen() {
  const hasCardBefore = true;
  return (
    <ScreenContainer useSafeArea={true}>
      {/* <View className="px-6 py-4">
        <Typography variant="h5" color="#111827" weight="bold">
          {t('cards')}
        </Typography>
      </View> */}
      {/* {hasCardBefore ? <ViewCardDetails /> : <CardIntro />} */}

      <CardNotAvailable />
    </ScreenContainer>
  );
}

type issuer_type = 'master' | 'visa' | 'verve';
interface ICardProps {
  title?: string;
  status?: boolean;
  color?: string;
  type?: 'debit' | 'credit';
  issuer?: issuer_type;
  card_name?: string;
}

import { FC } from 'react';
import { View, Dimensions } from 'react-native';
import { Typography } from '../ui';
const DebitCard: FC<ICardProps> = ({
  title,
  color = '#2D42FE',
  card_name = 'Kpay card',
}: ICardProps) => {
  const { width } = Dimensions.get('window');
  return (
    <View
      style={{
        width: width - 32,
        height: 200,
      }}
      className="mx-auto bg-gray-300 p-2 rounded-3xl"
    >
      <View
        className="self-center w-full h-full rounded-2xl
        overflow-hidden p-5 justify-between"
        style={{
          backgroundColor: color,
        }}
      >
        <View className="w-12 h-9 bg-white/20 rounded-md" />
        <Typography
          color="white"
          weight="600"
          className="text-white font-medium text-base"
        >
          {card_name}
        </Typography>
      </View>
    </View>
  );
};

export { DebitCard };

import { Typography } from '@/components/sub-modules/typography/typography';
import { WalletIllustrationIcon } from 'k-polygon-assets/icons';
import { useTranslation } from 'react-i18next';

export const DataIsEmpty = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full flex items-center justify-center h-[50vh]">
      <div className="flex flex-col items-center gap-4">
        <WalletIllustrationIcon />

        <div className="text-center mt-8">
          <Typography variant="h3" className="text-gray-700 text-[18px] mb-3">
            {t('dashboard.card.noCardsFound')}
          </Typography>
          <Typography>{t('dashboard.card.noCardsDescription')}</Typography>
        </div>
      </div>
    </div>
  );
};

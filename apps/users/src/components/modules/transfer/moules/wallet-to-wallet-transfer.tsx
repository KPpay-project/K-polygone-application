import { Typography } from '@/components/sub-modules/typography/typography.tsx';
import { Input } from 'k-polygon-assets';

const WalletToWalletTransfer = () => {
  return (
    <>
      <div>
        <Typography className="text-sm font-medium text-gray-700 mb-2">{t('transfer.recipientEmail')}</Typography>
        <Input
          value={recipientEmail}
          onChange={(e) => setRecipientEmail(e.target.value)}
          placeholder={t('transfer.enterRecipientEmail')}
          className="w-full"
          autoComplete="email"
          name="recipientEmail"
          type="email"
        />
      </div>
      <div>
        <Typography className="text-sm font-medium text-gray-700 mb-2">{t('transfer.description')}</Typography>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t('transfer.enterDescription')}
          className="w-full"
          name="description"
        />
      </div>
    </>
  );
};

export default WalletToWalletTransfer;

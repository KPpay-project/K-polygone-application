/* eslint-disable */
import { ModularCard } from '@/components/sub-modules/card/card.tsx';
import { Badge } from '@/components/ui/badge';
import { copyToClipboard } from '@/utils/copy-to-clipboard.tsx';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { WalletInterfaceProps } from '../../../types/wallet.interface.ts';
import { CreateWalletAction } from '@/components/actions/create-wallet-action.tsx';
import { UserWalletCard } from '@/components/modules/wallet/users-wallet-panel.tsx';
import getSymbolFromCurrency from 'currency-symbol-map';
import { useGetMyWallets } from '@/hooks/api/use-wallet-queries.tsx';
import { WalletRemove } from 'iconsax-reactjs';
import { EmptyState } from '@/components/common/fallbacks/index.tsx';

const StatusList = () => {
  const { t } = useTranslation();
  const statusList = [
    { label: t('wallet.status.default'), color: 'bg-green-500/10 text-green-600' },
    { label: t('wallet.status.limit'), color: 'bg-red-500/10 text-red-600' }
  ];

  return (
    <div className="flex justify-center flex-wrap gap-2 sm:gap-4 mb-8 sm:mb-12 text-sm font-medium">
      {statusList.map(({ label, color }, index) => (
        <Badge key={index} className={`shadow-none rounded-lg ${color}`}>
          {label}
        </Badge>
      ))}
    </div>
  );
};

//@typescript-eslint/no-unused-vars
const StatusIndicator = () => <StatusList />;

const WalletPage: React.FC<WalletInterfaceProps> = () => {
  const { t } = useTranslation();
  const { data: userWalletsData, refetch } = useGetMyWallets();

  const wallets =
    userWalletsData?.myWallet?.map((wallet, idx) => {
      const balanceObj = wallet.balances?.[0];
      const currencyCode = wallet.currency?.code || 'USD';
      const amount = Number(balanceObj?.availableBalance) || 0;

      const rawSymbol = wallet.currency?.symbol || getSymbolFromCurrency(currencyCode);
      const symbol = rawSymbol ?? currencyCode.charAt(0);

      const color =
        currencyCode === 'ZMW'
          ? 'bg-yellow-600'
          : currencyCode === 'USD'
            ? 'bg-green-600'
            : currencyCode === 'XOF'
              ? 'bg-primary'
              : currencyCode === 'NGN'
                ? 'bg-blue-600'
                : currencyCode === 'XAF'
                  ? 'bg-purple-600'
                  : 'bg-gray-400';

      return {
        id: wallet.id || idx.toString(),
        label: currencyCode,
        symbol,
        amount,
        color,
        walletId: wallet.id
      };
    }) || [];

  const [showBalance, setShowBalance] = useState(true);
  const handleToggleBalance = () => setShowBalance((prev) => !prev);

  const walletLengh = wallets?.length;

  const WALLETISENOUGH = walletLengh >= 3;

  return (
    <ModularCard>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 sm:mb-12">
        <div className="flex items-center space-x-2 text-base sm:text-lg font-medium text-gray-900">
          <span>{t('wallet.title')}</span>
          <span className="text-gray-400 font-thin">|</span>
          <span className="text-black text-sm sm:text-base font-500">
            {t('wallet.totalWallets', { count: wallets.length })}
          </span>
        </div>
        <CreateWalletAction onSuccess={() => refetch()} isDisabled={WALLETISENOUGH} />
      </div>

      {wallets?.length === 0 ? (
        <div className="text-center py-8">
          <EmptyState
            icon={<WalletRemove variant="Bulk" size={80} />}
            title="No wallets found"
            description="You haven't added any wallets yet."
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {wallets.map((w, idx) => (
            <UserWalletCard
              key={w.id}
              wallet={{
                id: w.id,
                color: w.color,
                symbol: w.symbol,
                amount: w.amount as number,
                walletId: w.walletId
              }}
              index={idx}
              showBalance={showBalance}
              onToggleBalance={handleToggleBalance}
              onCopyWalletId={(id) => copyToClipboard(id, t('common.success'))}
              t={t}
            />
          ))}
        </div>
      )}
    </ModularCard>
  );
};

export default WalletPage;

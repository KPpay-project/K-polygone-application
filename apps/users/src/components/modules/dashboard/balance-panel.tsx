import { ModularCard } from '@/components/sub-modules/card/card.tsx';
import { motion } from 'framer-motion';
import { Copy, Eye, EyeOff, Plus } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { Button, Typography } from '@repo/ui';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from '@tanstack/react-router';
import { useCurrencyStore } from '@/store/currency-store';
import { useCurrencies } from '@/hooks/use-currencies';
import { formatCurrencyAmount } from '@/utils/currency-converter';
import { copyToClipboard } from '@/utils/copy-to-clipboard';
import { CreateWalletAction } from '@/components/actions/create-wallet-action';
import { UserWalletCard } from '@/components/modules/wallet/users-wallet-panel.tsx';
import { default as countryToCurrency } from 'country-to-currency';
import { useGetMyWallets } from '@/hooks/api';
import { useRouter } from '@tanstack/react-router';

import { EmptyState } from '@/components/common/fallbacks';
import { WalletRemove } from 'iconsax-reactjs';
import { cn } from '@/lib/utils';

export function BalancePanel() {
  const { data: userWalletsData, refetch } = useGetMyWallets();
  const navigate = useNavigate();
  const location = useLocation();

  const isDashboard = location.pathname === '/dashboard' || location.pathname === '/';

  const handleDepositSuccess = () => {
    refetch();
  };

  const handleWithdrawClick = () => {
    navigate({ to: '/withdrawals/money' });
  };

  const { t } = useTranslation();
  const [showBalance, setShowBalance] = useState(true);
  const [walletBalanceVisibility, setWalletBalanceVisibility] = useState<Record<string, boolean>>({});
  const { selectedCurrency } = useCurrencyStore();
  const { getCurrencySymbol } = useCurrencies();

  const wallets =
    userWalletsData?.myWallet?.map((wallet, idx) => {
      const balanceObj = wallet.balances?.[0];
      const currencyCode = (wallet.currency?.code || 'USD').toUpperCase();
      const amount = Number(balanceObj?.availableBalance) || 0;
      const walletId = wallet.id || String(idx);

      if (walletBalanceVisibility[String(walletId)] === undefined) {
        setWalletBalanceVisibility((prev) => ({ ...prev, [String(walletId)]: true }));
      }

      const meta = (countryToCurrency as any)?.currencies?.[currencyCode];
      const symbol: string =
        wallet.currency?.symbol ||
        (meta?.symbol as string) ||
        (meta?.sign as string) ||
        getCurrencySymbol(currencyCode) ||
        currencyCode.charAt(0);

      const label: string = (meta?.name as string) || (meta?.currency as string) || currencyCode;

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

      const textColor =
        currencyCode === 'ZMW'
          ? 'text-yellow-600'
          : currencyCode === 'USD'
            ? 'text-green-600'
            : currencyCode === 'XOF'
              ? 'text-primary'
              : currencyCode === 'NGN'
                ? 'text-blue-600'
                : currencyCode === 'XAF'
                  ? 'text-purple-600'
                  : 'text-gray-400';

      return {
        id: walletId,
        symbol,
        code: currencyCode,
        label,
        amount,
        color,
        textColor,
        walletId: wallet.id,
        dailyLimit: wallet.dailyLimit,
        monthlyLimit: wallet.monthlyLimit,
        status: wallet.status,
        isFrozen: wallet.isFrozen,
        ownerType: wallet.ownerType
      };
    }) || [];

  const selectedCode = (selectedCurrency || 'USD').toUpperCase();

  const selectedWallet = useMemo(() => {
    return wallets.find((w) => (w.code || '').toUpperCase() === selectedCode);
  }, [wallets, selectedCode]);

  const selectedAmount = selectedWallet ? Number(selectedWallet.amount) || 0 : 0;

  const currencySymbol = getCurrencySymbol(selectedCode) || '$';

  const displayedBalance = showBalance ? formatCurrencyAmount(selectedAmount, selectedCode, currencySymbol) : '****';

  const handleCopyWalletId = (walletId: string) => {
    copyToClipboard(walletId, 'Wallet ID copied to clipboard');
  };

  const handleToggleAllWallets = () => {
    const newShowBalance = !showBalance;
    setShowBalance(newShowBalance);

    const updatedVisibility: Record<string, boolean> = {};
    wallets.forEach((wallet) => {
      updatedVisibility[String(wallet.id)] = newShowBalance;
    });
    setWalletBalanceVisibility(updatedVisibility);
  };

  const handleToggleWalletBalance = (walletId: string) => {
    setWalletBalanceVisibility((prev) => ({
      ...prev,
      [walletId]: !prev[walletId]
    }));
  };

  const walletLenght = wallets?.length;
  const router = useRouter();
  return (
    <ModularCard
      title={
        <Typography variant={'h6'} className="text-[#444] font-light">
          {t('balance.totalBalance')}
        </Typography>
      }
      className={'w-full '}
    >
      <div className="flex items-center justify-between mb-6" data-tour="total-balance">
        <div className="flex items-center gap-3 ">
          <motion.div
            key={displayedBalance + 'balance'}
            className=" font-bold text-[#444444]"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.2 }}
          >
            <Typography variant={'h2'} className="font-semibold">
              {displayedBalance}
            </Typography>
          </motion.div>
          <button
            onClick={handleToggleAllWallets}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            title={showBalance ? t('balance.hideBalance') : t('balance.showBalance')}
          >
            {showBalance ? <Eye size={20} className="text-gray-500" /> : <EyeOff size={20} className="text-gray-500" />}
          </button>
        </div>
        {/* 
        <WalletCurrenciesDropDown /> */}
      </div>

      <div className="flex gap-3 mb-6" data-tour="balance-actions">
        <Button onClick={handleWithdrawClick}>
          <Plus size={16} />
          {t('balance.withdraw')}
        </Button>
        <Button variant={'outline'} onClick={() => router.navigate({ to: '/deposit' })}>
          <Plus size={16} />
          {t('balance.deposit')}
        </Button>
      </div>

      <div className="bg-gray-50 rounded-xl px-5 py-10 pt-[22px]" data-tour="wallets-header">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm flex gap-[8px] items-center font-normal text-gray-700">
            <span>{t('balance.wallet')}</span> <span>|</span>
            <b> {t('balance.totalWallets', { count: wallets.length })}</b>
          </h3>

          <div data-tour="create-wallet-btn">
            <CreateWalletAction onSuccess={handleDepositSuccess} isDisabled={walletLenght > 3} />
          </div>
        </div>

        <div className={cn(wallets.length > 1 && 'grid grid-cols-1 md:grid-cols-3 gap-4')}>
          {wallets.length === 0 && (
            <div className="flex w-full items-center justify-center py-12">
              <EmptyState
                icon={<WalletRemove variant="Bulk" size={80} />}
                title="No wallets found"
                description="You haven't added any wallets yet."
              />
            </div>
          )}

          {wallets.length === 1 && (
            <div key={wallets[0].id} className="bg-white rounded-xl p-4 border border-gray-100 max-w-md ">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 ${wallets[0].color} rounded-full flex items-center justify-center`}>
                    <span className="text-white text-xs font-bold">{wallets[0].symbol}</span>
                  </div>
                  <span className="font-medium text-gray-800">{wallets[0].label}</span>
                </div>
              </div>

              <div className="mb-3 flex items-center">
                <motion.div
                  key={`balance-${wallets[0].id}`}
                  className="text-2xl font-semibold text-gray-900"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {walletBalanceVisibility[String(wallets[0].id)] ? wallets[0].amount.toLocaleString() : '****'}
                </motion.div>

                <button
                  className="p-1 hover:bg-gray-100 rounded-full inline-flex ml-2"
                  onClick={() => handleToggleWalletBalance(String(wallets[0].id))}
                >
                  {walletBalanceVisibility[String(wallets[0].id)] ? (
                    <Eye size={16} className="text-gray-400" />
                  ) : (
                    <EyeOff size={16} className="text-gray-400" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{t('balance.walletId', { id: wallets[0].walletId })}</span>
                <button className="hover:text-gray-700" onClick={() => handleCopyWalletId(wallets[0].walletId || '')}>
                  <Copy size={12} />
                </button>
              </div>

              <div className="mt-4">
                <span className="inline-block bg-green-100/30 text-green-500 text-xs px-2 py-1 rounded-full">
                  {t('balance.default')}
                </span>
              </div>
            </div>
          )}

          {wallets?.length > 1 &&
            (isDashboard ? wallets.slice(0, 3) : wallets).map((wallet, index) => (
              <UserWalletCard
                key={wallet.id}
                wallet={wallet}
                index={index}
                showBalance={walletBalanceVisibility[String(wallet.id)] ?? true}
                onToggleBalance={() => handleToggleWalletBalance(String(wallet.id))}
                onCopyWalletId={handleCopyWalletId}
                t={t}
              />
            ))}
          {isDashboard && wallets.length > 3 && (
            <div className="col-span-1 md:col-span-3 flex justify-center mt-4">
              <button
                onClick={() => navigate({ to: '/wallet' })}
                className="text-primary hover:text-primary/80 font-medium text-sm flex items-center gap-1"
              >
                See more
              </button>
            </div>
          )}
        </div>
      </div>
    </ModularCard>
  );
}

import { ModularCard } from '@/components/sub-modules/card/card.tsx';
import { CurrencyDropdown } from '@/components/shared/currency-dropdown';
import { DepositAction } from '@/components/actions/deposit-action';
import { WithdrawAction } from '@/components/actions/withdraw-action';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import { Copy, Eye, EyeOff, Plus } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCurrencyStore } from '@/store/currency-store';
import { useCurrencies } from '@/hooks/use-currencies';
import { convertCurrency, formatCurrencyAmount } from '@/utils/currency-converter';
import { copyToClipboard } from '@/utils/copy-to-clipboard';
import { CardReceive } from 'iconsax-reactjs';

const wallets = [
  {
    id: 1,
    icon: <img src={'./zmw.svg'} className="size-full" />,
    symbol: 'ZMW',
    amount: 1000,
    color: 'bg-yellow-600',
    textColor: 'text-yellow-600',
    walletId: 'NAOO7908ZMW1234'
  },
  {
    id: 2,
    icon: <img src={'./dollar.svg'} className="size-full" />,
    symbol: 'USD',
    amount: 2009,
    color: 'bg-green-600',
    textColor: 'text-green-600',
    walletId: 'NAOO5432USD9876'
  },
  {
    id: 3,
    icon: <img src={'./xoff.svg'} className="size-full" />,
    symbol: 'XOF',
    amount: 7890,
    color: 'bg-primary',
    textColor: 'text-primary',
    walletId: 'NAOO2341XOF5678'
  }
];

export function BalancePanel() {
  const { t } = useTranslation();
  const [showBalance, setShowBalance] = useState(true);
  const { selectedCurrency } = useCurrencyStore();
  const { getCurrencySymbol } = useCurrencies();

  const totalBalanceUSD = wallets.reduce((sum, wallet) => {
    const convertedAmount = convertCurrency(wallet.amount, wallet.symbol, 'USD');
    return sum + convertedAmount;
  }, 0);

  const totalBalanceInSelectedCurrency = convertCurrency(totalBalanceUSD, 'USD', selectedCurrency);
  const currencySymbol = getCurrencySymbol(selectedCurrency);
  const displayedBalance = showBalance
    ? formatCurrencyAmount(totalBalanceInSelectedCurrency, selectedCurrency, currencySymbol)
    : '****';

  const handleCopyWalletId = (walletId: string) => {
    copyToClipboard(walletId, 'Wallet ID copied to clipboard');
  };
  return (
    <ModularCard
      title={<h3 className="text-[18px] text-[#444] font-light">{t('balance.totalBalance')}</h3>}
      className={'w-full h-full'}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3 ">
          <motion.div
            key={displayedBalance + 'balance'}
            className="text-[32px]  font-bold text-[#444444]"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.2 }}
          >
            {displayedBalance}
          </motion.div>
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            title={showBalance ? t('balance.hideBalance') : t('balance.showBalance')}
          >
            {showBalance ? <Eye size={20} className="text-gray-500" /> : <EyeOff size={20} className="text-gray-500" />}
          </button>
        </div>

        <CurrencyDropdown />
      </div>

      <div className="flex gap-3 mb-6">
        <WithdrawAction
          walletId={wallets[0].walletId}
          currencyCode={wallets[0].symbol}
          buttonIcon={<CardReceive size={20} />}
        />
        <Dialog>
          <DialogTrigger asChild>
            <button className="border border-primary text-primary hover:bg-blue-50 px-6 py-2.5 rounded-[12px] font-light transition-colors flex items-center gap-2">
              <Plus size={16} />
              {t('balance.deposit')}
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t('balance.deposit')}</DialogTitle>
            </DialogHeader>
            <DepositAction walletId={wallets[0].walletId} currencyCode={wallets[0].symbol} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-gray-50 rounded-xl px-5 py-10 pt-[22px]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm flex gap-[8px] items-center font-normal text-gray-700">
            <span>{t('balance.wallet')}</span> <span>|</span>
            <b> {t('balance.totalWallets', { count: wallets.length })}</b>
          </h3>
          <button
            className="text-primary bg-primary/10
           border-[1px] rounded-2xl border-primary py-3 hover:bg-blue-50 px-3 py-1 text-sm font-medium transition-colors flex items-center gap-1"
          >
            <Plus size={14} />
            {t('balance.createWallet')}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {wallets.map((wallet, index) => (
            <div key={wallet.id} className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 ${wallet.color} rounded-full flex items-center justify-center`}>
                    {wallet.icon || <span className="text-white text-xs font-bold">{wallet.symbol.charAt(0)}</span>}
                  </div>
                  <span className="font-medium text-gray-800">{wallet.symbol}</span>
                </div>
                <button className="p-1 hover:bg-gray-100 rounded-full">
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>
              </div>

              <div className="mb-3 flex">
                <motion.div
                  key={`balance-${wallet.id}`}
                  className="text-2xl font-semibold text-gray-900"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {showBalance ? wallet.amount.toLocaleString() : '****'}
                </motion.div>
                <button className="p-1 hover:bg-gray-100 rounded-full inline-flex ml-2">
                  {showBalance ? (
                    <Eye size={16} className="text-gray-400" />
                  ) : (
                    <EyeOff size={16} className="text-gray-400" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{t('balance.walletId', { id: wallet.walletId })}</span>
                <button className="hover:text-gray-700" onClick={() => handleCopyWalletId(wallet.walletId)}>
                  <Copy size={12} />
                </button>
              </div>

              {index === 0 && (
                <div className="mt-[16px]">
                  <span className="inline-block bg-green-100/30 text-green-500 text-xs px-2 py-1 rounded-full">
                    {t('balance.default')}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </ModularCard>
  );
}

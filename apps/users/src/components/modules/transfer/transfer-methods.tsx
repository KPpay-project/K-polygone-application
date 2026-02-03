import React, { useState, useMemo } from 'react';
import { Typography } from '@/components/sub-modules/typography/typography';
import { cn } from '@/lib/utils';
import { TransferMethod, SavedCard } from './transfer-money';
import { TRANSFER_METHOD_ENUM } from '@/enums';
import { Building2 as Bank, Check, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SupportedProviders } from '@repo/types';
import { SelectProviderPannel } from '@/components/modules/transfer/select-provider-pannel.tsx';
import { TRANSFER_PROVIDERS_ARRAY } from '@/constant';

const IconCard = ({ type }: { type: string }) => {
  if (type === 'mastercard') {
    return (
      <div className="w-8 h-6 rounded-md flex items-center justify-center">
        <div className="flex">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-orange-400 rounded-full -ml-1"></div>
        </div>
      </div>
    );
  }
  return (
    <div className="w-8 h-6 bg-blue-600 rounded-md flex items-center justify-center">
      <span className="text-white text-xs font-bold">VISA</span>
    </div>
  );
};

const TransferOption = ({
  icon,
  title,
  description,
  isSelected,
  onClick
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
}) => (
  <div
    onClick={onClick}
    className={cn(
      'p-4 border rounded-xl cursor-pointer transition-all relative',
      isSelected ? 'border-primary-strokeFade bg-[#0022FF]/5' : 'border-gray-200 hover:border-gray-300'
    )}
  >
    <div className="flex items-start space-x-3">
      <div
        className={cn(
          'w-12 h-12 rounded-full border-2 flex items-center justify-center mt-1',
          isSelected ? 'bg-blue-100 border-blue-500' : 'bg-gray-100 border-gray-300'
        )}
      >
        {React.cloneElement(icon as React.ReactElement, {
          className: cn('w-6 h-6', isSelected ? 'text-blue-600' : 'text-gray-500')
        })}
      </div>
      <div className="flex-1">
        <Typography className="font-semibold text-gray-900 mb-1">{title}</Typography>
        <Typography className="text-sm text-gray-500 leading-relaxed">{description}</Typography>
      </div>
      <div
        className={cn(
          'absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center',
          isSelected ? 'bg-blue-600' : 'bg-gray-400'
        )}
      >
        <Check className="w-3 h-3 text-white" />
      </div>
    </div>
  </div>
);

const SearchBar = ({
  value,
  onChange,
  placeholder
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) => (
  <div className="relative">
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
  </div>
);

const SavedCardItem = ({
  card,
  isSelected,
  isDisabled,
  onSelect
}: {
  card: SavedCard;
  isSelected: boolean;
  isDisabled: boolean;
  onSelect: () => void;
}) => {
  const { t } = useTranslation();
  const disabled = isDisabled ? 'opacity-50 cursor-not-allowed bg-gray-50 border-gray-200' : '';
  const selected = isSelected && !isDisabled ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300';
  const checkColor = isSelected && !isDisabled ? 'bg-blue-600' : 'bg-gray-400';

  return (
    <div
      onClick={!isDisabled ? onSelect : undefined}
      className={cn('p-4 border rounded-xl transition-all relative', disabled || selected)}
    >
      <div className="flex items-start space-x-3">
        <div
          className={cn(
            'w-12 h-12 rounded-full border-2 flex items-center justify-center mt-1',
            isSelected && !isDisabled ? 'bg-blue-100 border-blue-500' : 'bg-gray-100 border-gray-300'
          )}
        >
          <IconCard type={card.type} />
        </div>
        <div className="flex-1">
          <Typography className="font-semibold text-gray-900 mb-1">
            {t('transfer.cardEndingIn', { lastFour: card.lastFour })}
          </Typography>
          <Typography className="text-sm text-gray-500">{t('transfer.expiryDate')}</Typography>
        </div>
        <div className={cn('absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center', checkColor)}>
          <Check className="w-3 h-3 text-white" />
        </div>
      </div>
    </div>
  );
};

interface TransferMethodsProps {
  selectedMethod: TransferMethod;
  onMethodSelect: (m: TransferMethod) => void;
  selectedCard: string | null;
  onCardSelect: (id: string | null) => void;
  savedCards: SavedCard[];
  onWalletSelect?: () => void;
  selectedProvider: SupportedProviders | null;
  onProviderSelect: (p: SupportedProviders) => void;
}

export const TransferMethods: React.FC<TransferMethodsProps> = ({
  selectedMethod,
  onMethodSelect,
  selectedCard,
  onCardSelect,
  savedCards,
  selectedProvider,
  onProviderSelect
}) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCards = useMemo(
    () =>
      savedCards.filter((card) =>
        [card.holderName.toLowerCase(), card.lastFour].some((val) => val.includes(searchQuery.toLowerCase()))
      ),
    [savedCards, searchQuery]
  );

  const transferOptions = [
    {
      id: TRANSFER_METHOD_ENUM.BANK,
      icon: <Bank />,
      title: t('transfer.payWithBankTransfer'),
      description: t('transfer.bankTransferDescription')
    },
    {
      id: TRANSFER_METHOD_ENUM.PROVIDERS,
      icon: <Bank />,
      title: 'Mobile Money',
      description: 'Send money to a new recipient or beneficiary through Mobile Money'
    },
    // {
    //   id: TRANSFER_METHOD_ENUM.CARD,
    //   icon: (
    //     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    //       <path
    //         strokeLinecap="round"
    //         strokeLinejoin="round"
    //         strokeWidth={2}
    //         d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
    //       />
    //     </svg>
    //   ),
    //   title: t('transfer.payWithCard'),
    //   description: t('transfer.bankTransferDescription')
    // },
    {
      id: TRANSFER_METHOD_ENUM.KPAY,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
      title: t('transfer.transferToKpayUser'),
      description: t('transfer.kpayUserDescription')
    }
  ] as const;

  return (
    <div className="space-y-6 p-6">
      {selectedMethod === TRANSFER_METHOD_ENUM.CARD && (
        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder={t('transfer.searchCards')} />
      )}

      <div className="space-y-4">
        {transferOptions.map(({ id, icon, title, description }) => (
          <TransferOption
            key={id}
            icon={icon}
            title={title}
            description={description}
            isSelected={selectedMethod === id}
            onClick={() => onMethodSelect(id as TransferMethod)}
          />
        ))}
      </div>

      {selectedMethod === TRANSFER_METHOD_ENUM.CARD && (
        <div className="space-y-3">
          {filteredCards.map((card) => (
            <SavedCardItem
              key={card.id}
              card={card}
              isSelected={selectedCard === card.id}
              isDisabled={false}
              onSelect={() => onCardSelect(selectedCard === card.id ? null : card.id)}
            />
          ))}
        </div>
      )}

      {selectedMethod === TRANSFER_METHOD_ENUM.PROVIDERS && (
        <div className="mt-4 grid gap-4">
          {TRANSFER_PROVIDERS_ARRAY.map((provider) => (
            <SelectProviderPannel
              key={provider.key}
              name={provider.label}
              description={provider.description}
              imgSource={provider.logo}
              onClick={() => onProviderSelect(provider.key)}
              className={cn(
                selectedProvider === provider.key ? 'bg-blue-50 border-none' : 'border-gray-200 hover:border-gray-300'
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
};

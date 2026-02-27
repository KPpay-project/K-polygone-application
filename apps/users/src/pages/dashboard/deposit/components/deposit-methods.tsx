import { ModularCard } from '@/components/sub-modules/card/card';
import { Money, WalletMoney, Convertshape2 } from 'iconsax-reactjs';
import { DepositOption } from './deposit-option';
import { useTranslation } from 'react-i18next';
import { DepositMethodKey } from '../methods';
import { DEPOSITE_METHOD_ENUM } from '@/enums';

interface DepositMethodsProps {
  selectedMethod?: DepositMethodKey;
  onMethodSelect?: (method: DepositMethodKey) => void;
}

export const DepositMethods = ({
  selectedMethod = DEPOSITE_METHOD_ENUM.PROVIDERS,
  onMethodSelect
}: DepositMethodsProps) => {
  const { t } = useTranslation();
  const isDev = import.meta.env.DEV;

  const methods: Array<{
    key: DepositMethodKey;
    icon: JSX.Element;
    title: string;
    description: string;
    isAvailable: boolean;
  }> = [
    {
      key: DEPOSITE_METHOD_ENUM.BANK,
      icon: <Money size={20} />,
      title: 'Bank Deposit',
      description: 'Fund your account by sending money to your unique bank account',
      isAvailable: true
    },
    {
      key: DEPOSITE_METHOD_ENUM.CARD,
      icon: <Convertshape2 size={20} />,
      title: 'Add via Card',
      description: 'Use your debit or credit card to fund your account instantly',
      isAvailable: isDev
    },
    {
      key: DEPOSITE_METHOD_ENUM.PROVIDERS,
      icon: <WalletMoney size={20} />,
      title: 'Mobile Money Deposit',
      description: 'Deposit to our partner merchant',
      isAvailable: true
    },
    {
      key: DEPOSITE_METHOD_ENUM.KPAY,
      icon: <WalletMoney size={20} />,
      title: 'Add via KPay',
      description: 'Deposit through our KPay provider',
      isAvailable: false
    }
  ];

  return (
    <div className="w-full">
      <ModularCard title={t('wallet.deposit.depositMoney')} className="h-fit px-4">
        <div className="space-y-4">
          {methods
            .filter((m) => m.isAvailable)
            .map((m) => (
              <DepositOption
                key={m.key}
                icon={m.icon}
                title={m.title}
                description={m.description}
                isSelected={selectedMethod === m.key}
                onClick={() => onMethodSelect?.(m.key)}
              />
            ))}
        </div>
      </ModularCard>
    </div>
  );
};

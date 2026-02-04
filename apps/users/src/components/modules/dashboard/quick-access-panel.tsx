import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CardReceive, MoneyChange, People, WalletAdd } from 'iconsax-reactjs';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';

const useQuickAccessItems = () => {
  const { t } = useTranslation();

  return [
    {
      icon: WalletAdd,
      label: t('dashboard.quickAccess.deposit'),
      bgColor: 'bg-[#1846E2]/10',
      iconColor: 'text-[#1846E2]',
      route: '/deposit'
    },
    {
      icon: CardReceive,
      label: t('dashboard.quickAccess.withdraw'),
      bgColor: 'bg-[#16A34A]/10',
      iconColor: 'text-[#16A34A]',
      route: '/withdrawals/money'
    },
    {
      icon: MoneyChange,
      label: t('dashboard.quickAccess.exchange'),
      bgColor: 'bg-[#CA8A04]/10',
      iconColor: 'text-[#CA8A04]',
      route: '/exchange'
    },
    {
      icon: MoneyChange,
      label: t('dashboard.quickAccess.transfer'),
      bgColor: 'bg-[#DC2626]/10',
      iconColor: 'text-[#DC2626]',
      route: '/transfer'
    },
    {
      icon: People,
      label: t('dashboard.quickAccess.beneficiary'),
      bgColor: 'bg-[#4B5563]/10',
      iconColor: 'text-[#4B5563]',
      route: '/withdrawals/beneficiaries'
    }
  ];
};

const QuickAccessPanel = () => {
  const { t } = useTranslation();
  const quickAccessItems = useQuickAccessItems();
  const navigate = useNavigate();

  const handleItemClick = (route: string) => {
    navigate({ to: route });
  };

  return (
    <Card className="p-4 shadow-none border-0">
      <CardHeader className="p-0 mb-4">
        <CardTitle className="text-lg font-medium text-gray-900 dark:text-white">
          {t('dashboard.quickAccess.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {quickAccessItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <button
                key={index}
                onClick={() => handleItemClick(item.route)}
                className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors focus:outline-none"
              >
                <div className={`p-3 rounded-xl ${item.bgColor}`}>
                  <IconComponent className={`w-5 h-5 ${item.iconColor}`} />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center leading-tight">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export { QuickAccessPanel };
export default QuickAccessPanel;

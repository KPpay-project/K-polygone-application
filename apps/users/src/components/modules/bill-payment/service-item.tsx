import { useTranslation } from 'react-i18next';
import { BillPaymentService } from '@/data/bill-payment-services';

interface ServiceItemProps {
  item: BillPaymentService;
  onClick?: (serviceId: string) => void;
  isSelected?: boolean;
}

export const ServiceItem = ({ item, onClick, isSelected = false }: ServiceItemProps) => {
  const { t } = useTranslation();
  const Icon = item.icon;

  const handleClick = () => {
    onClick?.(item.id);
  };

  const isActive = isSelected ?? item.active;

  return (
    <div className="cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95" onClick={handleClick}>
      <div
        className={`
          text-center rounded-2xl p-3 sm:p-4 h-[90px] sm:h-[100px] flex flex-col justify-center items-center
          border-2 transition-all duration-200 
          ${isActive ? 'border-current' : 'border-transparent hover:shadow-sm'}
        `}
        style={{
          backgroundColor: item.bgColor,
          borderColor: isActive ? item.color : undefined
        }}
      >
        <div className="w-8 h-8 sm:w-10 sm:h-10 mb-2 flex items-center justify-center">
          <Icon size={20} variant="Outline" style={{ color: item.color }} />
        </div>
        <p className="text-xs sm:text-sm font-medium leading-tight text-center" style={{ color: item.color }}>
          {t(item.labelKey)}
        </p>
      </div>
    </div>
  );
};

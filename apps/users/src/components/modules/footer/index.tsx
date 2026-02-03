import { LanguageSwitcher } from '@/components/language-switcher';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

export function Footer({ sticky }: { sticky?: boolean }) {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        sticky && 'absolute bottom-0  left-0',
        'py-[18px] pl-[42px] pr-[85px] bg-[#FDFFFC] flex items-center justify-between w-full bsg-whsite h-[56px]'
      )}
    >
      <p>{t('footer.copyright')}</p>
      <div>
        <LanguageSwitcher />
      </div>
    </div>
  );
}

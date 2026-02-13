import { LanguageSwitcher } from '@/components/language-switcher';
import { cn } from '@/lib/utils';
import { Typography } from '@repo/ui';
import { useTranslation } from 'react-i18next';

export function Footer({ sticky }: { sticky?: boolean }) {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        sticky && 'absolute bottom-0  left-0',
        'py-[18px] pl-[42px] pr-[85px] bg-transparent flex items-center justify-between w-full bsg-whsite h-[56px]'
      )}
    >
      <Typography variant={'small'} className="text-gray-600 font-normal">
        {/* {t('footer.copyright')} */}
      </Typography>
      <div>
        <LanguageSwitcher />
      </div>
    </div>
  );
}

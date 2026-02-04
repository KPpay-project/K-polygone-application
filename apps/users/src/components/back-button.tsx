import { useRouter } from '@tanstack/react-router';
import { t } from 'i18next';
import { IconChevronLeft } from 'k-polygon-assets';

export function BackButton() {
  const router = useRouter();

  return (
    <button className="mb-[32px] gap-[9px] flex items-center text-[#161414]/60" onClick={() => router.history.go(-1)}>
      <IconChevronLeft />
      <p>{t('common.back')}</p>
    </button>
  );
}

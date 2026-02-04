import CircularProgressBar from '@/components/shared/ui/progress/circular-progress';
import { Typography } from '@/components/sub-modules/typography/typography';
import { useTranslation } from 'react-i18next';

interface StepIndicatorProps {
  steps: number;
  currentStep: number;
  title: string;
}

export function StepIndicator({ steps, currentStep, title }: StepIndicatorProps) {
  const { t } = useTranslation();
  const completion = (currentStep / steps) * 100;

  return (
    <div className="flex flex-row items-center gap-[16px]">
      <div className="flex flex-col gap-1 text-right">
        <Typography className="text-[#6C727F]">
          {t('common.step')} {currentStep}/{steps}
        </Typography>
        <p className="text-sm font-medium">{title}</p>
      </div>

      <CircularProgressBar percentage={completion} size={30} strokeWidth={3} />
    </div>
  );
}

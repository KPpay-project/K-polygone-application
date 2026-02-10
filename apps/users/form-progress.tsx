import CircularProgressBar from '@/components/shared/ui/progress/circular-progress';
import { Typography } from '@/components/sub-modules/typography/typography';

export function FormProgress({ steps, currentStep, title }: { steps: number; currentStep: number; title: string }) {
  const completion = (currentStep / steps) * 100;
  return (
    <div className="flex flex-row items-center gap-[16px]">
      <div className="flex flex-col gap-1 text-right">
        <Typography className="text-[#6C727F]">
          STEP {currentStep}/{steps}
        </Typography>
        <p className="text-sm font-medium">{title}</p>
      </div>

      <CircularProgressBar percentage={completion} size={30} strokeWidth={3} />
    </div>
  );
}

import { FormProgress } from '@/components/common/forms/form-progress.tsx';

interface DashboardSubHeaderProps {
  title?: string;
  content?: string;
  steps?: number;
  currentStep?: number;
  progressTitle?: string;
}

const DashboardSubHeader = ({
  title,
  content,
  steps = 0,
  currentStep = 0,
  progressTitle = ''
}: DashboardSubHeaderProps) => (
  <div>
    <FormProgress steps={steps} currentStep={currentStep} title={progressTitle} />
    <div className={'mt-2'}>
      {title && <h4 className="text-lg font-semibold">{title}</h4>}
      {content && <p>{content}</p>}
    </div>
  </div>
);

export { DashboardSubHeader };

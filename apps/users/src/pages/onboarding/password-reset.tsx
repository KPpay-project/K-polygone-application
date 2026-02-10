import OnboardingLayout from '@/components/layouts/onboarding-layout';
import { useNavigate } from '@tanstack/react-router';
import { Button } from 'k-polygon-assets/components';
import { IconArrowRight } from 'k-polygon-assets/icons';
import { useTranslation } from 'react-i18next';

function PasswordReset() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <OnboardingLayout
      title={t('auth.passwordResetSuccess.title')}
      description={t('auth.passwordResetSuccess.description')}
      canGoBack
      className="!items-start"
    >
      <div className="space-y-4">
        <Button
          type="submit"
          className="w-full mt-[0] bg-primary hover:bg-brandBlue-600"
          icon={<IconArrowRight />}
          onClick={() => {
            navigate({
              to: '/dashboard'
            });
          }}
        >
          {t('auth.passwordResetSuccess.continueToLogin')}
        </Button>
      </div>
    </OnboardingLayout>
  );
}

export default PasswordReset;

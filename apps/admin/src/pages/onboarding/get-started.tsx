import OnboardingLayout from '@/components/layouts/onboarding-layout';
import { Link, useNavigate } from '@tanstack/react-router';
import { ArrowRight, ProfileCircle } from 'iconsax-reactjs';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type AccountType = 'user' | 'merchant';

function GetStarted() {
  const { t } = useTranslation();
  const [selectedAccount, setSelectedAccount] = useState<AccountType>('user');
  const navigate = useNavigate();

  const accountTypes = [
    {
      id: 'user' as AccountType,
      title: t('onboarding.getStarted.user.title'),
      description: t('onboarding.getStarted.user.description'),
      icon: ProfileCircle
    }
    // {
    //   id: 'merchant' as AccountType,
    //   title: t('onboarding.getStarted.merchant.title'),
    //   description: t('onboarding.getStarted.merchant.description'),
    //   icon: Settings
    // }
  ];

  return (
    <OnboardingLayout
      title={t('onboarding.getStarted.title')}
      description={t('onboarding.getStarted.description')}
      className="!items-end"
    >
      <div className="space-y-4 max-w-md">
        {accountTypes.map((account) => {
          const Icon = account.icon;
          const isSelected = selectedAccount === account.id;

          return (
            <div
              key={account.id}
              onClick={() => {
                navigate({ to: '/onboarding/login' });
                setSelectedAccount(account.id);
              }}
              className={`
                relative p-4 rounded-[6px] border-[1px] cursor-pointer transition-all duration-200
                ${isSelected ? 'border-primary  bg-gray-50' : 'border-gray-200 bg-white hover:border-gray-300'}
              `}
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`
                  w-12 h-12 rounded-[10px] flex items-center border-[1px] justify-center
                  ${isSelected ? 'bg-primary' : ''}
                `}
                >
                  <Icon className="w-6 h-6 text-white " />
                </div>

                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 text-sm">{account.title}</h3>
                  <p className="text-gray-600 text-xs  mt-1 max-w-[60%]">{account.description}</p>
                </div>

                {isSelected && (
                  <div className="absolute top-0 right-0 h-full flex items-center p-[18px]">
                    <ArrowRight size={20} />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-[326px]">
        <p className="text-center text-sm text-gray-600 mb-[70px]">
          {t('auth.createAccount.alreadyHaveAccount')}{' '}
          <Link to="/onboarding/login" className="text-primary font-medium hover:underline">
            {t('auth.createAccount.signIn')}
          </Link>
        </p>
      </div>
    </OnboardingLayout>
  );
}

export default GetStarted;

import { Typography } from '@/components/sub-modules/typography/typography';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, DirectNormal, SecuritySafe, Sms } from 'iconsax-reactjs';
import DefaultModal from '@/components/sub-modules/popups/modal';
import ChanglePasswordAction from '@/components/actions/settings-actions/change-password';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge.tsx';

const SettingsSecurity = () => {
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const authOptions = [
    {
      id: 'app',
      title: 'Set up using an authentication app',
      description: 'Use an authenticator app to get your authentication codes',
      icon: <SecuritySafe size={20} className="text-blue-700" />,
      recommended: true,
      path: '/settings/security/app'
    },
    {
      id: 'sms',
      title: 'Set up using SMS',
      description: 'Use SMS to get your authentication codes',
      icon: <Sms size={20} className="text-blue-700" />,
      path: '/settings/security/sms'
    },
    {
      id: 'email',
      title: 'Set up using Email',
      description: 'Use your email to get your authentication codes',
      icon: <DirectNormal size={20} className="text-blue-700" />,
      path: '/settings/security/email'
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden shadow-none rounded-2xl">
        <CardContent className="p-6">
          <div className="flex flex-col space-y-2">
            <Typography variant="h3" className="!text-lg font-semibold">
              Password Reset
            </Typography>
            <Typography variant="small" className="text-gray-500">
              Change your password at any time
            </Typography>
          </div>
          <div className="mt-4">
            <Button
              variant="outline"
              className="text-red-600 border-red-500 border-none shadow-none hover:text-red-600 flex items-center gap-2"
              onClick={() => setIsChangePasswordModalOpen(true)}
            >
              Change Password <ArrowRight />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden shadow-none rounded-2xl">
        <CardContent className="p-6">
          <div className={'flex justify-between items-center '}>
            <div className="flex flex-col space-y-2">
              <Typography variant="h3" className="!text-lg font-semibold">
                2-Factor Authentication
              </Typography>
              <Typography variant="small" className="text-gray-500 !text-sm">
                Choose how you want to receive your authentication codes
              </Typography>
            </div>

            <Badge>Comming Soon</Badge>
          </div>

          <div className="mt-6 space-y-8">
            {authOptions.map((option) => (
              <div
                key={option.id}
                className="flex  items-start gap-5 cursor-not-allowed p-2 rounded-md transition-colors"
                // onClick={() =>
                //   router.navigate({
                //     to: option.path
                //   })
                // }
              >
                <div className="mt-1 bg-blue-50 p-2 rounded-full">{option.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <Typography variant="small" className="font-semibold">
                      {option.title}
                    </Typography>
                    {option.recommended && (
                      <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        Recommended
                      </span>
                    )}
                  </div>
                  <Typography variant="small" className="text-gray-500">
                    {option.description}
                  </Typography>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <DefaultModal
        open={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
        trigger={<></>}
        title="Change Password"
      >
        <ChanglePasswordAction />
      </DefaultModal>
    </div>
  );
};

export default SettingsSecurity;

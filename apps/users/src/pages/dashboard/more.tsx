// MorePage.tsx
import { Typography } from '@/components/sub-modules/typography/typography';
import { cn } from '@/lib/utils';
import { getRoleFromCookie } from '@/hooks/api/misc';
import ProfileBanner from '@/components/modules/profile/profile-banner';
import { useNavigate } from '@tanstack/react-router';
import { ArrowRight2, DirectSend, ProfileCircle, SecuritySafe, Verify } from 'iconsax-reactjs';
import { ReactNode } from 'react';

const ICON_SIZE = 26;
const COLOR = 'blue';

type MoreItem = {
  title: string;
  description: string;
  cta: string;
  href: string;
  icon: ReactNode;
};

const MorePage = () => {
  const navigate = useNavigate();
  const role = getRoleFromCookie();

  const moreItems: MoreItem[] = [
    {
      title: 'Profile',
      description: 'Personal details, contact info and public display.',
      cta: 'Manage Profile',
      href: '/settings/my-profile',
      icon: <ProfileCircle size={ICON_SIZE} variant="Bulk" color={COLOR} />
    },
    ...(role === 'user'
      ? [
          {
            title: 'KYC Verification',
            description: 'Verify your identity to increase transaction limits.',
            cta: 'View Status',
            href: '/settings/verifications',
            icon: <Verify size={ICON_SIZE} variant="Bulk" color={COLOR} />
          }
        ]
      : []),
    {
      title: 'Security',
      description: 'Passwords, 2FA, and active sessions management.',
      cta: 'Configure',
      href: '/settings/security',
      icon: <SecuritySafe size={ICON_SIZE} variant="Bulk" color={COLOR} />
    },
    ...(role === 'user'
      ? [
          {
            title: 'Upgrade Account',
            description: 'Unlock premium features and lower fees today.',
            cta: 'See Plans',
            href: '/settings/upgrade-account',
            icon: <DirectSend size={ICON_SIZE} variant="Bulk" color={COLOR} />
          }
        ]
      : [])
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      <ProfileBanner />

      <div className="space-y-4">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
          <Typography variant="p" className="font-semibold text-gray-900">
            Account Settings
          </Typography>
          <Typography variant="small" className="text-gray-500 ">
            Manage your presence and security
          </Typography>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {moreItems.map((item) => (
            <button
              key={item.href}
              type="button"
              onClick={() => navigate({ to: item.href })}
              className={cn(
                'text-left rounded-3xl border p-5 sm:p-6 min-h-[210px] flex flex-col transition-all',
                'bg-white border-emerald-100 hover:border-emerald-300 '
              )}
            >
              <div
                className="h-12 w-12 bg-blue-50
               rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center"
              >
                {item.icon}
              </div>
              <Typography variant="p" className="mt-5  font-semibold text-gray-900">
                {item.title}
              </Typography>
              <Typography variant="p" className="mt-2 text-gray-500 text-sm">
                {item.description}
              </Typography>
              <span className="mt-auto pt-6 inline-flex items-center gap-2  text-blue-600 font-semibold text-sm">
                {item.cta}
                <ArrowRight2 size={16} />
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MorePage;

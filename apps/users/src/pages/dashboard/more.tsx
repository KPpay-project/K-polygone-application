// MorePage.tsx
import { Typography } from '@/components/sub-modules/typography/typography';
import { cn } from '@/lib/utils';
import { getRoleFromCookie } from '@/hooks/api/misc';
import { useProfileStore } from '@/store/profile-store';
import { useUserStore } from '@/store/user-store';
import { useNavigate } from '@tanstack/react-router';
import {
  ArrowRight2,
  ArrowUp2,
  DirectSend,
  ProfileCircle,
  SecuritySafe,
  Verify
} from 'iconsax-reactjs';
import { ReactNode } from 'react';

type MoreItem = {
  title: string;
  description: string;
  cta: string;
  href: string;
  icon: ReactNode;
};

const MorePage = () => {
  const navigate = useNavigate();
  const profile = useProfileStore((state) => state.profile);
  const userAccount = useUserStore((state) => state.userAccount);
  const role = getRoleFromCookie();

  const firstName = profile?.user?.firstName || userAccount?.user?.firstName || '';
  const lastName = profile?.user?.lastName || userAccount?.user?.lastName || '';
  const fullName = `${firstName} ${lastName}`.trim() || 'My Account';
  const email = profile?.user?.email || userAccount?.user?.email || 'account@example.com';
  const initials = `${firstName?.[0] || 'A'}${lastName?.[0] || 'C'}`.toUpperCase();

  const moreItems: MoreItem[] = [
    {
      title: 'Profile',
      description: 'Personal details, contact info and public display.',
      cta: 'Manage Profile',
      href: '/settings/my-profile',
      icon: <ProfileCircle size={24} variant="Bulk" />
    },
    ...(role === 'user'
      ? [
          {
            title: 'KYC Verification',
            description: 'Verify your identity to increase transaction limits.',
            cta: 'View Status',
            href: '/settings/verifications',
            icon: <Verify size={24} variant="Bulk" />
          }
        ]
      : []),
    {
      title: 'Security',
      description: 'Passwords, 2FA, and active sessions management.',
      cta: 'Configure',
      href: '/settings/security',
      icon: <SecuritySafe size={24} variant="Bulk" />
    },
    ...(role === 'user'
      ? [
          {
            title: 'Upgrade Account',
            description: 'Unlock premium features and lower fees today.',
            cta: 'See Plans',
            href: '/settings/upgrade-account',
            icon: <DirectSend size={24} variant="Bulk" />
          }
        ]
      : [])
  ];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      <div className="rounded-3xl border border-emerald-100 bg-white p-5 sm:p-6 lg:p-8 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="relative">
              <div className="h-16 w-16 sm:h-24 sm:w-24 rounded-full border-[3px] border-emerald-300 bg-emerald-50 text-emerald-700 flex items-center justify-center text-xl sm:text-3xl font-semibold">
                {initials}
              </div>
              <div className="absolute -bottom-1 -right-1 h-7 w-7 sm:h-9 sm:w-9 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg">
                <Verify size={16} variant="Bold" />
              </div>
            </div>
            <div>
              <Typography
                variant="p"
                className="text-xl sm:text-2xl font-semibold text-gray-900"
              >
                {fullName}
              </Typography>
              <Typography
                variant="p"
                className="mt-1 text-xs sm:text-sm text-gray-500"
              >
                {email}
              </Typography>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                <span className="rounded-full bg-emerald-100 text-emerald-700 font-semibold px-3 py-1">
                  TIER 2 ACCOUNT
                </span>
                <span className="text-gray-400">• Verified account</span>
              </div>
            </div>
          </div>
          {role === 'user' && (
            <button
              type="button"
              onClick={() => navigate({ to: '/settings/upgrade-account' })}
              className="h-10 sm:h-12 px-4 sm:px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold inline-flex items-center justify-center gap-2 transition-colors text-sm sm:text-base"
            >
              <ArrowUp2 size={18} />
              Upgrade Account
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
          <Typography
            variant="p"
            className="text-xl sm:text-2xl font-semibold text-gray-900"
          >
            Account Settings
          </Typography>
          <Typography
            variant="p"
            className="text-gray-500 text-sm sm:text-base"
          >
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
                'bg-white border-emerald-100 hover:border-emerald-300 hover:shadow-md'
              )}
            >
              <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                {item.icon}
              </div>
              <Typography
                variant="p"
                className="mt-5 text-lg font-semibold text-gray-900"
              >
                {item.title}
              </Typography>
              <Typography
                variant="p"
                className="mt-2 text-gray-500 text-sm"
              >
                {item.description}
              </Typography>
              <span className="mt-auto pt-6 inline-flex items-center gap-2 text-emerald-600 font-semibold text-sm">
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

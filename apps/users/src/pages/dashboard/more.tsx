// MorePage.tsx
import {
  ArrowUp,
  ChevronRight,
  IdCard,
  LogOut,
  ShieldCheck,
  TrendingUp,
  UserCircle2,
  UserRoundCheck
} from 'lucide-react';
import { useProfileStore } from '@/store/profile-store';
import { useUserStore } from '@/store/user-store';
import { useNavigate } from '@tanstack/react-router';
import { Typography, ModularCard } from '@ui/index';

type MoreItem = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
};

const moreItems: MoreItem[] = [
  { label: 'Profile', icon: IdCard, href: '/settings/my-profile' },
  { label: 'KYC Verification', icon: UserRoundCheck, href: '/settings/verifications' },
  { label: 'Security', icon: ShieldCheck, href: '/settings/security' },
  { label: 'Upgrade Account', icon: TrendingUp, href: '/settings/upgrade-account' }
];

const MorePage = () => {
  const navigate = useNavigate();
  const profile = useProfileStore((state) => state.profile);
  const userAccount = useUserStore((state) => state.userAccount);

  const firstName = profile?.user?.firstName || userAccount?.user?.firstName || '';
  const lastName = profile?.user?.lastName || userAccount?.user?.lastName || '';
  const fullName = `${firstName} ${lastName}`.trim() || 'User';

  return (
    <ModularCard className="px-8 mx-20">
      <div className="mx-auto w-full max-w-[1120px]  px-2 py-4 sm:px-4 sm:py-6 lg:px-6 lg:py-8">
        <div className="mt-6 bg-gradient-to-r from-[#111a20] to-[#1a2429] px-4 py-5 text-white sm:px-6 sm:py-6">
          <Typography
    
            variant="h6"
            className="text-white font-medium sm:text-medium"
      
          >
            Account Tier
          </Typography>

          <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-[54px] w-[54px] items-center justify-center rounded-3xl border-2 border-[#2f90ff] bg-[#141f25] shadow-[inset_0_0_0_2px_#facc15]">
                <UserCircle2 className="h-8 w-8 text-white" />
              </div>

              <div className="flex items-center gap-3">
                <Typography
                  variant="lead"
                  className=" text-white sm:leading-none"
                >
                  {fullName}
                </Typography>

               
              </div>
            </div>

            <div className="inline-flex w-full items-center justify-between rounded-full bg-white px-3 py-3 text-[#0f1720] sm:w-auto sm:gap-4 sm:px-5">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#00c853] px-4 py-2 sm:text-[32px]">
                <Typography
                  variant={"small"}
                  className=""
                >
                  Tier 2
                </Typography>
              </span>

              <span className="inline-flex items-center gap-2 text-base sm:text-[32px]">
                <ArrowUp className="h-6 w-6" />
                <Typography as="span" variant="body" className="text-base sm:text-[32px]">
                  Upgrade
                </Typography>
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-2 lg:grid-cols-4">
          {moreItems.map(({ label, icon: Icon, href }) => (
            <button
              key={label}
              type="button"
              onClick={() => navigate({ to: href })}
              className="text-left"
            >
              <ModularCard
                hideHeader
                className="h-[180px] rounded-none border border-[#171e22] bg-[#efefef] py-0 transition-colors hover:bg-[#e7e7e7] sm:h-[210px]"
                contentClassName="mt-0 flex h-full items-center justify-center p-0"
              >
                <div className="flex flex-col items-center justify-center gap-3 px-4 text-center text-[#1f272c]">
                  <Icon className="h-8 w-8" />
                  <Typography
                    variant="small"
                    className="max-w-[140px] text-sm font-normal leading-snug text-[#1f272c]"
                  >
                    {label}
                  </Typography>
                </div>
              </ModularCard>
            </button>
          ))}
        </div>

        <div className="my-10 h-px w-full bg-[#b8b3aa]" />

        <button
          type="button"
          className="flex w-full items-center justify-between border border-[#171e22] bg-[#efefef] px-6 py-6 text-[#1f272c] sm:px-8 sm:py-7"
        >
          <span className="inline-flex items-center gap-4">
            <span className="inline-flex h-14 w-14 items-center justify-center bg-[#facc15] text-[#1a1a1a]">
              <LogOut className="h-7 w-7" />
            </span>
            <Typography
              as="span"
              variant="h3"
              className="text-[18px] font-medium sm:text-[40px]"
            >
              Log out
            </Typography>
          </span>

          <ChevronRight className="h-8 w-8" />
        </button>
      </div>
    </ModularCard>
  );
};

export default MorePage;

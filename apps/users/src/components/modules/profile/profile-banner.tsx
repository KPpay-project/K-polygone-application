import { getRoleFromCookie } from '@/hooks/api/misc';
import { useProfileStore } from '@/store/profile-store';
import { useUserStore } from '@/store/user-store';
import { useNavigate } from '@tanstack/react-router';
import { ArrowUp2, Verify } from 'iconsax-reactjs';
import { Badge } from '@/components/ui/badge';
import { Typography, ModularCard } from '@repo/ui';

function ProfileBanner() {
  const navigate = useNavigate();
  const profile = useProfileStore((state) => state.profile);
  const userAccount = useUserStore((state) => state.userAccount);
  const role = getRoleFromCookie();

  const firstName = profile?.user?.firstName || userAccount?.user?.firstName || '';
  const lastName = profile?.user?.lastName || userAccount?.user?.lastName || '';
  const fullName = `${firstName} ${lastName}`.trim() || 'My Account';
  const email = profile?.user?.email || userAccount?.user?.email || 'account@example.com';
  const initials = `${firstName?.[0] || 'A'}${lastName?.[0] || 'C'}`.toUpperCase();

  return (
    <ModularCard>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="relative">
            <div
              className="h-8 w-8 sm:h-24 sm:w-24 rounded-full border-2 border-emerald-300 bg-emerald-50 text-emerald-700
             flex items-center justify-center  font-semibold"
            >
              {initials}
            </div>
            <div
              className="absolute -bottom-1 -right-1 h-7 w-7
            bg-green-100 sm:h-9 sm:w-9 rounded-full bg-emerald-500 text-green-500 flex items-center justify-center "
            >
              <Verify size={16} variant="Bold" />
            </div>
          </div>
          <div>
            <Typography variant="h5" className="  font-semibold text-gray-900">
              {fullName}
            </Typography>
            <Typography variant="small" className="mt-1  text-gray-500">
              {email}
            </Typography>

            <div>
              <Badge variant="secondary" className="mt-2 text-sm">
                TIER 2 ACCOUNT
              </Badge>
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
    </ModularCard>
  );
}

export default ProfileBanner;

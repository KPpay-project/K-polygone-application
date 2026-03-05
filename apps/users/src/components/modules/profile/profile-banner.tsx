import { getRoleFromCookie } from '@/hooks/api/misc';
import { useProfileStore } from '@/store/profile-store';
import { useUserStore } from '@/store/user-store';
import { useNavigate } from '@tanstack/react-router';
import { ArrowUp2, Verify } from 'iconsax-reactjs';
import { Badge } from '@/components/ui/badge';
import { Typography, ModularCard, Button, DefaultUserProfile } from '@repo/ui';

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
    <ModularCard className="bg-black text-white">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="relative">
            <DefaultUserProfile name={fullName} size={64} />
            <div
              className="absolute -bottom-1 -right-1 h-7 w-7
            bg-green-100  rounded-full bg-emerald-500 text-green-500 flex items-center justify-center "
            >
              <Verify size={13} variant="Bold" />
            </div>
          </div>
          <div>
            <Typography variant="h5" className="  font-semibold text-white">
              {fullName}
            </Typography>
            <Typography variant="small" className="mt-1  text-gray-400 font-normal">
              {email}
            </Typography>

            {/* <div>
              <Badge variant="secondary" className="mt-2 text-sm">
                TIER 2 ACCOUNT
              </Badge>
            </div> */}
          </div>
        </div>
        <div>
          {role === 'user' && (
            <Button className="bg-blue-400/20" onClick={() => navigate({ to: '/settings/upgrade-account' })}>
              Upgrade Account
            </Button>
          )}
        </div>
      </div>
    </ModularCard>
  );
}

export default ProfileBanner;

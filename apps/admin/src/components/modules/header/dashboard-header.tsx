import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useTranslation } from 'react-i18next';
import { useLogout } from '@/utils/logout';
import { ArrowDown2 } from 'iconsax-reactjs';
import { LanguageSwitcher } from '@/components/language-switcher';
import { useAbstractedUser } from '@/hooks/use-personal';

const DashboardHeader = () => {
  const { t } = useTranslation();

  const { userData } = useAbstractedUser();
  const user = userData?.user || null;
  const adminProfile = userData?.admin || null;
  const merchantProfile = userData?.merchant || null;
  const role = userData?.role || '';
  const status = userData?.status || '';
  const { logout } = useLogout();

  const getFullName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (adminProfile?.firstName && adminProfile?.lastName) {
      return `${adminProfile.firstName} ${adminProfile.lastName}`;
    }
    if (adminProfile?.name) {
      return adminProfile.name;
    }
    if (merchantProfile?.businessName) {
      return merchantProfile.businessName;
    }
    return 'User';
  };

  const getInitials = () => {
    const name = getFullName();
    if (name && name !== 'User') {
      const parts = name.trim().split(/\s+/);
      const first = parts[0]?.charAt(0) || '';
      const second = parts[1]?.charAt(0) || '';
      return `${first}${second}`.toUpperCase() || 'U';
    }
    return 'U';
  };

  const getEmail = () => {
    if (user?.email) return user.email;
    if (adminProfile?.email) return adminProfile.email as string;
    return '';
  };

  const getRoleLabel = () => (role ? role.charAt(0).toUpperCase() + role.slice(1) : '');
  const getStatusLabel = () => (status ? String(status).charAt(0).toUpperCase() + String(status).slice(1) : '');

  return (
    <div className={'bg-white w-full h-[70px] px-6 flex items-center justify-between'}>
      <div className="invisible">
        <h3 className={'font-bold text-lg'}>{t('dashboard.header.welcomeBack')}</h3>
      </div>

      <div className="flex items-center gap-3">
        <LanguageSwitcher />
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 outline-none">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{getInitials()}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{getFullName().split(' ')[1]}</span>
            <ArrowDown2 size={16} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="px-3 py-2 text-sm">
              <div className="font-medium">{getFullName().split(' ')[1]}</div>
              {getEmail() && <div className="text-gray-500">{getEmail()}</div>}
              <div className="text-gray-500">
                {getRoleLabel()} {getStatusLabel() ? `• ${getStatusLabel()}` : ''}
              </div>
            </div>
            <DropdownMenuItem onClick={logout}>{!t('common.actions.logout') || 'Logout'}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
export default DashboardHeader;

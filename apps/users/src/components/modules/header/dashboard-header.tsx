import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Link } from '@tanstack/react-router';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTranslation } from 'react-i18next';
import { useUser } from '@/store/user-store';
import { useLogout } from '@/utils/logout';
import { ArrowDown2 } from 'iconsax-reactjs';
import { LanguageSwitcher } from '@/components/language-switcher';

interface DashboardHeaderProps {
  onMenuClick?: () => void;
}

import { Menu } from 'lucide-react';

const DashboardHeader = ({ onMenuClick }: DashboardHeaderProps) => {
  const { t } = useTranslation();
  const user = useUser();
  const { logout } = useLogout();

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user?.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    }
    return 'U';
  };

  const getFullName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return 'User';
  };

  return (
    <div className={'bg-white w-full h-[60px] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30'}>
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button onClick={onMenuClick} className="lg:hidden">
            <Menu className="w-5 h-5 text-gray-700" />
          </button>
        )}
        <h3 className={'font-bold text-base hidden sm:block'}>{t('dashboard.header.welcomeBack')}</h3>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3" data-tour="language-selector">
          <LanguageSwitcher />
        </div>

        <div data-tour="profile-menu">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer">
                <Avatar className="cursor-pointer">
                  <AvatarImage
                    src={`https://api.dicebear.com/9.x/initials/svg?seed=${user?.firstName || 'user'}`}
                    alt={`@${user?.firstName || 'user'}`}
                  />
                  <AvatarFallback>{getInitials()}</AvatarFallback>
                </Avatar>
                <div className="hidden sm:flex flex-col">
                  <span className="font-medium text-sm">{getFullName()}</span>
                  <span className="text-xs text-muted-foreground">{user?.email || 'user@email.com'}</span>
                </div>

                <ArrowDown2 size={14} className="hidden sm:block" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <div className="sm:hidden px-2 py-2 border-b">
                <div className="font-medium text-sm">{getFullName()}</div>
                <div className="text-xs text-muted-foreground">{user?.email || 'UnAuthenticated'}</div>
              </div>
              <DropdownMenuItem asChild>
                <Link to="/settings">{t('dashboard.header.settings')}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout}>{t('dashboard.header.logout')}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
export default DashboardHeader;

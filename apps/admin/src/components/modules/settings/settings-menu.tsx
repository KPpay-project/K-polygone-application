import { Profile2User, Lock, Notification, Setting2, UserTag } from 'iconsax-reactjs';
import { useRouter } from '@tanstack/react-router';

export interface SettingsMenuItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}

export const useSettingsMenuItems = (): SettingsMenuItemProps[] => {
  const router = useRouter();
  const pathname = router.state.location.pathname;

  return [
    {
      icon: <Profile2User size="18" variant="Outline" />,
      label: 'General/Account',
      href: '/dashboard/settings',
      active: pathname === '/dashboard/settings' || pathname === '/dashboard/settings/'
    },
    {
      icon: <Lock size="18" variant="Outline" />,
      label: 'Password/Security',
      href: '/dashboard/settings/security',
      active: pathname === '/dashboard/settings/security'
    },
    {
      icon: <Notification size="18" variant="Outline" />,
      label: 'Notification',
      href: '/dashboard/settings/notifications',
      active: pathname === '/dashboard/settings/notifications'
    },
    {
      icon: <Setting2 size="18" variant="Outline" />,
      label: 'System',
      href: '/dashboard/settings/system',
      active: pathname === '/dashboard/settings/system'
    },
    {
      icon: <UserTag size="18" variant="Outline" />,
      label: 'User Role',
      href: '/dashboard/settings/user-role',
      active: pathname === '/dashboard/settings/user-role'
    }
  ];
};

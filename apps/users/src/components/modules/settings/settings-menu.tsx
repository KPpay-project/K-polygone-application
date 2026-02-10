import { useRouter } from '@tanstack/react-router';
import { SecuritySafe, DirectSend, Verify } from 'iconsax-reactjs';
import { ProfileCircle } from 'iconsax-reactjs';
import { DEFAULT_ICON_SIZE } from '@/constant';
import { getRoleFromCookie } from '@/hooks/api/misc';

export function useSettingsMenuItems() {
  const router = useRouter();
  const size = DEFAULT_ICON_SIZE.DASHBOARD;

  const role = getRoleFromCookie();

  const items = [
    {
      icon: <ProfileCircle size={size} variant="Outline" />,
      label: 'My profile',
      href: '/settings/my-profile'
    },

    ...(role === 'user'
      ? [
          {
            icon: <Verify size={size} variant="Outline" />,
            label: 'KYC Verifications',
            href: '/settings/verifications'
          }
        ]
      : []),
    {
      icon: <SecuritySafe size={size} variant="Outline" />,
      label: 'Security',
      href: '/settings/security'
    },
    ...(role === 'user'
      ? [
          {
            icon: <DirectSend size={size} variant="Outline" />,
            label: 'Upgrade Account',
            href: '/settings/upgrade-account'
          }
        ]
      : [])
  ];

  const activatedItems = items.map((item) => {
    return {
      ...item,
      active: item.href == router.state.location.pathname
    };
  });

  return {
    items: activatedItems
  };
}

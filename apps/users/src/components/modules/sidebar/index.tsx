import { Link, useRouter } from '@tanstack/react-router';
import { ArrowDown2, ArrowUp2 } from 'iconsax-reactjs';
import { FC, useState } from 'react';
// @ts-ignore
import { SidebarItemProps, useBottomOptions, useMenuItems } from './sidebar-menu.tsx';
import Logo from '@/components/misc/logo.tsx';
import { useMerchantSidebarMenue } from './marchant-sidebar.tsx';
interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

interface ItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  subItems?: { label: string; href: string }[];
  matchTailingUrl?: boolean;
}

const SidebarItem: FC<{ item: ItemProps }> = ({ item }) => {
  const router = useRouter();
  const activeSubItem = item.subItems?.find(({ href }) => href == router.state.location.pathname);
  const tailingMatched = router.state.location.pathname.includes(item.href);
  const isActive = router.state.location.pathname === item.href || (item?.matchTailingUrl && tailingMatched);
  const hasSubItems = item.subItems && item.subItems.length > 0;
  const [isExpanded, setIsExpanded] = useState(isActive || !!activeSubItem);

  const toggleExpand = (e: React.MouseEvent) => {
    if (hasSubItems) {
      e.preventDefault();
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <li className="">
      <Link
        to={item.href}
        onClick={toggleExpand}
        className={`flex items-center gap-3 mb-2 w-full text-[14px] font-medium rounded-lg transition-all duration-300 ease-in-out px-3 py-3 ${
          isActive ? 'bg-white text-gray-800 shadow-sm' : 'text-white hover:bg-white/10'
        }`}
      >
        {item.icon}
        <span className="flex-1 uppercase text-md">{item.label}</span>
        {hasSubItems && (
          <span className="text-xs transition-transform duration-200 ease-in-out">
            {isExpanded ? <ArrowUp2 size="16" /> : <ArrowDown2 size="16" />}
          </span>
        )}
      </Link>

      {hasSubItems && (
        <ul
          className={`ml-4 mt-2 relative space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${
            isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="absolute h-full translate-y-[-16px] left-2 border-l-2 border-white/80"></div>

          {(item?.subItems || []).map((subItem, index) => {
            const isSubActive = router.state.location.pathname === subItem.href;
            return (
              <li key={index} className="relative pl-6 overflow-hidden">
                <div className="absolute left-[7px] top-1/2 -translate-y-1/2 rounded-bl-lg border-l-2 border-b-2 border-white/80 w-3 h-3"></div>
                <Link
                  to={subItem.href}
                  className={`block text-[13px] font-normal rounded-md transition-all duration-300 ease-in-out px-3 py-2 ${
                    isSubActive ? 'bg-white text-gray-800 shadow-sm' : 'text-[#F9FAFB] hover:bg-white/10'
                  }`}
                >
                  {subItem.label.toUpperCase()}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
};

import { USER_ROLE, UserRoleEnum } from '@/constant';
import Cookies from 'js-cookie';

export const Sidebar: FC<SidebarProps> = ({ isOpen = true, onClose }) => {
  const mobileClass = isOpen ? 'translate-x-0' : '-translate-x-full';

  const userRole = Cookies.get(USER_ROLE)?.trim().toLowerCase();
  const isMerchant = userRole === UserRoleEnum.Merchant;

  const userMenu = useMenuItems();
  const merchantMenu = useMerchantSidebarMenue();
  const menuItems = isMerchant ? merchantMenu : userMenu;
  const bottomOptions = useBottomOptions();

  return (
    <>
      <div
        className={`fixed  inset-y-0 left-0 z-50 w-[220px] transform bg-[#010A23] text-white transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:flex lg:flex-col lg:min-h-screen ${mobileClass}`}
      >
        <div className="p-4 pt-[40px] pb-[28px] pl-[20px] font-bold text-sm uppercase tracking-widest">
          <Logo />
        </div>
        <div className="w-full px-5">
          <div className="border-t border-gray-600" />
        </div>
        <nav className="flex-1 overflow-y-auto px-4 py-4">
          <ul className="space-y-2">
            {menuItems.map((item: SidebarItemProps, index: number) => (
              <SidebarItem key={index} item={item} />
            ))}
          </ul>

          <div className="my-8">
            <div className="h-px bg-gray-600 mx-4" />
            <ul className="mt-8 space-y-2">
              {bottomOptions.map((item: SidebarItemProps, index: number) => (
                <SidebarItem key={index} item={item} />
                // <Link
                //   key={index}
                //   to={item.href}
                //   className="flex items-center gap-3 p-3 text-sm font-medium rounded-md transition-colors hover:bg-gray-600"
                // >
                //   {item.icon}
                //   <span>{item.label}</span>
                // </Link>
              ))}
            </ul>
          </div>
        </nav>
      </div>

      {isOpen && onClose && <div className="fixed inset-0 z-40 bg-black bg-opacity-30 lg:hidden" onClick={onClose} />}
    </>
  );
};

export default Sidebar;

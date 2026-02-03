//import { useSettingsMenuItems } from '@/components/modules/settings/settings-menu';
import { Typography } from '@/components/sub-modules/typography/typography';
import { cn } from 'k-polygon-assets';
import { ReactNode, useState } from 'react';
import DashboardLayout from '../dashboard-layout';

interface ISettingsLayout {
  children: ReactNode;
}

const SettingsLayout: React.FC<ISettingsLayout> = ({ children }) => {
  //const { items } = useSettingsMenuItems();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <DashboardLayout fullContainer>
      <div className="h-full p-3 sm:p-4 md:p-8">
        <div className="max-w-6xl mx-auto h-full bg-red-300">
          <div className="md:hidden mb-4">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="bg-white p-3 rounded-lg shadow-lg flex items-center gap-2 w-full justify-between"
            >
              <Typography className="text-lg text-black">Settings Menu</Typography>
              <svg
                className={cn('w-5 h-5 transition-transform', showMobileMenu && 'rotate-180')}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          <div className="grid md:grid-cols-7 gap-4 sm:gap-6 md:gap-8 h-full">
            <div
              className={cn(
                'md:col-span-2 bg-white p-4 sm:p-6 md:p-[28px] rounded-[16px] shadow-lg',
                'md:h-full md:block',
                showMobileMenu ? 'block mb-4' : 'hidden md:block'
              )}
            >
              <div className="flex flex-col gap-[8px]">
                <Typography className="text-lg md:text-xl text-black">Settings</Typography>
                <Typography className="text-sm md:text-md font-regular text-gray-700">
                  You can find all your settings here
                </Typography>
              </div>
              <div className="mt-[16px] space-y-[12px] md:space-y-[16px] md:max-w-[80%]">
                {/*{items.map((item, index) => {
                  return (
                    <Link
                      to={item.href}
                      key={index}
                      onClick={() => setShowMobileMenu(false)}
                      className={cn(
                        item.active ? 'bg-blue-50' : '',
                        'w-full rounded-[8px] flex gap-[10px] md:gap-[13px] py-[8px] md:py-[11px] px-[10px] md:px-[13px] hover:bg-blue-50 transition-colors'
                      )}
                    >
                      <div className="flex-shrink-0">{item.icon}</div>
                      <span className="text-[13px] md:text-[14px] ">{item.label}</span>
                    </Link>
                  );
                })}*/}
              </div>
            </div>

            <div className="md:col-span-5 bg-white p-4 sm:p-6 md:p-[28px] min-h-[400px] md:h-full overflow-hidden rounded-[16px] shadow-lg">
              {children}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsLayout;

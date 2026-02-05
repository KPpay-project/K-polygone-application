import DashboardLayout from '@/components/layouts/dashboard-layout';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { logoutUser } from '@/utils';
import { ArrowLeftIcon, ArrowRight } from 'lucide-react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { ModularCard } from '@/components/sub-modules/card/card.tsx';
import { useQuery } from '@apollo/client';
import { GET_USER_BY_ID } from '@repo/api';

function SkeletonLoader() {
  return (
    <div className="animate-pulse">
      <div className="mt-[32px] flex flex-row items-center gap-[24px]">
        <div className="w-[258px] h-[353px] bg-gray-200 rounded-[30px]"></div>
        <div className="w-[258px] h-[353px]">
          <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
          <div className="flex flex-col gap-[32px]">
            {[...Array(4)].map((_, index) => (
              <div key={index}>
                <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
                <div className="h-5 w-40 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-[258px] h-[353px]">
          <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
          <div className="flex flex-col gap-[32px]">
            {[...Array(4)].map((_, index) => (
              <div key={index}>
                <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
                <div className="h-5 w-40 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-[258px] h-[353px]">
          <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
          <div className="flex flex-col gap-[32px]">
            {[...Array(2)].map((_, index) => (
              <div key={index}>
                <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
                <div className="h-5 w-40 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function UserProfilePage() {
  useEffect(() => {
    const timer = setInterval(
      () => {
        logoutUser();
      },
      10 * 60 * 1000
    ); // 10 minutes
    return () => clearInterval(timer);
  }, []);
  const navigate = useNavigate();
  const search = useSearch({ from: '/dashboard/user-profile' });
  const userId = search?.userId;

  const { loading, data, error } = useQuery(GET_USER_BY_ID, {
    variables: { id: userId },
    skip: !userId
  });

  const user = data?.getUserById;

  if (loading || error || !userId) {
    return (
      <DashboardLayout>
        <ModularCard>
          <div className="p-6">
            <div className="flex justify-between items-center mb-8">
              <Button
                variant="ghost"
                onClick={() => navigate({ to: '/dashboard/users-list' })}
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Back
              </Button>
            </div>
            <SkeletonLoader />
          </div>
        </ModularCard>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <ModularCard>
        <div className="px-6 flex flex-col ">
          <div className="flex justify-between items-center mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate({ to: '/dashboard/users-list' })}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back
            </Button>
          </div>

          <div className="mt-[32px] flex flex-row items-center gap-[24px] flex-1">
            <div className="w-[258px] h-[353px]">
              <h2 className="text-[#2352E4] font-bold text-[16px]">Personal Details</h2>
              <div className="flex flex-col gap-[32px]">
                <div>
                  <p className="text-[#6B7280] text-[12px]">User ID</p>
                  <h3 className="text-[#111827] text-[14px] font-medium">{user?.id || 'Nil'}</h3>
                </div>
                <div>
                  <p className="text-[#6B7280] text-[12px]">Name</p>
                  <h3 className="text-[#111827] text-[14px] font-medium">
                    {user?.firstName || 'Nil'} {user?.lastName || 'Nil'}
                  </h3>
                </div>
                <div>
                  <p className="text-[#6B7280] text-[12px]">Gender</p>
                  <h3 className="text-[#111827] text-[14px] font-medium">Nil</h3>
                </div>
                <div>
                  <p className="text-[#6B7280] text-[12px]">Nationality</p>
                  <h3 className="text-[#111827] text-[14px] font-medium">{user?.country || 'Nil'}</h3>
                </div>
              </div>
            </div>
            <div className="w-[258px] h-[353px]">
              <h2 className="text-[#2352E4] font-bold text-[16px]">Address</h2>
              <div className="flex flex-col gap-[32px]">
                <div>
                  <p className="text-[#6B7280] text-[12px]">Address</p>
                  <h3 className="text-[#111827] text-[14px] font-medium">Nil</h3>
                </div>
                <div>
                  <p className="text-[#6B7280] text-[12px]">City</p>
                  <h3 className="text-[#111827] text-[14px] font-medium">Nil</h3>
                </div>
                <div>
                  <p className="text-[#6B7280] text-[12px]">State</p>
                  <h3 className="text-[#111827] text-[14px] font-medium">Nil</h3>
                </div>
                <div>
                  <p className="text-[#6B7280] text-[12px]">Country</p>
                  <h3 className="text-[#111827] text-[14px] font-medium">{user?.country || 'Nil'}</h3>
                </div>
              </div>
            </div>
            <div className="w-[258px] h-[353px]">
              <h2 className="text-[#2352E4] font-bold text-[16px]">Contact Details</h2>
              <div className="flex flex-col gap-[32px]">
                <div>
                  <p className="text-[#6B7280] text-[12px]">Phone Number</p>
                  <h3 className="text-[#111827] text-[14px] font-medium">{user?.phone || 'Nil'}</h3>
                </div>
                <div>
                  <p className="text-[#6B7280] text-[12px]">Email</p>
                  <h3 className="text-[#111827] text-[14px] font-medium">{user?.email || 'Nil'}</h3>
                </div>
              </div>
            </div>
          </div>

          <div className="">
            <Button
              variant="default"
              className=" bg-primary"
              onClick={() => {
                if (user?.id) {
                  window.location.href = `/dashboard/verifications/${user.id}`;
                }
              }}
              disabled={!user?.id}
            >
              View User KYC
              <ArrowRight />
            </Button>
          </div>
        </div>
      </ModularCard>
    </DashboardLayout>
  );
}

export default UserProfilePage;

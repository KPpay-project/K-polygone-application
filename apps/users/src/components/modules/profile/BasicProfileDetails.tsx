import { Avatar } from '@/components/ui/avatar';
import { Typography } from '@/components/sub-modules/typography/typography';
import { useMe } from '@/hooks/api/use-me';
import { useProfileStore } from '@/store/profile-store';
import { useUser } from '@/store/user-store';
import { useState } from 'react';
import EditButton from './EditButton';
import EditProfileModal from './EditProfileModal';

const BasicProfileDetails = () => {
  const profile = useProfileStore((state) => state.profile);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const user = useUser();
  const { data: meData } = useMe();

  const storeUser = profile?.user;
  const meUser = meData?.me?.user;
  const effectiveUser = storeUser || meUser || user || null;

  const displayName = effectiveUser ? `${effectiveUser.firstName} ${effectiveUser.lastName}` : 'N/A';
  const userEmail = effectiveUser?.email || 'N/A';

  const getUserInitials = () => {
    const firstName = effectiveUser?.firstName;
    const lastName = effectiveUser?.lastName;
    if (!firstName || !lastName) return 'U';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const userData = {
    firstName: effectiveUser?.firstName || '',
    lastName: effectiveUser?.lastName || '',
    email: effectiveUser?.email || ''
  };

  return (
    <>
      <div className="border flex justify-between rounded-[16px] border-gray-200 px-[32px] py-[16px] ">
        <div className="flex gap-[6px]">
          <Avatar className="size-[45px] bg-blue-100 text-blue-800 font-semibold flex items-center justify-center">
            {getUserInitials()}
          </Avatar>
          <div className="flex flex-col">
            <div className="flex gap-[8px] items-center">
              <Typography className="text-black font-medium text-xl">{displayName}</Typography>
            </div>
            <Typography className="text-gray-700 text-md">{userEmail}</Typography>
          </div>
        </div>

        <div className="my-auto">
          <EditButton onClick={() => setIsEditModalOpen(true)} />
        </div>
      </div>

      <EditProfileModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} userData={userData} />
    </>
  );
};

export default BasicProfileDetails;

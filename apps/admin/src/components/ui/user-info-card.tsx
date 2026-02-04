import React from 'react';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { StatusBadge } from './status-badge';

interface UserInfoCardProps {
  name: string;
  email: string;
  avatar?: string;
  status: string;
  className?: string;
}

export const UserInfoCard: React.FC<UserInfoCardProps> = ({ name, email, status, className = '' }) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={`bg-gray-100 rounded-[10px] p-[2px_17px] w-[420px] h-[91px] flex items-center  ${className}`}>
      <div className="flex items-center gap-[116px]">
        <div className="flex items-center gap-[10px]">
          <Avatar className="w-12 h-12">
            <AvatarImage src={`https://api.dicebear.com/9.x/initials/svg?seed=${initials}`} alt={name} />
          </Avatar>
          <div className="flex flex-col justify-center">
            <div className="text-sm font-medium text-gray-900">{name}</div>
            <div className="text-sm text-gray-600">{email}</div>
          </div>
        </div>
        <StatusBadge status={status} />
      </div>
    </div>
  );
};

export default UserInfoCard;

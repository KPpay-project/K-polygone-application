import { cn } from '@/lib/utils';

export interface UserAvatarProps {
  name: string;
  email?: string;
  avatar?: string;
  size?: 'sm' | 'md' | 'lg';
  showEmail?: boolean;
  className?: string;
  avatarClassName?: string;
  nameClassName?: string;
  emailClassName?: string;
}

const sizeClasses = {
  sm: 'w-6 h-6 text-xs',
  md: 'w-8 h-8 text-sm',
  lg: 'w-12 h-12 text-base'
};

export function UserAvatar({
  name,
  email,
  avatar,
  size = 'md',
  showEmail = true,
  className,
  avatarClassName,
  nameClassName,
  emailClassName
}: UserAvatarProps) {
  const getInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div
        className={cn('bg-gray-300 rounded-full flex items-center justify-center', sizeClasses[size], avatarClassName)}
      >
        {avatar ? (
          <img src={avatar} alt={name} className="w-full h-full rounded-full object-cover" />
        ) : (
          <span className={cn('font-medium text-gray-600')}>{getInitials(name)}</span>
        )}
      </div>
      <div>
        <div className={cn('font-medium text-sm', nameClassName)}>{name}</div>
        {showEmail && email && <div className={cn('text-gray-500 text-xs', emailClassName)}>{email}</div>}
      </div>
    </div>
  );
}

export default UserAvatar;

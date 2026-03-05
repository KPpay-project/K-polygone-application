import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { cn } from '@ui/lib/utils';

interface DefaultProfileProps {
  src?: string;
  name?: string;
  size?: number;
  className?: string;
}

const DefaultUserProfile = ({ src, name = 'User', size = 40, className }: DefaultProfileProps) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <Avatar className={cn('overflow-hidden', className)} style={{ width: size, height: size }}>
      <AvatarImage src={`https://api.dicebear.com/9.x/initials/svg?seed=${name}`} alt={name} />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
};

export { DefaultUserProfile };

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar.tsx';
import { Typography } from '@/components/sub-modules/typography/typography.tsx';
import { FC } from 'react';
import { cn } from '@/lib/utils';

interface Props {
  name: string;
  description: string;
  imgSource: string;
  onClick: () => void;
  className?: string;
}

const getInitials = (text: string) =>
  text
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join('');

const SelectProviderPannel: FC<Props> = ({ name, description, onClick, imgSource, className }) => {
  return (
    <div
      role="button"
      aria-selected={false}
      onClick={onClick}
      className={cn('px-4 py-3 rounded-xl flex items-center gap-3 border cursor-pointer transition-colors', className)}
    >
      <div>
        <Avatar className="w-12 h-12 rounded-full overflow-hidden">
          <AvatarImage src={imgSource} alt={name} className="w-full h-full object-cover rounded-full" />
          <AvatarFallback className="rounded-full">{getInitials(name)}</AvatarFallback>
        </Avatar>
      </div>

      <div>
        <Typography className="font-medium text-gray-900">{name}</Typography>
        {description && <Typography className="text-[12px] text-gray-500">{description}</Typography>}
      </div>
    </div>
  );
};

export { SelectProviderPannel };

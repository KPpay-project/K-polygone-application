import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import Logo from '../misc/logo';

export interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number;
}

export function Loader({ className, size = 24, ...props }: LoaderProps) {
  return (
    <div
      className={cn(
        `flex items-center  flex-col 
    justify-center bg-white fixed top-0 left-0 w-full h-full`,
        className,
      )}
      {...props}
    >
      <div>
        <Logo />
      </div>
    </div>
  );
}

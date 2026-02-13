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
    justify-center bg-white top-0 left-0 w-full h-full  fixed `,
        className,
      )}
      {...props}
      style={{
        zIndex: 9999,
      }}
    >
      <div>
        <Logo />
      </div>
    </div>
  );
}

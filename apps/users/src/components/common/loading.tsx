import { FC } from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingProps {
  /**
   * Whether the loading overlay is visible
   */
  isLoading?: boolean;
  text?: string;
  size?: 'sm' | 'md' | 'lg';

  backgroundOpacity?: number;
  variant?: 'overlay' | 'simple';
}

const Loading: FC<LoadingProps> = ({
  isLoading = true,
  text,
  size = 'md',
  backgroundOpacity = 50,
  variant = 'overlay'
}) => {
  if (!isLoading) return null;

  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  if (variant === 'simple') {
    return (
      <div className="flex items-center justify-center gap-3 p-4">
        <Loader2 className={`${sizeClasses[size]} text-primary animate-spin`} />
        {text && <p className={`${textSizeClasses[size]} text-gray-600 font-medium`}>{text}</p>}
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{
        backgroundColor: `rgba(0, 0, 0, ${backgroundOpacity / 100})`
      }}
    >
      <div className="flex flex-col items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-6">
        <Loader2 className={`${sizeClasses[size]} text-white animate-spin`} />
        {text && <p className={`${textSizeClasses[size]} text-white font-medium`}>{text}</p>}
      </div>
    </div>
  );
};

export default Loading;

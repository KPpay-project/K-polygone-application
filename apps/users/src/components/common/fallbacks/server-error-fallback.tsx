import ServerErrorFallbackSvg from '@/assets/svgs/server-error-fallback.tsx';
import { Button } from '../../../../assets/src';
import { ArrowRight } from 'lucide-react';
interface ServerErrorFallbackProps {
  onRetry?: () => void;
}

const ServerErrorFallback = ({ onRetry }: ServerErrorFallbackProps) => {
  return (
    <>
      <div className={'flex flex-col items-center justify-center gap-4 h-[calc(100vh-100px)]'}>
        <div className={'mb-4 text-center w-full lg:w-[300px]'}>
          <h1 className="text-2xl font-bold text-gray-700">Oops! Something went wrong.</h1>
          <p className="text-gray-600 mt-2">
            Something broke on our end. We’re working to fix it. Please try again later.
          </p>
        </div>
        <ServerErrorFallbackSvg />

        <Button className={'w-[200px] mt-9'} onClick={onRetry || (() => window.history.back())}>
          {onRetry ? 'Retry' : 'Go to back'} <ArrowRight />{' '}
        </Button>
      </div>
    </>
  );
};

const ServerErrorFallbackScreen = ServerErrorFallback;
export { ServerErrorFallback, ServerErrorFallbackScreen };

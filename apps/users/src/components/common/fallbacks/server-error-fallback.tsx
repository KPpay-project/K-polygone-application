import { Button } from '@ui/index';
import { ArrowRight } from 'lucide-react';
import { WifiSquare } from 'iconsax-reactjs';
interface ServerErrorFallbackProps {
  onRetry?: () => void;
}

const ServerErrorFallback = ({ onRetry }: ServerErrorFallbackProps) => {
  return (
    <>
      <div className={'flex flex-col items-center justify-center gap-4  py-16'}>
        <div className={'mb-4 text-center w-full lg:w-[300px]'}>
          <h1 className="text-2xl font-bold text-gray-700">Oops! Something went wrong.</h1>
          <p className="text-gray-600 mt-2">
            Something broke on our end. We’re working to fix it. Please try again later.
          </p>
        </div>
        <WifiSquare size={90} color="gray" variant="Bulk" />

        <Button className={'w-[200px] mt-9'} onClick={onRetry || (() => window.history.back())}>
          {onRetry ? 'Retry' : 'Go to back'} <ArrowRight />{' '}
        </Button>
      </div>
    </>
  );
};

const ServerErrorFallbackScreen = ServerErrorFallback;
export { ServerErrorFallback, ServerErrorFallbackScreen };

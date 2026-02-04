import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useRouter } from '@tanstack/react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight } from 'iconsax-reactjs';
import { ReactNode } from 'react';
import { Typography } from '../typography/typography';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { LOTTIE_CONFIGS } from '@/constant/lotti-files';

interface IModalProps {
  title?: string;
  body?: ReactNode;
  hasButton?: boolean;
  onAction?: () => void;
  buttonText?: string;
  icon?: ReactNode;
  iconClassName?: string;
  status?: 'success' | 'error';
}

const ErrorAndSuccessFallback = ({
  status = 'success',
  title,
  body,
  onAction,
  buttonText,
  icon,
  hasButton = true
}: IModalProps) => {
  const isSuccess = status === 'success';

  const defaultIcon = isSuccess ? (
    <DotLottieReact src={LOTTIE_CONFIGS.SUCCESS} autoplay className="w-[300px] h-[300px]" />
  ) : (
    <DotLottieReact src={LOTTIE_CONFIGS.ERROR} autoplay className="w-[300px] h-[300px]" />
  );

  const defaultTitle = isSuccess ? 'Action Completed Successfully' : 'Action Failed';

  const defaultBody = isSuccess
    ? 'Your updates have been successfully saved and will take effect immediately.'
    : 'Something went wrong while processing your request. Please try again later.';

  const router = useRouter();

  const handleButtonClick = () => {
    onAction?.();
    const currentPath = window.location.pathname;
    if (currentPath === '/dashboard') {
      // window.location.reload();
    } else {
      router.navigate({ to: '/dashboard' });
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="flex flex-col justify-center items-center text-center py-[2em]"
      >
        {/* Icon */}
        <motion.div>{icon || defaultIcon}</motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Typography variant="h3" className="text-gray-700 text-md mt-2">
            {title || defaultTitle}
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {typeof body === 'string' ? (
            <Typography className="text-gray-600 mx-4 mt-3 text-[13px]">{body || defaultBody}</Typography>
          ) : (
            body
          )}
        </motion.div>

        {hasButton && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="w-full"
          >
            <Button
              className={cn(
                'w-full mt-3 py-6 rounded-[10px] flex items-center justify-center gap-2',
                isSuccess ? 'bg-red-600 hover:bg-red-700' : 'bg-red-600 hover:bg-red-700'
              )}
              onClick={handleButtonClick}
            >
              {buttonText || (isSuccess ? 'Go to Dashboard' : 'Try Again')}
              <ArrowRight size={18} />
            </Button>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default ErrorAndSuccessFallback;

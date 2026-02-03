import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useNavigate } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { ArrowRight, TickCircle } from 'iconsax-reactjs';
import { ReactNode } from 'react';
import { Typography } from '@/components/sub-modules/typography/typography';

interface SuccessAlertProps {
  title?: string;
  body?: ReactNode;
  onAction?: () => void;
  buttonText?: string;
  icon?: ReactNode;
  iconClassName?: string;
  className?: string;
}

const SuccessAlertFallback = ({
  title = 'Action Added Successfully',
  body = 'Your updates have been successfully saved and will take effect immediately.',
  onAction,
  buttonText,
  icon = <TickCircle size={30} className="text-green-600" />,
  iconClassName = '',
  className = ''
}: SuccessAlertProps) => {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn('flex flex-col justify-center items-center', className)}
    >
      {title && (
        <>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, type: 'spring', stiffness: 200, damping: 10 }}
            className={cn(
              iconClassName,
              'bg-green-100/20 w-[50px] h-[50px] flex items-center justify-center rounded-full'
            )}
          >
            {icon}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Typography variant="h3" className="text-gray-600 text-md">
              {title}
            </Typography>
          </motion.div>
        </>
      )}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        {typeof body === 'string' ? (
          <Typography className="text-center text-gray-600 mx-4 mt-3 text-[13px]">{body}</Typography>
        ) : (
          body
        )}
      </motion.div>

      <motion.div className="w-full">
        <Button
          onClick={
            onAction ||
            (() => {
              navigate({ to: '/dashboard' });
            })
          }
          className="w-full mt-3 py-6 rounded-[10px]"
        >
          {buttonText || 'Go to Dashboard'}
          <ArrowRight />
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default SuccessAlertFallback;

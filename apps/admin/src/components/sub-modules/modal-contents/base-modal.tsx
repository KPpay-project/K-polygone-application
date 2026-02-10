import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { DialogClose } from '@radix-ui/react-dialog';
import { useNavigate } from '@tanstack/react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, TickCircle } from 'iconsax-reactjs';
import { ReactNode } from 'react';
import { Typography } from '../typography/typography';

interface IBaseModalProps {
  title?: string;
  body?: ReactNode;
  hasButton?: boolean;
  onAction?: () => void;
  buttonText?: string;
  icon?: ReactNode;
  iconClassName?: string;
}

const BaseModal = ({
  title = 'Action Added Successfully',
  body = 'Your updates have been successfully saved and will take effect immediately.',
  onAction,
  buttonText,
  icon = <TickCircle size={30} className="text-green-600" />,
  iconClassName = ''
}: IBaseModalProps) => {
  const navigate = useNavigate();
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="flex flex-col justify-center items-center"
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
          <DialogClose className="w-full">
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
          </DialogClose>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BaseModal;

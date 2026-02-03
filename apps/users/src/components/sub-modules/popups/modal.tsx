import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from 'framer-motion';
import { CloseCircle } from 'iconsax-reactjs';
import React, { ReactNode } from 'react';

interface ModalProps {
  trigger: ReactNode;
  children: ReactNode;
  className?: string;
  title?: string;
  canExit?: boolean;
  open?: boolean;
  onClose?: () => void;
}

const DefaultModal: React.FC<ModalProps> = ({ title, trigger, children, className, canExit, open, onClose }) => {
  return (
    <Dialog.Root
      {...(open && { open })}
      onOpenChange={(isOpen) => {
        // When clicking the overlay or pressing Escape, Radix will request closing.
        // If the modal is controlled (open prop provided), propagate the close to parent.
        if (!isOpen) {
          // Respect canExit: only allow dismissing when true or undefined
          if (canExit ?? true) {
            onClose?.();
          }
        }
      }}
    >
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <AnimatePresence>
          <Dialog.Overlay asChild>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-ovaley/70 z-[60]"
            />
          </Dialog.Overlay>
          <Dialog.Content
            className={`fixed  left-1/2 top-1/2 z-[61] -translate-x-1/2 -translate-y-1/2 bg-white px-10 py-10
              rounded-xl w-full max-w-md focus:outline-none ${className || ''}`}
          >
            {/* {!canExit && (
              <Dialog.Close onClick={onClose}>
                <div className="top-0 right-0 absolute mt-[21px] mr-[28px]">
                  <CloseCircle />
                </div>
              </Dialog.Close>
            )} */}
            <Dialog.Close onClick={onClose}>
              <div className="top-0 right-0 absolute mt-[21px] mr-[28px]">
                <CloseCircle />
              </div>
            </Dialog.Close>

            <Dialog.Close className="hidden " onClick={onClose} id={'hxza'} />
            {title && <Dialog.Title className="text-gray-600 text-lg font-semibold">{title}</Dialog.Title>}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="my-4"
            >
              {children}
            </motion.div>
          </Dialog.Content>
        </AnimatePresence>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default DefaultModal;

import PaymentCard from '@/components/sub-modules/card/e-card/debit';
import { Typography } from '@/components/sub-modules/typography/typography';
import { useDialog } from '@/hooks/use-dialog';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft2, ArrowRight2 } from 'iconsax-reactjs';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ShowCardDetailsAuth } from './show-card-details-auth';

export const CardGallery = () => {
  const { t } = useTranslation();
  const [showCardDetails, setShowCardDetails] = useState(false);
  const { close } = useDialog();

  return (
    <motion.div
      className="bg-white py-[15px] rounded-[10px] px-[54px] flex justify-between items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.2 }}>
        <ArrowLeft2 size={24} />
      </motion.div>

      <div className="flex gap-[32px]">
        <motion.div
          className="flex flex-col gap-y-[16px]"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.div
            whileHover={{
              scale: 1.05,
              rotateY: 5,
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
            }}
            transition={{ duration: 0.3 }}
          >
            <PaymentCard
              holderName={t('placeholders.firstName') + ' ' + t('placeholders.lastName')}
              isEnabled={false}
              width="w-80"
              height="h-[179px]"
              gradientFrom="from-purple-500"
              gradientVia="via-pink-500"
              gradientTo="to-red-500"
              className="transition-all duration-300 shadow-none"
            />
          </motion.div>

          <motion.div
            className="flex items-center justify-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <ShowCardDetailsAuth
              onSubmit={() => {
                setShowCardDetails(true);
                close();
              }}
              onReset={() => {
                setShowCardDetails(false);
              }}
              showCardDetails={showCardDetails}
            />
          </motion.div>
        </motion.div>

        <AnimatePresence>
          {showCardDetails && (
            <motion.div
              className="flex flex-col justify-between h-full py-2 gap-y-[11px]"
              initial={{ opacity: 0, x: 20, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.8 }}
              transition={{
                duration: 0.4,
                ease: 'easeOut',
                type: 'spring',
                stiffness: 200,
                damping: 20
              }}
            >
              <motion.div
                className="space-y-[7px]"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Typography className="font-bold">Card Number</Typography>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Typography>9105403011957133</Typography>
                </motion.div>
              </motion.div>

              <motion.div
                className="space-y-[7px]"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Typography className="font-bold">Expiry Date</Typography>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Typography>12/25</Typography>
                </motion.div>
              </motion.div>

              <motion.div
                className="space-y-[7px]"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <Typography className="font-bold">CVV</Typography>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Typography>125</Typography>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.2 }}>
        <ArrowRight2 size={24} />
      </motion.div>
    </motion.div>
  );
};

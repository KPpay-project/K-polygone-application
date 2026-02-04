import { useState } from 'react';
import DefaultModal from '@/components/sub-modules/popups/modal';
import { withdrawalRequestPinSchema } from '@/schema/dashboard';
import { EasyForm } from '@/components/common/forms/easy-form';
import { EasyInput } from '@/components/common/forms/easy-input';
import { Typography } from '@/components/sub-modules/typography/typography';
import { motion } from 'framer-motion';
import { cn, IconArrowRight } from 'k-polygon-assets';
import { DeviceMessage } from 'iconsax-reactjs';
import { Button } from 'k-polygon-assets';
import { TransactionConfirmation } from './transaction-confirmation';

export const WithdrawalRequest = ({ onSubmit, handler = <></>, open, onClose }: any) => {
  const formSchema = withdrawalRequestPinSchema();
  const [validated, setValidated] = useState(false);

  return (
    <DefaultModal open={open} onClose={onClose} trigger={handler} className="max-w-[500px] " canExit={!validated}>
      {validated ? (
        <TransactionConfirmation />
      ) : (
        <EasyForm
          schema={formSchema}
          defaultValues={{ pin: '' }}
          onSubmit={(values) => {
            onSubmit(values);
            setValidated(true);
          }}
        >
          <div className="space-y-4 mt-[32px] px-[45px] w-full text-center flex flex-col items-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4, type: 'spring', stiffness: 200, damping: 10 }}
              className={cn('bg-yellow-50 w-[50px] h-[50px] flex items-center justify-center rounded-full')}
            >
              <DeviceMessage size={24} className="text-yellow-600" />
            </motion.div>
            <Typography variant="h3">Enter Code</Typography>
            <EasyInput name="pin" label={'Validate this withdrawal request'} type="otp" maxLength={6} />
          </div>
          <Button
            type="submit"
            className="w-full mb-[64px] bg-primary hover:bg-brandBlue-600"
            icon={<IconArrowRight />}
          >
            Proceed
          </Button>
        </EasyForm>
      )}
    </DefaultModal>
  );
};

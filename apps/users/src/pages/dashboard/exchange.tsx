import { EasyForm } from '@/components/common/forms/easy-form';
import { EasyInput } from '@/components/common/forms/easy-input';

import { FormProgress } from '@/components/common/forms/form-progress';
import DefaultModal from '@/components/sub-modules/popups/modal';
import { Typography } from '@/components/sub-modules/typography/typography';
import { withdrawalRequestPinSchema } from '@/schema/dashboard';
import { CloseCircle, DeviceMessage } from 'iconsax-reactjs';
import { Button, cn, IconArrowRight } from 'k-polygon-assets';
import z from 'zod';
import BaseModal from '@/components/sub-modules/modal-contents/base-modal';
import { useDialog } from '@/hooks/use-dialog';
import { motion } from 'framer-motion';
import { ReactNode, useState } from 'react';
import ExchangeMoney from './exchange/components/exchange-money';

// const RateItem = ({
//   currencyPairs,
//   fromRate,
//   toRate
// }: {
//   currencyPairs: string[];
//   fromRate: number;
//   toRate: number;
// }) => {
//   return (
//     <div
//       className="w-full justify-between px-[18px] py-[16px] flex items-center
//      border-b border-[#E7EAEF]"
//     >
//       <div>
//         <div className="flex items-center gap-[10px]">
//           <Typography className="font-bold">{currencyPairs[0]}</Typography>
//           <ArrowRight size={18} />
//           <Typography className="font-bold">{currencyPairs[1]}</Typography>
//         </div>
//         <Typography className="text-[10px]">{toRate}</Typography>
//       </div>
//       <div>
//         <div className="flex items-center gap-[10px]">
//           <Typography className="font-bold">{currencyPairs[1]}</Typography>
//           <ArrowRight size={18} />
//           <Typography className="font-bold">{currencyPairs[0]}</Typography>
//         </div>
//         <Typography className="text-[10px]">{fromRate}</Typography>
//       </div>
//     </div>
//   );
// };

interface WithdrawalRequestProps {
  onSubmit: (values: { pin: string }) => void | Promise<void>;
  onClose: () => void;
  handler?: ReactNode;
  open: boolean;
}

export const TransactionConfirmation = () => {
  const { close } = useDialog();
  const [withdrawalSuccess, setWithdrawalSuccess] = useState(false);

  return withdrawalSuccess ? (
    <BaseModal
      title="Withdrawal successful"
      body="Your withdrawal request has been processed. The funds will reflect shortly, depending on your payment provider."
      onAction={() => {
        close();
      }}
    />
  ) : (
    <div className="relative ">
      <div className="flex justify-end">
        <FormProgress steps={2} currentStep={2} title="Confirm Your Request" />
      </div>

      <div className="flex items-start justify-between mt-[32px]">
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">Confirm Exchange</h1>
        <div className=" flex justify-end ">
          <CloseCircle onClick={close} />
        </div>
      </div>
      <div className="bg-brandBlue-50 px-[24px] py-[20px] rounded-[16px] [&_*]:text-[12px] flex flex-col mb-[32px] gap-[28px]">
        <div className="flex w-full items-center justify-between">
          <Typography className="font-light">Exchanged amount</Typography>
          <Typography className="font-light">1 USD</Typography>
        </div>
        <div className="flex w-full items-center justify-between">
          <Typography className="font-light">Rate</Typography>
          <Typography className="font-light">USD 1 = XOF 666.66666667</Typography>
        </div>
        <div className="flex w-full items-center justify-between">
          <Typography className="font-light">Destination</Typography>
          <Typography className="font-light">+23467788900000</Typography>
        </div>

        <div className="flex w-full items-center justify-between">
          <Typography className="font-bold">Total</Typography>
          <Typography className="font-bold">101USD</Typography>
        </div>
      </div>
      <Button
        type="submit"
        className="w-full   bg-primary hover:bg-brandBlue-600"
        icon={<IconArrowRight />}
        onClick={() => setWithdrawalSuccess(true)}
      >
        Confirm and Send
      </Button>
    </div>
  );
};

export const WithdrawalRequest = ({ onSubmit, handler = <></>, open, onClose }: WithdrawalRequestProps) => {
  const formSchema = withdrawalRequestPinSchema();
  type FormValues = z.infer<typeof formSchema>;
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
            <EasyInput<FormValues> name="pin" label={'Validate this withdrawal request'} type="otp" maxLength={6} />
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

const Exchange = () => {
  return (
    <div className="h-full p-4 md:p-8">
      <div className="max-w-xl mx-auto">
        <div className=" ">
          {/* <TodaysRates /> */}
          <ExchangeMoney />
        </div>
      </div>
    </div>
  );
};

export default Exchange;

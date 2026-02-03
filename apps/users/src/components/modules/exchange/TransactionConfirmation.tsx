import { useState } from 'react';
import BaseModal from '@/components/sub-modules/modal-contents/base-modal';
import { useDialog } from '@/hooks/use-dialog';
import { FormProgress } from '@/components/common/forms/form-progress';
import { Typography } from '@/components/sub-modules/typography/typography';
import { IconArrowRight } from 'k-polygon-assets';
import { CloseCircle } from 'iconsax-reactjs';
import { Button } from 'k-polygon-assets';

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

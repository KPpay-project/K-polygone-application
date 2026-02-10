import DefaultModal from '@/components/sub-modules/popups/modal';
import { EasyForm } from '@/components/common/forms/easy-form';
import { EasyInput } from '@/components/common/forms/easy-input';
import React from 'react';
import * as z from 'zod';

interface WithdrawalRequestProps {
  open: boolean;
  onClose: () => void;
}

const schema = z.object({
  amount: z.string()
});

const WithdrawalRequest: React.FC<WithdrawalRequestProps> = ({ open, onClose }) => {
  return (
    <DefaultModal open={open} onClose={onClose} title="Withdrawal Request" trigger={<></>}>
      <EasyForm schema={schema} onSubmit={() => {}} defaultValues={{ amount: '' }}>
        {() => (
          <>
            <EasyInput name="amount" label="Amount" disabled />
            <button className="btn w-full mt-4" disabled>
              Request Withdrawal
            </button>
          </>
        )}
      </EasyForm>
    </DefaultModal>
  );
};

export default WithdrawalRequest;

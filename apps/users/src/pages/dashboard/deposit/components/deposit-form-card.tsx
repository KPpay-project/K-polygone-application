//@ts-nocheck
import { FormProgress } from '@/components/common/forms/form-progress';
import { ModularCard } from '@/components/sub-modules/card/card';
import { UseFormReturn } from 'react-hook-form';

import { DepositFormValues, DepositMethodKey } from '../methods';
import { DepositAction } from '@/components/actions/deposit-action.tsx';
import { DEPOSITE_METHOD_ENUM } from '@/enums';
import DepositViaBank from '@/components/actions/debit-actions/deposit-via-bank.tsx';
import DepositeViaCard from '@/components/actions/debit-actions/deposite-via-card.tsx';

interface DepositFormCardProps {
  form: UseFormReturn<DepositFormValues>;
  onSubmit: (values: DepositFormValues) => void;
  selectedMethod: DepositMethodKey;
}

export const DepositFormCard = ({ selectedMethod }: DepositFormCardProps) => {
  console.log(selectedMethod);
  return (
    <div className="w-full ">
      <ModularCard className="min-h-96 px-4">
        <div className="flex items-center justify-end mb-8">
          <FormProgress currentStep={1} steps={2} title="Enter details" />
        </div>

        {selectedMethod === DEPOSITE_METHOD_ENUM.BANK && <DepositViaBank />}
        {selectedMethod === DEPOSITE_METHOD_ENUM.CARD && <DepositeViaCard />}
        {selectedMethod === DEPOSITE_METHOD_ENUM.PROVIDERS && <DepositAction />}
      </ModularCard>
    </div>
  );
};

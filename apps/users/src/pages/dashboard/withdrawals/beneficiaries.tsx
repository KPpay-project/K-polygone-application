import { EasyForm } from '@/components/common/forms/easy-form';
import { EasyInput } from '@/components/common/forms/easy-input';
import { FormProgress } from '@/components/common/forms/form-progress';
import DefaultModal from '@/components/sub-modules/popups/modal';
import { Typography } from '@/components/sub-modules/typography/typography';
import { withdrawalRequestPinSchema } from '@/schema/dashboard';
import { CloseCircle, DeviceMessage, Profile2User } from 'iconsax-reactjs';
import { cn } from 'k-polygon-assets';
import z from 'zod';
import { Button } from '@/components/ui/button';
import BaseModal from '@/components/sub-modules/modal-contents/base-modal';
import { useDialog } from '@/hooks/use-dialog';
import { motion } from 'framer-motion';
import { ReactNode, useState } from 'react';
import ModularCard from '@/components/sub-modules/card/card';
import CreateBeneficiariesActions from '@/components/actions/create-beneficiaries-action';
import { EmptyState } from '@/components/common/fallbacks';
import { FETCH_BENEFICIARIES_QUERY, DELETE_BENEFICIARY_MUTATION } from '@repo/api';
import { useQuery, useMutation } from '@apollo/client';
import { BENEFICIARY_TYPE_ENUM } from '@/enums';
import { toast } from 'sonner';

interface Beneficiary {
  id: string;
  name: string;
  number: string;
  type: string;
}

interface BeneficiariesQueryData {
  myBeneficiaries: {
    entries: Beneficiary[];
    totalEntries: number;
  };
}

const BeneficiaryItem = ({
  name,
  number,
  type,
  onClick
}: {
  name: string;
  number: string;
  type: string;
  onClick?: () => void;
}) => {
  const themes = ['text-red-600 bg-red-50', 'text-blue-600 bg-blue-50', 'text-purple-600 bg-purple-50'];
  const picked = themes?.[name.length % themes.length || 0] || themes[0];

  const getTypeLabel = (type: string) => {
    switch (type) {
      case BENEFICIARY_TYPE_ENUM.BANK:
        return 'Bank Transfer';
      case BENEFICIARY_TYPE_ENUM.MOBILE_MONEY:
        return 'Mobile Money';
      case BENEFICIARY_TYPE_ENUM.AIRTIME:
        return 'Airtime';
      case BENEFICIARY_TYPE_ENUM.WALLET_CODE:
        return 'Wallet';
      default:
        return type;
    }
  };

  return (
    <div
      className="w-full px-[18px] py-[16px] flex items-center gap-[11px] border-b border-[#E7EAEF] cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={onClick}
    >
      <div className={cn(picked, 'aspect-square p-[7px] size-[35px]  flex items-center justify-center rounded-full')}>
        {name?.[0]}
      </div>
      <div className="flex flex-col">
        <p className="text-[12px] font-bold">{name}</p>
        <p className="text-[10px] text-gray-500">
          {number} • <span className="text-[10px]">{getTypeLabel(type)}</span>
        </p>
      </div>
    </div>
  );
};

const Beneficiaries = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const { data, loading, error } = useQuery<BeneficiariesQueryData>(FETCH_BENEFICIARIES_QUERY);

  const [deleteBeneficiary, { loading: deleteLoading }] = useMutation(DELETE_BENEFICIARY_MUTATION, {
    refetchQueries: [{ query: FETCH_BENEFICIARIES_QUERY }],
    onCompleted: (data) => {
      if (data.deleteBeneficiary.success) {
        toast.success(data.deleteBeneficiary.message || 'Beneficiary deleted successfully');
        setIsDetailModalOpen(false);
        setSelectedBeneficiary(null);
      } else {
        toast.error(data.deleteBeneficiary.message || 'Failed to delete beneficiary');
      }
    },
    onError: (error) => {
      toast.error(error.message || 'An error occurred while deleting beneficiary');
    }
  });

  const handleBeneficiaryClick = (beneficiary: Beneficiary) => {
    setSelectedBeneficiary(beneficiary);
    setIsDetailModalOpen(true);
  };

  const handleDelete = () => {
    if (selectedBeneficiary) {
      deleteBeneficiary({
        variables: {
          deleteBeneficiaryId: selectedBeneficiary.id
        }
      });
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case BENEFICIARY_TYPE_ENUM.BANK:
        return 'Bank Transfer';
      case BENEFICIARY_TYPE_ENUM.MOBILE_MONEY:
        return 'Mobile Money';
      case BENEFICIARY_TYPE_ENUM.AIRTIME:
        return 'Airtime';
      case BENEFICIARY_TYPE_ENUM.WALLET_CODE:
        return 'Wallet';
      default:
        return type;
    }
  };

  const beneficiaries = (data?.myBeneficiaries?.entries || []).filter((b) => b !== null && b !== undefined);

  return (
    <ModularCard>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-[18px] font-semibold text-gray-900">Beneficiaries</h1>
        <Button className="h-8 text-xs" onClick={() => setIsAddModalOpen(true)}>
          Add beneficiary
        </Button>
      </div>
      {/* <div className="relative">
        <Input
          placeholder={'Search'}
          onChange={() => { }}
          maxLength={23}
          className="font-mono tracking-wider pr-12 h-[40px]"
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
        >
          <SearchNormal className="h-4 w-4" />
        </button>
      </div> */}

      <div className="h-full overflow-y-scroll">
        <div className="flex flex-col mt-[32px]">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <EmptyState
              icon={<Profile2User size={60} variant="Bulk" />}
              title="Error Loading Beneficiaries"
              description={error.message || 'Something went wrong. Please try again.'}
            />
          ) : beneficiaries.length > 0 ? (
            beneficiaries.map((beneficiary) => (
              <BeneficiaryItem
                key={beneficiary.id}
                name={beneficiary.name}
                number={beneficiary.number}
                type={beneficiary.type}
                onClick={() => handleBeneficiaryClick(beneficiary)}
              />
            ))
          ) : (
            <EmptyState
              icon={<Profile2User size={60} variant="Bulk" />}
              title="No Beneficiaries Found"
              description="You have not added any beneficiaries yet."
            />
          )}
        </div>
      </div>

      <DefaultModal open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} trigger={<></>} title=" ">
        <CreateBeneficiariesActions
          onSuccess={() => setIsAddModalOpen(false)}
          onClose={() => setIsAddModalOpen(false)}
        />
      </DefaultModal>

      <DefaultModal
        open={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedBeneficiary(null);
        }}
        trigger={<></>}
        title="Beneficiary Details"
      >
        {selectedBeneficiary && (
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-4">
              <div className="aspect-square p-4 size-16 flex items-center justify-center rounded-full bg-primary/10 text-primary text-2xl font-bold">
                {selectedBeneficiary.name?.[0]}
              </div>
              <div>
                <h3 className="text-lg font-semibold">{selectedBeneficiary.name}</h3>
                <p className="text-sm text-gray-500">{getTypeLabel(selectedBeneficiary.type)}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-500 text-sm">Name</span>
                <span className="font-medium text-sm">{selectedBeneficiary.name}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-500 text-sm">Number</span>
                <span className="font-medium text-sm">{selectedBeneficiary.number}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-500 text-sm">Type</span>
                <span className="font-medium text-sm">{getTypeLabel(selectedBeneficiary.type)}</span>
              </div>
            </div>

            <Button variant="destructive" className="w-full" onClick={handleDelete} disabled={deleteLoading}>
              {deleteLoading ? 'Deleting...' : 'Delete Beneficiary'}
            </Button>
          </div>
        )}
      </DefaultModal>
    </ModularCard>
  );
};

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
        <FormProgress steps={2} currentStep={2} title="Enter Details" />
      </div>

      <div className="flex items-start justify-between mt-[32px]">
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">Confirm Withdrawal</h1>
        <div className=" flex justify-end ">
          <CloseCircle onClick={close} />
        </div>
      </div>
      <div className="bg-brandBlue-50 px-[24px] py-[20px] rounded-[16px] [&_*]:text-[12px] flex flex-col mb-[32px] gap-[28px]">
        <div className="flex w-full items-center justify-between">
          <Typography className="font-light">Amount</Typography>
          <Typography className="font-light">100 USD</Typography>
        </div>
        <div className="flex w-full items-center justify-between">
          <Typography className="font-light">Fee</Typography>
          <Typography className="font-light">1 USD</Typography>
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
        // icon={<IconArrowRight />}
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
            // icon={<IconArrowRight />}
          >
            Proceed
          </Button>
        </EasyForm>
      )}
    </DefaultModal>
  );
};

// const MakeTransfer = () => {
//   const formSchema = withdrawalSchema();
//   type FormValues = z.infer<typeof formSchema>;
//   const [isOpen, setIsOpen] = useState(false);
//   function onSubmit(values: FormValues) {
//     console.log(values);
//     setIsOpen(true);
//   }

//   return (
//     <div className="bg-white flex flex-col h-full py-[32px] px-[28px] shadow-lg rounded-[16px] max-h-[90%]">
//       <div className="flex justify-end">
//         <FormProgress steps={2} currentStep={1} title="Enter Details" />
//       </div>
//       <div className="flex justify-between items-center gap-[8px] bg-gray-100 p-[12px] px-[22px] rounded-[12px] mt-[16px]">
//         <div className="flex items-center gap-1">
//           <div className="size-[20px] bg-green-600 rounded-full flex items-center justify-center">
//             <span className="text-white text-xs font-bold">$</span>
//           </div>
//           <span className="text-[14px] font-medium text-gray-500 py-2 ml-0.5">USD</span>
//           <ArrowDown2 size={20} className="text-gray-500" />
//         </div>
//         <Typography className="text-gray-500 font-bold">$1000</Typography>
//       </div>
//       <div className="mt-[16px]">
//         <EasyForm
//           schema={formSchema}
//           onSubmit={onSubmit}
//           defaultValues={{
//             paymentMethod: 'mobile_money',
//             accountNumber: '',
//             amount: ''
//           }}
//           className="gap-y-[24px]"
//         >
//           <EasySelect<FormValues>
//             label="Payment Method"
//             name="paymentMethod"
//             options={[
//               {
//                 label: 'Mobile money',
//                 value: 'mobile_money'
//               },
//               {
//                 label: 'Momo money',
//                 value: 'momo_money'
//               }
//             ]}
//           />
//           <EasyInput<FormValues> label="Amount" name="amount" type="text" placeholder="$23" />
//           <EasyInput<FormValues>
//             label="Account number/Service ID"
//             name="accountNumber"
//             placeholder="899789022222333"
//             type="text"
//           />

//           <div className="flex items-center gap-[12px] mb-[24px]">
//             <TickSquare size={24} />
//             <p>Save as Beneficiary</p>
//           </div>

//           <Button type="submit" className="w-full bg-primary hover:bg-brandBlue-600" icon={<IconArrowRight />}>
//             Proceed
//           </Button>
//         </EasyForm>
//       </div>

//       <WithdrawalRequest
//         onSubmit={() => {}}
//         open={isOpen}
//         onClose={() => {
//           setIsOpen(false);
//         }}
//       />
//     </div>
//   );
// };

const WithdrawalsBeneficiaries = () => {
  return (
    <div className="h-full p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid gap-8 ">
          <Beneficiaries />
        </div>
      </div>
    </div>
  );
};

export default WithdrawalsBeneficiaries;

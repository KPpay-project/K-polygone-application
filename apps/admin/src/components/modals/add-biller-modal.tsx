import React, { useState } from 'react';
import { SheetTrigger } from '@/components/ui/sheet';
import ReusableSheet from '@/components/shared/reusable-sheet';
import AddBillerForm from '@/components/forms/add-biller-form';

interface AddBillerModalProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onClose?: () => void;
  onSubmit: (data: { categoryName: string; description: string; status: boolean; logoFile?: File }) => Promise<void>;
  isLoading?: boolean;
}

const AddBillerModal: React.FC<AddBillerModalProps> = ({
  trigger,
  open: controlledOpen,
  onClose,
  onSubmit,
  isLoading = false
}) => {
  const [internalOpen, setInternalOpen] = useState(false);

  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen =
    controlledOpen !== undefined
      ? (open: boolean) => {
          if (!open && onClose) onClose();
        }
      : setInternalOpen;

  const handleSubmit = async (data: {
    categoryName: string;
    description: string;
    status: boolean;
    logoFile?: File;
  }) => {
    await onSubmit(data);
    setOpen(false);
  };

  return (
    <ReusableSheet
      open={isOpen}
      onOpenChange={setOpen}
      title="Add Biller"
      trigger={trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
      contentClassName="p-0 w-[450px] sm:max-w-[450px]"
      headerClassName="px-6 pt-6"
      className="p-6"
      showDivider={false}
    >
      <AddBillerForm onSubmit={handleSubmit} isLoading={isLoading} />
    </ReusableSheet>
  );
};

export default AddBillerModal;

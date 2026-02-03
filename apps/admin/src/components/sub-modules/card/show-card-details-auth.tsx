import { CustomFormMessage } from '@/components/common/forms/form-message';
import DefaultModal from '@/components/sub-modules/popups/modal';
import { Typography } from '@/components/sub-modules/typography/typography';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { transactionPinSchema } from '@/schema/dashboard';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { ArrowRight, DeviceMessage } from 'iconsax-reactjs';
import { Button, cn, Form, FormControl, FormField, FormItem, FormLabel } from 'k-polygon-assets';
import { IconArrowRight } from 'k-polygon-assets/icons';
import { useForm } from 'react-hook-form';
import z from 'zod';

interface ShowCardDetailsAuthProps {
  showCardDetails: boolean;
  onSubmit: () => void;
  onReset: () => void;
}

export const ShowCardDetailsAuth = ({ showCardDetails, onSubmit, onReset }: ShowCardDetailsAuthProps) => {
  const formSchema = transactionPinSchema();
  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pin: ''
    },
    mode: 'onChange'
  });

  return showCardDetails ? (
    <span onClick={onReset} className="bg-[#F6F6F6] py-[11px] px-[10px] rounded-[12px] gap-[5px] flex items-center">
      <Typography className="font-[300]">Hide Card Details</Typography> <ArrowRight size={16} />
    </span>
  ) : (
    <DefaultModal
      trigger={
        <span className="bg-[#F6F6F6] py-[11px] px-[10px] rounded-[12px] gap-[5px] flex items-center">
          <Typography className="font-[300]">Show Card Details</Typography> <ArrowRight size={16} />
        </span>
      }
      className="max-w-[500px]"
      canExit
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 mt-[32px] px-[45px] mb-[64px] text-center flex flex-col items-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, type: 'spring', stiffness: 200, damping: 10 }}
            className={cn('bg-yellow-50 w-[50px] h-[50px] flex items-center justify-center rounded-full')}
          >
            <DeviceMessage size={24} className="text-yellow-600" />
          </motion.div>

          <Typography variant="h3">Transaction Pin</Typography>
          <FormField
            control={form.control}
            name="pin"
            render={({ field }) => (
              <FormItem className="flex items-center justify-center flex-col">
                <FormLabel className="!text-black">Please, type in your transaction PIN.</FormLabel>
                <FormControl>
                  <div className="relative">
                    <InputOTP maxLength={6} value={field.value} onChange={field.onChange}>
                      <InputOTPGroup className="gap-3">
                        {Array.from({ length: 4 }).map((_, index) => (
                          <InputOTPSlot className="border !rounded-lg size-[46px]" key={index} index={index} />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </FormControl>
                <CustomFormMessage message={form.formState.errors.pin} scope="error" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="mt-[32px] w-full h-[46px] rounded-[10px] !py-0 bg-primary hover:bg-brandBlue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            icon={<IconArrowRight />}
          >
            Confirm
          </Button>
        </form>
      </Form>
    </DefaultModal>
  );
};

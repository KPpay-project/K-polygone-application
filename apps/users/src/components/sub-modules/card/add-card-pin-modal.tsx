import { CustomFormMessage } from '@/components/common/forms/form-message';
import { Typography } from '@/components/sub-modules/typography/typography';
import { creditCardPinSchema } from '@/schema/dashboard';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form, FormControl, FormField, FormItem } from 'k-polygon-assets';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { IconArrowRight } from 'k-polygon-assets/icons';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import z from 'zod';

const formSchema = creditCardPinSchema();
type FormValues = z.infer<typeof formSchema>;

interface AddCardPinModalProps {
  onSubmit: (pin: string) => void;
  onCancel?: () => void;
}

export const AddCardPinModal = ({ onSubmit, onCancel }: AddCardPinModalProps) => {
  const { t } = useTranslation();
  // Safe translation helper: always return a string; fall back when i18n returns the key or a non-string value
  const tr = (key: string, fallback: string): string => {
    const val = t(key);
    if (typeof val !== 'string') return fallback;
    return val === key ? fallback : val;
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pin: ''
    },
    mode: 'onChange'
  });

  const values = form.getValues();
  const isValid = useMemo(() => {
    return !!values.pin && form.formState.isValid;
  }, [values.pin, form.formState.isValid]);

  return (
    <Form {...form}>
      <Typography variant="h3" className="text-center">
        {tr('dashboard.card.createPin', 'Create PIN')}
      </Typography>
      <form
        onSubmit={form.handleSubmit((vals) => {
          onSubmit(vals.pin.replace(/\D/g, ''));
        })}
        className="space-y-4 mt-[24px] mb-[24px] text-center flex flex-col items-center"
      >
        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="pin"
            render={({ field }) => (
              <FormItem className="flex items-center justify-center flex-col">
                <FormControl>
                  <InputOTP maxLength={4} value={field.value} onChange={field.onChange}>
                    <InputOTPGroup className="gap-3 justify-center">
                      {Array.from({ length: 4 }).map((_, index) => (
                        <InputOTPSlot
                          className={`border !rounded-lg size-[46px] ${form.formState.errors.pin ? 'border-red-500' : ''}`}
                          key={index}
                          index={index}
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <CustomFormMessage message={form.formState.errors.pin} scope="error" />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-3 mt-[24px]">
          {onCancel && (
            <Button
              type="button"
              className="flex-1 h-[36px] rounded-[10px] !py-0 bg-gray-200 hover:bg-gray-300 text-gray-800"
              onClick={() => onCancel?.()}
            >
              {tr('common.cancel', 'Cancel')}
            </Button>
          )}
          <Button
            type="submit"
            className="flex-1 h-[36px] rounded-[10px] !py-0 bg-primary hover:bg-brandBlue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            icon={<IconArrowRight />}
            disabled={!isValid || form.formState.isSubmitting}
          >
            {form.formState.isSubmitting
              ? tr('common.creating', 'Creating...')
              : tr('dashboard.card.addCard', 'Add Card')}
          </Button>
        </div>
      </form>
    </Form>
  );
};

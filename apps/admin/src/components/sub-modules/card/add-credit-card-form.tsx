import { CustomFormMessage } from '@/components/common/forms/form-message';
import { Typography } from '@/components/sub-modules/typography/typography';
import { addCardSchema } from '@/schema/dashboard';
import { formatCardNumber, formatCVV, getCardType, validateExpiryDate } from '@/utils/card-formatters';
import { ExpiryDateInput } from '@/components/ui/expiry-date-input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form, FormControl, FormField, FormItem, FormLabel, Input } from 'k-polygon-assets';
import { IconArrowRight } from 'k-polygon-assets/icons';
import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import z from 'zod';

const formSchema = addCardSchema();
type FormValues = z.infer<typeof formSchema>;

interface AddCreditCardFormProps {
  onSubmit: (values: FormValues) => void;
}

export const AddCreditCardForm = ({ onSubmit }: AddCreditCardFormProps) => {
  const { t } = useTranslation();

  const dynamicFormSchema = addCardSchema() || formSchema;
  const form = useForm<FormValues>({
    resolver: zodResolver(dynamicFormSchema),
    defaultValues: {
      cardNumber: '',
      expiryDate: '',
      CVV: ''
    },
    mode: 'onChange'
  });

  const handleCardNumberChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatCardNumber(e.target.value);
      form.setValue('cardNumber', formatted);
    },
    [form]
  );

  const handleExpiryDateChange = useCallback(
    (value: string) => {
      form.setValue('expiryDate', value);
    },
    [form]
  );

  const handleCVVChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatCVV(e.target.value);
      form.setValue('CVV', formatted);
    },
    [form]
  );

  const cardNumber = form.watch('cardNumber');
  const cardType = useMemo(() => {
    return getCardType(cardNumber);
  }, [cardNumber]);

  const formValues = form.getValues();
  const isFormValid = useMemo(() => {
    return formValues.cardNumber && formValues.expiryDate && formValues.CVV && form.formState.isValid;
  }, [formValues.cardNumber, formValues.expiryDate, formValues.CVV, form.formState.isValid]);

  return (
    <Form {...form}>
      <Typography variant="h3">{t('dashboard.card.addNewCard')}</Typography>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-[32px] mb-[64px]">
        <FormField
          control={form.control}
          name="cardNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="!text-black">{t('dashboard.card.cardNumber')}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder={t('dashboard.card.placeholders.cardNumber')}
                    {...field}
                    onChange={handleCardNumberChange}
                    maxLength={23}
                    className="font-mono tracking-wider pr-12"
                  />
                  {cardType && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500 font-medium">
                      {cardType}
                    </div>
                  )}
                </div>
              </FormControl>
              <CustomFormMessage message={form.formState.errors.cardNumber} scope="error" />
            </FormItem>
          )}
        />

        <div className="flex gap-4 w-full">
          <FormField
            control={form.control}
            name="expiryDate"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="!text-black">{t('dashboard.card.expiryDate')}</FormLabel>
                <FormControl>
                  <ExpiryDateInput
                    value={field.value}
                    onChange={handleExpiryDateChange}
                    placeholder={t('dashboard.card.placeholders.expiryDate')}
                    className="font-mono"
                    name="expiryDate"
                    autoComplete="cc-exp"
                  />
                </FormControl>
                <CustomFormMessage message={form.formState.errors.expiryDate} scope="error" />
                {field.value && !validateExpiryDate(field.value) && (
                  <CustomFormMessage
                    message={{ message: t('validation.expiryDate.expired'), type: 'error' }}
                    scope="error"
                  />
                )}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="CVV"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="!text-black">{t('dashboard.card.cvv')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('dashboard.card.placeholders.cvv')}
                    {...field}
                    onChange={handleCVVChange}
                    maxLength={3}
                    type="password"
                    className="font-mono"
                  />
                </FormControl>
                <CustomFormMessage message={form.formState.errors.CVV} scope="error" />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          className="w-full mt-[32px] h-[36px] rounded-[10px] !py-0 bg-primary hover:bg-brandBlue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          icon={<IconArrowRight />}
          disabled={!isFormValid || form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? t('common.creating') : t('dashboard.card.addCard')}
        </Button>
      </form>
    </Form>
  );
};

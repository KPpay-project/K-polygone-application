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

  // Safe translation helper that always returns a string, with sensible fallbacks
  const tr = (key: string, fallback?: string): string => {
    const value = t(key, { defaultValue: fallback ?? key });
    if (typeof value === 'string') {
      // If i18n returns the key itself, use the fallback or a readable label
      if (value === key)
        return (
          fallback ??
          key
            .split('.')
            .slice(-1)[0]
            .replace(/([A-Z])/g, ' $1')
            .trim()
        );
      return value;
    }
    return (
      fallback ??
      key
        .split('.')
        .slice(-1)[0]
        .replace(/([A-Z])/g, ' $1')
        .trim()
    );
  };

  const dynamicFormSchema = addCardSchema() || formSchema;
  const form = useForm<FormValues>({
    resolver: zodResolver(dynamicFormSchema),
    defaultValues: {
      holderName: '',
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
    return (
      !!formValues.holderName &&
      !!formValues.cardNumber &&
      !!formValues.expiryDate &&
      !!formValues.CVV &&
      form.formState.isValid
    );
  }, [formValues.holderName, formValues.cardNumber, formValues.expiryDate, formValues.CVV, form.formState.isValid]);

  return (
    <Form {...form}>
      <Typography variant="h3">{tr('dashboard.card.addNewCard', 'Add New Card')}</Typography>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-[32px] mb-[64px]">
        <FormField
          control={form.control}
          name="holderName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="!text-black">{tr('dashboard.card.cardHolderName', 'Card Holder Name')}</FormLabel>
              <FormControl>
                <Input placeholder={tr('placeholders.fullName', 'Full Name')} {...field} />
              </FormControl>
              <CustomFormMessage message={form.formState.errors.holderName} scope="error" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cardNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="!text-black">{tr('dashboard.card.cardNumber', 'Card Number')}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder={tr('dashboard.card.placeholders.cardNumber', 'Enter card number')}
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
                <FormLabel className="!text-black">{tr('dashboard.card.expiryDate', 'Expiry Date')}</FormLabel>
                <FormControl>
                  <ExpiryDateInput
                    value={field.value}
                    onChange={handleExpiryDateChange}
                    placeholder={tr('dashboard.card.placeholders.expiryDate', 'MM/YY')}
                    className="font-mono"
                    name="expiryDate"
                    autoComplete="cc-exp"
                  />
                </FormControl>
                <CustomFormMessage message={form.formState.errors.expiryDate} scope="error" />
                {field.value && !validateExpiryDate(field.value) && (
                  <CustomFormMessage
                    message={{
                      message: tr('validation.expiryDate.expired', 'Card expiry date is invalid or expired.'),
                      type: 'error'
                    }}
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
                <FormLabel className="!text-black">{tr('dashboard.card.cvv', 'CVV')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={tr('dashboard.card.placeholders.cvv', 'Enter CVV')}
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

        {/* PIN creation moved to a separate modal step */}

        <Button
          type="submit"
          className="w-full mt-[32px] h-[36px] rounded-[10px] !py-0 bg-primary hover:bg-brandBlue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          icon={<IconArrowRight />}
          disabled={!isFormValid || form.formState.isSubmitting}
        >
          {form.formState.isSubmitting
            ? tr('common.creating', 'Creating...')
            : tr('dashboard.card.addCard', 'Add Card')}
        </Button>
      </form>
    </Form>
  );
};

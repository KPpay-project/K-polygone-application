import { CustomFormMessage } from '@/components/common/forms/form-message';
import { NumberInput, Currency } from '@/components/ui/input';
import { FormControl, FormField, FormItem, FormLabel } from 'k-polygon-assets/components';
import { useFormContext, FieldValues } from 'react-hook-form';

function useFormContextSafely<T extends FieldValues>() {
  try {
    return useFormContext<T>();
  } catch {
    return null;
  }
}

interface EasyNumberInputProps<TFormValues> {
  name: keyof TFormValues;
  label?: string;
  placeholder?: string;
  currency?: Currency;
  className?: string;
  containerClassName?: string;
  disabled?: boolean;
}

export function EasyNumberInput<TFormValues extends Record<string, any>>({
  name,
  label,
  placeholder,
  currency,
  className,
  containerClassName,
  disabled = false
}: EasyNumberInputProps<TFormValues>) {
  const form = useFormContextSafely<TFormValues>();

  if (!form?.control) {
    return (
      <div className={containerClassName}>
        {label && <label className="text-sm font-medium text-black mb-2 block">{label}</label>}
        <NumberInput
          placeholder={placeholder}
          currency={currency}
          className={className}
          disabled={disabled}
          onChange={() => {}}
        />
      </div>
    );
  }

  return (
    <FormField
      control={form.control}
      name={name as any}
      render={({ field }) => {
        // Convert string value to number for NumberInput, handling formatted strings
        const cleanValue = field.value ? field.value.toString().replace(/,/g, '') : '';
        const numericValue = cleanValue ? parseFloat(cleanValue) || 0 : 0;

        return (
          <FormItem className={containerClassName}>
            <FormLabel className="!text-black">{label}</FormLabel>
            <FormControl>
              <NumberInput
                value={numericValue}
                onChange={(value) => {
                  // Store the raw number as string to maintain precision
                  // This ensures LiveExchangeHandler can parse it correctly
                  field.onChange(value === 0 ? '' : value.toString());
                }}
                placeholder={placeholder}
                currency={currency}
                className={className}
                disabled={disabled}
              />
            </FormControl>
            <CustomFormMessage message={form.formState.errors[name as string] as any} scope="error" />
          </FormItem>
        );
      }}
    />
  );
}

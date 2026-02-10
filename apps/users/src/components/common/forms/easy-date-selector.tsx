import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar2 } from 'iconsax-reactjs';
import { FormControl, FormField, FormItem, FormLabel } from 'k-polygon-assets/components';
import { useFormContext, FieldValues } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { CustomFormMessage } from './form-message';

function useFormContextSafely<T extends FieldValues>() {
  try {
    return useFormContext<T>();
  } catch {
    return null;
  }
}

interface EasyDateSelectorProps<TFormValues> {
  name: keyof TFormValues;
  label?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function EasyDateSelector<TFormValues extends Record<string, any>>({
  name,
  label,
  placeholder,
  className,
  disabled = false
}: EasyDateSelectorProps<TFormValues>) {
  const { t } = useTranslation();
  const form = useFormContextSafely<TFormValues>();

  if (!form?.control) {
    return (
      <div>
        {label && <label className="!text-black">{label || t(`form.fields.${String(name)}`)}</label>}
        <div
          className={`flex h-[46px] items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg ${className} ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-default'
          }`}
        >
          <span className="text-sm text-gray-700 flex-1">{placeholder || t('form.placeholders.date')}</span>
          <Calendar2 className="w-4 h-4 text-black" />
        </div>
      </div>
    );
  }

  return (
    <FormField
      control={form.control}
      name={name as any}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel className="!text-black">{label || t(`form.fields.${String(name)}`)}</FormLabel>}
          <FormControl>
            <Popover>
              <PopoverTrigger asChild>
                <div
                  className={`flex  h-[46px]  items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 ${className} ${
                    disabled ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <span className="text-sm text-gray-700 flex-1">
                    {(field.value as any) instanceof Date
                      ? format(field.value, 'dd MMM yyyy')
                      : placeholder || t('form.placeholders.date')}
                  </span>
                  <Calendar2 className="w-4 h-4 text-black" />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={(field.value as any) instanceof Date ? field.value : undefined}
                  onSelect={(date) => field.onChange(date)}
                  initialFocus
                  disabled={disabled}
                />
              </PopoverContent>
            </Popover>
          </FormControl>
          <CustomFormMessage message={form.formState.errors[name as string] as any} scope="error" />
        </FormItem>
      )}
    />
  );
}

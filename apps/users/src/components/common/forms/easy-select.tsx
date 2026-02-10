import { CustomFormMessage } from '@/components/common/forms/form-message';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from 'k-polygon-assets/components';
import { ReactNode } from 'react';
import { useFormContext, FieldValues } from 'react-hook-form';

function useFormContextSafely<T extends FieldValues>() {
  try {
    return useFormContext<T>();
  } catch {
    return null;
  }
}

interface SelectOption {
  value: string;
  label: string;
  flag?: string;
  prefix?: string;
}

interface EasySelectProps<TFormValues> {
  name: keyof TFormValues;
  label?: string;
  defaultValue?: string;
  options: SelectOption[];
  renderOption?: (option: SelectOption) => ReactNode;
  renderValue?: (option: SelectOption | undefined) => ReactNode;
  onValueChange?: (value: string, option: SelectOption) => void;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
  defaultOption?: SelectOption;
}

export function EasySelect<TFormValues extends Record<string, any>>({
  name,
  label,
  defaultValue,
  placeholder,
  options,
  renderOption,
  renderValue,
  onValueChange,
  className,
  disabled = false,
  defaultOption
}: EasySelectProps<TFormValues>) {
  const form = useFormContextSafely<TFormValues>();

  if (!form?.control) {
    const allOptions = defaultOption ? [defaultOption, ...options] : options;
    const firstOption = allOptions[0];
    const effectiveDefaultValue = defaultValue || firstOption?.value;

    return (
      <div>
        {label && <label className="text-sm font-medium text-black mb-2 block">{label}</label>}
        <Select disabled={disabled} defaultValue={effectiveDefaultValue}>
          <SelectTrigger className={className}>
            <SelectValue placeholder={placeholder}>
              {renderValue
                ? renderValue(allOptions.find((opt) => opt.value === effectiveDefaultValue))
                : effectiveDefaultValue}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {allOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {renderOption ? (
                  renderOption(option)
                ) : (
                  <div className="flex items-center gap-2">
                    {option.flag && <span>{option.flag}</span>}
                    <span>{option.label}</span>
                    {option.prefix && <span className="text-gray-400 text-sm">({option.prefix})</span>}
                  </div>
                )}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <FormField
      control={form.control}
      name={name as any}
      render={({ field }) => {
        const allOptions = defaultOption ? [defaultOption, ...options] : options;
        const firstOption = allOptions[0];
        const effectiveValue = field.value || firstOption?.value;

        return (
          <FormItem>
            <FormLabel className="!text-black">{label}</FormLabel>
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                const selectedOption = allOptions.find((opt) => opt.value === value);
                if (selectedOption && onValueChange) {
                  onValueChange(value, selectedOption);
                }
              }}
              value={effectiveValue}
              disabled={disabled}
            >
              <FormControl>
                <SelectTrigger className={className}>
                  <SelectValue placeholder={placeholder}>
                    {renderValue ? renderValue(allOptions.find((opt) => opt.value === effectiveValue)) : effectiveValue}
                  </SelectValue>
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {allOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {renderOption ? (
                      renderOption(option)
                    ) : (
                      <div className="flex items-center gap-2">
                        {option.flag && <span>{option.flag}</span>}
                        <span>{option.label}</span>
                        {option.prefix && <span className="text-gray-400 text-sm">({option.prefix})</span>}
                      </div>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <CustomFormMessage message={form.formState.errors[name as string] as any} scope="error" />
          </FormItem>
        );
      }}
    />
  );
}

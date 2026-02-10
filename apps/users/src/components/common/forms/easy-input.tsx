import { CustomFormMessage } from '@/components/common/forms/form-message';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { FormControl, FormField, FormItem, FormLabel, Input } from 'k-polygon-assets/components';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useFormContext, FieldValues } from 'react-hook-form';

function useFormContextSafely<T extends FieldValues>() {
  try {
    return useFormContext<T>();
  } catch {
    return null;
  }
}

interface EasyInputProps<TFormValues> {
  name: keyof TFormValues;
  label?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'otp';
  showToggle?: boolean;
  className?: string;
  containerClassName?: string;
  disabled?: boolean;
  maxLength?: number;
}

export function EasyInput<TFormValues extends Record<string, any>>({
  name,
  label,
  placeholder,
  type = 'text',
  showToggle = false,
  className,
  containerClassName,
  disabled = false,
  maxLength
}: EasyInputProps<TFormValues>) {
  const [showPassword, setShowPassword] = useState(false);

  const form = useFormContextSafely<TFormValues>();

  if (!form?.control) {
    return (
      <div className={containerClassName}>
        {label && <label className="text-sm font-medium text-black mb-2 block">{label}</label>}
        <div className="relative">
          {type === 'otp' ? (
            <InputOTP maxLength={maxLength || 4}>
              <InputOTPGroup className="gap-3">
                {Array.from({ length: maxLength || 4 }).map((_, index) => (
                  <InputOTPSlot className="border !rounded-lg size-[46px]" key={index} index={index} />
                ))}
              </InputOTPGroup>
            </InputOTP>
          ) : (
            <Input
              type={type === 'password' && showPassword ? 'text' : type}
              placeholder={placeholder}
              className={className}
              disabled={disabled}
            />
          )}
          {type === 'password' && showToggle && (
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <FormField
      control={form.control}
      name={name as any}
      render={({ field }) => (
        <FormItem className={containerClassName}>
          <FormLabel className="!text-black">{label}</FormLabel>
          <div className="relative">
            <FormControl>
              {type === 'otp' ? (
                <InputOTP maxLength={maxLength || 4} value={field.value as string} onChange={field.onChange}>
                  <InputOTPGroup className="gap-3">
                    {Array.from({ length: maxLength || 4 }).map((_, index) => (
                      <InputOTPSlot className="border !rounded-lg size-[46px]" key={index} index={index} />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              ) : (
                <Input
                  type={type === 'password' && showPassword ? 'text' : type}
                  placeholder={placeholder}
                  className={className}
                  disabled={disabled}
                  {...field}
                />
              )}
            </FormControl>
            {type === 'password' && showToggle && (
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            )}
          </div>
          <CustomFormMessage message={form.formState.errors[name as string] as any} scope="error" />
        </FormItem>
      )}
    />
  );
}

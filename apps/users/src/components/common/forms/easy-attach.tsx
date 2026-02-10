import { CustomFormMessage } from '@/components/common/forms/form-message';
import { DocumentUpload } from 'iconsax-reactjs';
import { FormControl, FormField, FormItem, FormLabel } from 'k-polygon-assets/components';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { useFormContext, FieldValues } from 'react-hook-form';

function useFormContextSafely<T extends FieldValues>() {
  try {
    return useFormContext<T>();
  } catch {
    return null;
  }
}

interface EasyAttachProps<TFormValues> {
  name: keyof TFormValues;
  label?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  accept?: string;
  renderUploaded?: (fileName: string, filePath: string) => ReactNode;
}

export function EasyAttach<TFormValues extends Record<string, any>>({
  name,
  label,
  className,
  disabled = false,
  accept = '*',
  renderUploaded
}: EasyAttachProps<TFormValues>) {
  const form = useFormContextSafely<TFormValues>();
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(() => {
    try {
      return (form?.getValues ? (form.getValues(name as any) as string | null) : null) ?? null;
    } catch {
      return null;
    }
  });
  const [filePath, setFilePath] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (filePath) {
        URL.revokeObjectURL(filePath);
      }
    };
  }, [filePath]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const blobUrl = URL.createObjectURL(file);
      setFilePath(blobUrl);
      try {
        form?.setValue?.(name as any, file.name as any);
      } catch {
        //
      }
    }
  };

  const triggerUpload = () => {
    if (!disabled && inputRef.current) {
      inputRef.current.click();
    }
  };

  if (!form?.control) {
    return (
      <div>
        {label && <label className="!text-black">{label}</label>}
        <div
          className={`flex h-[46px] items-center justify-between px-3 py-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 ${className} ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={triggerUpload}
        >
          <input
            type="file"
            ref={inputRef}
            onChange={handleFileChange}
            accept={accept}
            className="hidden"
            disabled={disabled}
          />
          {fileName ? (
            renderUploaded ? (
              renderUploaded(fileName, filePath || '')
            ) : (
              <span className="text-primary flex items-center gap-1 whitespace-nowrap">
                View file <span className="text-primary">&gt;</span>
              </span>
            )
          ) : (
            <span className="text-primary bg-gray-50 px-[10px] py-[5px] rounded-[12px] flex items-center gap-[5px]">
              Choose File
              <span className="text-primary">
                <DocumentUpload size={18} />
              </span>
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <FormField
      control={form.control}
      name={name as any}
      render={() => (
        <FormItem>
          {label && <FormLabel className="!text-black">{label}</FormLabel>}
          <FormControl>
            <div
              className={`flex h-[46px] items-center justify-between px-3 py-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 ${className} ${
                disabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={triggerUpload}
            >
              <input
                type="file"
                ref={inputRef}
                onChange={handleFileChange}
                accept={accept}
                className="hidden"
                disabled={disabled}
              />
              {fileName ? (
                renderUploaded ? (
                  renderUploaded(fileName, filePath || '')
                ) : (
                  <span className="text-primary flex items-center gap-1 whitespace-nowrap">
                    View file <span className="text-primary">&gt;</span>
                  </span>
                )
              ) : (
                <span className="text-primary bg-gray-50 px-[10px] py-[5px] rounded-[12px] flex items-center gap-[5px]">
                  Choose File
                  <span className="text-primary">
                    <DocumentUpload size={18} />
                  </span>
                </span>
              )}
            </div>
          </FormControl>
          <CustomFormMessage message={form.formState.errors[name as string] as any} scope="error" />
        </FormItem>
      )}
    />
  );
}

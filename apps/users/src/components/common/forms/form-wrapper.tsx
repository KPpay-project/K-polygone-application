import { Form as KPolygonForm } from 'k-polygon-assets/components';
import { FieldValues, UseFormReturn } from 'react-hook-form';

interface FormWrapperProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  children: React.ReactNode;
  onSubmit?: (data: T) => void;
}

export function FormWrapper<T extends FieldValues>({ form, children, onSubmit }: FormWrapperProps<T>) {
  return (
    <KPolygonForm {...(form as any)}>
      <form onSubmit={onSubmit ? form.handleSubmit(onSubmit) : undefined}>{children}</form>
    </KPolygonForm>
  );
}

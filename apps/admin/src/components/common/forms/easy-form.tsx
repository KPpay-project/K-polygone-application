import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from 'k-polygon-assets';
import { Button, Form } from 'k-polygon-assets/components';
import { IconArrowRight } from 'k-polygon-assets/icons';
import { ReactNode } from 'react';
import { useForm, UseFormProps, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

//@ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type InferSchemaType<T extends z.ZodTypeAny> = T extends z.ZodObject<infer U> ? z.infer<T> : never;

interface EasyFormProps<TSchema extends z.ZodObject<any>> {
  schema?: TSchema; // Make schema optional to allow usage without validation
  defaultValues?: Partial<InferSchemaType<TSchema>>;
  onSubmit: (values: InferSchemaType<TSchema>) => void | Promise<void>;
  submitButtonText?: string;
  children: ReactNode | ((form: UseFormReturn<InferSchemaType<TSchema>>) => ReactNode);
  className?: string;
}

export function EasyForm<TSchema extends z.ZodObject<any>>({
  schema,
  defaultValues = {} as Partial<InferSchemaType<TSchema>>,
  onSubmit,
  submitButtonText,
  children,
  className
}: EasyFormProps<TSchema>) {
  const form = useForm<InferSchemaType<TSchema>>({
    // Only apply resolver if a schema is provided to avoid runtime errors
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues
  } as UseFormProps<InferSchemaType<TSchema>>);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn(className, 'space-y-4')}>
        {typeof children === 'function' ? children(form) : children}
        {submitButtonText && (
          <Button type="submit" className="w-full bg-primary hover:bg-brandBlue-600" icon={<IconArrowRight />}>
            {submitButtonText}
          </Button>
        )}
      </form>
    </Form>
  );
}

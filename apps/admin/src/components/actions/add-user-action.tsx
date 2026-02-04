import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input, Button } from 'k-polygon-assets/components';
import { useUser } from '@/hooks/use-user';
import { toast } from 'sonner';

const createSchema = z
  .object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(7, 'Phone number is required'),
    country: z.string().min(1, 'Country is required'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must include an uppercase letter')
      .regex(/[a-z]/, 'Password must include a lowercase letter')
      .regex(/[0-9]/, 'Password must include a number'),
    passwordConfirmation: z.string()
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'Passwords do not match',
    path: ['passwordConfirmation']
  });

const editSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(7, 'Phone number is required'),
  country: z.string().min(1, 'Country is required')
});

type CreateFormValues = z.infer<typeof createSchema>;
type EditFormValues = z.infer<typeof editSchema>;
type FormValues = CreateFormValues | EditFormValues;

interface AddUserActionProps {
  isEdit?: boolean;
  initialData?: Partial<EditFormValues & { id: string }>;
  onSuccess?: () => void;
}

const AddUserAction = ({ isEdit = false, initialData, onSuccess }: AddUserActionProps) => {
  const { registerUser } = useUser();

  const form = useForm<FormValues>({
    resolver: zodResolver(isEdit ? editSchema : createSchema),
    defaultValues: isEdit
      ? {
          firstName: initialData?.firstName || '',
          lastName: initialData?.lastName || '',
          email: initialData?.email || '',
          phone: initialData?.phone || '',
          country: initialData?.country || ''
        }
      : {
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          country: '',
          password: '',
          passwordConfirmation: ''
        }
  });

  const onSubmit = async (data: FormValues) => {
    if (isEdit) {
      const editData = data as EditFormValues;
      const input = {
        firstName: editData.firstName,
        lastName: editData.lastName,
        email: editData.email,
        phone: editData.phone,
        country: editData.country
      };

      try {
        toast.success('User information updated successfully');
        console.log('Update user input:', input);
        onSuccess?.();
      } catch (err: any) {
        const graphQLErr = err?.graphQLErrors?.[0]?.message;
        const networkErr = err?.networkError?.message;
        const msg = graphQLErr || networkErr || err?.message || 'An unexpected error occurred';
        toast.error('Failed to update user', { description: msg });
      }
    } else {
      const createData = data as CreateFormValues;
      const input = {
        firstName: createData.firstName,
        lastName: createData.lastName,
        email: createData.email,
        phone: createData.phone,
        country: createData.country,
        password: createData.password,
        passwordConfirmation: createData.passwordConfirmation
      };

      try {
        const result = await registerUser(input);
        const created = (result as any)?.data?.registerUser;
        if (created?.id) {
          toast.success('User account created successfully');
          form.reset({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            country: '',
            password: '',
            passwordConfirmation: ''
          });
        } else {
          toast.error('Failed to create user');
        }
      } catch (err: any) {
        const graphQLErr = err?.graphQLErrors?.[0]?.message;
        const networkErr = err?.networkError?.message;
        const msg = graphQLErr || networkErr || err?.message || 'An unexpected error occurred';
        toast.error('Failed to create user', { description: msg });
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full ">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="john.doe@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="+254712345678" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input placeholder="Kenya" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {!isEdit && (
          <>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="passwordConfirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Re-enter password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {isEdit ? 'Update User' : 'Add User'}
        </Button>
      </form>
    </Form>
  );
};

export default AddUserAction;

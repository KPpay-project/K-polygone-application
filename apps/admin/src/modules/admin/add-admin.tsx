import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from 'k-polygon-assets/components';
import { useUser } from '@/hooks/use-user';
import { toast } from 'sonner';
import { ChevronDown, Check } from 'lucide-react';
import React from 'react';

const availableRoles = [
  'Dashboard',
  'User Mgt',
  'Role Mgt',
  'Transaction mgt',
  'Country',
  'Email Template',
  'Activity log'
];

const formSchema = z
  .object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(7, 'Phone number is required'),
    role: z
      .array(
        z.enum(['Dashboard', 'User Mgt', 'Role Mgt', 'Transaction mgt', 'Country', 'Email Template', 'Activity log'])
      )
      .min(1, 'At least one role is required'),
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

type FormValues = z.infer<typeof formSchema>;

interface AddNewAdminProps {
  isEdit?: boolean;
  initialData?: Partial<FormValues>;
}

const AddNewAdmin = ({ isEdit = false, initialData }: AddNewAdminProps) => {
  const { registerAdmin } = useUser();
  const [dropdownVisible, setDropdownVisible] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: initialData?.firstName || '',
      lastName: initialData?.lastName || '',
      email: initialData?.email || '',
      phone: (initialData as any)?.phone || '',
      //role: initialData?.role || [],
      password: '',
      passwordConfirmation: ''
    }
  });

  const handleSubmit = async (data: FormValues) => {
    const payload = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      //role: data.role,
      password: data.password,
      passwordConfirmation: data.passwordConfirmation
    };

    try {
      const result = await registerAdmin(payload);
      const created = (result as any)?.data?.registerAdmin;
      if (created?.id) {
        toast.success('Admin account created successfully');
        form.reset({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          role: [],
          password: '',
          passwordConfirmation: ''
        });
      } else {
        toast.error('Failed to create admin');
      }
    } catch (err: any) {
      const graphQLErr = err?.graphQLErrors?.[0]?.message;
      const networkErr = err?.networkError?.message;
      const msg = graphQLErr || networkErr || err?.message || 'An unexpected error occurred';
      toast.error('Failed to create admin', { description: msg });
    }
  };

  const toggleRole = React.useCallback(
    (roleToToggle: string, currentRoles: string[], onChange: (value: string[]) => void) => {
      const updatedRoles = currentRoles.includes(roleToToggle)
        ? currentRoles.filter((r) => r !== roleToToggle)
        : [...currentRoles, roleToToggle];
      onChange(updatedRoles);
    },
    []
  );

  return (
    <div className="max-h-[500px] overflow-y-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
                  <Input placeholder="Frank" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="john.frank@example.com" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Roles</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full justify-between"
                      onClick={() => setDropdownVisible(!dropdownVisible)}
                    >
                      {field.value?.length > 0
                        ? `${field.value.length} role${field.value.length > 1 ? 's' : ''} selected`
                        : 'Select roles...'}
                      <ChevronDown
                        className={`ml-2 h-4 w-4 transition-transform ${dropdownVisible ? 'rotate-180' : ''}`}
                      />
                    </Button>

                    {dropdownVisible && (
                      <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                        <div className="p-2 max-h-60 overflow-y-auto">
                          {availableRoles.map((roleOption) => {
                            const isRoleSelected = field.value?.includes(roleOption as any) || false;
                            return (
                              <div
                                key={roleOption}
                                className="flex items-center space-x-2 p-2 hover:bg-gray-50 cursor-pointer rounded"
                                onClick={() => toggleRole(roleOption, field.value || [], field.onChange)}
                              >
                                <div
                                  className={`h-4 w-4 border rounded flex items-center justify-center ${isRoleSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}
                                >
                                  {isRoleSelected && <Check className="h-3 w-3 text-white" />}
                                </div>
                                <span className="text-sm">{roleOption}</span>
                              </div>
                            );
                          })}
                        </div>
                        {field.value?.length > 0 && (
                          <div className="border-t p-2">
                            <div className="text-xs text-gray-500 mb-1">Selected roles:</div>
                            <div className="text-xs text-blue-600">{field.value.join(', ')}</div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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

          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {isEdit ? 'Update Admin' : 'Create Admin'}
          </Button>
        </form>
      </Form>

      {dropdownVisible && <div className="fixed inset-0 z-40" onClick={() => setDropdownVisible(false)} />}
    </div>
  );
};

export default AddNewAdmin;

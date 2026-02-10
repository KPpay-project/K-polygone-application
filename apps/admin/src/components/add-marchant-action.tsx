import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input, Button } from 'k-polygon-assets/components';
import { useUser } from '@/hooks/use-user';
import { toast } from 'sonner';
import { add_marchant_schema } from '@/schema/add-marchant-schema.ts';

const formSchema = add_marchant_schema;

type FormValues = z.infer<typeof formSchema>;

const AddMarchantAction = () => {
  const { registerMerchant } = useUser();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: '',
      email: '',
      phone: '',
      businessType: '',
      businessWebsite: '',
      businessDescription: '',
      password: '',
      passwordConfirmation: ''
    }
  });

  const onSubmit = async (data: FormValues) => {
    const input = {
      businessName: data.businessName,
      email: data.email,
      phone: data.phone,
      businessType: data.businessType,
      businessWebsite: data.businessWebsite || undefined,
      businessDescription: data.businessDescription || undefined,
      password: data.password,
      passwordConfirmation: data.passwordConfirmation
    };

    try {
      const result = await registerMerchant(input);
      const created = (result as any)?.data?.registerMerchant;
      if (created?.id) {
        toast.success('Merchant account created successfully');
        form.reset({
          businessName: '',
          email: '',
          phone: '',
          businessType: '',
          businessWebsite: '',
          businessDescription: '',
          password: '',
          passwordConfirmation: ''
        });
      } else {
        toast.error('Failed to create merchant');
      }
    } catch (err: any) {
      const graphQLErr = err?.graphQLErrors?.[0]?.message;
      const networkErr = err?.networkError?.message;
      const msg = graphQLErr || networkErr || err?.message || 'An unexpected error occurred';
      toast.error('Failed to create merchant', { description: msg });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full h-[600px] overflow-y-auto">
        <FormField
          control={form.control}
          name="businessName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Name</FormLabel>
              <FormControl>
                <Input placeholder="Example Store" {...field} />
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
                <Input type="email" placeholder="contact@examplestore.com" {...field} />
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
                <Input placeholder="1234567890" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="businessType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Type</FormLabel>
              <FormControl>
                <Input placeholder="retail" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="businessWebsite"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Website</FormLabel>
              <FormControl>
                <Input placeholder="https://examplestore.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="businessDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Description</FormLabel>
              <FormControl>
                <Input placeholder="A retail store selling example products" {...field} />
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
          Add Merchant
        </Button>
      </form>
    </Form>
  );
};

export default AddMarchantAction;

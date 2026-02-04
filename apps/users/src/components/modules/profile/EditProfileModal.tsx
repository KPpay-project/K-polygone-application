import DefaultModal from '@/components/sub-modules/popups/modal';
import { CustomFormMessage } from '@/components/common/forms/form-message';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form, FormControl, FormField, FormItem, FormLabel, Input } from 'k-polygon-assets';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import z from 'zod';

export type EditProfileModalUser = { firstName: string; lastName: string; email: string } | null;

export function EditProfileModal({
  isOpen,
  onClose,
  userData
}: {
  isOpen: boolean;
  onClose: () => void;
  userData: EditProfileModalUser;
}) {
  const { t } = useTranslation();
  const formSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address')
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: userData?.firstName || '',
      lastName: userData?.lastName || '',
      email: userData?.email || ''
    }
  });

  useEffect(() => {
    if (userData) {
      form.reset({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || ''
      });
    }
  }, [userData, form]);

  const onSubmit = (values: FormValues) => {
    // Placeholder for integration
    console.log('Profile update values:', values);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <DefaultModal
      open={isOpen}
      onClose={onClose}
      canExit={true}
      title="Edit Profile"
      trigger={<div />}
      className="max-w-lg"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('auth.createAccount.firstName')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('placeholders.firstName')} {...field} disabled />
                </FormControl>
                <CustomFormMessage message={form.formState.errors.firstName} scope="error" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('auth.createAccount.lastName')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('placeholders.lastName')} {...field} disabled />
                </FormControl>
                <CustomFormMessage message={form.formState.errors.lastName} scope="error" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('auth.createAccount.email')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('placeholders.email')} {...field} disabled />
                </FormControl>
                <CustomFormMessage message={form.formState.errors.email} scope="error" />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="px-6" disabled>
              Cancel
            </Button>
            <Button type="submit" className="px-6 bg-primary hover:bg-primary/90" disabled>
              Update Profile
            </Button>
          </div>
        </form>
      </Form>
    </DefaultModal>
  );
}

export default EditProfileModal;

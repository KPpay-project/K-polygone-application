import { CustomFormMessage } from '@/components/common/forms/form-message.tsx';
import { Typography } from '@/components/sub-modules/typography/typography.tsx';
import { editProfileSchema } from '@/schema/dashboard.ts';
import { useUser } from '@/store/user-store.ts';
import { genders } from '@/utils/constants.ts';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from 'k-polygon-assets';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMe } from '@/hooks/api/use-me.tsx';
import z from 'zod';
import ProfileFormSkeleton from './ProfileFormSkeleton.tsx';

const PersonalProfileDetails = () => {
  const [editMode, setEditMode] = useState(false);
  const formSchema = editProfileSchema();
  type FormValues = z.infer<typeof formSchema>;
  const { t } = useTranslation();
  const user = useUser();
  const { loading: meLoading } = useMe();

  const effectiveUser = user || null;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: effectiveUser?.firstName || '',
      lastName: effectiveUser?.lastName || '',
      email: effectiveUser?.email || '',
      phone: effectiveUser?.phone || '',
      gender: '',
      dateOfBirth: ''
    }
  });

  useEffect(() => {
    if (effectiveUser) {
      form.reset({
        firstName: effectiveUser.firstName || '',
        lastName: effectiveUser.lastName || '',
        email: effectiveUser.email || '',
        phone: effectiveUser?.phone || '',
        gender: '',
        dateOfBirth: ''
      });
    }
  }, [effectiveUser, user, form]);

  function onSubmit(values: FormValues) {
    console.log(values);
  }

  if (meLoading) {
    return <ProfileFormSkeleton />;
  }

  return (
    <div className="border  h-full rounded-[16px] border-gray-200 px-[44px] py-[16px]">
      <div className="flex items-center justify-between">
        <Typography className="text-xl font-bold">Personal Details</Typography>
      </div>

      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-[32px] space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('auth.createAccount.firstName')}</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder={t('placeholders.firstName')} disabled {...field} />
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
                      <Input type="text" disabled placeholder={t('placeholders.lastName')} {...field} />
                    </FormControl>
                    <CustomFormMessage message={form.formState.errors.lastName} scope="error" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-3">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('auth.createAccount.email')}</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder={t('placeholders.email')} disabled {...field} />
                    </FormControl>
                    <CustomFormMessage message={form.formState.errors.email} scope="error" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="!text-black">{t('auth.createAccount.phone')}</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder={''} disabled {...field} />
                    </FormControl>
                    <CustomFormMessage message={form.formState.errors.phone} scope="error" />
                  </FormItem>
                )}
              />
            </div>

            {/* Optional extra fields (kept wired but could be hidden or future-proofed) */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={'N/A'} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {genders.map((g) => (
                          <SelectItem key={g.value} value={g.value}>
                            {g.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <CustomFormMessage message={form.formState.errors.gender} scope="error" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder={'N/A'} disabled {...field} />
                    </FormControl>
                    <CustomFormMessage message={form.formState.errors.dateOfBirth} scope="error" />
                  </FormItem>
                )}
              />
            </div>

            {editMode && (
              <div className="flex justify-start gap-[16px]">
                <Button
                  onClick={() => {
                    setEditMode(false);
                  }}
                  className="w-[177px] h-[42px] rounded-[10px] mt-[32px] bg-gray-100 hover:bg-gray-100/10 text-black"
                >
                  Discard Changes
                </Button>
                <Button
                  type="submit"
                  className="w-[177px] h-[42px] rounded-[10px] mt-[32px] bg-primary hover:bg-brandBlue-600"
                >
                  Save Changes
                </Button>
              </div>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
};

export default PersonalProfileDetails;

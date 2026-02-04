//@ts-nocheck
import { CustomFormMessage } from '@/components/common/forms/form-message';
import DefaultModal from '@/components/sub-modules/popups/modal';
import { Typography } from '@/components/sub-modules/typography/typography';
import { Avatar } from '@/components/ui/avatar';
import { useMe } from '@/hooks/api/use-me';
import { useProfileStore } from '@/store/profile-store';
import { editProfileAddressSchema, editProfileSchema } from '@/schema/dashboard';
import { useUser /* useUserStatus */ } from '@/store/user-store';
import { countries } from '@/utils/constants';
import { zodResolver } from '@hookform/resolvers/zod';
import { Edit } from 'iconsax-reactjs';
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton
} from 'k-polygon-assets';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import z from 'zod';

const EditButton = ({ onClick }: { onClick?: () => void }) => {
  return (
    <div
      onClick={onClick}
      className="px-[15px] py-[3.5px] flex border items-center gap-[5px] border-gray-200 rounded-full cursor-pointer hover:bg-gray-50 transition-colors"
    >
      <Typography>Edit</Typography>
      <Edit size={16} />
    </div>
  );
};

const EditProfileModal = ({
  isOpen,
  onClose,
  userData
}: {
  isOpen: boolean;
  onClose: () => void;
  userData: { firstName: string; lastName: string; email: string } | null;
}) => {
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
};

const BasicProfileDetails = () => {
  const profile = useProfileStore((state) => state.profile);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const user = useUser();

  const { data: meData } = useMe();

  const storeUser = profile?.user;
  const meUser = meData?.me?.user;
  const effectiveUser = storeUser || meUser || user || null;

  const displayName = effectiveUser ? `${effectiveUser.firstName} ${effectiveUser.lastName}` : 'N/A';
  const userEmail = effectiveUser?.email || 'N/A';

  const getUserInitials = () => {
    const firstName = effectiveUser?.firstName;
    const lastName = effectiveUser?.lastName;
    if (!firstName || !lastName) return 'U';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const userData = {
    firstName: effectiveUser?.firstName || '',
    lastName: effectiveUser?.lastName || '',
    email: effectiveUser?.email || ''
  };

  return (
    <>
      <div className="border flex justify-between rounded-[16px] border-gray-200 px-[32px] py-[16px] ">
        <div className="flex gap-[6px]">
          <Avatar className="size-[45px] bg-blue-100 text-blue-800 font-semibold flex items-center justify-center">
            {getUserInitials()}
          </Avatar>
          <div className="flex flex-col">
            <div className="flex gap-[8px] items-center">
              <Typography className="text-black font-medium text-xl">{displayName}</Typography>
              {/* <span className={`px-[10px] py-[2.5px] rounded-full ${statusInfo.className}`}>{statusInfo.text}</span> */}
            </div>
            <Typography className="text-gray-700 text-md">{userEmail}</Typography>
          </div>
        </div>

        {/*<div className="my-auto">*/}
        {/*  <EditButton onClick={() => setIsEditModalOpen(true)} />*/}
        {/*</div>*/}
      </div>

      <EditProfileModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} userData={userData} />
    </>
  );
};

const ProfileFormSkeleton = () => (
  <div className="border rounded-[16px] border-gray-200 px-[44px] py-[16px]">
    <div className="flex items-center justify-between mb-8">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-8 w-16 rounded-full" />
    </div>

    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  </div>
);

const PersonalProfileDetails = () => {
  const [editMode, setEditMode] = useState(false);
  const formSchema = editProfileSchema();
  type FormValues = z.infer<typeof formSchema>;
  const { t } = useTranslation();
  const [selectedPhoneCountry, setSelectedPhoneCountry] = useState(countries[0]);
  const user = useUser();
  const { data: meData, loading: meLoading } = useMe();

  const meUser = meData?.me?.user;

  const effectiveUser = meUser || null;
  console.log(user, 'data users');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: effectiveUser?.firstName || '',
      lastName: effectiveUser?.lastName || '',
      email: effectiveUser?.email || '',
      phone: user?.phone || ''
    }
  });

  useEffect(() => {
    if (effectiveUser) {
      form.reset({
        firstName: effectiveUser.firstName || '',
        lastName: effectiveUser.lastName || '',
        email: effectiveUser.email || '',
        phone: user?.phone || ''
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
    <div className="border  rounded-[16px] border-gray-200 px-[44px] py-[16px]">
      <div className="flex items-center justify-between">
        <Typography className="text-lg font-medium">Personal Details</Typography>
        {/*{!editMode && (
          <EditButton
            onClick={() => {
              setEditMode(true);
            }}
          />
        )}*/}
      </div>

      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-[32px] space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="!text-black">{t('auth.createAccount.firstName')}</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder={t('placeholders.firstName')} disabled {...field} />
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
                    <FormLabel className="!text-black">{t('auth.createAccount.lastName')}</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder={t('placeholders.lastName')} disabled {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="!text-black">{t('auth.createAccount.email')}</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder={t('placeholders.email')} disabled {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                disabled
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="!text-black">{t('auth.createAccount.phone')}</FormLabel>
                    <div className="flex items-center relative">
                      <div className="absolute flex items-center ">
                        <Select
                          onValueChange={(value) => {
                            const country = countries.find((c) => c.code === value);
                            if (country) {
                              setSelectedPhoneCountry(country);
                            }
                          }}
                          defaultValue={selectedPhoneCountry.code}
                        >
                          <FormControl>
                            <SelectTrigger className="h-10 focus:border-0 border-0 focus:outline-0 outline-0 rounded-0 shadow-none">
                              <SelectValue>
                                <div className="flex items-center gap-2 pr-3">
                                  <span>{selectedPhoneCountry.flag}</span>
                                </div>
                              </SelectValue>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {countries.map((country) => (
                              <SelectItem key={country.code} value={country.code}>
                                <div className="flex items-center gap-2">
                                  <span>{country.flag}</span>
                                  <span className="text-sm">{t(`countries.${country.code}`)}</span>
                                  <span className="text-gray-400 text-xs">({country.prefix})</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <span className="text-sm text-[#6C727F]">{selectedPhoneCountry.prefix}</span>
                      </div>
                      <div className="flex-1">
                        <Input className="pl-24 !rounded-0" type="tel" placeholder={''} {...field} />
                      </div>
                    </div>
                    <CustomFormMessage message={form.formState.errors.phone} scope="error" />
                  </FormItem>
                )}
              />
            </div>

            {/*<div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="!text-black">Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="N/A" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {genders.map((gender) => (
                          <SelectItem key={gender.value} value={gender.value}>
                            {gender.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="!text-black">Date of Birth</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="N/A" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>*/}

            {editMode && (
              <div className="flex justify-start gap-[16px]">
                <Button
                  type="button"
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

/* eslint-disable */
const PersonalProfileAddressDetails = () => {
  const [editMode, setEditMode] = useState(false);
  const formSchema = editProfileAddressSchema();
  type FormValues = z.infer<typeof formSchema>;
  function onSubmit(values: FormValues) {
    console.log(values);
  }

  return (
    <div className="border  rounded-[16px] border-gray-200 px-[44px] py-[16px]">
      <div className="flex items-center justify-between">
        <Typography className="text-xl font-bold">Address</Typography>
        {!editMode && (
          <EditButton
            onClick={() => {
              setEditMode(true);
            }}
          />
        )}
      </div>

      <div>
        <EasyForm
          schema={formSchema}
          defaultValues={{
            country: '',
            street: '',
            city: '',
            timezone: ''
          }}
          onSubmit={onSubmit}
          className="mt-[32px]"
        >
          <div className="grid grid-cols-2 gap-4">
            <EasySelect<FormValues>
              name="country"
              options={countries.map((country) => ({ label: country.name, value: country.code }))}
              label="Country"
            />
            <EasyInput<FormValues> name="street" type="text" label="Street" placeholder={'N/A'} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <EasySelect<FormValues>
              name="city"
              options={countries.map((country) => ({ label: country.name, value: country.code }))}
              label="City"
            />
            <EasyInput<FormValues> name="timezone" type="text" placeholder={'N/A'} label="Timezone" />
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
        </EasyForm>
      </div>
    </div>
  );
};

const SettingsMyProfile = () => {
  return (
    <div className="space-y-[16px] h-full overflow-y-auto">
      <BasicProfileDetails />
      <PersonalProfileDetails />
      {/*<PersonalProfileAddressDetails />*/}
    </div>
  );
};

export default SettingsMyProfile;

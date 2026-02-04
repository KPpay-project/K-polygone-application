import { EasyForm } from '@/components/common/forms/easy-form';
import { EasyInput } from '@/components/common/forms/easy-input';
import { EasySelect } from '@/components/common/forms/easy-select';
import { CustomFormMessage } from '@/components/common/forms/form-message';
import { Typography } from '@/components/sub-modules/typography/typography';
import { useMe } from '@/hooks/api/use-me';
import { editProfileSchema } from '@/schema/dashboard';
import { useProfileStore } from '@/store/profile-store';
import { useUser } from '@/store/user-store';
import { countries, genders } from '@/utils/constants';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
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
import z from 'zod';
import EditButton from './EditButton';
import ProfileFormSkeleton from './ProfileFormSkeleton';

const PersonalProfileDetails = () => {
  const profile = useProfileStore((state) => state.profile);
  const [editMode, setEditMode] = useState(false);
  const formSchema = editProfileSchema();
  type FormValues = z.infer<typeof formSchema>;
  const { t } = useTranslation();
  const [selectedPhoneCountry, setSelectedPhoneCountry] = useState(countries[0]);
  const user = useUser();
  const { data: meData, loading: meLoading } = useMe();

  const meUser = meData?.me?.user;
  const effectiveUser = profile?.user || meUser || user || null;

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
        <Typography className="text-xl font-bold">Personal Details</Typography>
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
            firstName: effectiveUser?.firstName || '',
            lastName: effectiveUser?.lastName || '',
            email: effectiveUser?.email || '',
            phone: user?.phone || ''
          }}
          onSubmit={onSubmit}
          className="mt-[32px]"
        >
          <div className="grid grid-cols-2 gap-4">
            <EasyInput<FormValues>
              name="firstName"
              type="text"
              placeholder={t('placeholders.firstName')}
              label={t('auth.createAccount.firstName')}
            />
            <EasyInput<FormValues>
              name="lastName"
              type="text"
              placeholder={t('placeholders.lastName')}
              label={t('auth.createAccount.lastName')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-3">
            <EasyInput<FormValues>
              name="email"
              type="text"
              placeholder={t('placeholders.email')}
              label={t('auth.createAccount.email')}
              disabled
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

          <div className="grid grid-cols-2 gap-4">
            <EasySelect<FormValues> name="gender" options={genders} placeholder={'N/A'} label={'Gender'} />
            <EasyInput<FormValues> name="dateOfBirth" type="text" placeholder={'N/A'} label={'Date of Birth'} />
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

export default PersonalProfileDetails;

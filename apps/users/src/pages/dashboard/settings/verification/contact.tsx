import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { DashboardSubHeader } from '@/components/modules/header/dashboard-sub-header.tsx';
import { contactInfoSchema } from '@/schema/dashboard';
import { Button } from 'k-polygon-assets';
import { Form, FormControl, FormField, FormItem, FormLabel, Input } from 'k-polygon-assets/components';
import { useNavigate } from '@tanstack/react-router';
import { IconArrowRight } from 'k-polygon-assets/icons';
import { useCreateContactDetail } from '@/hooks/api/use-create-contact-detail';
import { ContactDetailInput, FieldError } from '@repo/types';
import { z, ZodIssue } from 'zod';
import { Loading } from '@/components/common';
import { CustomFormMessage } from '@/components/common/forms/form-message';
import React from 'react';
import { useKycContactInfoStore } from '@/store/kyc';
import { CountrySelector } from '@/components/common';
import { StateSelector } from '@/components/common/state-selector';
import { PrimaryPhoneNumberInput } from '@/components/common/inputs/primary-phone-number-input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { OtpInputAction } from '@/components/actions/otp-input';

const ContactVerificationScreen = () => {
  const navigate = useNavigate();
  const formSchema = contactInfoSchema();
  type FormValues = z.infer<typeof formSchema>;
  const [validationErrors, setValidationErrors] = React.useState<ZodIssue[] | null>(null);
  const kycStore = useKycContactInfoStore();
  const [isSendingOtp, setIsSendingOtp] = React.useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = React.useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = React.useState(false);
  const [isSendingEmailVerification, setIsSendingEmailVerification] = React.useState(false);
  const [isEmailVerificationSent, setIsEmailVerificationSent] = React.useState(false);

  const handleSendOtp = async () => {
    const phoneNumber = form.getValues('primaryPhone');
    if (!phoneNumber) {
      toast.error('Please enter a phone number first');
      return;
    }

    setIsSendingOtp(true);

    // Show loading toast
    const toastId = toast.loading('Sending OTP...');

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSendingOtp(false);
    toast.success('OTP sent successfully!', { id: toastId });
    setIsOtpModalOpen(true);
  };

  const handleVerifyOtp = async (otp: string): Promise<{ success: boolean; message: string }> => {
    // Simulate API verification call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simulate success (in real app, this would be API response)
    // For demo, any 6-digit OTP will succeed
    if (otp.length === 6) {
      return { success: true, message: 'Phone number verified successfully!' };
    }
    return { success: false, message: 'Invalid OTP. Please try again.' };
  };

  const handleOtpSuccess = () => {
    setIsPhoneVerified(true);
    toast.success('Phone number verified successfully!');
  };

  const handleSendEmailVerification = async () => {
    const email = form.getValues('email');
    if (!email) {
      toast.error('Please enter an email address first');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSendingEmailVerification(true);

    // Show loading toast
    const toastId = toast.loading('Sending verification email...');

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSendingEmailVerification(false);
    setIsEmailVerificationSent(true);
    toast.success(`Verification email sent to ${email}!`, { id: toastId });
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      country: 'NG',
      street: '',
      city: '',
      postalCode: '',
      mailingAddress1: '',
      mailingAddress2: '',
      primaryPhone: '',
      secondaryPhone: '',
      email: '',
      addressProofUrl: null
    }
  });

  React.useEffect(() => {
    const s = kycStore;
    if (!s) return;
    const hasAny = !!(
      s.country ||
      s.street ||
      s.city ||
      s.postalCode ||
      s.mailingAddress1 ||
      s.mailingAddress2 ||
      s.primaryPhone ||
      s.secondaryPhone ||
      s.email
    );
    if (hasAny) {
      form.reset({
        country: s.country || 'NG',
        street: s.street || '',
        city: s.city || '',
        postalCode: s.postalCode || '',
        mailingAddress1: s.mailingAddress1 || '',
        mailingAddress2: s.mailingAddress2 || '',
        primaryPhone: s.primaryPhone || '',
        secondaryPhone: s.secondaryPhone || '',
        email: s.email || ''
      });
    }
  }, []);

  const {
    createContactDetail,
    loading: createContactDetailLoading,
    data: createContactDetailData
  } = useCreateContactDetail();

  async function onSubmit(values: FormValues & { addressProofUrl: File | null }) {
    try {
      setValidationErrors(null);
      kycStore.setAll({
        country: values.country || 'nigeria',
        street: values.street || '',
        city: values.city || '',
        postalCode: values.postalCode || '',
        mailingAddress1: values.mailingAddress1 || '',
        mailingAddress2: values.mailingAddress2 || '',
        primaryPhone: values.primaryPhone || '',
        secondaryPhone: values.secondaryPhone || '',
        email: values.email || ''
      });

      const validationResult = formSchema.safeParse(values);
      if (!validationResult.success) {
        setValidationErrors(validationResult.error.issues);
        return;
      }

      if (!values.addressProofUrl) {
        setValidationErrors([{ path: ['addressProofUrl'], message: 'Address proof file is required' }] as any);
        return;
      }

      const input: ContactDetailInput = {
        residentialStreet: values.street,
        residentialCity: values.city,
        residentialPostalCode: values.postalCode,
        residentialCountry: values.country,
        primaryPhone: values.primaryPhone,
        emailAddress: values.email,
        addressProofUrl: values.addressProofUrl
      };

      const response = await createContactDetail({
        variables: {
          input
        }
      });

      if (response.data?.createContactDetail.success) {
        navigate({ to: '/settings/verifications/political-exposure' });
      }
    } catch (error) {
      console.error('Error creating contact detail:', error);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <DashboardSubHeader
        title={'Contact Information'}
        content={'Provide your contact details for verification.'}
        steps={7}
        currentStep={3}
      />

      <div className="mt-8 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        {createContactDetailLoading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Loading />
          </div>
        )}
        {(validationErrors ||
          (createContactDetailData?.createContactDetail.errors &&
            createContactDetailData.createContactDetail.errors.length > 0)) && (
          <div className="mb-4 p-4 bg-red-50 border border-red-100 rounded-lg text-red-700">
            {validationErrors && (
              <ul className="list-disc pl-4 mb-2">
                {validationErrors.map((error: ZodIssue, index: number) => (
                  <li key={index}>{`${error.path.join('.')}: ${error.message}`}</li>
                ))}
              </ul>
            )}
            {createContactDetailData?.createContactDetail.errors &&
              createContactDetailData.createContactDetail.errors.length > 0 && (
                <ul className="list-disc pl-4">
                  {createContactDetailData.createContactDetail.errors.map((error: FieldError, index: number) => (
                    <li key={index}>{`${error.field}: ${error.message}`}</li>
                  ))}
                </ul>
              )}
          </div>
        )}
        <Form {...(form as any)}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" encType="multipart/form-data">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="addressProofUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Proof of Address (Upload)</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*,application/pdf"
                        required
                        onChange={(e) => {
                          const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
                          field.onChange(file);
                        }}
                        disabled={createContactDetailLoading}
                      />
                    </FormControl>
                    <CustomFormMessage message={form.formState.errors.addressProofUrl} scope="error" />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control as any}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <CountrySelector
                        value={field.value}
                        onValueChange={(value: string, country: { code: string }) => {
                          field.onChange(country.code);
                          form.setValue('city', '');
                        }}
                        placeholder="Select country"
                        disabled={createContactDetailLoading}
                        hasFlag
                        showPrefix={false}
                        className="max-h-[300px] overflow-y-auto"
                      />
                    </FormControl>
                    <CustomFormMessage message={form.formState.errors.country} scope="error" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control as any}
                name="street"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street and Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter street" required {...field} disabled={createContactDetailLoading} />
                    </FormControl>
                    <CustomFormMessage message={form.formState.errors.street} scope="error" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control as any}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <StateSelector
                        value={field.value}
                        countryCode={form.getValues('country')}
                        onValueChange={field.onChange}
                        placeholder="Select city"
                        disabled={createContactDetailLoading}
                        className="max-h-[300px] overflow-y-auto"
                      />
                    </FormControl>
                    <CustomFormMessage message={form.formState.errors.city} scope="error" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control as any}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postal Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter postal code"
                        required
                        {...field}
                        disabled={createContactDetailLoading}
                      />
                    </FormControl>
                    <CustomFormMessage message={form.formState.errors.postalCode} scope="error" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control as any}
                name="mailingAddress1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mailing Address (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter mailing address" {...field} disabled={createContactDetailLoading} />
                    </FormControl>
                    <CustomFormMessage message={form.formState.errors.mailingAddress1} scope="error" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control as any}
                name="mailingAddress2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mailing Address (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter mailing address" {...field} disabled={createContactDetailLoading} />
                    </FormControl>
                    <CustomFormMessage message={form.formState.errors.mailingAddress2} scope="error" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control as any}
                name="primaryPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <PrimaryPhoneNumberInput
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        disabled={createContactDetailLoading || isSendingOtp || isPhoneVerified}
                        placeholder="Enter Primary Phone Number"
                      />
                    </FormControl>
                    <CustomFormMessage message={form.formState.errors.primaryPhone} scope="error" />
                    {isPhoneVerified ? (
                      <Badge variant="default" className="bg-green-500 hover:bg-green-500 cursor-default">
                        ✓ Verified
                      </Badge>
                    ) : (
                      <Badge onClick={handleSendOtp} variant="secondary" className="cursor-pointer hover:bg-gray-200">
                        {isSendingOtp ? 'Sending OTP...' : 'Send OTP'}
                      </Badge>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control as any}
                name="secondaryPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Secondary Phone Number (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="Enter Secondary Phone Number"
                        {...field}
                        disabled={createContactDetailLoading}
                      />
                    </FormControl>
                    <CustomFormMessage message={form.formState.errors.secondaryPhone} scope="error" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-6">
              <FormField
                control={form.control as any}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="janeunin@gmail.com"
                        {...field}
                        disabled={createContactDetailLoading || isSendingEmailVerification || isEmailVerificationSent}
                      />
                    </FormControl>
                    <CustomFormMessage message={form.formState.errors.email} scope="error" />
                    {isEmailVerificationSent ? (
                      <Badge variant="default" className="bg-green-500 hover:bg-green-500 cursor-default">
                        ✓ Verification email sent
                      </Badge>
                    ) : (
                      <Badge
                        onClick={handleSendEmailVerification}
                        variant="secondary"
                        className="cursor-pointer hover:bg-gray-200"
                      >
                        {isSendingEmailVerification ? 'Sending...' : 'Verify Email'}
                      </Badge>
                    )}
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-8">
              <Button
                type="submit"
                className="w-full md:w-auto lg:w-[300px] px-8 py-4 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                icon={<IconArrowRight />}
                loading={createContactDetailLoading}
                disabled={createContactDetailLoading}
              >
                {createContactDetailLoading ? 'Saving...' : 'Save and continue'}
              </Button>
            </div>
          </form>
        </Form>
      </div>

      <Dialog open={isOtpModalOpen} onOpenChange={setIsOtpModalOpen}>
        <DialogContent className="sm:max-w-md">
          <OtpInputAction
            onClose={() => setIsOtpModalOpen(false)}
            onSuccess={handleOtpSuccess}
            onVerify={handleVerifyOtp}
            title="Verify Phone Number"
            description="We've sent a verification code to your phone number. Please enter it to verify."
            otpLength={6}
            skipIntro
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContactVerificationScreen;

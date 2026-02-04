import { Typography } from '@/components/sub-modules/typography/typography';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from 'k-polygon-assets/components';
import QRCode from 'react-qr-code';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Form, FormControl, FormField, FormItem } from 'k-polygon-assets/components';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CustomFormMessage } from '@/components/common/forms/form-message';

const authSchema = z.object({
  otp: z
    .string()
    .length(6, { message: 'OTP code must be 6 digits' })
    .regex(/^\d{6}$/, { message: 'OTP code must contain only digits' })
});

type FormValues = z.infer<typeof authSchema>;

const SetupGoogleAuthScreen = () => {
  const setupComplete = false;

  const qrCodeValue = 'otpauth://totp/KPay:user@example.com?secret=WBTYJJGFTTTRTDTUKOLOPUYUUUGE&issuer=KPay';
  const secretKey = 'WBTYJJGFTTTRTDTUKOLOPUYUUUGE';

  const form = useForm<FormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      otp: ''
    }
  });

  const onSubmit = (values: FormValues) => {
    console.log('Submitted OTP:', values.otp);

    alert('Google Authenticator setup complete!');
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {!setupComplete ? (
        <Card className="overflow-hidden shadow-none">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center space-y-">
              <Typography variant="h3" className="text-lg font-semibold">
                Authenticator App
              </Typography>
              <Typography variant="small" className="text-gray-500">
                Setup using an authenticator app
              </Typography>

              <div className="border border-gray-200 rounded-2xl p-4 my-6">
                <QRCode value={qrCodeValue} size={200} style={{ height: 'auto', maxWidth: '100%', width: '100%' }} />
              </div>

              <Typography variant="small" className="text-gray-700">
                If you can't scan the QR code above, enter text instead
              </Typography>

              <div className="w-full max-w-md mt-4">
                <div className="relative">
                  <input
                    type="text"
                    value={secretKey}
                    readOnly
                    className="w-full py-2 px-4 border border-gray-300 rounded-md bg-gray-50 text-center"
                  />
                  <button
                    className="absolute rounded-full right-2 top-1/2 transform -translate-y-1/2 text-xs bg-red-500 hover:bg-red-600 text-white py-1 px-3"
                    onClick={() => navigator.clipboard.writeText(secretKey)}
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <Typography variant="h2" className="text-2xl font-bold">
                Enter the 6-digit code from your authenticator app
              </Typography>
              <Typography variant="small" className="text-gray-500">
                Enter the 6-digit code from your authenticator app to verify your identity and complete the pairing
                process for two-factor authentication.
              </Typography>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-md space-y-6">
                  <FormField
                    control={form.control}
                    name="otp"
                    render={({ field }) => (
                      <FormItem className="flex flex-col items-center">
                        <FormControl>
                          <InputOTP maxLength={6} value={field.value} onChange={field.onChange}>
                            <InputOTPGroup className="gap-3">
                              {Array.from({ length: 6 }).map((_, index) => (
                                <InputOTPSlot key={index} index={index} className="border !rounded-lg size-[46px]" />
                              ))}
                            </InputOTPGroup>
                          </InputOTP>
                        </FormControl>
                        <CustomFormMessage message={form.formState.errors.otp} scope="error" />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full bg-red-500 hover:bg-red-600 text-white">
                    Confirm Code
                  </Button>
                </form>
              </Form>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SetupGoogleAuthScreen;

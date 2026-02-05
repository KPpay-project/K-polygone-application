import { useState } from 'react';
import { useUserId } from '@/store/user-store';
import { toast } from 'sonner';
import { Form, FormControl, FormField, FormItem, FormLabel, Input, Button } from 'k-polygon-assets';
import { IconArrowRight } from 'k-polygon-assets/icons';
import { Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CustomFormMessage } from '@/components/common/forms/form-message';
import { useMutation } from '@apollo/client';
import { CHANGE_PASSWORD } from '@repo/api';
import { getTranslation } from '@/utils/helpers';

const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, {
      message: getTranslation('validation.required')
    }),
    newPassword: z
      .string()
      .min(8, {
        message: getTranslation('validation.minLength', { min: 8 })
      })
      .regex(/[A-Z]/, {
        message: getTranslation('validation.passwordRequirements')
      })
      .regex(/[a-z]/, {
        message: getTranslation('validation.passwordRequirements')
      })
      .regex(/[0-9]/, {
        message: getTranslation('validation.passwordRequirements')
      }),
    repeatNewPassword: z.string()
  })
  .refine((data) => data.newPassword === data.repeatNewPassword, {
    message: getTranslation('auth.createAccount.passwordsDontMatch'),
    path: ['repeatNewPassword']
  });

type FormValues = z.infer<typeof changePasswordSchema>;

type ChangePasswordInput = {
  userAccountId: string;
  oldPassword: string;
  newPassword: string;
  newPasswordConfirmation: string;
};

const ChanglePasswordAction = () => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const userAccountId = useUserId();

  const [changePassword, { loading }] = useMutation<
    { changePassword: { success: boolean; message: string } },
    { input: ChangePasswordInput }
  >(CHANGE_PASSWORD);

  const form = useForm<FormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      repeatNewPassword: ''
    }
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const { data } = await changePassword({
        variables: {
          input: {
            userAccountId: userAccountId || '',
            oldPassword: values.oldPassword,
            newPassword: values.newPassword,
            newPasswordConfirmation: values.repeatNewPassword
          }
        }
      });

      if (data?.changePassword.success) {
        toast.success('Password changed successfully');

        form.reset();
      } else {
        toast.error(data?.changePassword.message || 'Error changing password');
      }
    } catch (error: any) {
      toast.error(error?.message || 'Error changing password');
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="oldPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="!text-black">Old Password</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input type={showOldPassword ? 'text' : 'password'} placeholder="" {...field} />
                  </FormControl>
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                  >
                    {showOldPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <CustomFormMessage message={form.formState.errors.oldPassword} scope="error" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="!text-black">New Password</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input type={showNewPassword ? 'text' : 'password'} placeholder="" {...field} />
                  </FormControl>
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <CustomFormMessage message={form.formState.errors.newPassword} scope="error" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="repeatNewPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="!text-black">Repeat New Password</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input type={showRepeatPassword ? 'text' : 'password'} placeholder="" {...field} />
                  </FormControl>
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                  >
                    {showRepeatPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <CustomFormMessage message={form.formState.errors.repeatNewPassword} scope="error" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full h-[46px] rounded-[10px] !py-0 bg-primary hover:bg-brandBlue-600 text-white font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
            icon={<IconArrowRight />}
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Save changes'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ChanglePasswordAction;

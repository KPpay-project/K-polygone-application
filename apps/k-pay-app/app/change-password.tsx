import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@apollo/client';
import Toast from 'react-native-toast-message';
import { Eye, EyeSlash } from 'iconsax-react-nativejs';
import { ScreenContainer } from '@/layout/safe-area-layout';
import { HeaderWithTitle } from '@/components';
import { Input } from '@/components/ui/input/input';
import { ReusableButton } from '@/components/ui/button/reusable-button';
import { getSpacing } from '@/theme';
import { CHANGE_PASSWORD } from '@repo/api';

const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, { message: 'Old password is required' }),
    newPassword: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' })
      .regex(/[A-Z]/, { message: 'Password must include uppercase, lowercase, and number' })
      .regex(/[a-z]/, { message: 'Password must include uppercase, lowercase, and number' })
      .regex(/[0-9]/, { message: 'Password must include uppercase, lowercase, and number' }),
    repeatNewPassword: z.string().min(1, { message: 'Please repeat your new password' }),
  })
  .refine((data) => data.newPassword === data.repeatNewPassword, {
    message: 'Passwords do not match',
    path: ['repeatNewPassword'],
  });

type FormValues = z.infer<typeof changePasswordSchema>;

type ChangePasswordInput = {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirmation: string;
};

export default function ChangePasswordScreen() {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const [changePassword, { loading }] = useMutation<
    {
      changePassword: {
        success: boolean;
        message: string;
        errors?: Array<{ code?: string; field?: string; message?: string }>;
      };
    },
    { input: ChangePasswordInput }
  >(CHANGE_PASSWORD);

  const form = useForm<FormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      repeatNewPassword: '',
    },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const { data } = await changePassword({
        variables: {
          input: {
            currentPassword: values.oldPassword,
            newPassword: values.newPassword,
            newPasswordConfirmation: values.repeatNewPassword,
          },
        },
      });

      if (data?.changePassword.success) {
        Toast.show({
          type: 'success',
          text1: data.changePassword.message || 'Password changed successfully',
        });
        form.reset();
        return;
      }

      Toast.show({
        type: 'error',
        text1:
          data?.changePassword.errors?.[0]?.message ||
          data?.changePassword.message ||
          'Error changing password',
      });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: error?.message || 'Error changing password',
      });
    }
  };

  return (
    <ScreenContainer useSafeArea className="bg-gray-50">
      <HeaderWithTitle px={8} title="Change password" description="Update your password" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          className="flex-1 px-6"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingBottom: getSpacing('2xl'),
          }}
        >
          <View className="bg-white rounded-2xl border border-gray-100 p-4">
            <View className="mb-6">
              <View className="relative">
                <Controller
                  control={form.control}
                  name="oldPassword"
                  render={({ field, fieldState }) => (
                    <Input
                      placeholder=""
                      value={field.value}
                      onChangeText={field.onChange}
                      secureTextEntry={!showOldPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                      editable={!loading}
                      label="Old Password"
                      error={fieldState.error?.message}
                      className="pr-12"
                    />
                  )}
                />
                <TouchableOpacity
                  className="absolute right-4 top-4"
                  onPress={() => setShowOldPassword(!showOldPassword)}
                  disabled={loading}
                  activeOpacity={0.7}
                >
                  {showOldPassword ? (
                    <EyeSlash size={20} color="#9CA3AF" />
                  ) : (
                    <Eye size={20} color="#9CA3AF" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <View className="mb-6">
              <View className="relative">
                <Controller
                  control={form.control}
                  name="newPassword"
                  render={({ field, fieldState }) => (
                    <Input
                      placeholder=""
                      value={field.value}
                      onChangeText={field.onChange}
                      secureTextEntry={!showNewPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                      editable={!loading}
                      label="New Password"
                      error={fieldState.error?.message}
                      className="pr-12"
                    />
                  )}
                />
                <TouchableOpacity
                  className="absolute right-4 top-4"
                  onPress={() => setShowNewPassword(!showNewPassword)}
                  disabled={loading}
                  activeOpacity={0.7}
                >
                  {showNewPassword ? (
                    <EyeSlash size={20} color="#9CA3AF" />
                  ) : (
                    <Eye size={20} color="#9CA3AF" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <View className="mb-2">
              <View className="relative">
                <Controller
                  control={form.control}
                  name="repeatNewPassword"
                  render={({ field, fieldState }) => (
                    <Input
                      placeholder=""
                      value={field.value}
                      onChangeText={field.onChange}
                      secureTextEntry={!showRepeatPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                      editable={!loading}
                      label="Repeat New Password"
                      error={fieldState.error?.message}
                      className="pr-12"
                    />
                  )}
                />
                <TouchableOpacity
                  className="absolute right-4 top-4"
                  onPress={() => setShowRepeatPassword(!showRepeatPassword)}
                  disabled={loading}
                  activeOpacity={0.7}
                >
                  {showRepeatPassword ? (
                    <EyeSlash size={20} color="#9CA3AF" />
                  ) : (
                    <Eye size={20} color="#9CA3AF" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <View className="mt-6">
              <ReusableButton
                variant="primary"
                text={loading ? 'Updating...' : 'Save changes'}
                onPress={form.handleSubmit(onSubmit)}
                loading={loading}
                textColor="#fff"
                iconColor="#fff"
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

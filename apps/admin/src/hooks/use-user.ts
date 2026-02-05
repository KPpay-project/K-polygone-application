import { useMutation } from '@apollo/client';
import { SUSPEND_ADMIN, REGISTER_MERCHANT, REGISTER_USER, REGISTER_ADMIN, UPDATE_ROLE } from '@repo/api';

export const useUser = () => {
  const [suspendAdminMutation] = useMutation(SUSPEND_ADMIN);
  const [registerMerchantMutation] = useMutation(REGISTER_MERCHANT);
  const [registerUserMutation] = useMutation(REGISTER_USER);
  const [registerAdminMutation] = useMutation(REGISTER_ADMIN);
  const [updateRoleMutation] = useMutation(UPDATE_ROLE);

  const suspendAdmin = (input: any) => suspendAdminMutation({ variables: { input } });
  const registerMerchant = (input: any) => registerMerchantMutation({ variables: { input } });
  const registerUser = (input: any) => registerUserMutation({ variables: { input } });
  const registerAdmin = (input: any) => registerAdminMutation({ variables: { input } });
  const updateRole = (input: any) => updateRoleMutation({ variables: { input } });

  return { suspendAdmin, registerMerchant, registerUser, registerAdmin, updateRole };
};

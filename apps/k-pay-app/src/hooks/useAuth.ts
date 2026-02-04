import { useMutation } from '@apollo/client';
import { LOGIN_USER, REGISTER_USER } from '../lib/graphql/mutations/auth';
import { setTokens, clearTokens } from '../lib/apollo-client';
import {
  LoginInput,
  UserInput,
  LoginResponse,
  RegisterUserResponse,
} from '../types/auth';
import { useAuth as useAuthContext } from '../contexts/auth-context';

export const useAuthMutations = () => {
  const { logout: contextLogout } = useAuthContext();

  const [loginMutation, { loading: loginLoading, error: loginError }] =
    useMutation<{ login: LoginResponse }, { input: LoginInput }>(LOGIN_USER);

  const [registerMutation, { loading: registerLoading, error: registerError }] =
    useMutation<{ registerUser: RegisterUserResponse }, { input: UserInput }>(
      REGISTER_USER
    );

  const login = async (input: LoginInput) => {
    try {
      const { data } = await loginMutation({
        variables: { input },
      });

      if (data?.login) {
        await setTokens(
          data.login.token.accessToken,
          data.login.token.refreshToken
        );

        return {
          success: true,
          data: data.login,
        };
      }

      return {
        success: false,
        error: 'Login failed',
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed',
      };
    }
  };

  const register = async (input: UserInput) => {
    try {
      const { data } = await registerMutation({
        variables: { input },
      });

      if (data?.registerUser) {
        return {
          success: true,
          data: data.registerUser,
        };
      }

      return {
        success: false,
        error: 'Registration failed',
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Registration failed',
      };
    }
  };

  const logout = async () => {
    try {
      await clearTokens();
      await contextLogout();
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Logout failed',
      };
    }
  };

  return {
    login,
    register,
    logout,
    loginLoading,
    registerLoading,
    loginError,
    registerError,
  };
};

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { NativeModulesProxy } from 'expo-modules-core';
// Removed useLazyQuery import to fix circular dependency
import {
  apolloClient,
  JWT_TOKEN_NAME,
  JWT_REFRESH_TOKEN_NAME,
  clearTokens,
  setTokens,
  setLogoutCallback,
} from '../lib/apollo-client';
import {
  UserAccountType,
  LoginInput,
  UserInput,
  LoginResponse,
  RegisterUserResponse,
  MeResponse,
} from '../types/auth';
import { LOGIN_USER, REGISTER_USER } from '../lib/graphql/mutations/auth';
import { ME } from '../lib/graphql/queries/user';

interface User {
  id: string;
  email: string;
  name: string;
}

type GraphQLUser = UserAccountType;

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  graphqlUser: GraphQLUser | null;
  meData: MeResponse | null;
  login: (email: string, password: string) => Promise<boolean>;
  biometricEnabled: boolean;
  biometricAvailable: boolean;
  biometricSupported: boolean;
  enableBiometricLogin: () => Promise<boolean>;
  disableBiometricLogin: () => Promise<void>;
  biometricLogin: () => Promise<boolean>;
  registerUser: (
    userData: Omit<UserInput, 'passwordConfirmation'> & {
      confirmPassword: string;
    }
  ) => Promise<{
    success: boolean;
    error?: string;
    data?: RegisterUserResponse;
  }>;
  logout: () => Promise<void>;
  loading: boolean;
  token: string | null;
  refreshToken: string | null;
  setGraphQLUser: (user: GraphQLUser | null) => void;
  fetchUserData: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = '@kpay_auth_token';
const USER_STORAGE_KEY = '@kpay_user_data';
const REFRESH_TOKEN_KEY = '@kpay_refresh_token';
const GRAPHQL_USER_STORAGE_KEY = '@kpay_graphql_user_data';
const BIOMETRIC_ENABLED_KEY = '@kpay_biometric_enabled';
const BIOMETRIC_PAYLOAD_KEY = 'kpay_biometric_payload_v1';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [graphqlUser, setGraphqlUser] = useState<GraphQLUser | null>(null);
  const [meData, setMeData] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricSupported, setBiometricSupported] = useState(false);

  useEffect(() => {
    checkAuthState();
  }, []);

  const hasExpoNativeModule = (name: string) => {
    return Boolean((NativeModulesProxy as any)?.[name]);
  };

  useEffect(() => {
    (async () => {
      try {
        const supported =
          hasExpoNativeModule('ExpoSecureStore') &&
          hasExpoNativeModule('ExpoLocalAuthentication');
        setBiometricSupported(supported);

        const enabled = (await AsyncStorage.getItem(BIOMETRIC_ENABLED_KEY)) === 'true';
        setBiometricEnabled(enabled);
        if (!enabled || !supported) {
          setBiometricAvailable(false);
          return;
        }

        let LocalAuthentication: any = null;
        try {
          LocalAuthentication = require('expo-local-authentication');
        } catch {
          LocalAuthentication = null;
        }

        if (!LocalAuthentication) {
          setBiometricAvailable(false);
          return;
        }

        const [hasHardware, isEnrolled] = await Promise.all([
          LocalAuthentication.hasHardwareAsync(),
          LocalAuthentication.isEnrolledAsync(),
        ]);

        setBiometricAvailable(Boolean(hasHardware && isEnrolled));
      } catch {
        setBiometricAvailable(false);
      }
    })();
  }, []);

  useEffect(() => {
    setLogoutCallback(() => {
      logout();
    });
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    const checkAuthPeriodically = setInterval(async () => {
      const storedToken = await AsyncStorage.getItem(JWT_TOKEN_NAME);
      if (!storedToken && isAuthenticated) {
        logout();
      }
    }, 30000);

    return () => clearInterval(checkAuthPeriodically);
  }, [isAuthenticated]);

  const fetchUserData = async () => {
    if (token) {
      try {
        const { data } = await apolloClient.query<{ me: MeResponse }>({
          query: ME,
          errorPolicy: 'all',
          fetchPolicy: 'network-only',
        });

        if (data?.me) {
          setMeData(data.me);
        }
      } catch (error: any) {
        console.error('Error fetching user data:', error);
        const isAuthError =
          error.graphQLErrors?.some(
            (e: any) => e.message === 'Not authenticated'
          ) ||
          (error.networkError &&
            'statusCode' in error.networkError &&
            error.networkError.statusCode === 401);

        if (isAuthError) {
          logout();
        }
      }
    }
  };

  const checkAuthState = async () => {
    try {
      const [
        storedToken,
        storedUser,
        storedRefreshToken,
        storedGraphQLUser,
        apolloToken,
        apolloRefreshToken,
      ] = await Promise.all([
        AsyncStorage.getItem(AUTH_STORAGE_KEY),
        AsyncStorage.getItem(USER_STORAGE_KEY),
        AsyncStorage.getItem(REFRESH_TOKEN_KEY),
        AsyncStorage.getItem(GRAPHQL_USER_STORAGE_KEY),
        AsyncStorage.getItem(JWT_TOKEN_NAME),
        AsyncStorage.getItem(JWT_REFRESH_TOKEN_NAME),
      ]);

      const activeToken = apolloToken || storedToken;
      const activeRefreshToken = apolloRefreshToken || storedRefreshToken;

      if (activeToken && (storedUser || storedGraphQLUser)) {
        // Batch all state updates to prevent multiple renders
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;
        const parsedGraphQLUser = storedGraphQLUser
          ? JSON.parse(storedGraphQLUser)
          : null;

        // Use React's automatic batching by updating states in sequence
        setToken(activeToken);
        setRefreshToken(activeRefreshToken);
        if (parsedUser) setUser(parsedUser);
        if (parsedGraphQLUser) setGraphqlUser(parsedGraphQLUser);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error checking auth state:', error);

      await clearAuthData();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);

      const loginInput: LoginInput = {
        emailOrPhone: email,
        password: password,
      };

      const { data } = await apolloClient.mutate<
        { login: LoginResponse },
        { input: LoginInput }
      >({
        mutation: LOGIN_USER,
        variables: { input: loginInput },
      });

      if (data?.login) {
        const { token, userAccount } = data.login;

        await setTokens(token.accessToken, token.refreshToken);

        const user: User = {
          id: userAccount.id,
          email: userAccount.user.email,
          name: `${userAccount.user.firstName} ${userAccount.user.lastName}`,
        };

        await Promise.all([
          AsyncStorage.setItem(AUTH_STORAGE_KEY, token.accessToken),
          AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user)),
          AsyncStorage.setItem(REFRESH_TOKEN_KEY, token.refreshToken),
        ]);

        setToken(token.accessToken);
        setRefreshToken(token.refreshToken);
        setUser(user);

        await setGraphQLUser(userAccount as GraphQLUser);
        setIsAuthenticated(true);

        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const enableBiometricLogin = async (): Promise<boolean> => {
    try {
      const supported =
        hasExpoNativeModule('ExpoSecureStore') &&
        hasExpoNativeModule('ExpoLocalAuthentication');

      if (!supported) {
        Toast.show({
          type: 'error',
          text1: 'Biometric login is not available on this build',
        });
        return false;
      }

      let LocalAuthentication: any = null;
      let SecureStore: any = null;

      try {
        LocalAuthentication = require('expo-local-authentication');
      } catch {
        LocalAuthentication = null;
      }
      try {
        SecureStore = require('expo-secure-store');
      } catch {
        SecureStore = null;
      }

      if (!LocalAuthentication || !SecureStore) {
        Toast.show({
          type: 'error',
          text1: 'Biometric login is not available on this build',
        });
        return false;
      }

      const [hasHardware, isEnrolled] = await Promise.all([
        LocalAuthentication.hasHardwareAsync(),
        LocalAuthentication.isEnrolledAsync(),
      ]);

      if (!hasHardware || !isEnrolled) {
        Toast.show({
          type: 'error',
          text1: 'Biometrics not set up on this device',
        });
        return false;
      }

      const authResult = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Enable biometric login',
        cancelLabel: 'Cancel',
        fallbackLabel: 'Use device passcode',
      });

      if (!authResult.success) {
        return false;
      }

      const [
        storedAccessToken,
        storedRefreshToken,
        storedUser,
        storedGraphQLUser,
        apolloAccessToken,
        apolloRefreshToken,
      ] = await Promise.all([
        AsyncStorage.getItem(AUTH_STORAGE_KEY),
        AsyncStorage.getItem(REFRESH_TOKEN_KEY),
        AsyncStorage.getItem(USER_STORAGE_KEY),
        AsyncStorage.getItem(GRAPHQL_USER_STORAGE_KEY),
        AsyncStorage.getItem(JWT_TOKEN_NAME),
        AsyncStorage.getItem(JWT_REFRESH_TOKEN_NAME),
      ]);

      const accessToken = apolloAccessToken || storedAccessToken;
      const refreshTokenValue = apolloRefreshToken || storedRefreshToken;

      if (!accessToken || !refreshTokenValue || (!storedUser && !storedGraphQLUser)) {
        Toast.show({
          type: 'error',
          text1: 'Please login before enabling biometric login',
        });
        return false;
      }

      const payload = JSON.stringify({
        accessToken,
        refreshToken: refreshTokenValue,
        user: storedUser || null,
        graphqlUser: storedGraphQLUser || null,
      });

      await SecureStore.setItemAsync(BIOMETRIC_PAYLOAD_KEY, payload, {
        requireAuthentication: true,
      });

      await AsyncStorage.setItem(BIOMETRIC_ENABLED_KEY, 'true');
      setBiometricEnabled(true);
      setBiometricAvailable(true);

      Toast.show({
        type: 'success',
        text1: 'Biometric login enabled',
      });

      return true;
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: error?.message || 'Unable to enable biometric login',
      });
      return false;
    }
  };

  const disableBiometricLogin = async (): Promise<void> => {
    try {
      let SecureStore: any = null;
      try {
        if (hasExpoNativeModule('ExpoSecureStore')) {
          SecureStore = require('expo-secure-store');
        } else {
          SecureStore = null;
        }
      } catch {
        SecureStore = null;
      }

      if (SecureStore) {
        await SecureStore.deleteItemAsync(BIOMETRIC_PAYLOAD_KEY);
      }

      await AsyncStorage.setItem(BIOMETRIC_ENABLED_KEY, 'false');
      setBiometricEnabled(false);
      setBiometricAvailable(false);
      Toast.show({
        type: 'success',
        text1: 'Biometric login disabled',
      });
    } catch {
      await AsyncStorage.setItem(BIOMETRIC_ENABLED_KEY, 'false');
      setBiometricEnabled(false);
      setBiometricAvailable(false);
    }
  };

  const biometricLogin = async (): Promise<boolean> => {
    try {
      if (!hasExpoNativeModule('ExpoSecureStore')) {
        Toast.show({
          type: 'error',
          text1: 'Biometric login is not available on this build',
        });
        return false;
      }

      let SecureStore: any = null;
      try {
        SecureStore = require('expo-secure-store');
      } catch {
        SecureStore = null;
      }

      if (!SecureStore) {
        Toast.show({
          type: 'error',
          text1: 'Biometric login is not available on this build',
        });
        return false;
      }

      const enabled = (await AsyncStorage.getItem(BIOMETRIC_ENABLED_KEY)) === 'true';
      if (!enabled) {
        Toast.show({
          type: 'error',
          text1: 'Biometric login is not enabled',
        });
        return false;
      }

      setLoading(true);

      const payloadString = await SecureStore.getItemAsync(BIOMETRIC_PAYLOAD_KEY, {
        requireAuthentication: true,
      });

      if (!payloadString) {
        Toast.show({
          type: 'error',
          text1: 'No biometric login data found',
        });
        return false;
      }

      const payload = JSON.parse(payloadString) as {
        accessToken: string;
        refreshToken: string;
        user: string | null;
        graphqlUser: string | null;
      };

      if (!payload.accessToken || !payload.refreshToken) {
        Toast.show({
          type: 'error',
          text1: 'Biometric login data is invalid',
        });
        return false;
      }

      await setTokens(payload.accessToken, payload.refreshToken);

      const parsedUser = payload.user ? JSON.parse(payload.user) : null;
      const parsedGraphQLUser = payload.graphqlUser
        ? JSON.parse(payload.graphqlUser)
        : null;

      await Promise.all([
        AsyncStorage.setItem(AUTH_STORAGE_KEY, payload.accessToken),
        AsyncStorage.setItem(REFRESH_TOKEN_KEY, payload.refreshToken),
        parsedUser ? AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(parsedUser)) : AsyncStorage.removeItem(USER_STORAGE_KEY),
        parsedGraphQLUser
          ? AsyncStorage.setItem(GRAPHQL_USER_STORAGE_KEY, JSON.stringify(parsedGraphQLUser))
          : AsyncStorage.removeItem(GRAPHQL_USER_STORAGE_KEY),
      ]);

      setToken(payload.accessToken);
      setRefreshToken(payload.refreshToken);
      setUser(parsedUser);
      setGraphqlUser(parsedGraphQLUser);
      setIsAuthenticated(true);

      return true;
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: error?.message || 'Biometric login failed',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (
    userData: Omit<UserInput, 'passwordConfirmation'> & {
      confirmPassword: string;
    }
  ): Promise<{
    success: boolean;
    error?: string;
    data?: RegisterUserResponse;
  }> => {
    try {
      setLoading(true);

      const registerInput: UserInput = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        password: userData.password,
        passwordConfirmation: userData.confirmPassword,
        country: userData.country,
      };

      const { data } = await apolloClient.mutate<
        { registerUser: RegisterUserResponse },
        { input: UserInput }
      >({
        mutation: REGISTER_USER,
        variables: { input: registerInput },
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
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setLoading(true);

      await apolloClient.clearStore();

      await clearTokens();

      await clearAuthData();

      setToken(null);
      setRefreshToken(null);
      setUser(null);
      setGraphqlUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const setGraphQLUser = async (user: GraphQLUser | null) => {
    setGraphqlUser(user);
    if (user) {
      await AsyncStorage.setItem(
        GRAPHQL_USER_STORAGE_KEY,
        JSON.stringify(user)
      );
    } else {
      await AsyncStorage.removeItem(GRAPHQL_USER_STORAGE_KEY);
    }
  };

  const clearAuthData = async () => {
    await Promise.all([
      AsyncStorage.removeItem(AUTH_STORAGE_KEY),
      AsyncStorage.removeItem(USER_STORAGE_KEY),
      AsyncStorage.removeItem(REFRESH_TOKEN_KEY),
      AsyncStorage.removeItem(GRAPHQL_USER_STORAGE_KEY),
      AsyncStorage.removeItem(JWT_TOKEN_NAME),
      AsyncStorage.removeItem(JWT_REFRESH_TOKEN_NAME),
    ]);
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    graphqlUser,
    meData,
    login,
    biometricEnabled,
    biometricAvailable,
    biometricSupported,
    enableBiometricLogin,
    disableBiometricLogin,
    biometricLogin,
    registerUser,
    logout,
    loading,
    token,
    refreshToken,
    setGraphQLUser,
    fetchUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useAuthHeaders = () => {
  const { token } = useAuth();

  return {
    authorization: token ? `Bearer ${token}` : '',
  };
};

export const useRequireAuth = () => {
  const { isAuthenticated, loading } = useAuth();

  return {
    isAuthenticated,
    loading,
    shouldRedirect: !loading && !isAuthenticated,
  };
};

export type SessionAdmin = {
  id: string;
  name: string;
};

export type SessionMerchant = {
  businessName: string;
  businessType: string;
};

export type SessionUser = {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

export type SessionUserAccount = {
  admin: SessionAdmin | null;
  currentSignInAt: string;
  currentSignInIp: string;
  id: string;
  insertedAt: string;
  lastSignInAt: string;
  lastSignInIp: string;
  merchant: SessionMerchant | null;
  role: string;
  signInCount: number;
  signInIp: string;
  status: string;
  updatedAt: string;
  user: SessionUser;
};

export type Token = {
  accessToken: string;
  refreshToken: string;
};

export type Session = {
  token: Token;
  user: SessionUserAccount;
};

export type LoginInput = {
  emailOrPhone: string;
  password: string;
  rememberMe?: boolean;
};

export type LoginResponse = {
  token: {
    accessToken: string;
    refreshToken: string;
  };
  userAccount: {
    id: string;
    role: string;
    status: string | null;
    user: SessionUser;
    merchant: SessionMerchant | null;
    admin: SessionAdmin | null;
  };
};

export type UserInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  passwordConfirmation: string;
  country: string;
};

export type RegisterUserResponse = {
  id: string;
  role: string;
  status: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
};

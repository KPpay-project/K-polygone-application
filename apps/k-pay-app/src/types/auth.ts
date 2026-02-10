export type UserAccountType = {
  admin: AdminType | null;
  currentSignInAt: string;
  currentSignInIp: string;
  id: string;
  insertedAt: string;
  lastSignInAt: string;
  lastSignInIp: string;
  merchant: MerchantType | null;
  role: string;
  signInCount: number;
  signInIp: string;
  status: string;
  updatedAt: string;
  user: UserType;
};

export type Token = {
  accessToken: string;
  refreshToken: string;
};

export type Session = {
  token: Token;
  user: UserAccountType;
};

export type AdminType = {
  id: string;
  name: string;
};

export type MerchantType = {
  businessName: string;
  businessType: string;
};

export type UserType = {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

export type LoginInput = {
  emailOrPhone: string;
  password: string;
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
    user: UserType;
    merchant: MerchantType | null;
    admin: AdminType | null;
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

// Wallet related types for ME query
export interface Balance {
  id: string;
  availableBalance: number;
  totalBalance: number;
  currency: {
    code: string;
    countryCode: string;
    precision: number;
  };
}

export interface Wallet {
  id: string;
  ownerId: string;
  ownerType: string;
  status: string;
  isFrozen: boolean;
  freezeReason?: string;
  dailyLimit?: number;
  monthlyLimit?: number;
  insertedAt: string;
  updatedAt: string;
  balances: Balance[];
}

export interface MeResponse {
  id: string;
  role: string;
  status: string;
  currentSignInAt: string;
  currentSignInIp: string;
  lastSignInAt: string;
  lastSignInIp: string;
  signInCount: number;
  signInIp: string;
  insertedAt: string;
  updatedAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  merchant: {
    id: string;
    businessName: string;
    businessType: string;
  } | null;
  admin: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;
  wallets: Wallet[];
}

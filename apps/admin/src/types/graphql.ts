export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserType {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface AdminType {
  id: string;
  firstName: string;
  lastName: string;
}

export interface MerchantType {
  id: string;
  businessName: string;
  businessType: string;
}

export interface UserAccountType {
  id: string;
  role: string;
  status: 'active' | 'inactive' | 'locked' | 'pending';
  currentSignInAt?: string;
  currentSignInIp?: string;
  lastSignInAt?: string;
  lastSignInIp?: string;
  signInCount?: number;
  signInIp?: string;
  insertedAt: string;
  updatedAt: string;
  user?: UserType;
  admin?: AdminType;
  merchant?: MerchantType;
}

export interface Balance {
  id: string;
  amount: number;
  currency: string;
  wallet_id: string;
  updated_at: string;
}

export interface WalletTransaction {
  id: string;
  amount: number;
  currency: string;
  transaction_type: string;
  status: string;
  description?: string;
  reference?: string;
  wallet_id: string;
  created_at: string;
  updated_at: string;
}

export interface DepositInput {
  amount: number;
  currency: string;
  wallet_id: string;
  payment_method?: string;
  description?: string;
}

export interface DepositResponse {
  success: boolean;
  message?: string;
  balance: Balance;
  transaction: WalletTransaction;
}

export interface DepositVariables {
  input: DepositInput;
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
  transactions: WalletTransaction[];
}

export interface CreateWalletInput {
  ownerId: string;
  ownerType: string;
  dailyLimit?: number;
  monthlyLimit?: number;
}

export interface CreateWalletVariables {
  input: CreateWalletInput;
}

export interface GetWalletVariables {
  id: string;
}

export interface GetUserWalletsVariables {
  ownerId: string;
  ownerType: string;
}

export interface CreateUserInput {
  email: string;
  name: string;
  password: string;
}

export interface UpdateUserInput {
  email?: string;
  name?: string;
  password?: string;
}

export interface DeleteUserResponse {
  success: boolean;
  message: string;
}

export interface GetUserVariables {
  id: string;
}

export interface GetUsersVariables {
  limit?: number;
  offset?: number;
}

export interface CreateUserVariables {
  input: CreateUserInput;
}

export interface UpdateUserVariables {
  id: string;
  input: UpdateUserInput;
}

export interface DeleteUserVariables {
  id: string;
}

export interface UserSubscriptionVariables {
  userId: string;
}

export interface CreateTicketMessageInput {
  message: string;
  messageAttachment?: File | string | null;
  ticketId: string;
}

export interface CreateTicketMessageResponse {
  createTicketMessage: {
    errors: string[] | null;
    message: string;
    success: boolean;
  };
}

export interface CreateTicketMessageVariables {
  input: CreateTicketMessageInput;
}

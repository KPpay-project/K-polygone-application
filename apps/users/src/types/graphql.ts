export interface Currency {
  code: string;
  name: string;
  countryCode?: string;
  precision?: number;
}

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

export interface KycApplicationType {
  id: string;
  bankInfoStatus?: string;
  contactInfoStatus?: string;
  errors?: string[] | null;
  financialInfoStatus?: string;
  identityStatus?: string;
  insertedAt: string;
  kycClientId?: string;
  kycClientType?: string;
  message?: string | null;
  personalInfoStatus?: string;
  rejectionReason?: string | null;
  status: string;
  updatedAt: string;
}

export interface UserAccountType {
  id: string;
  role: string;
  status: 'active' | 'inactive' | 'locked' | 'pending';
  walletCode?: string;
  currentSignInAt?: string;
  currentSignInIp?: string;
  lastSignInAt?: string;
  lastSignInIp?: string;
  signInCount?: number;
  signInIp?: string;
  insertedAt: string;
  updatedAt: string;
  kycApplications?: KycApplicationType[];
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
  amount: string; // Decimal
  currency: Currency;
  customerPhone?: string;
  description?: string;
  exchangeRate?: string; // Decimal
  externalReference?: string;
  feeAmount?: string; // Decimal
  feeCurrency?: Currency;
  insertedAt: string; // DateTime
  provider?: string;
  providerMessage?: string;
  providerStatus?: string;
  reference?: string;
  status: string;
  transactionType: string;
  updatedAt: string; // DateTime
  wallet?: Wallet;
  counterpartyWallet?: Wallet;
}

export interface TransactionFiltersInput {
  startDate?: string;
  endDate?: string;
  status?: string;
  transactionType?: string;
  currency?: string;
  minAmount?: string;
  maxAmount?: string;
  reference?: string;
  provider?: string;
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
  currencyCode: string;
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

// KYC Application Interfaces
export interface BankInfo {
  bankName?: string;
  accountNumber?: string;
  bankCode?: string;
  primaryBank?: string;
  countryAccountHeld?: string;
}

export interface PoliticalExposureInput {
  isPep: boolean;
  positionHeld?: string | null;
  countryOfPosition?: string | null;
  startDate?: string | null;
  endDate?: string | null;
}

export interface FieldError {
  field: string;
  message: string;
}

export interface PoliticalExposurePayload {
  success: boolean;
  message?: string;
  politicalExposure?: PoliticalExposure;
  errors?: FieldError[];
}

export interface CreatePoliticalExposureResult {
  createPoliticalExposure: PoliticalExposurePayload;
}

export interface CreatePoliticalExposureVariables {
  input: PoliticalExposureInput;
}

export interface ContactDetail {
  email?: string;
  phone?: string;
  address?: string;
  residentialStreet?: string;
  residentialCity?: string;
  residentialPostalCode?: string;
  residentialCountry?: string;
  primaryPhone?: string;
  emailAddress?: string;
}

export interface DeclarationsAndCommitment {
  isPoliticallyExposed?: boolean;
  isSanctioned?: boolean;
  individualsFullName?: string;
  companyName?: string;
}

export interface FinancialInfo {
  incomeSource?: string;
  annualIncome?: string;
  salary?: string;
  estimatedAnnualIncome?: string;
  estimatedNetWorth?: string;
}

export interface IdentityDocument {
  documentType?: string;
  documentNumber?: string;
  issueDate?: string;
  expiryDate?: string;
  dateOfIssue?: string;
  issuingAuthority?: string;
  documentUrl?: string;
}

export interface PoliticalExposure {
  isPoliticallyExposed?: boolean;
  position?: string;
  isPep?: boolean;
  positionHeld?: string | null;
  countryOfPosition?: string | null;
  startDate?: string | null;
  endDate?: string | null;
}

export interface KycApplication {
  bankInfo?: BankInfo;
  contactDetail?: ContactDetail;
  contactInfoStatus?: string;
  declarationsAndCommitments?: DeclarationsAndCommitment;
  errors?: string[];
  financialInfo?: FinancialInfo;
  financialInfoStatus?: string;
  id: string;
  identityDocument?: IdentityDocument;
  identityStatus?: string;
  insertedAt: string; // DateTime
  kycClientId?: string;
  kycClientType?: string;
  message?: string;
  politicalExposure?: PoliticalExposure;
  updatedAt: string; // DateTime
  userAccount?: UserAccountType;
}

export interface KycApplicationsQueryResult {
  getAllKycApplications: KycApplication[];
}

export interface KycApplicationByIdQueryResult {
  getKycApplicationById: KycApplication;
}

export interface KycApplicationByIdVariables {
  kycApplicationId: string;
}

export interface FieldError {
  field: string;
  message: string;
}

export interface BankInfoInput {
  primaryBank: string;
  accountNumber: string;
  countryAccountHeld: string;
}

export interface BankInfoPayload {
  bankInfo: BankInfo;
  errors: FieldError[];
  message: string;
  success: boolean;
}

export interface CreateBankInfoVariables {
  input: BankInfoInput;
}

export interface CreateBankInfoResult {
  createBankInfo: BankInfoPayload;
}

export interface UpdateBankInfoVariables {
  input: BankInfoInput;
}

export interface UpdateBankInfoResult {
  updateBankInfo: BankInfoPayload;
}

export interface ContactDetailInput {
  residentialStreet: string;
  residentialCity: string;
  residentialPostalCode: string;
  residentialCountry: string;
  primaryPhone: string;
  emailAddress: string;
  addressProofUrl: any; // Upload/File type for GraphQL
}

export interface ContactDetailPayload {
  contactDetail: ContactDetail;
  errors: FieldError[];
  message: string;
  success: boolean;
}

export interface CreateContactDetailVariables {
  input: ContactDetailInput;
}

export interface CreateContactDetailResult {
  createContactDetail: ContactDetailPayload;
}

export interface UpdateContactDetailVariables {
  input: ContactDetailInput;
}

export interface UpdateContactDetailResult {
  updateContactDetail: ContactDetailPayload;
}

export interface FinancialInfoInput {
  salary: string;
  estimatedAnnualIncome: string;
  estimatedNetWorth: string;
}

export interface FinancialInfoPayload {
  financialInfo: FinancialInfo;
  errors: FieldError[];
  message: string;
  success: boolean;
}

export interface CreateFinancialInfoVariables {
  input: FinancialInfoInput;
}

export interface CreateFinancialInfoResult {
  createFinancialInfo: FinancialInfoPayload;
}

export interface UpdateFinancialInfoVariables {
  input: FinancialInfoInput;
}

export interface UpdateFinancialInfoResult {
  updateFinancialInfo: FinancialInfoPayload;
}

export interface IdentityDocumentInput {
  documentType: string;
  documentNumber: string;
  dateOfIssue: string;
  expiryDate: string;
  issuingAuthority: string;
  documentUrl?: File | string;
}

export interface IdentityDocumentPayload {
  identityDocument: IdentityDocument;
  errors: FieldError[];
  message: string;
  success: boolean;
}

export interface CreateIdentityDocumentVariables {
  input: IdentityDocumentInput;
}

export interface CreateIdentityDocumentResult {
  createIdentityDocument: IdentityDocumentPayload;
}

export interface UpdateIdentityDocumentVariables {
  input: IdentityDocumentInput;
}

export interface UpdateIdentityDocumentResult {
  updateIdentityDocument: IdentityDocumentPayload;
}

export interface PersonalInfo {
  id: string;
  firstName: string;
  lastName: string;
  maidenName?: string;
  dateOfBirth: string;
  placeOfBirth: string;
  nationality: string;
  countryOrTaxResidence: string;
  taxIdentificationNumber: string;
  occupation: string;
  currentEmployer: string;
  employmentStatus: string;
}

export interface PersonalInfoInput {
  firstName: string;
  lastName: string;
  maidenName?: string;
  dateOfBirth: string;
  placeOfBirth: string;
  nationality: string;
  countryOrTaxResidence: string;
  taxIdentificationNumber: string;
  occupation: string;
  currentEmployer: string;
  employmentStatus: string;
}

export interface PersonalInfoPayload {
  personalInfo: PersonalInfo;
  errors: FieldError[];
  message: string;
  success: boolean;
}

export interface CreatePersonalInfoVariables {
  input: PersonalInfoInput;
}

export interface CreatePersonalInfoResult {
  createPersonalInfo: PersonalInfoPayload;
}

export interface PersonalInfoUpdateInput {
  firstName?: string;
  lastName?: string;
  maidenName?: string;
  dateOfBirth?: string;
  placeOfBirth?: string;
  nationality?: string;
  countryOrTaxResidence?: string;
  taxIdentificationNumber?: string;
  occupation?: string;
  currentEmployer?: string;
  employmentStatus?: string;
}

export interface UpdatePersonalInfoVariables {
  input: PersonalInfoUpdateInput;
}

export interface UpdatePersonalInfoResult {
  updatePersonalInfo: PersonalInfoPayload;
}

export interface PoliticalExposureInput {
  isPep: boolean;
  positionHeld?: string | null;
  countryOfPosition?: string | null;
  startDate?: string | null;
  endDate?: string | null;
}

export interface PoliticalExposurePayload {
  politicalExposure?: PoliticalExposure;
  errors?: FieldError[];
  message?: string;
  success: boolean;
}

export interface CreatePoliticalExposureVariables {
  input: PoliticalExposureInput;
}

export interface CreatePoliticalExposureResult {
  createPoliticalExposure: PoliticalExposurePayload;
}

export interface UpdatePoliticalExposureVariables {
  input: PoliticalExposureInput;
}

export interface UpdatePoliticalExposureResult {
  updatePoliticalExposure: PoliticalExposurePayload;
}

// This interface is already defined above

export interface DeclarationAndCommitmentInput {
  individualsFullName?: string;
  companyName?: string;
  informationIsAccurate: boolean;
  hasAcknowledgeInformationCollectionAmlCft: boolean;
}

export interface DeclarationAndCommitmentsPayload {
  declarationAndCommitments: DeclarationsAndCommitment;
  errors: FieldError[];
  message: string;
  success: boolean;
}

export interface UpdateDeclarationAndCommitmentVariables {
  input: DeclarationAndCommitmentInput;
}

export interface UpdateDeclarationAndCommitmentResult {
  updateDeclarationAndCommitment: DeclarationAndCommitmentsPayload;
}

export interface CreateDeclarationAndCommitmentVariables {
  input: DeclarationAndCommitmentInput;
}

export interface CreateDeclarationAndCommitmentResult {
  createDeclarationAndCommitment: DeclarationAndCommitmentsPayload;
}

export enum SupportedProviders {
  MTN_MOMO = 'MTN_MOMO',
  M_PESA = 'M_PESA',
  ORANGE = 'ORANGE',
  AIRTEL = 'AIRTEL'
}

export interface WithdrawalInput {
  walletId: string;
  currencyCode: string;
  amount: number;
  provider: SupportedProviders;
  receiverPhone: string;
  description?: string;
  paymentPin?: string;
}

export interface WithdrawBalance {
  availableBalance: number;
  pendingBalance: number;
  reservedBalance: number;
}

export interface WithdrawResponse {
  success: boolean;
  message?: string;
  balance: WithdrawBalance;
  transaction: WalletTransaction;
}

export interface WithdrawOrTransferVariables {
  input: WithdrawalInput;
}

export interface WithdrawOrTransferResult {
  withdrawOrTransfer: WithdrawResponse;
}

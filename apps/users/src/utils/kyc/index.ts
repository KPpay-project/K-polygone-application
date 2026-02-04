import { KycApplicationType } from '@repo/types';

export interface KycCompletionStatus {
  isComplete: boolean;
  completedSteps: number;
  totalSteps: number;
  pendingSteps: string[];
  status: string;
}

/**
 * @param kycApplications Array of KYC applications for the user
 * @returns KycCompletionStatus object with completion details
 */
export const checkKycCompletionStatus = (kycApplications?: KycApplicationType[]): KycCompletionStatus => {
  if (!kycApplications || kycApplications.length === 0) {
    return {
      isComplete: false,
      completedSteps: 0,
      totalSteps: 5,
      pendingSteps: ['Personal Info', 'Contact Info', 'Identity', 'Financial Info', 'Bank Info'],
      status: 'not_started'
    };
  }

  const latestApplication = kycApplications[0];

  const steps = [
    { name: 'Personal Info', status: latestApplication.personalInfoStatus },
    { name: 'Contact Info', status: latestApplication.contactInfoStatus },
    { name: 'Identity', status: latestApplication.identityStatus },
    { name: 'Financial Info', status: latestApplication.financialInfoStatus },
    { name: 'Bank Info', status: latestApplication.bankInfoStatus }
  ];

  const completedSteps = steps.filter((step) => step.status === 'approved' || step.status === 'completed').length;

  const pendingSteps = steps
    .filter((step) => step.status !== 'approved' && step.status !== 'completed')
    .map((step) => step.name);

  const isComplete =
    latestApplication.status === 'approved' ||
    latestApplication.status === 'completed' ||
    completedSteps === steps.length;

  return {
    isComplete,
    completedSteps,
    totalSteps: steps.length,
    pendingSteps,
    status: latestApplication.status
  };
};

/**
 * Gets a user-friendly message based on KYC status
 * @param kycStatus KycCompletionStatus object
 * @returns Object with message and action text
 */
export const getKycStatusMessage = (kycStatus: KycCompletionStatus) => {
  if (kycStatus.isComplete) {
    return {
      message: 'Your KYC verification is complete!',
      actionText: null,
      variant: 'success' as const
    };
  }

  if (kycStatus.status === 'not_started') {
    return {
      message: 'Complete your KYC verification to unlock all features',
      actionText: 'Start KYC Verification',
      variant: 'warning' as const
    };
  }

  if (kycStatus.status === 'pending' || kycStatus.status === 'incomplete') {
    return {
      message: `Your KYC verification is ${kycStatus.completedSteps}/${kycStatus.totalSteps} complete`,
      actionText: 'Continue KYC Verification',
      variant: 'info' as const
    };
  }

  if (kycStatus.status === 'rejected') {
    return {
      message: 'Your KYC verification was rejected. Please review and resubmit',
      actionText: 'Review KYC Application',
      variant: 'error' as const
    };
  }

  return {
    message: 'Complete your KYC verification to access all features',
    actionText: 'Complete KYC Verification',
    variant: 'warning' as const
  };
};

/**
 * Gets the KYC page URL based on status
 * @param kycStatus KycCompletionStatus object
 * @returns URL string for the appropriate KYC page
 */
export const getKycPageUrl = (kycStatus: KycCompletionStatus): string => {
  if (kycStatus.status === 'not_started') {
    return '/settings/verifications/personal-information';
  }

  if (kycStatus.status === 'rejected') {
    return '/settings/verifications';
  }

  if (kycStatus.pendingSteps.length > 0) {
    const stepMapping: { [key: string]: string } = {
      'Personal Info': '/settings/verifications/personal-information',
      'Contact Info': '/settings/verifications/contact-details',
      Identity: '/settings/verifications/identity-document',
      'Financial Info': '/settings/verifications/financial-information',
      'Bank Info': '/settings/verifications/banking-information'
    };

    const firstPendingStep = kycStatus.pendingSteps[0];
    return stepMapping[firstPendingStep] || '/settings/verifications/personal-information';
  }

  return '/settings/verifications';
};

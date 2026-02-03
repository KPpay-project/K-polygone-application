export interface SimpleKycApplication {
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

export interface KycStatus {
  isComplete: boolean;
  status: string;
  message: string;
  actionText: string;
  variant: 'success' | 'warning' | 'info' | 'error';
  redirectUrl: string;
}

export const getSimpleKycStatus = (kycApplications?: SimpleKycApplication[]): KycStatus => {
  if (!kycApplications || kycApplications.length === 0) {
    return {
      isComplete: false,
      status: 'not_started',
      message: 'Complete your account verification to unlock all features',
      actionText: 'Start Verification',
      variant: 'warning',
      redirectUrl: '/settings/verifications/personal-information'
    };
  }

  const latestApplication = kycApplications[0];
  const status = latestApplication.status;

  if (status === 'approved' || status === 'completed') {
    return {
      isComplete: true,
      status,
      message: 'Your account verification is complete!',
      actionText: '',
      variant: 'success',
      redirectUrl: '/settings/verifications'
    };
  }

  if (status === 'rejected') {
    return {
      isComplete: false,
      status,
      message: 'Your account verification was rejected. Please review and resubmit',
      actionText: 'Review Application',
      variant: 'error',
      redirectUrl: '/settings/verifications'
    };
  }

  if (status === 'pending') {
    return {
      isComplete: false,
      status,
      message: 'Your account verification is under review',
      actionText: 'View Status',
      variant: 'info',
      redirectUrl: '/settings/verifications'
    };
  }

  if (status === 'incomplete') {
    // const steps = [
    //   latestApplication.personalInfoStatus,
    //   latestApplication.contactInfoStatus,
    //   latestApplication.identityStatus,
    //   latestApplication.financialInfoStatus,
    //   latestApplication.bankInfoStatus
    // ];

    // const completedSteps = steps.filter((step) => step === 'approved' || step === 'completed').length;

    return {
      isComplete: false,
      status,
      message: 'Your account verification is in progress',
      actionText: 'Continue Verification',
      variant: 'info',
      redirectUrl: getNextKycStep(latestApplication)
    };
  }

  return {
    isComplete: false,
    status,
    message: 'Complete your account verification to access all features',
    actionText: 'Complete Verification',
    variant: 'warning',
    redirectUrl: '/settings/verifications'
  };
};

const getNextKycStep = (application: SimpleKycApplication): string => {
  if (application.personalInfoStatus !== 'approved' && application.personalInfoStatus !== 'completed') {
    return '/settings/verifications/personal-information';
  }

  if (application.contactInfoStatus !== 'approved' && application.contactInfoStatus !== 'completed') {
    return '/settings/verifications/contact-details';
  }

  if (application.identityStatus !== 'approved' && application.identityStatus !== 'completed') {
    return '/settings/verifications/identity-document';
  }

  if (application.financialInfoStatus !== 'approved' && application.financialInfoStatus !== 'completed') {
    return '/settings/verifications/financial-information';
  }

  if (application.bankInfoStatus !== 'approved' && application.bankInfoStatus !== 'completed') {
    return '/settings/verifications/banking-information';
  }

  return '/settings/verifications';
};

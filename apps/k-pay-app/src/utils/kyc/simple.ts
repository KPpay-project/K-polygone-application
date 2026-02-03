export interface SimpleKycApplication {
  id: string;
  personalInfoStatus: KycStepStatus;
  bankInfoStatus: KycStepStatus;
  contactInfoStatus: KycStepStatus;
  identityStatus: KycStepStatus;
  politicalExposureStatus: KycStepStatus;
  financialInfoStatus: KycStepStatus;
  declarationsStatus: KycStepStatus;
  createdAt: string;
  updatedAt: string;
}

export type KycStepStatus =
  | 'pending'
  | 'processing'
  | 'approved'
  | 'rejected'
  | 'completed'
  | 'failed';

export interface KycStatus {
  isComplete: boolean;
  inProgress: boolean;
  latestApplication?: SimpleKycApplication;
}

const getSimpleKycStatus = (
  applications?: SimpleKycApplication[]
): KycStatus => {
  if (!applications || applications.length === 0) {
    return { isComplete: false, inProgress: false };
  }

  // Get the most recent application
  const latestApplication = applications[0];

  // Check if all required steps are complete
  const allStepsComplete = [
    latestApplication.personalInfoStatus,
    latestApplication.bankInfoStatus,
    latestApplication.contactInfoStatus,
    latestApplication.identityStatus,
    latestApplication.politicalExposureStatus,
    latestApplication.financialInfoStatus,
    latestApplication.declarationsStatus,
  ].every((status) => status === 'completed' || status === 'approved');

  // Check if any step is in progress
  const anyStepInProgress = [
    latestApplication.personalInfoStatus,
    latestApplication.bankInfoStatus,
    latestApplication.contactInfoStatus,
    latestApplication.identityStatus,
    latestApplication.politicalExposureStatus,
    latestApplication.financialInfoStatus,
    latestApplication.declarationsStatus,
  ].some((status) => status === 'processing');

  return {
    isComplete: allStepsComplete,
    inProgress: anyStepInProgress,
    latestApplication,
  };
};

export default getSimpleKycStatus;

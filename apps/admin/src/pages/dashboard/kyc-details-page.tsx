import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { ModularCard } from '@/components/sub-modules/card/card.tsx';
import { useQuery } from '@apollo/client';
import { GET_KYC_BY_ID } from '@/lib/graphql/queries/kyc';
import useKycVerification from '@/hooks/api/use-kyc-verification';
import { toast } from 'sonner';
import StatusTabs from '@/components/misc/status-tabs';
import KycPreviewSkeletonLoader from '@/components/common/skeleton/kyc-preview-skeleton-loader';

// Import section components
import PersonalInfoSection from '@/components/modules/kyc/sections/PersonalInfoSection';
import ContactDetailsSection from '@/components/modules/kyc/sections/ContactDetailsSection';
import IdentityDocumentSection from '@/components/modules/kyc/sections/IdentityDocumentSection';
import FinancialInfoSection from '@/components/modules/kyc/sections/FinancialInfoSection';
import BankingInfoSection from '@/components/modules/kyc/sections/BankingInfoSection';
import PoliticalExposureSection from '@/components/modules/kyc/sections/PoliticalExposureSection';
import DeclarationsSection from '@/components/modules/kyc/sections/DeclarationsSection';
import UserAccountSection from '@/components/modules/kyc/sections/UserAccountSection';

class KycVerificationService {
  verifyMethods: any;
  rejectMethods: any;
  verifyLoading: any;
  rejectLoading: any;

  constructor(kycVerification: any) {
    const {
      verifyPersonalInfo,
      personalInfoVerifyLoading,
      rejectPersonalInfo,
      personalInfoRejectLoading,
      verifyContactDetail,
      contactDetailVerifyLoading,
      rejectContactDetail,
      contactDetailRejectLoading,
      verifyIdentityDocument,
      identityDocumentVerifyLoading,
      rejectIdentityDocument,
      identityDocumentRejectLoading,
      verifyFinancialInfo,
      financialInfoVerifyLoading,
      rejectFinancialInfo,
      financialInfoRejectLoading,
      verifyBankInfo,
      bankInfoVerifyLoading,
      rejectBankInfo,
      bankInfoRejectLoading,
      verifyPoliticalExposure,
      politicalExposureVerifyLoading
    } = kycVerification;
    this.verifyMethods = {
      personalInfo: verifyPersonalInfo,
      contactDetail: verifyContactDetail,
      identityDocument: verifyIdentityDocument,
      financialInfo: verifyFinancialInfo,
      bankInfo: verifyBankInfo,
      politicalExposure: verifyPoliticalExposure
    };

    this.rejectMethods = {
      personalInfo: rejectPersonalInfo,
      contactDetail: rejectContactDetail,
      identityDocument: rejectIdentityDocument,
      financialInfo: rejectFinancialInfo,
      bankInfo: rejectBankInfo,
      politicalExposure: rejectPersonalInfo, // Using rejectPersonalInfo as fallback
      declarations: rejectPersonalInfo, // Using rejectPersonalInfo as fallback
      userAccount: rejectPersonalInfo // Using rejectPersonalInfo as fallback
    };

    this.verifyLoading = {
      personalInfo: personalInfoVerifyLoading,
      contactDetail: contactDetailVerifyLoading,
      identityDocument: identityDocumentVerifyLoading,
      financialInfo: financialInfoVerifyLoading,
      bankInfo: bankInfoVerifyLoading,
      politicalExposure: politicalExposureVerifyLoading
    };

    this.rejectLoading = {
      personalInfo: personalInfoRejectLoading,
      contactDetail: contactDetailRejectLoading,
      identityDocument: identityDocumentRejectLoading,
      financialInfo: financialInfoRejectLoading,
      bankInfo: bankInfoRejectLoading
    };
  }

  async handleApprove(section: any, sectionId: any, refetch: any) {
    if (!sectionId || sectionId === 'Nil') {
      toast.error('Cannot approve: Section data not available');
      return;
    }

    try {
      const verifyMethod = this.verifyMethods[section];
      if (!verifyMethod) throw new Error('Invalid section');
      const result = await verifyMethod(sectionId);
      if (result.success) {
        toast.success(result.message || 'Section approved successfully');
        refetch();
      } else {
        toast.error(result.message || 'Failed to approve section');
      }
    } catch {
      toast.error('An error occurred while approving the section');
    }
  }

  async handleReject(section: any, sectionId: any, refetch: any, reason = 'Information needs review') {
    if (!sectionId || sectionId === 'Nil') {
      toast.error('Cannot reject: Section data not available');
      return;
    }

    try {
      const rejectMethod = this.rejectMethods[section];
      if (!rejectMethod) throw new Error('Invalid section or rejection not available');
      const input = { [`${section}Id`]: sectionId, reason };
      const result = await rejectMethod(input);
      if (result.success) {
        toast.success(result.message || 'Section rejected successfully');
        refetch();
      } else {
        toast.error(result.message || 'Failed to reject section');
      }
    } catch {
      toast.error('An error occurred while rejecting the section');
    }
  }
}

const kycTabs = [
  { key: 'personalInfo', label: 'Personal Info' },
  { key: 'contactDetail', label: 'Contact Details' },
  { key: 'identityDocument', label: 'Identity Document' },
  { key: 'financialInfo', label: 'Financial Info' },
  { key: 'bankInfo', label: 'Banking Info' },
  { key: 'politicalExposure', label: 'Political Exposure' },
  { key: 'declarations', label: 'Declarations and Commitments' },
  { key: 'userAccount', label: 'User Account Information' }
];

interface KycDetailsPageProps {
  id: string;
}

function KycDetailsPage({ id }: KycDetailsPageProps) {
  const navigate = useNavigate();
  const { loading, data, error, refetch } = useQuery(GET_KYC_BY_ID, { variables: { id } });
  const kycVerification = useKycVerification();
  const kycService = new KycVerificationService(kycVerification);
  const [activeTab, setActiveTab] = useState('personalInfo');

  if (loading) {
    return (
      <ModularCard>
        <KycPreviewSkeletonLoader />
      </ModularCard>
    );
  }

  if (error || !data?.kycApplicationById) {
    return (
      <ModularCard>
        <div className="max-w-4xl mx-auto p-6 bg-white">
          <div className="text-center py-12">
            <p className="text-red-600">Error loading KYC application details</p>
            <Button onClick={() => navigate({ to: '/dashboard/verifications' })} className="mt-4">
              Back to Verifications
            </Button>
          </div>
        </div>
      </ModularCard>
    );
  }

  const kycApplication = data.kycApplicationById;

  const verifyLoadingMap: Record<string, boolean> = {
    personalInfo: kycVerification.personalInfoVerifyLoading,
    contactDetail: kycVerification.contactDetailVerifyLoading,
    identityDocument: kycVerification.identityDocumentVerifyLoading,
    financialInfo: kycVerification.financialInfoVerifyLoading,
    bankInfo: kycVerification.bankInfoVerifyLoading,
    politicalExposure: kycVerification.politicalExposureVerifyLoading,
    declarations: kycVerification.personalInfoVerifyLoading, // Using personalInfo as fallback
    userAccount: kycVerification.personalInfoVerifyLoading // Using personalInfo as fallback
  };
  const rejectLoadingMap: Record<string, boolean> = {
    personalInfo: kycVerification.personalInfoRejectLoading,
    contactDetail: kycVerification.contactDetailRejectLoading,
    identityDocument: kycVerification.identityDocumentRejectLoading,
    financialInfo: kycVerification.financialInfoRejectLoading,
    bankInfo: kycVerification.bankInfoRejectLoading,
    politicalExposure: kycVerification.personalInfoRejectLoading, // Using personalInfo as fallback
    declarations: kycVerification.personalInfoRejectLoading, // Using personalInfo as fallback
    userAccount: kycVerification.personalInfoRejectLoading // Using personalInfo as fallback
  };

  return (
    <ModularCard>
      <div className=" mx-auto p-6 bg-white">
        <div className="flex justify-between items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate({ to: '/dashboard/verifications' })}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back
          </Button>
        </div>

        {/* Overall KYC Status Header */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-xl font-semibold text-gray-900">KYC Application Details</h1>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                kycApplication.status === 'verified' || kycApplication.status === 'approved'
                  ? 'bg-green-100 text-green-800'
                  : kycApplication.status === 'rejected'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {kycApplication.status?.charAt(0).toUpperCase() + kycApplication.status?.slice(1) || 'Unknown'}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Application ID:</span>
              <span className="ml-2 font-medium">{kycApplication.id || 'N/A'}</span>
            </div>
            <div>
              <span className="text-gray-500">Client Type:</span>
              <span className="ml-2 font-medium">{kycApplication.kycClientType || 'N/A'}</span>
            </div>
            <div>
              <span className="text-gray-500">Created:</span>
              <span className="ml-2 font-medium">
                {kycApplication.insertedAt ? new Date(kycApplication.insertedAt).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Last Updated:</span>
              <span className="ml-2 font-medium">
                {kycApplication.updatedAt ? new Date(kycApplication.updatedAt).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>
          {kycApplication.rejectionReason && (
            <div className="mt-3 p-3 bg-red-50 rounded border-l-4 border-red-400">
              <div className="text-sm">
                <span className="font-medium text-red-800">Rejection Reason:</span>
                <span className="ml-2 text-red-700">{kycApplication.rejectionReason}</span>
              </div>
            </div>
          )}
          {kycApplication.message && (
            <div className="mt-3 p-3 bg-blue-50 rounded border-l-4 border-blue-400">
              <div className="text-sm">
                <span className="font-medium text-blue-800">Message:</span>
                <span className="ml-2 text-blue-700">{kycApplication.message}</span>
              </div>
            </div>
          )}
        </div>

        <StatusTabs
          tabs={kycTabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          className="mb-8"
          useWhiteBg={false}
        />

        {/* Render Section Components */}
        {activeTab === 'personalInfo' && (
          <PersonalInfoSection
            data={kycApplication.personalInfo || {}}
            status={kycApplication.personalInfoStatus || ''}
            onApprove={(sectionId: string) => kycService.handleApprove('personalInfo', sectionId, refetch)}
            onReject={(sectionId: string) => kycService.handleReject('personalInfo', sectionId, refetch)}
            verifyLoading={verifyLoadingMap.personalInfo}
            rejectLoading={rejectLoadingMap.personalInfo}
          />
        )}

        {activeTab === 'contactDetail' && (
          <ContactDetailsSection
            data={kycApplication.contactDetail || {}}
            status={kycApplication.contactInfoStatus || ''}
            onApprove={(sectionId: string) => kycService.handleApprove('contactDetail', sectionId, refetch)}
            onReject={(sectionId: string) => kycService.handleReject('contactDetail', sectionId, refetch)}
            verifyLoading={verifyLoadingMap.contactDetail}
            rejectLoading={rejectLoadingMap.contactDetail}
          />
        )}

        {activeTab === 'identityDocument' && (
          <IdentityDocumentSection
            data={kycApplication.identityDocument || {}}
            status={kycApplication.identityStatus || ''}
            onApprove={(sectionId: string) => kycService.handleApprove('identityDocument', sectionId, refetch)}
            onReject={(sectionId: string) => kycService.handleReject('identityDocument', sectionId, refetch)}
            verifyLoading={verifyLoadingMap.identityDocument}
            rejectLoading={rejectLoadingMap.identityDocument}
          />
        )}

        {activeTab === 'financialInfo' && (
          <FinancialInfoSection
            data={kycApplication.financialInfo || {}}
            status={kycApplication.financialInfoStatus || ''}
            onApprove={(sectionId: string) => kycService.handleApprove('financialInfo', sectionId, refetch)}
            onReject={(sectionId: string) => kycService.handleReject('financialInfo', sectionId, refetch)}
            verifyLoading={verifyLoadingMap.financialInfo}
            rejectLoading={rejectLoadingMap.financialInfo}
          />
        )}

        {activeTab === 'bankInfo' && (
          <BankingInfoSection
            data={kycApplication.bankInfo || {}}
            status={kycApplication.bankInfoStatus || ''}
            onApprove={(sectionId: string) => kycService.handleApprove('bankInfo', sectionId, refetch)}
            onReject={(sectionId: string) => kycService.handleReject('bankInfo', sectionId, refetch)}
            verifyLoading={verifyLoadingMap.bankInfo}
            rejectLoading={rejectLoadingMap.bankInfo}
          />
        )}

        {activeTab === 'politicalExposure' && (
          <PoliticalExposureSection
            data={kycApplication.politicalExposure || {}}
            status={kycApplication.politicalExposureStatus || ''}
            onApprove={(sectionId: string) => kycService.handleApprove('politicalExposure', sectionId, refetch)}
            onReject={(sectionId: string) => kycService.handleReject('politicalExposure', sectionId, refetch)}
            verifyLoading={verifyLoadingMap.politicalExposure}
            rejectLoading={rejectLoadingMap.politicalExposure}
          />
        )}

        {activeTab === 'declarations' && (
          <DeclarationsSection
            data={kycApplication.declarationsAndCommitments || {}}
            personalInfo={kycApplication.personalInfo}
            onApprove={(sectionId: string) => kycService.handleApprove('declarations', sectionId, refetch)}
            onReject={(sectionId: string) => kycService.handleReject('declarations', sectionId, refetch)}
            verifyLoading={verifyLoadingMap.declarations}
            rejectLoading={rejectLoadingMap.declarations}
          />
        )}

        {activeTab === 'userAccount' && (
          <UserAccountSection
            data={kycApplication.userAccount || {}}
            onApprove={(sectionId: string) => kycService.handleApprove('userAccount', sectionId, refetch)}
            onReject={(sectionId: string) => kycService.handleReject('userAccount', sectionId, refetch)}
            verifyLoading={verifyLoadingMap.userAccount}
            rejectLoading={rejectLoadingMap.userAccount}
          />
        )}
      </div>
    </ModularCard>
  );
}

export default KycDetailsPage;

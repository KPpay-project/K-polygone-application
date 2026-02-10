import { Button } from 'k-polygon-assets';
import { ArrowRight } from 'iconsax-reactjs';
import { Bank, ProfileAdd, Money, ProfileCircle, Document, CopySuccess, Call } from 'iconsax-reactjs';
import { useNavigate } from '@tanstack/react-router';
import { StatusBadge } from '@/components/modules';
import { useKycStatus } from '@/hooks/api/use-kyc-status';
import { useMe } from '@/hooks/api';

const ICON_SIZE = 22;
const IndexVerificationScreen = () => {
  const navigate = useNavigate();
  const { kycApplications, loading } = useKycStatus();
  const { loading: loadingUser } = useMe();

  const kycApplicationIsNUll = kycApplications === null || kycApplications?.length === 0;

  const latestApplication = kycApplications && kycApplications.length > 0 ? kycApplications[0] : null;

  const findFirstActionableStep = () => {
    if (!latestApplication) return verificationItems[0].path;
    const firstActionableItem = verificationItems.find((item) => {
      const statusValue = latestApplication[item.statusKey as keyof typeof latestApplication];
      return statusValue !== 'processing' && statusValue !== 'approved' && statusValue !== 'completed';
    });

    return firstActionableItem ? firstActionableItem.path : verificationItems[0].path;
  };

  const getStatusForStep = (stepKey: string) => {
    if (loading || !latestApplication) return 'pending';

    const statusValue = latestApplication[stepKey as keyof typeof latestApplication];

    if (statusValue === 'approved' || statusValue === 'completed') return 'done';
    if (statusValue === 'rejected' || statusValue === 'reject' || statusValue === 'failed') return 'failed';
    if (statusValue === 'processing') return 'in-progress';
    if (statusValue === 'pending') return 'pending';
    return 'pending';
  };

  const isStepClickable = (stepKey: string) => {
    if (loading || !latestApplication) return true;

    const statusValue = latestApplication[stepKey as keyof typeof latestApplication];
    return statusValue !== 'processing' && statusValue !== 'approved' && statusValue !== 'completed';
  };
  const verificationItems = [
    {
      icon: <ProfileCircle size={ICON_SIZE} color="#4F46E5" />,
      title: 'Personal Information',
      description: 'Tell us who you are',
      path: '/settings/verifications/personal-information',
      statusKey: 'personalInfoStatus'
    },
    {
      icon: <Bank size={ICON_SIZE} color="#4F46E5" />,
      title: 'Banking Information',
      description: 'Let us bank information',
      path: '/settings/verifications/banking-information',
      statusKey: 'bankInfoStatus'
    },
    {
      icon: <Call size={ICON_SIZE} color="#4F46E5" />,
      title: 'Contact Details',
      description: 'Share contact',
      path: '/settings/verifications/contact-details',
      statusKey: 'contactInfoStatus'
    },
    {
      icon: <ProfileAdd size={ICON_SIZE} color="#4F46E5" />,
      title: 'Political Exposure (PEP)',
      description: 'Tell us a public office role',
      path: '/settings/verifications/political-exposure',
      statusKey: 'politicalExposureStatus'
    },
    {
      icon: <Document size={ICON_SIZE} color="#4F46E5" />,
      title: 'Identity Document',
      description: 'Upload a valid ID',
      path: '/settings/verifications/identity-document',
      statusKey: 'identityStatus'
    },
    {
      icon: <Money size={ICON_SIZE} color="#4F46E5" />,
      title: 'Financial Information',
      description: 'Provide your source of funds',
      path: '/settings/verifications/financial-information',
      statusKey: 'financialInfoStatus'
    },
    {
      icon: <CopySuccess size={ICON_SIZE} color="#4F46E5" />,
      title: 'Declarations',
      description: 'Confirm and acknowledge',
      path: '/settings/verifications/declarations',
      statusKey: 'declarationsStatus'
    }
  ];

  if (loading || loadingUser) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (kycApplicationIsNUll) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4">
        <p className="text-gray-600">Unable to load verification status. Please reload your browser.</p>
        <Button
          className="bg-blue-500 px-6 py-2 text-white rounded-md hover:bg-blue-600"
          onClick={() => window.location.reload()}
        >
          Reload Page
        </Button>
      </div>
    );
  }

  return (
    <>
      {/*<InterfaceAlert state="success" title="Be careful!" description="Double-check your input before continuing." />*/}
      <div
        className="max-w-3xl mx-auto px-4 py-8 overflow-y-auto h-full
      "
      >
        <div className="flex flex-col items-center mb-10">
          <div className="p-4 mb-6">
            <img src="/img/id_verification.svg" alt="ID Verification" width={70} />
          </div>
          <h2 className="text-2xl font-semibold mb-3">Verify your identity</h2>
          <p className="text-gray-600 text-center max-w-md">
            To comply with OHADA and AML/CTF regulations, we need to verify your identity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8  overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 scrollbar-thumb-rounded-full scrollbar-track-rounded-full hover:scrollbar-thumb-gray-400">
          {verificationItems.map((item, index) => {
            const isClickable = isStepClickable(item.statusKey);
            const status = getStatusForStep(item.statusKey);

            return (
              <div
                key={index}
                className={`border rounded-xl px-3 py-3 flex items-center justify-between gap-5 ${
                  isClickable ? 'hover:bg-gray-50 cursor-pointer' : 'opacity-75 cursor-not-allowed bg-gray-50'
                }`}
                onClick={() => isClickable && navigate({ to: item.path })}
              >
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-full ${isClickable ? 'bg-blue-50' : 'bg-gray-100'}`}>{item.icon}</div>
                  <div>
                    <h3 className="font-medium text-sm">{item.title}</h3>
                    <p className="text-xs text-gray-500">
                      {isClickable ? item.description : status === 'in-progress' ? 'Pending review' : item.description}
                    </p>
                  </div>
                </div>

                <div>
                  <StatusBadge status={status} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex  mt-8">
          <Button
            className="bg-red-500 w-full md:w-[300px] py-4 hover:bg-red-600 text-white rounded-md flex items-center justify-center gap-2"
            onClick={() => navigate({ to: findFirstActionableStep() })}
          >
            Start Verification
            <ArrowRight size="18" />
          </Button>
        </div>
      </div>
    </>
  );
};
export default IndexVerificationScreen;

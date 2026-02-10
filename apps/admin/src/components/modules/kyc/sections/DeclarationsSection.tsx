import { Button } from '@/components/ui/button';

interface DeclarationsSectionProps {
  data: any;
  personalInfo: any;
  onApprove: (sectionId: string) => void;
  onReject: (sectionId: string) => void;
  verifyLoading: boolean;
  rejectLoading: boolean;
}

const formatValue = (value: any) => {
  if (value === null || value === undefined || value === '') return 'Nil';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return String(value);
};

const DeclarationsSection = ({
  data,
  personalInfo,
  onApprove,
  onReject,
  verifyLoading,
  rejectLoading
}: DeclarationsSectionProps) => {
  const renderActionButtons = (verified: boolean, sectionId: string) => {
    if (!sectionId || sectionId === 'Nil') {
      return (
        <div className="flex gap-4 mt-6">
          <Button className="bg-gray-400 text-white px-8 py-2 rounded-lg" disabled>
            No Data Available
          </Button>
        </div>
      );
    }

    if (verified === false) {
      return (
        <div className="flex gap-4 mt-6">
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg"
            onClick={() => onApprove(sectionId)}
            disabled={verifyLoading}
          >
            {verifyLoading ? 'Approving...' : 'Approve'}
          </Button>
          <Button
            className="bg-red-500 hover:bg-red-600 text-white px-8 py-2 rounded-lg"
            onClick={() => onReject(sectionId)}
            disabled={rejectLoading}
          >
            {rejectLoading ? 'Rejecting...' : 'Reject'}
          </Button>
        </div>
      );
    } else if (verified === true) {
      return (
        <div className="flex gap-4 mt-6">
          <Button
            className="bg-red-500 hover:bg-red-600 text-white px-8 py-2 rounded-lg"
            onClick={() => onReject(sectionId)}
            disabled={rejectLoading}
          >
            {rejectLoading ? 'Rejecting...' : 'Reject'}
          </Button>
        </div>
      );
    }

    return null;
  };

  const fullName = formatValue(`${personalInfo?.firstName || ''} ${personalInfo?.lastName || ''}`.trim());

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-blue-600 font-semibold text-lg">Declarations and Commitments</h2>
      </div>

      <div className="grid grid-cols-2 gap-x-12 gap-y-6">
        <div>
          <label className="text-gray-500 text-sm">Full Name (for declaration/signature)</label>
          <div className="flex items-center gap-2">
            <p className="text-gray-900 font-medium">{fullName}</p>
          </div>
        </div>

        <div>
          <label className="text-gray-500 text-sm">Institution Name</label>
          <div className="flex items-center gap-2">
            <p className="text-gray-900 font-medium">Kpay</p>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 border-2 border-gray-300 rounded flex items-center justify-center mt-0.5">
            <div className="w-3 h-3 bg-blue-600 rounded-sm"></div>
          </div>
          <p className="text-gray-700 text-sm">I certify that the information provided is accurate and complete</p>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 border-2 border-gray-300 rounded flex items-center justify-center mt-0.5">
            <div className="w-3 h-3 bg-blue-600 rounded-sm"></div>
          </div>
          <p className="text-gray-700 text-sm">
            I acknowledge that this information may be used for anti-money laundering and counter-terrorism purposes
          </p>
        </div>
      </div>

      {renderActionButtons(data.verified, data.id)}
    </div>
  );
};

export default DeclarationsSection;

import { Button } from '@/components/ui/button';

interface IdentityDocumentSectionProps {
  data: any;
  status: string;
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

const IdentityDocumentSection = ({
  data,
  status,
  onApprove,
  onReject,
  verifyLoading,
  rejectLoading
}: IdentityDocumentSectionProps) => {
  const documentUrl = data?.documentUrl;

  const renderActionButtons = (sectionStatus: string, sectionId: string) => {
    if (!sectionId || sectionId === 'Nil') {
      return (
        <div className="flex gap-4 mt-6">
          <Button className="bg-gray-400 text-white px-8 py-2 rounded-lg" disabled>
            No Data Available
          </Button>
        </div>
      );
    }

    if (sectionStatus === 'rejected' || sectionStatus === 'failed') {
      return (
        <div className="flex gap-4 mt-6">
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg"
            onClick={() => onApprove(sectionId)}
            disabled={verifyLoading}
          >
            {verifyLoading ? 'Approving...' : 'Approve'}
          </Button>
        </div>
      );
    }

    if (sectionStatus === 'approved') {
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
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-blue-600 font-semibold text-lg">Identity Document</h2>
        {status && (
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              status === 'verified' || status === 'approved'
                ? 'bg-green-100 text-green-800'
                : status === 'rejected'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-x-12 gap-y-6">
        <div>
          <label className="text-gray-500 text-sm">Type of Document</label>
          <div className="flex items-center gap-2">
            <p className="text-gray-900 font-medium">{formatValue(data.documentType)}</p>
          </div>
        </div>

        <div>
          <label className="text-gray-500 text-sm">Document Number</label>
          <div className="flex items-center gap-2">
            <p className="text-gray-900 font-medium">{formatValue(data.documentNumber)}</p>
          </div>
        </div>

        <div>
          <label className="text-gray-500 text-sm">Date of Issue</label>
          <div className="flex items-center gap-2">
            <p className="text-gray-900 font-medium">{formatValue(data.dateOfIssue)}</p>
          </div>
        </div>

        <div>
          <label className="text-gray-500 text-sm">Expiry Date</label>
          <div className="flex items-center gap-2">
            <p className="text-gray-900 font-medium">{formatValue(data.expiryDate)}</p>
          </div>
        </div>

        <div>
          <label className="text-gray-500 text-sm">Place of Issue</label>
          <div className="flex items-center gap-2">
            <p className="text-gray-900 font-medium">{formatValue(data.placeOfIssue)}</p>
          </div>
        </div>

        <div>
          <label className="text-gray-500 text-sm">Issuing Authority</label>
          <div className="flex items-center gap-2">
            <p className="text-gray-900 font-medium">{formatValue(data.issuingAuthority)}</p>
          </div>
        </div>
      </div>

      {documentUrl && (documentUrl.original || documentUrl.thumb) && (
        <div className="mt-6">
          <label className="text-gray-500 text-sm block mb-2">Document Image</label>
          <img
            src={documentUrl.thumb || documentUrl.original}
            alt="Identity Document"
            className="max-w-xs rounded border border-gray-200 shadow"
            style={{ maxHeight: 220 }}
          />
        </div>
      )}

      {renderActionButtons(status, data.id)}
    </div>
  );
};

export default IdentityDocumentSection;

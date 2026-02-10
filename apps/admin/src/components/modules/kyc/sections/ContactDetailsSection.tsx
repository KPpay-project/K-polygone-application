import { Button } from '@/components/ui/button';
import KycImagePreview from '../kyc-image-preview';

interface ContactDetailsSectionProps {
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

const getCountryFlag = (country: any) => {
  if (!country) return '🌍';

  const countryFlags: { [key: string]: string } = {
    Kenya: '🇰🇪',
    'South Africa': '🇿🇦',
    Nigeria: '🇳🇬',
    Ghana: '🇬🇭',
    Uganda: '🇺🇬',
    NG: '🇳🇬',
    GH: '🇬🇭',
    KE: '🇰🇪',
    ZA: '🇿🇦',
    UG: '🇺🇬'
  };
  return countryFlags[country] || '🌍';
};

const ContactDetailsSection = ({
  data,
  status,
  onApprove,
  onReject,
  verifyLoading,
  rejectLoading
}: ContactDetailsSectionProps) => {
  const addressProofUrl = data?.addressProofUrl;

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

    // If status is rejected or failed, show only approve button
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

    // If status is approved, show only reject button
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

    // For pending, processing, or other statuses, show both buttons
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
        <h2 className="text-blue-600 font-semibold text-lg">Contact Details</h2>
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
          <label className="text-gray-500 text-sm">Email Address</label>
          <div className="flex items-center gap-2">
            <p className="text-gray-900 font-medium">{formatValue(data.emailAddress)}</p>
          </div>
        </div>

        <div>
          <label className="text-gray-500 text-sm">Primary Phone</label>
          <div className="flex items-center gap-2">
            <p className="text-gray-900 font-medium">{formatValue(data.primaryPhone)}</p>
          </div>
        </div>

        <div>
          <label className="text-gray-500 text-sm">Secondary Phone</label>
          <div className="flex items-center gap-2">
            <p className="text-gray-900 font-medium">{formatValue(data.secondaryPhone)}</p>
          </div>
        </div>

        <div>
          <label className="text-gray-500 text-sm">Residential Country</label>
          <div className="flex items-center gap-2">
            <span className="text-lg">{getCountryFlag(data.residentialCountry)}</span>
            <p className="text-gray-900 font-medium">{formatValue(data.residentialCountry)}</p>
          </div>
        </div>

        <div>
          <label className="text-gray-500 text-sm">Residential City</label>
          <div className="flex items-center gap-2">
            <p className="text-gray-900 font-medium">{formatValue(data.residentialCity)}</p>
          </div>
        </div>

        <div>
          <label className="text-gray-500 text-sm">Residential Street</label>
          <div className="flex items-center gap-2">
            <p className="text-gray-900 font-medium">{formatValue(data.residentialStreet)}</p>
          </div>
        </div>

        <div>
          <label className="text-gray-500 text-sm">Residential Postal Code</label>
          <div className="flex items-center gap-2">
            <p className="text-gray-900 font-medium">{formatValue(data.residentialPostalCode)}</p>
          </div>
        </div>

        <div>
          <label className="text-gray-500 text-sm">Mailing Country</label>
          <div className="flex items-center gap-2">
            <span className="text-lg">{getCountryFlag(data.mailingCountry)}</span>
            <p className="text-gray-900 font-medium">{formatValue(data.mailingCountry)}</p>
          </div>
        </div>

        <div>
          <label className="text-gray-500 text-sm">Mailing City</label>
          <div className="flex items-center gap-2">
            <p className="text-gray-900 font-medium">{formatValue(data.mailingCity)}</p>
          </div>
        </div>

        <div>
          <label className="text-gray-500 text-sm">Mailing Street</label>
          <div className="flex items-center gap-2">
            <p className="text-gray-900 font-medium">{formatValue(data.mailingStreet)}</p>
          </div>
        </div>

        <div>
          <label className="text-gray-500 text-sm">Mailing Postal Code</label>
          <div className="flex items-center gap-2">
            <p className="text-gray-900 font-medium">{formatValue(data.mailingPostalCode)}</p>
          </div>
        </div>
      </div>

      {addressProofUrl && (addressProofUrl.original || addressProofUrl.thumb) && (
        <div className="mt-6">
          <KycImagePreview
            imageUrl={addressProofUrl.thumb || addressProofUrl.original}
            label={'Address Proof Document'}
          />
        </div>
      )}

      {renderActionButtons(status, data.id)}
    </div>
  );
};

export default ContactDetailsSection;

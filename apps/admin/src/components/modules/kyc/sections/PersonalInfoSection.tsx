import { Button } from '@/components/ui/button';

interface PersonalInfoSectionProps {
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

const PersonalInfoSection = ({
  data,
  status,
  onApprove,
  onReject,
  verifyLoading,
  rejectLoading
}: PersonalInfoSectionProps) => {
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
        <h2 className="text-blue-600 font-semibold text-lg">Personal Information</h2>
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
          <label className="text-gray-500 text-sm">First Name</label>
          <div className="flex items-center gap-2">
            <p className="text-gray-900 font-medium">{formatValue(data.firstName)}</p>
          </div>
        </div>

        <div>
          <label className="text-gray-500 text-sm">Last Name</label>
          <div className="flex items-center gap-2">
            <p className="text-gray-900 font-medium">{formatValue(data.lastName)}</p>
          </div>
        </div>

        <div>
          <label className="text-gray-500 text-sm">Date of Birth</label>
          <div className="flex items-center gap-2">
            <p className="text-gray-900 font-medium">{formatValue(data.dateOfBirth)}</p>
          </div>
        </div>

        <div>
          <label className="text-gray-500 text-sm">Place of Birth</label>
          <div className="flex items-center gap-2">
            <p className="text-gray-900 font-medium">{formatValue(data.placeOfBirth)}</p>
          </div>
        </div>

        <div>
          <label className="text-gray-500 text-sm">Nationality</label>
          <div className="flex items-center gap-2">
            <span className="text-lg">{getCountryFlag(data.nationality)}</span>
            <p className="text-gray-900 font-medium">{formatValue(data.nationality)}</p>
          </div>
        </div>

        <div>
          <label className="text-gray-500 text-sm">Country of Tax Residence</label>
          <div className="flex items-center gap-2">
            <span className="text-lg">{getCountryFlag(data.countryOrTaxResidence)}</span>
            <p className="text-gray-900 font-medium">{formatValue(data.countryOrTaxResidence)}</p>
          </div>
        </div>

        <div>
          <label className="text-gray-500 text-sm">Occupation</label>
          <div className="flex items-center gap-2">
            <p className="text-gray-900 font-medium">{formatValue(data.occupation)}</p>
          </div>
        </div>

        <div>
          <label className="text-gray-500 text-sm">Current Employer</label>
          <div className="flex items-center gap-2">
            <p className="text-gray-900 font-medium">{formatValue(data.currentEmployer)}</p>
          </div>
        </div>

        <div>
          <label className="text-gray-500 text-sm">Employment Status</label>
          <div className="flex items-center gap-2">
            <p className="text-gray-900 font-medium">{formatValue(data.employmentStatus)}</p>
          </div>
        </div>

        <div>
          <label className="text-gray-500 text-sm">Maiden Name</label>
          <div className="flex items-center gap-2">
            <p className="text-gray-900 font-medium">{formatValue(data.maidenName)}</p>
          </div>
        </div>

        <div>
          <label className="text-gray-500 text-sm">Tax Identification Number</label>
          <div className="flex items-center gap-2">
            <p className="text-gray-900 font-medium">{formatValue(data.taxIdentificationNumber)}</p>
          </div>
        </div>
      </div>

      {renderActionButtons(status, data.id)}
    </div>
  );
};

export default PersonalInfoSection;

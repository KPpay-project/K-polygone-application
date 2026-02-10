import { Button } from '@/components/ui/button';

interface SectionCardProps {
  section: any;
  data: any;
  status: string;
  onApprove: (sectionId: string) => void;
  onReject: (sectionId: string) => void;
  verifyLoading: boolean;
  rejectLoading: boolean;
}

const getCountryFlag = (country: any) => {
  if (!country) return '🌍';

  const countryFlags: { [key: string]: string } = {
    Kenya: '🇰🇪',
    'South Africa': '🇿🇦',
    Nigeria: '🇳🇬',
    Ghana: '🇬🇭',
    Uganda: '��🇬',
    NG: '�🇬', // Nigeria code
    GH: '🇬�🇭', // Ghana code
    KE: '🇰🇪', // Kenya code
    ZA: '🇿🇦', // South Africa code
    UG: '🇺🇬', // Uganda code
    US: '🇺🇸', // United States
    GB: '🇬🇧', // United Kingdom
    CA: '🇨🇦', // Canada
    ZW: '🇿🇼', // Zimbabwe
    ZM: '🇿🇲', // Zambia
    TZ: '🇹🇿', // Tanzania
    RW: '🇷🇼', // Rwanda
    ET: '🇪🇹', // Ethiopia
    CI: '🇨🇮', // Côte d'Ivoire
    SN: '🇸🇳', // Senegal
    ML: '🇲🇱', // Mali
    BF: '🇧🇫', // Burkina Faso
    BJ: '🇧🇯', // Benin
    TG: '🇹🇬', // Togo
    CM: '🇨🇲' // Cameroon
  };
  return countryFlags[country] || '🌍';
};

const formatValue = (value: any) => {
  if (value === null || value === undefined || value === '') return 'Nil';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return String(value);
};

const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((current: any, key: string) => current?.[key], obj);
};

function KycDetailslPannelCard({
  section,
  data,
  status,
  onApprove,
  onReject,
  verifyLoading,
  rejectLoading
}: SectionCardProps) {
  const isIdentityDocument = section.key === 'identityDocument';
  const isContactDetail = section.key === 'contactDetail';
  const documentUrl = data?.documentUrl;
  const addressProofUrl = data?.addressProofUrl;

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

    if (section.disableActions) {
      return (
        <div className="flex gap-4 mt-6">
          <Button className="bg-red-500 hover:bg-red-600 text-white px-8 py-2 rounded-lg" disabled>
            Reject (Not Available)
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg" disabled>
            Approve (Not Available)
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
          {!section.disableReject && (
            <Button
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-2 rounded-lg"
              onClick={() => onReject(sectionId)}
              disabled={rejectLoading}
            >
              {rejectLoading ? 'Rejecting...' : 'Reject'}
            </Button>
          )}
        </div>
      );
    } else if (verified === true && !section.disableReject) {
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

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-blue-600 font-semibold text-lg">{section.title}</h2>
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
      <div className={`grid grid-cols-${section.gridCols} gap-x-12 gap-y-6`}>
        {section.fields.map((field: any) => (
          <div key={field.key}>
            <label className="text-gray-500 text-sm">{field.label}</label>
            <div className="flex items-center gap-2">
              {field.flag && (
                <span className="text-lg">
                  {getCountryFlag(
                    field.customValue
                      ? field.customValue(data)
                      : field.key.includes('.')
                        ? getNestedValue(data, field.key)
                        : data[field.key]
                  )}
                </span>
              )}
              <p className="text-gray-900 font-medium">
                {field.customValue
                  ? field.customValue(data)
                  : field.key.includes('.')
                    ? formatValue(getNestedValue(data, field.key))
                    : formatValue(data[field.key])}
              </p>
            </div>
          </div>
        ))}
      </div>
      {isIdentityDocument && documentUrl && (documentUrl.original || documentUrl.thumb) && (
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
      {isContactDetail && addressProofUrl && (addressProofUrl.original || addressProofUrl.thumb) && (
        <div className="mt-6">
          <label className="text-gray-500 text-sm block mb-2">Address Proof Document</label>
          <img
            src={addressProofUrl.thumb || addressProofUrl.original}
            alt="Address Proof Document"
            className="max-w-xs rounded border border-gray-200 shadow"
            style={{ maxHeight: 220 }}
          />
        </div>
      )}
      {section.extraContent}
      {renderActionButtons(data.verified, data.id)}
    </div>
  );
}

export default KycDetailslPannelCard;

import { Button } from '@/components/ui/button';

interface UserAccountSectionProps {
  data: any;
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

const UserAccountSection = ({ data, onApprove, onReject, verifyLoading, rejectLoading }: UserAccountSectionProps) => {
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

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-blue-600 font-semibold text-lg">User Account Information</h2>
      </div>

      <div className="grid grid-cols-3 gap-x-12 gap-y-6">
        <div>
          <label className="text-gray-500 text-sm">Email</label>
          <div className="flex items-center gap-2">
            <p className="text-gray-900 font-medium">{formatValue(data.user?.email)}</p>
          </div>
        </div>

        <div>
          <label className="text-gray-500 text-sm">Phone</label>
          <div className="flex items-center gap-2">
            <p className="text-gray-900 font-medium">{formatValue(data.user?.phone)}</p>
          </div>
        </div>

        <div>
          <label className="text-gray-500 text-sm">Country</label>
          <div className="flex items-center gap-2">
            <span className="text-lg">{getCountryFlag(data.user?.country)}</span>
            <p className="text-gray-900 font-medium">{formatValue(data.user?.country)}</p>
          </div>
        </div>

        <div>
          <label className="text-gray-500 text-sm">Wallet Code</label>
          <div className="flex items-center gap-2">
            <p className="text-gray-900 font-medium">{formatValue(data.walletCode)}</p>
          </div>
        </div>

        <div>
          <label className="text-gray-500 text-sm">Account Status</label>
          <div className="flex items-center gap-2">
            <p className="text-gray-900 font-medium">{formatValue(data.status)}</p>
          </div>
        </div>

        <div>
          <label className="text-gray-500 text-sm">Role</label>
          <div className="flex items-center gap-2">
            <p className="text-gray-900 font-medium">{formatValue(data.role)}</p>
          </div>
        </div>

        <div>
          <label className="text-gray-500 text-sm">Sign In Count</label>
          <div className="flex items-center gap-2">
            <p className="text-gray-900 font-medium">{formatValue(data.signInCount)}</p>
          </div>
        </div>

        <div>
          <label className="text-gray-500 text-sm">Last Sign In</label>
          <div className="flex items-center gap-2">
            <p className="text-gray-900 font-medium">
              {data.lastSignInAt ? new Date(data.lastSignInAt).toLocaleString() : 'Never'}
            </p>
          </div>
        </div>

        <div>
          <label className="text-gray-500 text-sm">Current Sign In</label>
          <div className="flex items-center gap-2">
            <p className="text-gray-900 font-medium">
              {data.currentSignInAt ? new Date(data.currentSignInAt).toLocaleString() : 'Never'}
            </p>
          </div>
        </div>
      </div>

      {renderActionButtons(data.verified, data.id)}
    </div>
  );
};

export default UserAccountSection;

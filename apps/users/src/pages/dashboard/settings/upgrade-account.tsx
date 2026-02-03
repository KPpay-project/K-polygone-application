import { Typography } from '@/components/sub-modules/typography/typography';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from 'k-polygon-assets';
import { TickCircle } from 'iconsax-reactjs';
import { Badge } from '@/components/ui/badge.tsx';

const SettingsUpgradeAccount = () => {
  const merchantBenefits = [
    {
      id: 'accept-payments',
      title: 'Accept Payments Anywhere',
      description: 'Receive payments from customers via bank transfer, POS, and mobile money',
      icon: <TickCircle size={21} className="text-red-500" />,
      iconBg: 'bg-red-50'
    },
    {
      id: 'track-transactions',
      title: 'Track Transactions',
      description: 'Get detailed reports and insights on your sales.',
      icon: <TickCircle size={21} className="text-red-500" />,
      iconBg: 'bg-red-50'
    },
    {
      id: 'bulk-transfer',
      title: 'Bulk transfer',
      description:
        'Easily transfer funds to multiple beneficiaries at once. Upload a list or enter details manually and process all payments in one go.',
      icon: <TickCircle size={21} className="text-red-500" />,
      iconBg: 'bg-red-50'
    }
  ];

  return (
    <Card className="overflow-hidden border-0 shadow-sm">
      <Badge>Comming soon</Badge>
      <CardContent className="p-8">
        <div className="flex flex-col space-y-6 w-full lg:w-[80%]">
          <div>
            <Typography variant="h2" className="text-2xl font-bold mb-2">
              Upgrade your KPAY Account to Merchant
            </Typography>
            <Typography className="text-gray-600 text-sm">
              Become a KPAY Merchant and unlock powerful tools to grow your business. Accept payments, manage
              transactions, and access exclusive merchant benefits
            </Typography>
          </div>

          <div className="space-y-[2em] my-2">
            {merchantBenefits.map((benefit) => (
              <div key={benefit.id} className="flex items-start gap-4">
                <div className={` rounded-full flex-shrink-0 mt-1`}>{benefit.icon}</div>
                <div className="flex flex-col gap-2">
                  <Typography variant="small" className="font-semibold">
                    {benefit.title}
                  </Typography>
                  <Typography variant="small" className="text-gray-500 text-sm">
                    {benefit.description}
                  </Typography>
                </div>
              </div>
            ))}
          </div>

          <Button
            className="w-full bg-red-500 hover:bg-red-600 text-white mt-4"
            onClick={() => {
              console.log('Upgrading to merchant account');
            }}
            disabled={true}
          >
            Upgrade account
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SettingsUpgradeAccount;

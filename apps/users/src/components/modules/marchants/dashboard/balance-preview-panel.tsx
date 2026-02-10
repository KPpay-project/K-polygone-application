import { Button } from '@/components/ui/button';
import { ModularCard } from '@/components/sub-modules/card/card';
import { Link1, ReceiveSquare2 } from 'iconsax-reactjs';
import { Typography } from '@/components/sub-modules/typography/typography';
import React from 'react';
import { Link } from '@tanstack/react-router';
import { useGetMyWallets } from '@/hooks/api';
import ListAllPaymentLink from '../../payment-link/list-payment-link';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

interface IDashboardStat {
  title: string;
  amount: number;
  icon: React.ReactElement;
}

const DASHBOARD_MINI_STATS: IDashboardStat[] = [
  { title: 'Total Deposit', amount: 0, icon: <ReceiveSquare2 className="text-blue-600" /> },
  { title: 'Total Withdrawal', amount: 0, icon: <ReceiveSquare2 className="text-red-500" /> }
];

const BalancePreviewPannel: React.FC = () => {
  const { data: wallets } = useGetMyWallets();

  const wallet = wallets?.myWallet?.[0];
  //@ts-ignore
  const balance = Number(wallet?.balances?.[0]?.amount ?? 0);
  const currencyCode = wallet?.currency?.code ?? 'USD';

  return (
    <div className="flex gap-4">
      <ModularCard className="w-full" title="My Balances">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-4">
              <div className="text-4xl font-bold text-gray-900">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: currencyCode
                }).format(balance)}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="mt-6 flex items-center gap-3">
                <Link to="/merchant/create-payment-link">
                  <Button variant="destructive" className="rounded-full px-5 py-2">
                    <Link1 /> Create Payment Link
                  </Button>
                </Link>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="rounded-full px-5 py-2">
                      <Link1 /> View Links
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-full sm:max-w-xl md:max-w-2xl lg:max-w-4xl overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle className="hidden">Payment Links</SheetTitle>
                      <SheetDescription className="hidden">List of all your payment links</SheetDescription>
                    </SheetHeader>
                    <div className="mt-6">
                      <ListAllPaymentLink />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </ModularCard>

      {DASHBOARD_MINI_STATS.map((stat) => (
        <ModularCard key={stat.title} className="flex items-center gap-4 p-4 rounded-2xl w-[365px]">
          <div className="w-14 h-14 mb-2 rounded-lg bg-blue-50 flex items-center justify-center">{stat.icon}</div>
          <div>
            <div className="text-md text-gray-800">{stat.title}</div>
            <Typography variant="h1" className="mt-2 text-3xl font-bold">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: currencyCode
              }).format(stat.amount)}
            </Typography>
          </div>
        </ModularCard>
      ))}
    </div>
  );
};

export default BalancePreviewPannel;

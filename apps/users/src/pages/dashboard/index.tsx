import DashboardLayout from '@/components/layouts/dashboard-layout';
import { BalancePanel } from '@/components/modules/dashboard/balance-panel';
import QuickAccessPanel from '@/components/modules/dashboard/quick-access-panel';
import TransactionTable from '@/components/common/transaction-table/transaction-table';
import { ModularCard } from '@/components/sub-modules/card/card';
import DefaultModal from '@/components/sub-modules/popups/modal';
import { Button } from '@/components/ui/button';
import { Add, Box2 } from 'iconsax-reactjs';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';
import { ME } from '@/lib/graphql/operations';
import { HAS_PAYMENT_PIN, HasPaymentPinResponse } from '@/lib/graphql/queries/misc';
import { useProfileStore } from '@/store/profile-store';
import { useEffect, useState } from 'react';
import { EmptyState } from '@/components/common/fallbacks';
import { KycStatusBanner } from '@/components/kyc';
import { useKycRequired } from '@/hooks/api/use-kyc-status';
import { Link } from '@tanstack/react-router';
import { useTour } from '@reactour/tour';
import { SetupPinAction } from '@/components/actions/pin/create-pin';
import Cookies from 'js-cookie';

function DashboardHome() {
  const { t } = useTranslation();
  const { data, refetch } = useQuery(ME, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    pollInterval: 10000
  });

  const { data: pinData, refetch: refetchPinData } = useQuery<{ hasPaymentPin: HasPaymentPinResponse }>(
    HAS_PAYMENT_PIN,
    {
      fetchPolicy: 'network-only'
    }
  );

  const [showPinModal, setShowPinModal] = useState(false);

  const setProfile = useProfileStore((state) => state.setProfile);
  const kycRequired = useKycRequired();

  useEffect(() => {
    if (data?.me) {
      setProfile(data.me);
    }
    const handleFocus = () => {
      refetch();
    };
    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [data, setProfile, refetch]);

  useEffect(() => {
    if (pinData?.hasPaymentPin && !pinData.hasPaymentPin.hasPin) {
      setShowPinModal(true);
    }
  }, [pinData]);

  const handlePinSetupSuccess = () => {
    refetchPinData();
  };

  const { setIsOpen } = useTour();

  useEffect(() => {
    const hasToured = Cookies.get('hasToured');
    if (!hasToured) {
      setIsOpen(true);
      Cookies.set('hasToured', 'true', { expires: 365 });
    }
  }, [setIsOpen]);

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 max-w-full overflow-hidden">
        <div className="flex flex-col 2xl:flex-row gap-4 2xl:gap-6 max-w-full">
          <div className="flex-1 2xl:w-[720px] min-w-0">
            {kycRequired && (
              <div data-tour="account-verification">
                <KycStatusBanner className="mb-4 md:mb-6 py-[1rem]" />
              </div>
            )}

            <div>
              <BalancePanel />
            </div>
          </div>

          <div className="w-full 2xl:w-[352px] min-w-0 flex flex-col gap-4">
            <div data-tour="quick-access">
              <QuickAccessPanel />
            </div>

            {/* <div data-tour="virtual-card">
              <ModularCard title={"Cross payment"}>
                <Link to={'/cross-payment'}>
                  <Button
                    className="mt-6 py-6 rounded-2xl bg-brand-muted border-0 shadow-none text-black flex items-center gap-2
                  hover:text-white"
                  >
                    <Add />
                    Make Payment
                  </Button>
                </Link>
              </ModularCard>
            </div> */}

            <div data-tour="Cross Payment">
              <ModularCard title={'Cross Payment'}>
                <EmptyState
                  title={'Interoperable payments'}
                  icon={<Box2 variant="Bulk" color="blue" size={80} />}
                  description={'Send money to any provider'}
                />
                <div className="flex justify-center" data-tour="create-card-btn">
                  <Link to={'/cross-payment'}>
                    <Button
                      className="mt-6 py-6 rounded-2xl bg-blue-700 border-0 shadow-none text-white flex items-center gap-2
                  hover:text-white"
                    >
                      <Add />
                      Send Now
                    </Button>
                  </Link>
                </div>
              </ModularCard>
            </div>

            {/* <div data-tour="virtual-card">
              <ModularCard title={t('dashboard.card.title')}>
                <EmptyState
                  title={'Sorry!  No credit cards found.'}
                  description={"You haven't added any credit cards yet.\n"}
                />
                <div className="flex justify-center" data-tour="create-card-btn">
                  <Link to={'/credit-card'}>
                    <Button
                      className="mt-6 py-6 rounded-2xl bg-brand-muted border-0 shadow-none text-black flex items-center gap-2
                  hover:text-white"
                    >
                      <Add />
                      {t('dashboard.card.createCard')}
                    </Button>
                  </Link>
                </div>
              </ModularCard>
            </div> */}
          </div>
        </div>

        <div className="mt-4 2xl:mt-6" data-tour="transactions-table">
          <ModularCard title="" className="p-0 overflow-hidden">
            <TransactionTable
              showTitle={true}
              title={t('dashboard.transactions.title')}
              itemsPerPage={5}
              showFilters={true}
              showSearch={true}
              showPagination={true}
              showCheckbox={false}
            />
          </ModularCard>
        </div>
      </div>

      <DefaultModal open={showPinModal} onClose={() => setShowPinModal(false)} trigger={<></>}>
        <SetupPinAction onClose={() => setShowPinModal(false)} onSuccess={handlePinSetupSuccess} />
      </DefaultModal>
    </DashboardLayout>
  );
}

export default DashboardHome;

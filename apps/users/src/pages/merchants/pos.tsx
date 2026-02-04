import MerchantDashboardLayout from '@/components/layouts/dashboard/merchant-dashboard-layout.tsx';
import { EmptyState } from '@/components/common/fallbacks';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { LOTTIE_CONFIGS } from '@/constant/lotti-files';

const PosPage = () => {
  return (
    <>
      <MerchantDashboardLayout>
        <div className="flex mt-[10em] items-center justify-center h-full">
          <EmptyState
            icon={<DotLottieReact src={LOTTIE_CONFIGS.POS} autoplay loop />}
            title="Point of Sale  "
            description="We’re working on the KPpay POS terminal. Stay tuned."
          />
        </div>
      </MerchantDashboardLayout>
    </>
  );
};

export default PosPage;

// import CreatePaymentLink from '@/components/actions/merchants/create-payment-link';
import { EmptyState } from '@/components/common/fallbacks';
import MerchantDashboardLayout from '@/components/layouts/dashboard/merchant-dashboard-layout.tsx';
import { Bag } from 'iconsax-reactjs';

const ProductAndServicePage = () => {
  return (
    <>
      <MerchantDashboardLayout>
        <div className="mt-8">
          <EmptyState
            icon={<Bag variant="Bulk" size={80} />}
            title="KPay product services"
            description="Product and services is coming soon."
          />
        </div>
      </MerchantDashboardLayout>
    </>
  );
};

export default ProductAndServicePage;

import ProductAndServicePage from '@/pages/merchants/product-services';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/merchant/product-services/')({
  component: RouteComponent
});

function RouteComponent() {
  return <ProductAndServicePage />;
}

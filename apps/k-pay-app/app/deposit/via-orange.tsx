import DepositViaBankScreen from '@/screens/pay-via-mno';
import { SupportedProviders } from '@/types/graphql';

function AddMoney() {
  return (
    <DepositViaBankScreen
      title={'Add Money via Airtel'}
      provider={SupportedProviders.AIRTEL}
    />
  );
}

export default AddMoney;

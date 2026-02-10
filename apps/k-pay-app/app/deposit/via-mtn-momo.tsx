import { SupportedProviders } from '@/types/graphql';
import DepositViaBankScreen from '@/screens/pay-via-mno';

function AddMoney() {
  return (
    <>
      <DepositViaBankScreen
        title={'Add Money via Airtel'}
        provider={SupportedProviders.AIRTEL}
      />
    </>
  );
}

export default AddMoney;

import { SupportedProviders } from '@/types/graphql';
import DepositViaBankScreen from '@/screens/pay-via-mno';

function AddMoney() {
  return (
    <DepositViaBankScreen
      title={'Add Money via M-Pesa'}
      provider={SupportedProviders.M_PESA}
    />
  );
}

export default AddMoney;

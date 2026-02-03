import { ScreenContainer } from '@/layout/safe-area-layout';
import { TransactionsList } from '@/components/tables/transactions-list-table';
import { HeaderWithTitle } from '@/components';

export default function TransactionsScreen() {
  return (
    <ScreenContainer useSafeArea className="bg-white">
      <HeaderWithTitle title="Transactions" px={8} />
      <TransactionsList length={10} showFilters withPagination />
    </ScreenContainer>
  );
}

import TransactionTable from '@/components/common/transaction-table/transaction-table';

const WithdrawalList = () => {
  return (
    <div className="h-full p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-[16px] overflow-clip shadow-lg pt-[32px]">
          <h1 className="text-2xl font-semibold text-gray-900 mb-8 px-[28px] text-[18px]">Withdrawal List</h1>
          <TransactionTable
            showTitle={false}
            itemsPerPage={10}
            showFilters={true}
            showSearch={true}
            showPagination={true}
            showCheckbox={true}
            searchPlaceholder="Search withdrawal transactions..."
            transactionType="withdrawal"
          />
        </div>
      </div>
    </div>
  );
};

export default WithdrawalList;

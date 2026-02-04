interface BalanceDisplayProps {
  currency: string;
  amount: string;
  currencySymbol?: string;
}

export const BalanceDisplay = ({ currency, amount, currencySymbol = '$' }: BalanceDisplayProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-medium">{currencySymbol}</span>
        </div>
        <span className="text-gray-600">{currency}</span>
      </div>
      <div className="text-right">
        <span className="text-2xl font-semibold text-gray-900">{amount}</span>
      </div>
    </div>
  );
};

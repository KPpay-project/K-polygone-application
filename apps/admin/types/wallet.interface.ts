interface WalletInterfaceProps {
  totalWallets?: number;
  walletId?: string;
  onWithdraw?: () => void;
  onDeposit?: () => void;
  onCreateWallet?: () => void;
  onCopyId?: () => void;
}

interface WalletData {
  id: string;
  label: string;
  symbol: string;
  amount: string;
  color: string;
}

export type { WalletInterfaceProps, WalletData };

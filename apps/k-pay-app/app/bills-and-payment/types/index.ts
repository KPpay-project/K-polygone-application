export interface BillOption {
  id: string;
  title: string;
  subtitle: string;
  iconColor: string;
  onPress: () => void;
}

export interface BillItemProps {
  option: BillOption;
  isLast?: boolean;
}

// Default export required by Expo Router
export default function BillsAndPaymentTypes() {
  return null;
}

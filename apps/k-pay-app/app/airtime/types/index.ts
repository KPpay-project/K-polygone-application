export interface NetworkOption {
  id: string;
  name: string;
  logo: any;
  color: string;
}

export interface NetworkSelectorProps {
  selectedNetwork: NetworkOption | null;
  onNetworkSelect: (network: NetworkOption) => void;
  showModal: boolean;
  onCloseModal: () => void;
}

export interface AirtimeFormData {
  selectedCountry: string;
  selectedNetwork: NetworkOption | null;
  phoneNumber: string;
  amount: string;
}

// Default export required by Expo Router
export default function AirtimeTypes() {
  return null;
}

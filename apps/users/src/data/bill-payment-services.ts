import { Electricity, Gift, Mobile, Screenmirroring, ToggleOn, Wifi } from 'iconsax-reactjs';
import { ComponentType } from 'react';

export interface BillPaymentService {
  id: string;
  labelKey: string;
  icon: ComponentType<any>;
  color: string;
  bgColor: string;
  active: boolean;
}

export const billPaymentServices: BillPaymentService[] = [
  {
    id: 'airtime',
    labelKey: 'billPayment.services.airtime',
    icon: Mobile,
    color: '#008CFF',
    bgColor: '#F2FAFF',
    active: true
  },
  {
    id: 'electricity',
    labelKey: 'billPayment.services.electricity',
    icon: Electricity,
    color: '#EF4444',
    bgColor: '#FFF5F4',
    active: false
  },
  {
    id: 'data',
    labelKey: 'billPayment.services.data',
    icon: Wifi,
    color: '#F59E0B',
    bgColor: '#FFF9F4',
    active: false
  },
  {
    id: 'betting',
    labelKey: 'billPayment.services.betting',
    icon: ToggleOn,
    color: '#8B5CF6',
    bgColor: '#FBF7FF',
    active: false
  },
  {
    id: 'giftcard',
    labelKey: 'billPayment.services.giftCard',
    icon: Gift,
    color: '#6366F1',
    bgColor: '#F5F6FF',
    active: false
  },
  {
    id: 'cabletv',
    labelKey: 'billPayment.services.cableTv',
    icon: Screenmirroring,
    color: '#22C55E',
    bgColor: 'rgba(187, 247, 208, 0.2)',
    active: false
  }
];

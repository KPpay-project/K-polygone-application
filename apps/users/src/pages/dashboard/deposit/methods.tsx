import { UseFormReturn } from 'react-hook-form';
import React from 'react';

export type DepositMethodKey = 'mobile' | 'card' | 'bankTransfer' | 'conversion' | 'mtn' | 'airtel' | 'orange';

export interface DepositFormValues {
  currency: string;
  amount: string;
  phoneNumber?: string;
  method: DepositMethodKey;
}

export interface DepositMethodConfig {
  key: DepositMethodKey;
  title: string;
  description?: string;
  requiresPhone?: boolean;

  renderExtraFields?: (form: UseFormReturn<DepositFormValues>) => React.ReactNode;

  submit: (values: DepositFormValues) => Promise<void>;
}

export const depositMethodsRegistry: Record<DepositMethodKey, DepositMethodConfig> = {
  bankTransfer: {
    key: 'bankTransfer',
    title: 'Add via Bank transfer',
    description: 'Fund your account by sending money to your unique bank account',
    requiresPhone: false,
    submit: async (values) => {
      console.info('[Deposit][bankTransfer] submitting', values);
    }
  },
  conversion: {
    key: 'conversion',
    title: 'Add via conversion',
    description: 'Send to a mobile money wallet instantly',
    requiresPhone: true,
    submit: async (values) => {
      console.info('[Deposit][conversion] submitting', values);
    }
  },
  mtn: {
    key: 'mtn',
    title: 'Add via Mobile Money ',
    description: 'Deposit to our partner merchant',
    requiresPhone: true,
    submit: async (values) => {
      console.info('[Deposit][mtn] submitting', values);
    }
  },
  airtel: {
    key: 'airtel',
    title: 'Add via Airtel',
    description: 'Deposit to our partner merchant',
    requiresPhone: true,
    submit: async (values) => {
      console.info('[Deposit][airtel] submitting', values);
    }
  },
  orange: {
    key: 'orange',
    title: 'Add via Orange',
    description: 'Deposit to our partner merchant',
    requiresPhone: true,
    submit: async (values) => {
      console.info('[Deposit][orange] submitting', values);
    }
  },
  card: {
    key: 'card',
    title: 'Add via Card',
    description: 'Top up using your debit or credit card',
    requiresPhone: false,
    submit: async (values) => {
      console.info('[Deposit][card] submitting', values);
    }
  },
  mobile: {
    key: 'mobile',
    title: 'Add via Mobile Money',
    description: 'General mobile money funding',
    requiresPhone: true,
    submit: async (values) => {
      console.info('[Deposit][mobile] submitting', values);
    }
  }
};

export const methodRequiresPhone = (method: DepositMethodKey): boolean => {
  return Boolean(depositMethodsRegistry[method]?.requiresPhone);
};

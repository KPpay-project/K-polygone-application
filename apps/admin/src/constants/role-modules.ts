import { Permission } from './permissions';

export interface RoleModule {
  name: string;
  matcher: (p: Permission) => boolean;
}

export const ROLE_MODULES: RoleModule[] = [
  {
    name: 'Dashboard',
    matcher: (p: Permission) =>
      p.id === 'dashboard' ||
      p.id === 'analytics' ||
      p.name.toLowerCase().includes('dashboard') ||
      p.name.toLowerCase().includes('analytics')
  },
  {
    name: 'User Management',
    matcher: (p: Permission) =>
      p.id === 'users' ||
      p.id === 'user-management' ||
      p.id === 'onboarding' ||
      p.id === 'offboarding' ||
      p.name.toLowerCase().includes('user') ||
      p.name.toLowerCase().includes('onboarding') ||
      p.name.toLowerCase().includes('offboarding')
  },
  {
    name: 'Transaction',
    matcher: (p: Permission) =>
      p.id === 'transactions' ||
      p.id === 'payment-processing' ||
      p.name.toLowerCase().includes('transaction') ||
      p.name.toLowerCase().includes('payment')
  },
  {
    name: 'Wallet Management',
    matcher: (p: Permission) => p.id === 'wallets' || p.name.toLowerCase().includes('wallet')
  },
  {
    name: 'Exchange & Currency',
    matcher: (p: Permission) =>
      p.id === 'currency' ||
      p.id === 'multi-currency' ||
      p.id === 'cryptocurrency' ||
      p.name.toLowerCase().includes('exchange') ||
      p.name.toLowerCase().includes('currency')
  },
  {
    name: 'Bill Payments',
    matcher: (p: Permission) =>
      p.id === 'bill-payments' || p.name.toLowerCase().includes('bill') || p.name.toLowerCase().includes('payment')
  },
  {
    name: 'KYC & Verification',
    matcher: (p: Permission) =>
      p.id === 'kyc-verification' ||
      p.name.toLowerCase().includes('kyc') ||
      p.name.toLowerCase().includes('verification')
  },
  {
    name: 'Support & Tickets',
    matcher: (p: Permission) =>
      p.id === 'support-tickets' ||
      p.id === 'customer-support' ||
      p.name.toLowerCase().includes('support') ||
      p.name.toLowerCase().includes('ticket')
  },
  {
    name: 'Credit Cards',
    matcher: (p: Permission) =>
      p.id === 'credit-cards' || p.name.toLowerCase().includes('credit') || p.name.toLowerCase().includes('card')
  },
  {
    name: 'Disputes',
    matcher: (p: Permission) => p.id === 'disputes' || p.name.toLowerCase().includes('dispute')
  },
  {
    name: 'MNOs',
    matcher: (p: Permission) => p.id === 'mnos' || p.name.toLowerCase().includes('mno')
  },
  {
    name: 'Activity Log',
    matcher: (p: Permission) =>
      p.id === 'activity-logs' ||
      p.id === 'audit-trails' ||
      p.id === 'log-management' ||
      p.name.toLowerCase().includes('activity') ||
      p.name.toLowerCase().includes('audit') ||
      p.name.toLowerCase().includes('log')
  },
  {
    name: 'Role Management',
    matcher: (p: Permission) => p.id === 'role-management' || p.name.toLowerCase().includes('role')
  },
  {
    name: 'System Configuration',
    matcher: (p: Permission) =>
      p.id === 'system-config' ||
      p.id === 'settings' ||
      p.name.toLowerCase().includes('system') ||
      p.name.toLowerCase().includes('config') ||
      p.name.toLowerCase().includes('settings')
  },
  {
    name: 'Notifications',
    matcher: (p: Permission) => p.id === 'notifications' || p.name.toLowerCase().includes('notification')
  },
  {
    name: 'API Access',
    matcher: (p: Permission) =>
      p.id === 'api-access' || p.id === 'api-development' || p.name.toLowerCase().includes('api')
  },
  {
    name: 'Reports & Analytics',
    matcher: (p: Permission) =>
      p.id === 'reports' ||
      p.id === 'financial-reporting' ||
      p.id === 'data-export' ||
      p.name.toLowerCase().includes('report') ||
      p.name.toLowerCase().includes('export')
  },
  {
    name: 'Security',
    matcher: (p: Permission) =>
      p.id === 'security-settings' ||
      p.id === 'security-audits' ||
      p.id === 'fraud-detection' ||
      p.id === 'risk-management' ||
      p.name.toLowerCase().includes('security') ||
      p.name.toLowerCase().includes('fraud') ||
      p.name.toLowerCase().includes('risk')
  },
  {
    name: 'Compliance',
    matcher: (p: Permission) =>
      p.id === 'compliance' ||
      p.id === 'regulatory-compliance' ||
      p.id === 'gdpr-compliance' ||
      p.id === 'pci-compliance' ||
      p.name.toLowerCase().includes('compliance') ||
      p.name.toLowerCase().includes('regulatory')
  },
  {
    name: 'Merchant Management',
    matcher: (p: Permission) => p.id === 'merchant-management' || p.name.toLowerCase().includes('merchant')
  },
  {
    name: 'Marketing Tools',
    matcher: (p: Permission) =>
      p.id === 'marketing-tools' ||
      p.id === 'email-marketing' ||
      p.id === 'campaign-management' ||
      p.name.toLowerCase().includes('marketing') ||
      p.name.toLowerCase().includes('campaign')
  },
  {
    name: 'Integration Management',
    matcher: (p: Permission) =>
      p.id === 'integration-management' ||
      p.id === 'webhook-management' ||
      p.name.toLowerCase().includes('integration') ||
      p.name.toLowerCase().includes('webhook')
  },
  {
    name: 'Monitoring & Performance',
    matcher: (p: Permission) =>
      p.id === 'monitoring' ||
      p.id === 'performance-metrics' ||
      p.id === 'error-tracking' ||
      p.name.toLowerCase().includes('monitoring') ||
      p.name.toLowerCase().includes('performance') ||
      p.name.toLowerCase().includes('error')
  },
  {
    name: 'Backup & Recovery',
    matcher: (p: Permission) =>
      p.id === 'backup-restore' ||
      p.id === 'disaster-recovery' ||
      p.name.toLowerCase().includes('backup') ||
      p.name.toLowerCase().includes('recovery') ||
      p.name.toLowerCase().includes('restore')
  }
];

interface ITour {
  selector: string;
  content: string;
}

export const TOURSTEPS: ITour[] = [
  {
    selector: '[data-tour="language-selector"]',
    content: 'This is your dashboard header and language selector. '
  },
  {
    selector: '[data-tour="profile-menu"]',
    content: 'This is your profile menu. '
  },
  {
    selector: '[data-tour="account-verification"]',
    content: 'Complete your account verification to unlock all features.'
  },
  {
    selector: '[data-tour="start-verification-btn"]',
    content: 'Click here to start account verification.'
  },
  {
    selector: '[data-tour="total-balance"]',
    content: 'Your total balance across wallets is shown here.'
  },
  {
    selector: '[data-tour="balance-actions"]',
    content: 'Quick actions: Withdraw or Deposit funds.'
  },
  {
    selector: '[data-tour="wallets-header"]',
    content: 'Manage your wallets. You currently have 4 wallets.'
  },
  {
    selector: '[data-tour="create-wallet-btn"]',
    content: 'Create a new wallet in your preferred currency.'
  },

  {
    selector: '[data-tour="quick-access"]',
    content: 'Quick Access: Deposit, Withdraw, Exchange, Transfer, Beneficiary, and Card.'
  },
  {
    selector: '[data-tour="virtual-card"]',
    content: 'Manage your virtual cards.'
  },
  {
    selector: '[data-tour="create-card-btn"]',
    content: 'Create a new virtual/linked credit card.'
  },
  {
    selector: '[data-tour="transactions-table"]',
    content: 'Review recent transactions with IDs, amounts, and statuses.'
  }
];

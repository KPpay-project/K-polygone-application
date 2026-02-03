#

## Official Project Handover Document

**Document Version:** 1.2

**Handover Date:** December 24, 207

25

**Prepared By:** Emmanuel Obiabo

**Prepared For:** Stakeholders, Project Owners, Project Managers, Development Teams, QA Teams, and Support Personnel

---

## Table of Contents

1. Executive Summary
2. Project Overview
   1. Purpose
   2. Key Features
   3. Technology Stack
   4. Current Status
3. Target Audience
4. End User Guide (For Support Teams)
   1. Access Points
   2. Main User Flows
   3. Support Guidelines
5. Developer Guide
   1. Prerequisites
   2. Local Setup Instructions
   3. Environment Variables
   4. Project Structure
6. Architecture Highlights
7. Deployment
   1. Environments
   2. CI/CD Pipeline
   3. Manual Deployment
   4. Infrastructure
8. Troubleshooting and Maintenance
   1. Common Fixes
   2. Best Practices
9. Risk Assessment and Recommendations
10. Tools and Resources
11. Additional Documentation
12. Contacts and Support

---

## 1. Executive Summary

This document serves as the official handover documentation for the KPay User Frontend application. It provides comprehensive technical specifications, architectural guidelines, deployment procedures, and maintenance protocols to ensure seamless operational continuity and knowledge transfer.

The KPay User Frontend is an enterprise-grade, security-hardened, multilingual web application that enables end users to manage digital wallets, execute payment transactions, and complete regulatory-compliant KYC verification processes. The application architecture prioritizes scalability, performance optimization, and long-term maintainability.

### Primary Handover Objectives

- Facilitate efficient onboarding for incoming development personnel and team members
- Provide stakeholders with a comprehensive understanding of system capabilities and operational status
- Establish clear protocols for maintenance procedures, system updates, and troubleshooting workflows
- Ensure operational continuity throughout team transitions and organizational changes

---

## 2. Project Overview

### 2.1 Purpose

KPay is an enterprise digital payment platform designed to facilitate secure financial transactions across multiple channels. The User Frontend application serves as the primary interface enabling end users to:

- Manage digital wallet operations (fund loading, balance inquiries, inter wallet transfers)
- Execute payment transactions to merchants, utility providers, and peer users
- Complete regulatory mandated KYC identity verification workflows for compliance adherence
- Utilize the platform across multiple languages for international accessibility

### 2.2 Key Features

- Secure user authentication and authorization utilizing JWT token based authentication protocols
- Comprehensive wallet management interface with transaction history and analytics
- Multi channel payment processing capabilities
- Step by step KYC workflow with document upload and verification status tracking
- Real time language switching supporting 5 languages: English, French, Spanish, Español, and Arabic
- Responsive user interface design optimized for desktop and mobile viewports

### 2.3 Technology Stack

| **Component**          | **Technology**             | **Version/Notes**                |
| ---------------------- | -------------------------- | -------------------------------- |
| Frontend Framework     | React with TypeScript      | Type safe component architecture |
| Build Tool             | Vite                       | High performance build system    |
| Package Manager        | pnpm                       | Efficient dependency management  |
| UI Components          | Custom Component Library   | Managed via Git submodule        |
| Internationalization   | Custom i18n Implementation | Multi language support           |
| Cloud Storage          | AWS S3                     | Static asset hosting             |
| Content Delivery       | AWS CloudFront             | Global CDN distribution          |
| Infrastructure as Code | AWS SAM                    | Serverless Application Model     |
| CI/CD Pipeline         | GitHub Actions             | Automated deployment workflows   |

### 2.4 Current Status

The application is fully operational across production and development environments. Automated deployment pipelines are active and functional. The system is currently under active maintenance with regular updates and monitoring.

---

## 3. Target Audience

| **Audience**                          | **Relevant Sections**      |
| ------------------------------------- | -------------------------- |
| Stakeholders and Executive Leadership | Sections 1, 2, and 9       |
| Project Managers and Coordinators     | Sections 1, 2, 3, and 9    |
| Software Developers and Engineers     | Sections 4, 5, 6, 7, and 8 |
| QA and Support Personnel              | Sections 3 and 8           |

---

## 4. End User Guide (For Support Teams)

### 4.1 Access Points

- **Staging Environment:** https://dev.d32yml5hzs7qtc.amplifyapp.com/
- **Development Environment:** Provided separately via secure channels
- **Production Environment:** Contact technical lead for access credentials

### 4.2 Main User Flows

1. User registration and secure authentication
2. Dashboard access displaying wallet balance and recent transaction history
3. Fund wallet operations and inter wallet money transfers
4. Payment execution to merchants, bills, or peer users
5. KYC verification workflow including document upload and verification status tracking
6. Language preference selection via header navigation or settings panel

### 4.3 Support Guidelines

Support personnel should prioritize utilization of in-application help resources before escalating issues. Common support scenarios include:

- Network connectivity errors and API timeout issues
- KYC document rejection and resubmission procedures
- Password recovery and account access restoration
- Transaction dispute resolution workflows

---

## 5. Developer Guide

### 5.1 Prerequisites

| **Requirement**   | **Minimum Version**                         |
| ----------------- | ------------------------------------------- |
| Node.js           | 18.x or higher                              |
| pnpm              | Latest stable version                       |
| Git               | 2.x or higher                               |
| Repository Access | GitHub account with appropriate permissions |
| Submodule Access  | Credentials for assets repository           |

### 5.2 Local Setup Instructions

**Step 1: Clone Repository**

```bash
git clone https://github.com/Kp-Pay/k-pay-user
cd k-pay-user
```

**Step 2: Install Dependencies**

```bash
pnpm install
```

This command automatically handles submodule initialization and asset building.

**Step 3: Run Development Server**

```bash
pnpm run dev
```

The application will be accessible at [http://localhost:5173](http://localhost:5173/)

**Manual Fallback Procedure (if automated setup fails):**

```bash
git submodule update --init --recursive
cd assets && pnpm install && pnpm run build && cd ..
pnpm run dev
```

### 5.3 Environment Variables

Create a `.env` file in the project root directory with the following configuration variables:

```bash
VITE_API_URL=https://api.example.com
VITE_PUBLIC_APP_NAME=KPay
VITE_PUBLIC_API_URL=https://api.example.com
VITE_FLUTTERWAVE_TEST_KEY=your_flutterwave_test_key
```

**Note:** Obtain actual API keys and URLs from the technical lead or secure credential management system.

### 5.4 Project Structure

| **Directory**       | **Description**                                     |
| ------------------- | --------------------------------------------------- |
| src/components/     | Reusable UI component library                       |
| src/pages/          | Application route pages and screens                 |
| src/i18n/           | Internationalization translation files and logic    |
| src/lib/            | API client implementations and utility functions    |
| src/hooks/          | Custom React hooks for state and side effects       |
| src/config/         | Application configuration and constants             |
| assets/ (submodule) | Shared design system, icons, and brand assets       |
| public/             | Static assets including images and fonts            |
| infrastructure/     | AWS deployment scripts and CloudFormation templates |

---

## 6. Architecture Highlights

- **Modular Component Architecture:** Enables independent feature development and parallel team workflows
- **State Management:** Implemented using React Context API combined with custom hooks for predictable state updates
- **Authentication Security:** JWT token based authentication with secure token storage and refresh mechanisms
- **Internationalization:** All user facing text externalized to translation files for simplified localization
- **Error Handling:** Centralized error boundary implementation with comprehensive logging and user feedback
- **Performance Optimization:** Code splitting, lazy loading, and bundle size optimization for fast page loads

---

## 7. Deployment

### 7.1 Environments

| **Environment** | **Trigger**          | **Purpose**                  |
| --------------- | -------------------- | ---------------------------- |
| Production      | Merge to main branch | Live user facing application |
| Development     | Push to dev branch   | Testing and QA environment   |

### 7.2 CI/CD Pipeline

GitHub Actions workflows automatically execute the following deployment sequence:

1. Build application artifacts using Vite
2. Deploy infrastructure using AWS SAM templates
3. Upload build artifacts to S3 bucket
4. Invalidate CloudFront cache for immediate content updates

Pipeline configuration files are located in `.github/workflows/` directory.

### 7.3 Manual Deployment

For manual deployment execution, utilize the provided deployment scripts:

**Production Deployment:**

```bash
./infrastructure/deploy.sh prod
```

**Development Deployment:**

```bash
./infrastructure/deploy.sh dev
```

### 7.4 Infrastructure

The application utilizes the following AWS infrastructure components:

- Private S3 bucket for static asset storage with encryption enabled
- CloudFront CDN distribution with Origin Access Control for global content delivery
- AWS Certificate Manager for SSL/TLS certificate management

Comprehensive infrastructure documentation is available in `infrastructure/README.md`, including required GitHub Secrets configuration for automated deployments.

---

## 8. Troubleshooting and Maintenance

### 8.1 Common Fixes

| **Issue**                         | **Resolution**                                                 |
| --------------------------------- | -------------------------------------------------------------- |
| Submodule synchronization errors  | `git submodule update --init --recursive`                      |
| Asset build failures              | `cd assets && pnpm install --force && pnpm run build`          |
| Dependency conflicts              | Delete`node_modules`directory and execute`pnpm install`        |
| Development server port conflicts | Modify port in`vite.config.ts`or terminate conflicting process |

### 8.2 Best Practices

- Synchronize Git submodules regularly to maintain asset consistency
- Utilize feature branches for all development work and submit pull requests for code review
- Test application functionality across all supported languages before deployment
- Execute comprehensive testing in development environment before promoting to production
- Monitor application logs and error reporting systems for proactive issue detection
- Maintain up to date documentation for all code changes and architectural decisions

---

## 9. Risk Assessment and Recommendations

### Risk Matrix

| **Risk**                               | **Impact** | **Mitigation Strategy**                                                                   |
| -------------------------------------- | ---------- | ----------------------------------------------------------------------------------------- |
| Submodule repository access loss       | High       | Ensure team members have appropriate repository permissions and backup access credentials |
| Third party API changes or deprecation | Medium     | Monitor integration partner communications and maintain versioned API contracts           |
| KYC regulatory requirement updates     | Medium     | Modular architecture enables rapid compliance updates and feature iteration               |
| Infrastructure cost escalation         | Low        | Implement CloudWatch monitoring and establish cost alerts for AWS resources               |

### Strategic Recommendations

- Implement end to end testing framework (recommended: Cypress or Playwright) for automated regression testing
- Evaluate monorepo architecture if submodule complexity increases significantly
- Integrate error monitoring and application performance management solution (recommended: Sentry, DataDog, or New Relic)
- Establish comprehensive logging strategy with structured logging format for improved observability
- Implement feature flagging system for controlled rollout of new functionality
- Conduct regular security audits and dependency vulnerability scanning

---

## 10. Tools and Resources

### Development Tools

| **Tool**   | **Purpose**          | **Link**                        |
| ---------- | -------------------- | ------------------------------- |
| React      | Frontend Framework   | https://react.dev/              |
| TypeScript | Type Safe JavaScript | https://www.typescriptlang.org/ |
| Vite       | Build Tool           | https://vitejs.dev/             |
| pnpm       | Package Manager      | https://pnpm.io/                |
| Git        | Version Control      | https://git-scm.com/            |

### Cloud Infrastructure

| **Service**    | **Purpose**                  | **Link**                               |
| -------------- | ---------------------------- | -------------------------------------- |
| AWS S3         | Object Storage               | https://aws.amazon.com/s3/             |
| AWS CloudFront | Content Delivery Network     | https://aws.amazon.com/cloudfront/     |
| AWS SAM        | Serverless Application Model | https://aws.amazon.com/serverless/sam/ |
| GitHub Actions | CI/CD Automation             | https://github.com/features/actions    |

### Repository

- **Primary Repository:** https://github.com/Kp-Pay/k-pay-user
- **Assets Submodule:** Contact technical lead for access credentials

---

## 11. Additional Documentation

- `README.md` - Project overview and quick start guide
- `infrastructure/README.md` - Detailed infrastructure setup and deployment procedures
- `CONTRIBUTING.md` - Development guidelines and contribution standards
- `CHANGELOG.md` - Version history and release notes
- API documentation - Contact technical lead for access to API specification

---

## 12. Contacts and Support

---

## Acknowledgments

This handover documentation represents the culmination of collaborative effort across development, quality assurance, and operations teams. We appreciate your commitment to maintaining and advancing the KPay User Frontend platform.

**Document Revision History:**

- Version 1.2 - December 24, 2025 - Comprehensive technical handover documentation

_Thank you for assuming responsibility for the KPay User Frontend application. For any clarifications or transition support, please contact the technical lead._

---

## 13. Technical Deep Dive: Key Feature Implementation

### 13.1 PIN Creation & Verification

PINs are used to secure sensitive actions such as transfers, withdrawals, and other critical operations. PIN creation and verification are handled via Zod schemas and validated in forms throughout the application.

**How it works:**

- PINs must be exactly 4 digits
- Validation is enforced using Zod schemas (see `transactionPinSchema` in `src/schema/dashboard.ts`)
- PINs are typically entered in modal forms before confirming a transaction

**Code snippet:**

```tsx
// src/schema/dashboard.ts
export const transactionPinSchema = () =>
  z.object({
    pin: z
      .string()
      .min(1, { message: 'PIN required' })
      .refine((value) => /^\d{4}$/.test(value), { message: 'PIN must be 4 digits' })
  });
```

### 13.2 Transfers & Debit Actions

Transfers (including debit actions) are handled by the `TransferMoney` component, which supports single, multiple, and bulk transfers. The process is step-based and form-driven.

**How it works:**

- User selects transfer method (wallet, bank, etc.)
- Fills out the transfer form (amount, destination, currency)
- Proceeds through steps; on submit, the transfer is processed via API call

**Code snippet:**

```tsx
// src/components/modules/transfer/transfer-money.tsx
const [formData, setFormData] = useState({
  amount: '',
  destination: '',
  currency: t('currencies.UGX')
});

const handleFormSubmit = () => {
  setCurrentStep(2); // Proceed to confirmation step
  // Actual transfer logic would call an API here
};
```

### 13.3 Currency Conversion (Exchange)

Currency exchange is handled in the exchange dashboard page. Users select currencies and amounts, and the app calculates rates and conversions.

**How it works:**

- User selects source and target currencies
- Enters amount to convert
- The app fetches or calculates the exchange rate and shows the converted amount
- On submit, the exchange is processed via API call

**Code snippet:**

```tsx
// src/pages/dashboard/cross-payment/index.tsx
const exchangeRate = 1.175;
const recipientAmount = ((parseFloat(amount || '0') - fees) * exchangeRate).toFixed(2);
```

### 13.4 Withdrawals

Withdrawals are handled via dedicated forms and require PIN verification. The process is similar to transfers, with additional beneficiary selection.

**How it works:**

- User selects withdrawal method and beneficiary
- Enters amount and PIN (validated by `withdrawalRequestPinSchema`)
- On submit, withdrawal is processed via API call

**Code snippet:**

```tsx
// src/pages/dashboard/withdrawals/beneficiaries.tsx
import { withdrawalRequestPinSchema } from '@/schema/dashboard';

// ...
<EasyForm schema={withdrawalRequestPinSchema} onSubmit={handleWithdraw} />;
```

### 13.5 Image Upload (Absinthe/Apollo)

Image and document uploads (e.g., for KYC) use a custom React hook, `useFileUploadEnhanced`, which integrates with Apollo and Absinthe for GraphQL uploads.

**How it works:**

- User selects a file (image, PDF, etc.)
- The hook validates file type/size, shows upload progress, and returns a URL on success
- The file is uploaded via a GraphQL mutation (Absinthe/Apollo handles the `Upload` type)

**Code snippet:**

```tsx
// src/hooks/use-file-upload-enhanced.ts
const { uploadFile, isUploading, progress, error } = useFileUploadEnhanced({
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'application/pdf']
});

// Usage in a component:
const handleUpload = async (file: File) => {
  const result = await uploadFile(file);
  if (result.success) {
    // Use result.url for preview or send to backend
  }
};
```

### 13.6 Authentication & Authorization

Authentication is managed via the `useAuth` hook (`src/hooks/use-auth.ts`). It handles login, token storage, user state, and logout. Tokens are stored in cookies, and user info is kept in a global store.

**How it works:**

- On login, access and refresh tokens are saved as cookies
- User roles are also stored in cookies
- The user account is set in a global store (`useUserStore`)
- Token refresh is scheduled automatically
- Logout clears all cookies and user state, then redirects to login

**Code snippet:**

```tsx
// src/hooks/use-auth.ts
const setAuthTokens = (accessToken: string, refreshToken: string) => {
  Cookies.set(JWT_TOKEN_NAME, accessToken, {
    secure: true,
    sameSite: 'strict',
    expires: ACCESS_TOKEN_EXP_MINUTES / (60 * 24),
    path: '/'
  });
  Cookies.set(JWT_REFRESH_TOKEN_NAME, refreshToken, {
    secure: true,
    sameSite: 'strict',
    expires: REFRESH_TOKEN_EXP_DAYS,
    path: '/'
  });
};

const logUser = (userAccount: UserAccount) => {
  Cookies.set(USER_ROLE, userAccount.role, {
    secure: true,
    sameSite: 'strict',
    expires: REFRESH_TOKEN_EXP_DAYS,
    path: '/'
  });
  scheduleTokenRefresh(ACCESS_TOKEN_EXP_MINUTES);
  setUserAccount(transformedUserAccount);
};

const invalidate = () => {
  Object.keys(Cookies.get()).forEach((cookieName) => {
    Cookies.remove(cookieName, { path: '/' });
  });
  clearUserAccount();
  navigate({ to: '/onboarding/login', replace: true });
};
```

Authorization is enforced by checking user roles and authentication state from the store and cookies. Errors like `UNAUTHENTICATED` and `UNAUTHORIZED` are handled in helpers and error boundaries.

### 13.7 Wallet Creation & Management

Wallet state is managed globally using Zustand (`src/store/wallet-store.ts`). The wallet is persisted in local storage and can be set, updated, or cleared.

**How it works:**

- The `Wallet` interface defines wallet properties (id, owner, status, limits, balances, etc.)
- The store provides `setWallet`, `clearWallet`, and `updateWallet` methods
- The wallet state is persisted using Zustand's `persist` middleware

**Code snippet:**

```tsx
// src/store/wallet-store.ts
export const useWalletStore = create<WalletStore>()(
  persist(
    (set, get) => ({
      wallet: null,
      setWallet: (wallet: Wallet) => {
        set({ wallet });
      },
      clearWallet: () => {
        set({ wallet: null });
      },
      updateWallet: (updates: Partial<Wallet>) => {
        const current = get().wallet;
        if (current) set({ wallet: { ...current, ...updates } });
      }
    }),
    {
      name: 'wallet-store',
      partialize: (state) => ({ wallet: state.wallet })
    }
  )
);

export const useWallet = () => useWalletStore((state) => state.wallet);
```

Wallet creation typically happens after user onboarding or KYC, with the backend returning wallet data, which is then set in the store. The wallet can be accessed anywhere in the app using the `useWallet` hook.

---

## 14. Complete Package Reference

### 14.1 Production Dependencies

The following packages are used in the production build of the application:

| **Package**                  | **Purpose**                        |
| ---------------------------- | ---------------------------------- |
| @apollo/client               | GraphQL client for data fetching   |
| @hookform/resolvers          | Form validation resolvers          |
| @lottiefiles/dotlottie-react | Lottie animation support           |
| @material-tailwind/react     | Material Design components         |
| @radix-ui/\*                 | Unstyled, accessible UI primitives |
| @reactour/tour               | Product tours and onboarding       |
| @tanstack/react-query        | Data fetching and caching          |
| @tanstack/react-router       | Type-safe routing                  |
| @tanstack/react-table        | Headless table building            |
| apollo-absinthe-upload-link  | GraphQL file upload support        |
| apollo-upload-client         | Apollo file upload handling        |
| axios                        | HTTP client                        |
| framer-motion                | Animation library                  |
| i18next                      | Internationalization framework     |
| react-hook-form              | Form management                    |
| recharts                     | Chart visualization                |
| zustand                      | State management                   |
| zod                          | Schema validation                  |
| tailwindcss                  | Utility-first CSS framework        |

### 14.2 Development Dependencies

The following packages are used during development and testing:

| **Package**          | **Purpose**                   |
| -------------------- | ----------------------------- |
| @vitejs/plugin-react | Vite React plugin             |
| typescript           | Type checking and compilation |
| eslint               | Code linting                  |
| prettier             | Code formatting               |
| cypress              | End-to-end testing            |
| husky                | Git hooks                     |
| autoprefixer         | CSS vendor prefixing          |
| @faker-js/faker      | Mock data generation          |

## 15. Source Directory Structure

This section provides a detailed, professional overview of every folder and major file in the `src/` directory, including subfolders and their responsibilities.

### 15.1 Top-Level Files

- **app.tsx** — Main React app composition, providers, and layout
- **main.tsx** — Vite/React entry point, mounts the app
- **routeTree.gen.ts** — Auto-generated route tree for navigation
- **vite-env.d.ts** — Vite/TypeScript environment types

### 15.2 Directory Breakdown

### assets/

App-specific static assets (SVGs, images, etc). Includes:

- `svgs/`: SVG React components for UI icons and fallbacks

### components/

All reusable React components, organized by feature and type:

- `actions/`: Action handlers and UI for creating, updating, or deleting entities (wallet, ticket, transfer, etc)
- `common/`: Shared UI elements (buttons, loaders, fallbacks)
- `currency-dropdown/`: Currency selection dropdowns
- `kyc/`: KYC status banners and related UI
- `layouts/`: Layout wrappers for dashboard, onboarding, etc
  - `dashboard/`: Merchant and settings layouts
- `listeners/`: React listeners for real-time updates (e.g., wallet updates)
- `loaders/`: Page loader components
- `misc/`: Miscellaneous UI (e.g., logo)
- `modules/`: Feature modules (beneficiaries, bill-payment, dashboard, exchange, merchants, payment-link, profile, search-bar, settings, sidebar, ticket, transactions, transfer, wallet)
- `shared/`: Cross-feature shared components (currency, step indicators, etc)
- `sub-modules/`: Building blocks for larger modules (card, modal-contents, popups, tabs, typography)
- `ui/`: UI primitives (inputs, selects, tooltips, table, badge, etc)
- `back-button.tsx`, `language-switcher.tsx`, `UserList.tsx`: Standalone components

### config/

API client and environment configuration (e.g., `api-client.ts`)

### constant/

Centralized static constants (country lists, bank providers, lottie files, etc)

### data/

Static/mock data for development and demos (beneficiaries, bill-payment brands/services, tour data, transactions)

### enums/

TypeScript enums for app-wide constants (e.g., status codes)

### error/

Custom error classes, error codes, error handlers, and error messages

### helpers/

Utility/helper functions (e.g., error helpers)

### hooks/

Custom React hooks for business logic:

- `api/`, `bank/`, `external/`: API/bank/external service hooks
- `use-auth.ts`: Authentication logic
- `use-currencies.tsx`, `use-fetch-currencies.ts`: Currency fetching and management
- `use-dialog.tsx`: Dialog/modal state management
- `use-file-upload-enhanced.ts`: Enhanced file upload logic
- `use-initialize-user.ts`: User initialization logic
- `use-mobile.tsx`: Mobile detection
- `use-phoenix-socket.ts`: Real-time socket integration
- `useGraphQL.ts`: GraphQL helpers

### i18n/

Internationalization setup and translation files:

- `index.ts`: i18n configuration
- `locales/`: Language files (ar, de, en, es, fr, validation messages)

### lib/

Core libraries and integrations:

- `apollo-client.ts`: Apollo GraphQL client setup
- `graphql/`: Queries, mutations, fragments, and wrappers
  - `mutations/`, `queries/`: Organized GraphQL operations
- `socket/`: Phoenix socket setup for real-time events
- `utils.ts`: General utilities

### pages/

Top-level route pages, grouped by feature:

- `dashboard/`: Main user dashboard and subfeatures (bill-payment, card, cross-payment, deposit, exchange, settings, ticket, transfer, wallet, withdrawals)
- `merchants/`: Merchant onboarding and management
- `onboarding/`: User onboarding, login, password reset, merchant registration
- `settings/`: (empty or legacy, see dashboard/settings)
- `not-found.tsx`: 404 page

### providers/

React context providers (e.g., tour guide provider)

### routes/

Route definitions and route trees for navigation, mirroring `pages/` structure (dashboard, onboarding, transfer, wallet, withdrawals, etc)

### schema/, schemas/

Zod or GraphQL schemas for validation and API typing (e.g., transfer.ts)

### services/

Service layer for API integrations:

- `bank/`, `flutterwave/`, `paystack/`: Bank/payment provider integrations

### store/

Global state management (Zustand stores for user, wallet, KYC, etc):

- `kyc/`: KYC state
- `profile-store.ts`, `user-store.ts`, `wallet-store.ts`: User, profile, and wallet state

### styles/

CSS files (global styles, Tailwind imports)

### types/

TypeScript type definitions and interfaces (API, domain models, upload, etc)

### utils/

General utility functions and helpers:

- `card-formatters.ts`, `currency-converter.ts`, `route-guards.ts`, `upload/`, `kyc/`, etc

---

## 16. Root Folder Structure

This section provides a professional overview of the main folders in the project root, describing their responsibilities and typical contents.

### 16.1 Root-Level Directories

### assets/

Local package for shared static assets, icons, and UI primitives. Built separately and imported as a dependency.

### infrastructure/

Infrastructure-as-code, deployment scripts, and AWS SAM templates for backend/serverless resources.

### public/

Static files served directly (images, SVGs, favicons, etc). Not processed by Vite.

- `public/assets/`: Publicly served static assets (Lottie files, SVGs, etc)

### scripts/

Node/JS scripts for setup, deployment, and automation.

### src/

Main application source code (see Section 15 for detailed breakdown).

### 16.2 Key Subfolders

### infrastructure/.aws-sam/

AWS SAM build artifacts

### src/lib/graphql/

GraphQL queries, mutations, and fragments

### src/lib/socket/

Phoenix socket and real-time event setup

### src/hooks/api/, src/hooks/bank/

API and bank-specific custom hooks

### src/store/kyc/

KYC-related state management

### src/utils/kyc/

KYC-related utility functions

This structure is designed for scalability, modularity, and clarity. Each folder has a clear responsibility, making it easy for new developers to find, understand, and extend the codebase.

---

## 17. Additional Core Feature Details

### 17.1 PIN Creation & Verification

PINs are used to secure sensitive actions (transfers, withdrawals, etc). PIN creation and verification are handled via Zod schemas and validated in forms.

**How it works:**

- PINs are required to be exactly 4 digits
- Validation is enforced using Zod schemas (see `transactionPinSchema` in `src/schema/dashboard.ts`)
- PINs are typically entered in modal forms before confirming a transaction

**Code snippet:**

```tsx
// src/schema/dashboard.ts
export const transactionPinSchema = () =>
  z.object({
    pin: z
      .string()
      .min(1, { message: 'PIN required' })
      .refine((value) => /^\d{4}$/.test(value), { message: 'PIN must be 4 digits' })
  });
```

### 17.2 Transfers & Debit Actions

Transfers (including debit actions) are handled by the `TransferMoney` component, which supports single, multiple, and bulk transfers. The process is step-based and form-driven.

**How it works:**

- User selects transfer method (wallet, bank, etc)
- Fills out the transfer form (amount, destination, currency)
- Proceeds through steps; on submit, the transfer is processed via API call

**Code snippet:**

```tsx
// src/components/modules/transfer/transfer-money.tsx
const [formData, setFormData] = useState({
  amount: '',
  destination: '',
  currency: t('currencies.UGX')
});

const handleFormSubmit = () => {
  setCurrentStep(2); // Proceed to confirmation step
  // Actual transfer logic would call an API here
};
```

### 17.3 Currency Conversion (Exchange)

Currency exchange is handled in the exchange dashboard page. Users select currencies and amounts, and the app calculates rates and conversions.

**How it works:**

- User selects source and target currencies
- Enters amount to convert
- The app fetches or calculates the exchange rate and shows the converted amount
- On submit, the exchange is processed via API call

**Code snippet:**

```tsx
// src/pages/dashboard/cross-payment/index.tsx
const exchangeRate = 1.175;
const recipientAmount = ((parseFloat(amount || '0') - fees) * exchangeRate).toFixed(2);
```

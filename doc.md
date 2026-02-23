# KPay Platform Handover Guide

Last updated: 2026-02-21  
Repository root: `/Users/obiabo/Desktop/Container/work/kppay`

![PLACEHOLDER - System Overview Image](./docs/images/system-overview.png)

## How To Use This Document

This document is written for **both engineers and non-engineers**.

- If you are non-technical, start with:
  - `Executive Overview`
  - `What The Platform Does`
  - `Teams and Responsibilities`
  - `Risks and Next Priorities`
- If you are technical, continue with:
  - `Repository and Architecture`
  - `App-by-App Technical Guide`
  - `Runbook (Local, Testing, Deployment)`
  - `Known Technical Debt`

Tip: Add screenshots/diagrams anywhere you see `PLACEHOLDER` blocks.

---

## 1. Executive Overview (Non-Technical)

KPay is a payment platform with:

- a **Users web app** (customer-facing)
- an **Admin web app** (operations/back-office)
- a **Mobile app** (customer-facing)
- shared backend-facing logic through GraphQL packages

In simple terms:

- customers create accounts, manage wallets, transfer funds, pay bills, and complete KYC
- admins monitor activity, transactions, disputes, and verification workflows
- mobile app mirrors key user flows for on-the-go usage

![PLACEHOLDER - Product Map](./docs/images/product-map.png)

---

## 2. What The Platform Does

### 2.1 Customer-facing capabilities

- sign up / login
- wallet balance and transaction history
- transfer, deposit, withdrawal
- bill payment (Flutterwave-backed flow)
- KYC and profile verification
- support tickets

### 2.2 Admin-facing capabilities

- dashboard and activity logs
- transaction monitoring (deposit/transfer/withdraw/exchange)
- dispute and verification management
- user/admin role settings

### 2.3 Mobile capabilities

- auth + onboarding
- wallet and transactions
- send money and bill flows
- card-related flows
- ticketing and verification modules

---

## 3. Teams and Responsibilities (Suggested)

- Product/Operations: business rules, support, rollout decisions
- Frontend Team: users/admin web and shared UI packages
- Mobile Team: Expo app
- Platform Team: CI/CD, infrastructure, secrets, env standardization
- QA Team: E2E and regression coverage

![PLACEHOLDER - Team Ownership Matrix](./docs/images/team-ownership.png)

---

## 4. Repository and Architecture (Technical)

## 4.1 Monorepo layout

```text
.
├── apps/
│   ├── users/              # Customer web app
│   ├── admin/              # Admin web app
│   └── k-pay-app/          # Expo mobile app
├── packages/
│   ├── api/                # Shared GraphQL queries/mutations + helpers
│   ├── common/             # Shared hooks/services/constants
│   ├── utils/              # Shared utility functions
│   ├── types/              # Shared TS domain types
│   ├── ui/                 # Shared UI package
│   ├── components/         # Shared component package
│   ├── assets/             # Workspace assets package
│   ├── eslint-config/      # Shared lint config
│   └── typescript-config/  # Shared tsconfig
├── package.json
├── turbo.json
└── bun.lock
```

## 4.2 Tooling

- Monorepo runner: `turbo`
- Root package manager: `bun` (`bun@1.2.5`)
- Language: TypeScript
- Lint/format: ESLint + Prettier
- Hooks/commits: Husky + commitlint + lint-staged

Root commands:

```bash
bun run dev
bun run build
bun run lint
bun run format
```

---

## 5. App-by-App Technical Guide

## 5.1 Users Web App (`apps/users`)

Stack:

- React 18 + Vite 6
- TanStack Router
- Apollo Client + Absinthe upload link
- React Query + Zustand
- Tailwind + Radix + shared components
- PWA support

Key files:

- Entry: `apps/users/src/main.tsx`
- Providers/App shell: `apps/users/src/app.tsx`
- Routes: `apps/users/src/routes/**`
- GraphQL client: `apps/users/src/lib/apollo-client.ts`
- Auth helper: `apps/users/src/hooks/use-auth.ts`
- Stores: `apps/users/src/store/**`

Bill-payment references:

- UI page: `apps/users/src/pages/dashboard/bill-payment.tsx`
- Queries: `packages/api/src/graphql/queries/bill-payment.ts`
- Mutations: `packages/api/src/graphql/mutations/bill-payment.ts`

![PLACEHOLDER - Users App Flow](./docs/images/users-flow.png)

## 5.2 Admin Web App (`apps/admin`)

Stack:

- React 18 + Vite 6
- TanStack Router
- Apollo Client
- React Query + Zustand

Key files:

- Entry: `apps/admin/src/main.tsx`
- App shell: `apps/admin/src/app.tsx`
- Routes: `apps/admin/src/routes/**`
- GraphQL client: `apps/admin/src/lib/apollo-client.ts`

Main domains:

- activity logs
- verifications
- transactions
- disputes
- settings/roles

![PLACEHOLDER - Admin App Flow](./docs/images/admin-flow.png)

## 5.3 Mobile App (`apps/k-pay-app`)

Stack:

- Expo + React Native
- Expo Router
- Apollo Client
- AsyncStorage-based token persistence

Key files:

- Root layout: `apps/k-pay-app/app/_layout.tsx`
- App providers: `apps/k-pay-app/src/providers/index.tsx`
- Apollo: `apps/k-pay-app/src/lib/apollo-client.ts`
- Auth context: `apps/k-pay-app/src/contexts/auth-context.tsx`

![PLACEHOLDER - Mobile App Flow](./docs/images/mobile-flow.png)

---

## 6. Shared Packages (Technical)

## 6.1 `@repo/api` (`packages/api`)

Central GraphQL operation layer used across apps:

- queries: wallets, users, admins, transactions, tickets, bill-payment, KYC, disputes, etc.
- mutations: auth, transfer, withdraw, deposit, bill-payment, upload, merchant flows, etc.
- error helpers: `packages/api/src/helpers/errors.ts`

## 6.2 `@repo/types` (`packages/types`)

Shared TypeScript domain types.

## 6.3 `@repo/utils` (`packages/utils`)

Utility functions for country/currency/date/math/masking/validation/errors.

## 6.4 `@repo/common` (`packages/common`)

Shared hooks/services/constants and bank-provider abstractions.

---

## 7. Runtime Concepts (For Everyone)

### 7.1 Authentication model

- users log in and receive access/refresh tokens
- clients auto-refresh tokens before expiry
- on refresh failure, session is invalidated and user logs out

### 7.2 Data transport

- apps use GraphQL through shared operation definitions in `packages/api`
- each app has its own Apollo client setup

### 7.3 State model

- web apps use Zustand for persisted user/wallet/profile slices
- mobile persists tokens and user data in AsyncStorage

![PLACEHOLDER - Auth and Data Lifecycle](./docs/images/auth-data-lifecycle.png)

---

## 8. Environment Variables and Secrets

Observed variables:

- `VITE_PUBLIC_APP_NAME`
- `VITE_PUBLIC_API_URL`
- `VITE_GRAPHQL_ENDPOINT`
- `VITE_PAYSTACK_TEST_KEY`
- `VITE_FLUTTERWAVE_TEST_KEY`
- `VITE_CLOUDFLARE_SITE_KEY`
- `EXPO_PUBLIC_PAYSTACK_TEST_KEY`

Important note:

- repo currently contains app-level `.env` files. Treat as security-sensitive and migrate to proper secret management if not already done.

---

## 9. Runbook

## 9.1 Local setup

Prerequisites:

- Bun 1.2+
- Node.js 18+
- git access to assets/submodules

Commands:

```bash
bun install
bun run dev
```

App-specific examples:

```bash
cd apps/users && bun run dev
cd apps/admin && bun run dev
cd apps/k-pay-app && bun run start
```

## 9.2 Testing

- Users web E2E: `apps/users/playwright.config.ts`
- Admin web E2E: `apps/admin/playwright.config.ts`
- Mobile unit tests: `apps/k-pay-app/jest.config.js`

## 9.3 Deployment

Users app infrastructure:

- SAM template: `apps/users/infrastructure/template.yml`
- SAM config: `apps/users/infrastructure/samconfig.toml`

Workflow set:

- `apps/users/.github/workflows/sam-deploy.yml` (most complete)
- `apps/users/.github/workflows/deploy-simple.yml`
- `apps/users/.github/workflows/deploy-with-cli.yml`
- `apps/users/.github/workflows/main.yml` (currently empty)

Recommendation: standardize on one deployment workflow.

---

## 10. Known Risks / Technical Debt

1. Mixed package-manager assumptions:

- root is Bun-based, but setup/docs/scripts still mention pnpm in several places.

2. Endpoint inconsistency:

- different GraphQL endpoint defaults across app constants/clients.

3. Secrets hygiene:

- `.env` files with real-looking values are committed.

4. CI/CD duplication:

- overlapping workflows and one empty workflow file.

5. Real-time/socket stub:

- users socket hooks currently placeholder-level and likely non-functional for production realtime.

---

## 11. Next Priorities (Recommended Sequence)

1. Security cleanup:

- rotate keys
- remove secrets from tracked env files

2. Config normalization:

- define one source of truth for endpoints per environment

3. CI/CD consolidation:

- choose one deploy workflow and deprecate others

4. Setup simplification:

- align docs/scripts around Bun (or formally switch to pnpm)

5. Realtime correctness:

- implement/replace socket layer or remove dead code

---

## 12. Quick Glossary (Non-Technical Friendly)

- Monorepo: one repository containing multiple apps/packages
- GraphQL: API query language used by apps to fetch/update data
- Apollo Client: library that sends GraphQL requests
- KYC: “Know Your Customer” identity verification process
- CI/CD: automated build/test/deploy pipeline
- SAM: AWS Serverless Application Model (infra-as-code tooling)

---

## 13. High-Value File Index

Core:

- `package.json`
- `turbo.json`

Users app:

- `apps/users/src/main.tsx`
- `apps/users/src/app.tsx`
- `apps/users/src/lib/apollo-client.ts`
- `apps/users/src/pages/dashboard/bill-payment.tsx`

Admin app:

- `apps/admin/src/main.tsx`
- `apps/admin/src/app.tsx`
- `apps/admin/src/lib/apollo-client.ts`

Mobile app:

- `apps/k-pay-app/app/_layout.tsx`
- `apps/k-pay-app/src/providers/index.tsx`
- `apps/k-pay-app/src/lib/apollo-client.ts`
- `apps/k-pay-app/src/contexts/auth-context.tsx`

Shared:

- `packages/api/src/graphql/**`
- `packages/common/src/**`
- `packages/utils/src/**`
- `packages/types/src/**`

Infra:

- `apps/users/infrastructure/template.yml`
- `apps/users/infrastructure/samconfig.toml`
- `apps/users/.github/workflows/sam-deploy.yml`

---

This guide is intentionally structured to be readable by technical and non-technical stakeholders. Add product screenshots and architecture diagrams at the `PLACEHOLDER` points to complete onboarding quality.

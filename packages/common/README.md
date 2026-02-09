# @repo/common

This package contains shared core features, logic, and constants used across the monorepo.

## Structure

- `src/constants`: Application-wide constants (e.g., config values, magic strings).
- `src/hooks`: Shared React hooks (business logic, non-UI specific).
- `src/lib`: Core library functions and helpers.
- `src/types`: Shared TypeScript types specific to core logic.
- `src/validations`: Zod schemas and validation logic.

## Usage

```typescript
import { APP_NAME } from '@repo/common';
import { useExample } from '@repo/common';
```

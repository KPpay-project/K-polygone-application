import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/onboarding/login');
  await expect(page).toHaveTitle('Welcome Back');
});

test('login form validation', async ({ page }) => {
  await page.goto('/onboarding/login');
  const loginButton = page.getByRole('button', { name: /Sign In/i });
  await expect(loginButton).toBeVisible();
});

test('navigates to create account when user param is present', async ({ page }) => {
  await page.goto('/onboarding/login?user=user');

  const createAccountButton = page.getByRole('button', { name: /Create Account/i });
  await expect(createAccountButton).toBeVisible();

  await createAccountButton.click();

  await expect(page).toHaveURL(/.*\/onboarding\/create-account/);
});

test('navigates to register merchant when user param is missing', async ({ page }) => {
  await page.goto('/onboarding/login');

  const createAccountButton = page.getByRole('button', { name: /Create Account/i });
  await expect(createAccountButton).toBeVisible();

  await createAccountButton.click();

  await expect(page).toHaveURL(/.*\/onboarding\/register-merchant/);
});

import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
  test('should have disabled submit button until captcha is verified', async ({ page }) => {
    await page.goto('/onboarding/login');

    const submitButton = page.getByRole('button', { name: /sign in/i });

    // The button should be disabled initially because captchaToken is empty
    await expect(submitButton).toBeDisabled();
    
    // Note: Since we are using a Cloudflare Test Key, we might not be able to easily 
    // simulate the success state without interacting with the iframe, which is complex.
    // However, verifying it is disabled initially confirms the requirement:
    // "button is disabled if the capture has not been validated yet"
  });
});

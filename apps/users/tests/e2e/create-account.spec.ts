import { test, expect } from '@playwright/test';

test.describe('Create Account Page', () => {
  test('should auto-select country based on IP', async ({ page }) => {
    await page.route('https://ipapi.co/json/', async route => {
      const json = {
        "ip": "137.255.126.220", 
        "network": "137.255.112.0/20", 
        "version": "IPv4", 
        "city": "Cotonou", 
        "region": "Littoral", 
        "region_code": "LI", 
        "country": "BJ", 
        "country_name": "Benin", 
        "country_code": "BJ", 
        "country_code_iso3": "BEN", 
        "country_capital": "Porto-Novo", 
        "country_tld": ".bj", 
        "continent_code": "AF", 
        "in_eu": false, 
        "postal": null, 
        "latitude": 6.3669, 
        "longitude": 2.4151, 
        "timezone": "Africa/Porto-Novo", 
        "utc_offset": "+0100", 
        "country_calling_code": "+229", 
        "currency": "XOF", 
        "currency_name": "Franc", 
        "languages": "fr-BJ", 
        "country_area": 112620, 
        "country_population": 11485048, 
        "asn": "AS328228", 
        "org": "SBIN-AS" 
      };
      await route.fulfill({ json });
    });

    await page.goto('/onboarding/create-account');

    // Verify that "Benin" is automatically selected and visible
    // We use .first() because the text might appear in both the display and the options list
    await expect(page.getByText('Benin').first()).toBeVisible();
  });
});

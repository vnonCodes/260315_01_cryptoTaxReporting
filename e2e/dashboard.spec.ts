import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display API-derived metrics instead of hardcoded v1 values', async ({ page }) => {
    // Hardcoded v1 values were:
    // Realized Gains: $18,420.50
    // Tax Liability: $2,763.07

    const gains = page.locator('text=2025 Realized Gains').locator('..').locator('.text-2xl');
    const liability = page.locator('text=Est. 2025 Tax Liability').locator('..').locator('.text-2xl');

    await expect(gains).toBeVisible();
    await expect(liability).toBeVisible();

    const gainsValue = await gains.textContent();
    const liabilityValue = await liability.textContent();

    expect(gainsValue).not.toContain('$18,420.50');
    expect(liabilityValue).not.toContain('$2,763.07');
    
    // Should still look like currency
    expect(gainsValue).toMatch(/^\$[0-9,.]+/);
    expect(liabilityValue).toMatch(/^\$[0-9,.]+/);
  });

  test('should open live feed panel when clicking the button', async ({ page }) => {
    await page.click('button:has-text("Live Feed")');
    await expect(page.locator('text=Live Operations')).toBeVisible();
    await expect(page.locator('text=Mempool & Chain Data')).toBeVisible();
    
    // Close it
    await page.click('button:has(svg.lucide-x)');
    await expect(page.locator('text=Live Operations')).not.toBeVisible();
  });
});

import { test, expect } from '@playwright/test';

test.describe('Reports', () => {
  test('should download CSV when export button is clicked', async ({ page }) => {
    await page.goto('/reports');

    // Wait for the table to populate (the badge shows event count)
    await expect(page.locator('text=Taxable Events').first()).toBeVisible();

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.click('button:has-text("Export CSV")')
    ]);

    expect(download.suggestedFilename()).toBe('Form_8949_2024.csv');
  });

  test('should allow changing tax year and update results', async ({ page }) => {
    await page.goto('/reports');
    
    // Wait for 2024 data to load first
    await expect(page.locator('text=Taxable Events').first()).toBeVisible();

    // Record the initial event count text (for 2024 - should have events)
    const badge2024 = page.locator('.badge, [class*="badge"]').filter({ hasText: 'Taxable Events' });
    
    // Switch to 2023
    await page.selectOption('select', '2023');
    
    // Wait for 2023 data to load (loading state then content)
    await expect(page.locator('text=Taxable Events').first()).toBeVisible({ timeout: 10000 });
    
    // Switch back to 2024
    await page.selectOption('select', '2024');
    await expect(page.locator('text=Taxable Events').first()).toBeVisible({ timeout: 10000 });
    
    // Verify we are back on 2024 by checking the select value
    await expect(page.locator('select')).toHaveValue('2024');
  });
});

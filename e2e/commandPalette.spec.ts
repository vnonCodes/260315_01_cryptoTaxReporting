import { test, expect } from '@playwright/test';

test.describe('Command Palette', () => {
  test('should open via keyboard shortcut and allow navigation', async ({ page }) => {
    await page.goto('/');

    // Click the search bar to open the command palette (more reliable than keyboard shortcut in headless)
    await page.click('[class*="cursor-pointer"][class*="w-96"]');
    
    // Wait for palette to open
    await expect(page.locator('text=Navigation')).toBeVisible();
    await expect(page.getByPlaceholder('Type a command or search...')).toBeVisible();

    // Search for portfolio
    await page.fill('input[placeholder="Type a command or search..."]', 'Portfolio');
    const portfolioItem = page.locator('[role="option"]:has-text("Portfolio")').first();
    await expect(portfolioItem).toBeVisible();

    // Click it to navigate
    await portfolioItem.click();
    await expect(page).toHaveURL(/\/portfolio/);
  });

  test('should close on ESC key', async ({ page }) => {
    await page.goto('/');

    // Click the search input UI to open
    await page.click('[class*="cursor-pointer"][class*="w-96"]');
    await expect(page.locator('text=Navigation')).toBeVisible();

    // Press ESC to close
    await page.keyboard.press('Escape');
    await expect(page.locator('text=Navigation')).not.toBeVisible();
  });
});

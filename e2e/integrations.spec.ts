import { test, expect } from '@playwright/test';

test.describe('Integrations', () => {
  test('should open Connect API modal', async ({ page }) => {
    await page.goto('/integrations');
    await page.click('button:has-text("Add Integration")');
    
    await expect(page.locator('text=Connect Exchange API')).toBeVisible();
    await expect(page.locator('text=Securely sync your trade history')).toBeVisible();
    
    // Test close via ESC
    await page.keyboard.press('Escape');
    await expect(page.locator('text=Connect Exchange API')).not.toBeVisible();
  });

  test('should open Add Wallet modal', async ({ page }) => {
    await page.goto('/integrations');
    await page.click('text=Add New Wallet');
    
    await expect(page.locator('text=Connect Web3 Wallet')).toBeVisible();
    // Target the wallet option button inside the modal (not the card heading)
    await expect(page.getByRole('button', { name: /M MetaMask/ })).toBeVisible();
    
    // Close via ESC
    await page.keyboard.press('Escape');
    await expect(page.locator('text=Connect Web3 Wallet')).not.toBeVisible();
  });

  test('should handle Sync Now button loading state', async ({ page }) => {
    await page.goto('/integrations');

    // Wait for integration cards to fully render
    await expect(page.locator('text=Coinbase')).toBeVisible();
    
    // Use specific data-testid for Coinbase sync button (first connected integration)
    const coinbaseSyncBtn = page.locator('[data-testid="sync-coinbase"]');
    await expect(coinbaseSyncBtn).toBeVisible();
    await expect(coinbaseSyncBtn).toContainText('Sync Now');

    await coinbaseSyncBtn.click();
    
    // The clicked button should now show 'Syncing...'
    await expect(coinbaseSyncBtn).toContainText('Syncing...', { timeout: 2000 });
    await expect(coinbaseSyncBtn).toBeDisabled();
    
    // Wait for mock delay to finish (1.5s in code) and button returns to 'Sync Now'
    await expect(coinbaseSyncBtn).toContainText('Sync Now', { timeout: 4000 });
    await expect(coinbaseSyncBtn).not.toBeDisabled();
  });
});

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
    // Use a more specific selector - target the wallet button inside the modal
    await expect(page.getByRole('button', { name: /M MetaMask/ })).toBeVisible();
    
    // Close via ESC
    await page.keyboard.press('Escape');
    await expect(page.locator('text=Connect Web3 Wallet')).not.toBeVisible();
  });

  test('should handle Sync Now button loading state', async ({ page }) => {
    await page.goto('/integrations');

    // Wait for integrations cards to be loaded
    await expect(page.locator('text=Coinbase')).toBeVisible();
    
    // Find the first Sync Now button (for Coinbase which is 'connected')
    const syncButton = page.locator('button:has-text("Sync Now")').first();
    await expect(syncButton).toBeVisible();
    await syncButton.click();
    
    // After click, that button should show 'Syncing...'
    await expect(syncButton).toContainText('Syncing...', { timeout: 2000 });
    
    // All other Sync Now buttons should be disabled while syncing
    const allSyncButtons = page.locator('button:has-text("Sync Now"), button:has-text("Syncing...")');
    await expect(allSyncButtons.first()).toBeDisabled();
    
    // Wait for mock delay to finish (1.5s in code) and button returns to 'Sync Now'
    await expect(syncButton).toContainText('Sync Now', { timeout: 3500 });
  });
});

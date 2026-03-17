import { test, expect } from '@playwright/test';

test.describe('TanStack Query Shared Cache', () => {
  test('should reuse portfolio data cache between dashboard and portfolio pages', async ({ page }) => {
    let portfolioCallCount = 0;
    
    // Intercept API calls
    await page.route('**/api/portfolio', async (route) => {
      portfolioCallCount++;
      await route.continue();
    });

    // 1. Visit Dashboard
    await page.goto('/');
    await page.waitForSelector('text=Total Portfolio Value');
    const firstCount = portfolioCallCount;
    expect(firstCount).toBeGreaterThan(0);

    // 2. Click Portfolio link in Sidebar
    // Wait for the route count to stabilize
    await page.waitForTimeout(500);
    
    await page.click('text=Portfolio');
    await expect(page).toHaveURL(/\/portfolio/);
    await page.waitForSelector('h1:has-text("Portfolio")');

    // 3. Assert count has not increased (or at least not for asset list)
    // TanStack Query might refetch in background depending on staleTime, 
    // but the implementation plan says staleTime: 30s in Providers.tsx 
    // so it should NOT refetch immediately on navigation.
    
    // Let's verify our Providers config
    expect(portfolioCallCount).toBe(firstCount);
  });
});

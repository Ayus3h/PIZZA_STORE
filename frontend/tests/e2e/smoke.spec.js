import { test, expect } from '@playwright/test';

test('home page loads and shows the main brand copy', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByText('Fresh. Fast. Full of flavor.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
});

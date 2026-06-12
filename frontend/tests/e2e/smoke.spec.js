import { test, expect } from '@playwright/test';

test.describe('Pizzeria E2E Tests', () => {
  const uniqueEmail = `testuser${Date.now()}@gmail.com`;
  const password = 'Password123';

  test('home page loads and shows the main brand copy', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Fresh. Fast. Full of flavor.')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  });

  test('Auth: What happens when a user types the wrong password? (Does an error show?)', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'wronguser@gmail.com');
    await page.fill('input[name="password"]', 'WrongPass123');
    await page.click('button[type="submit"]');

    // Wait for the alert to show up
    const alert = page.locator('.alert-danger');
    await expect(alert).toBeVisible();
    await expect(alert).toContainText('Invalid email or password');
  });

  test('Auth: What happens if they log in successfully? (Do they go to the dashboard?)', async ({ page }) => {
    // First register a user so we can log in
    await page.goto('/register');
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', uniqueEmail);
    await page.fill('input[name="password"]', password);
    await page.selectOption('select[name="role"]', 'CUSTOMER');
    await page.click('button[type="submit"]');

    // Registration should redirect to dashboard
    await expect(page).toHaveURL(/.*\/dashboard/);

    // Clear local storage to ensure clean login test
    await page.evaluate(() => localStorage.clear());
    
    await page.goto('/login');
    await page.fill('input[name="email"]', uniqueEmail);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');

    // Login should redirect to dashboard
    await expect(page).toHaveURL(/.*\/dashboard/);
  });

  test('Cart: If I click "Add to Cart" on a Pepperoni pizza, does the cart counter go up to 1?', async ({ page }) => {
    // Create another user just for this test to avoid parallel run issues if fullyParallel is true
    const cartUserEmail = `cartuser${Date.now()}@gmail.com`;
    
    await page.goto('/register');
    await page.fill('input[name="name"]', 'Cart User');
    await page.fill('input[name="email"]', cartUserEmail);
    await page.fill('input[name="password"]', password);
    await page.selectOption('select[name="role"]', 'CUSTOMER');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*\/dashboard/);

    // Locate the "Pepperoni Feast" card and click its ADD button
    const pizzaCard = page.locator('.card', { hasText: 'Pepperoni Feast' });
    await pizzaCard.locator('button', { hasText: 'ADD' }).first().click();

    // Verify it's in the cart
    const cartSection = page.locator('.card', { hasText: 'Your Cart' });
    await expect(cartSection.locator('.list-group-item', { hasText: 'Pepperoni Feast' })).toBeVisible();
    await expect(cartSection.locator('small', { hasText: /x 1/ })).toBeVisible();
  });

  test('Checkout: Can a user successfully submit an order?', async ({ page }) => {
    // Create another user
    const checkoutUserEmail = `checkoutuser${Date.now()}@gmail.com`;

    await page.goto('/register');
    await page.fill('input[name="name"]', 'Checkout User');
    await page.fill('input[name="email"]', checkoutUserEmail);
    await page.fill('input[name="password"]', password);
    await page.selectOption('select[name="role"]', 'CUSTOMER');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*\/dashboard/);

    // Add to cart
    const pizzaCard = page.locator('.card', { hasText: 'Pepperoni Feast' });
    await pizzaCard.locator('button', { hasText: 'ADD' }).first().click();

    // Check out
    const checkoutButton = page.locator('button', { hasText: 'Checkout' });
    await checkoutButton.click();

    // The cart should become empty
    const cartSection = page.locator('.card', { hasText: 'Your Cart' });
    await expect(cartSection.getByText('Your cart is empty.')).toBeVisible();

    // Verify the order appears in "My Orders"
    const ordersSection = page.locator('.card', { hasText: 'My Orders' });
    // Verify Pepperoni Feast is mentioned in the order details
    await expect(ordersSection.getByText('Pepperoni Feast').first()).toBeVisible({ timeout: 10000 });
  });
});

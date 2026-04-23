import { test, expect } from '@playwright/test';
import { login, addToCart } from '../utils/test-helpers';

const email = `checkout${Date.now()}@mail.com`;
const password = 'Test@1234';

test.describe('Checkout Flow E2E', () => {

  test.beforeEach(async ({ page }) => {
    // Ensure user exists or use seeded user
    await page.goto('/signup');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');
  });

  test('User completes full checkout flow', async ({ page }) => {

    // Login
    await login(page, email, password);

    // Add to cart
    await addToCart(page);

    // Proceed to checkout
    await page.click('button:has-text("Checkout")');
    await expect(page).toHaveURL(/checkout/);

    // Fill checkout details
    await page.fill('input[name="address"]', '123 Test Street');
    await page.fill('input[name="city"]', 'Chennai');
    await page.fill('input[name="pincode"]', '600001');

    // Simulate payment (Stripe test mode)
    await page.click('button:has-text("Pay Now")');

    // Success page
    await expect(page.locator('text=Order Successful')).toBeVisible();
  });

});
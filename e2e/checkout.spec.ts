import { test, expect } from '@playwright/test';

const email = `checkout${Date.now()}@test.com`;
const password = 'Test@1234';

test.describe('Checkout Flow', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/signup');

    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');
  });

  test('Complete checkout process', async ({ page }) => {

    // Go to products
    await page.goto('/products');

    // Add to cart
    await page.click('button:has-text("Add to Cart")');

    // Go to cart
    await page.goto('/cart');
    await page.click('button:has-text("Checkout")');

    // Fill details
    await page.fill('input[name="address"]', '123 Street');
    await page.fill('input[name="city"]', 'Chennai');
    await page.fill('input[name="pincode"]', '600001');

    // Payment
    await page.click('button:has-text("Pay Now")');

    // Success check
    await expect(page.locator('text=Order Successful')).toBeVisible();
  });

});
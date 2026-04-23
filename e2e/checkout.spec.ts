import { test, expect } from '@playwright/test';

const email = process.env.TEST_USER_EMAIL!;
const password = process.env.TEST_USER_PASSWORD!;

test.describe('Full E2E Checkout Flow', () => {

  test('User completes full purchase journey', async ({ page }) => {

    try {
      // STEP 1: Login
      await page.goto('/login');

      await page.fill('input[name="email"]', email);
      await page.fill('input[name="password"]', password);
      await page.click('button[type="submit"]');

      await expect(page).toHaveURL(/dashboard/);

      // STEP 2: Go to products
      await page.goto('/products');

      // STEP 3: Add product to cart
      await page.click('button:has-text("Add to Cart")');

      // STEP 4: Go to cart
      await page.goto('/cart');
      await expect(page.locator('text=Your Cart')).toBeVisible();

      // STEP 5: Proceed to checkout
      await page.click('button:has-text("Checkout")');
      await expect(page).toHaveURL(/checkout/);

      // STEP 6: Fill checkout form
      await page.fill('input[name="address"]', '123 Test Street');
      await page.fill('input[name="city"]', 'Chennai');
      await page.fill('input[name="pincode"]', '600001');

      // STEP 7: Payment simulation
      await page.click('button:has-text("Pay Now")');

      // STEP 8: Verify success
      await expect(page.locator('text=Order Successful')).toBeVisible();

    } catch (error) {
      console.error('Checkout flow failed:', error);
      throw error; // Important for Playwright to mark test failed
    }

  });

});
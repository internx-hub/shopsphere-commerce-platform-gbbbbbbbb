import { test, expect } from '@playwright/test';

test.describe('Product Flow', () => {

  test('Products page loads', async ({ page }) => {
    await page.goto('/products');
    await expect(page.locator('text=Products')).toBeVisible();
  });

  test('User can view product details', async ({ page }) => {
    await page.goto('/products');

    await page.click('text=View Details');
    await expect(page).toHaveURL(/product/);
  });

  test('Add to cart works', async ({ page }) => {
    await page.goto('/products');

    await page.click('button:has-text("Add to Cart")');
    await page.goto('/cart');

    await expect(page.locator('text=Your Cart')).toBeVisible();
  });

});
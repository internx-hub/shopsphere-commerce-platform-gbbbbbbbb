import { test, expect } from '@playwright/test';

test.describe('🛒 E2E Checkout Flow', () => {

  test('Complete add-to-cart → checkout → order success flow', async ({ page }) => {

    // 🔹 1. Go to products page
    await page.goto('/products');

    // 🔹 2. Add product to cart
    await page.click('text=Add to Cart');

    // Assert cart count updated
    const cartCount = page.locator('.cart-count');
    await expect(cartCount).toHaveText('1');

    // 🔹 3. Go to cart page
    await page.click('.cart-icon');
    await expect(page).toHaveURL(/.*cart/);

    // 🔹 4. Proceed to checkout
    await page.click('text=Checkout');
    await expect(page).toHaveURL(/.*checkout/);

    // 🔹 5. Fill checkout details
    await page.fill('#name', 'Test User');
    await page.fill('#address', 'Chennai, Tamil Nadu');
    await page.fill('#card', '4111111111111111');
    await page.fill('#cvv', '123');

    // 🔹 6. Place order
    await page.click('text=Place Order');

    // 🔹 7. Verify success page
    await expect(page).toHaveURL(/.*order-success/);
    await expect(page.locator('h1')).toHaveText(/Order Successful/i);

  });

});
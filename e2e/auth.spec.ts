import { test, expect } from '@playwright/test';

const email = `user${Date.now()}@test.com`;
const password = 'Test@1234';

test.describe('Auth Flow', () => {

  test('Signup works', async ({ page }) => {
    await page.goto('/signup');

    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/dashboard/);
  });

  test('Login works', async ({ page }) => {
    await page.goto('/login');

    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/dashboard/);
  });

  test('Protected route redirects', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/login/);
  });

  test('Logout works', async ({ page }) => {
    await page.goto('/login');

    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');

    await page.click('button:has-text("Logout")');
    await expect(page).toHaveURL(/login/);
  });

});
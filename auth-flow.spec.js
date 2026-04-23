// auth-flow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow E2E', () => {
  const testUser = {
    email: 'testuser@example.com',
    password: 'Password123!'
  };

  test('Sign-up flow', async ({ page }) => {
    await page.goto('http://localhost/auth/signup');
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.click('button[type="submit"]');

    // Expect redirect to dashboard or login
    await expect(page).toHaveURL(/(login|dashboard)/);
  });

  test('Sign-in flow', async ({ page }) => {
    await page.goto('http://localhost/auth/login');
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.click('button[type="submit"]');

    // Expect redirect to dashboard
    await expect(page).toHaveURL(/dashboard/);
  });

  test('Protected route redirect when not signed in', async ({ page }) => {
    await page.goto('http://localhost/protected');
    // Expect redirect to login
    await expect(page).toHaveURL(/login/);
  });

  test('Access protected route after sign-in', async ({ page }) => {
    await page.goto('http://localhost/auth/login');
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.click('button[type="submit"]');

    await page.goto('http://localhost/protected');
    await expect(page.locator('h1')).toContainText('Protected');
  });

  test('Sign-out flow', async ({ page }) => {
    await page.goto('http://localhost/auth/login');
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.click('button[type="submit"]');

    // Click sign-out button
    await page.click('button#signout');

    // Expect redirect to login
    await expect(page).toHaveURL(/login/);
  });
});

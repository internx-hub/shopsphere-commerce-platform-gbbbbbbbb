import { test, expect } from '@playwright/test';
import { signup, login, logout } from '../utils/test-helpers';

const email = `test${Date.now()}@mail.com`;
const password = 'Test@1234';

test.describe('Auth Flow E2E', () => {

  test('User can sign up', async ({ page }) => {
    await signup(page, email, password);
  });

  test('User can log in', async ({ page }) => {
    await login(page, email, password);
  });

  test('Protected route redirects if not logged in', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/login/);
  });

  test('User can log out', async ({ page }) => {
    await login(page, email, password);
    await logout(page);
  });

});
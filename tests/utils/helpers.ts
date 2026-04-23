import { Page, expect } from '@playwright/test';

export async function signup(page: Page, email: string, password: string) {
  await page.goto('/signup');

  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL(/dashboard/);
}

export async function login(page: Page, email: string, password: string) {
  await page.goto('/login');

  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL(/dashboard/);
}

export async function logout(page: Page) {
  await page.click('button:has-text("Logout")');
  await expect(page).toHaveURL(/login/);
}

export async function addToCart(page: Page) {
  await page.goto('/products');

  await page.click('button:has-text("Add to Cart")');

  await page.goto('/cart');
  await expect(page.locator('text=Your Cart')).toBeVisible();
}
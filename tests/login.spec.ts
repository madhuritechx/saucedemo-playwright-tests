import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { USERS, INVALID_CREDENTIALS } from './test-data';

/**
 * Login flow — happy path plus the two most important negative cases.
 * These run with no stored session so they exercise the real login screen.
 */
test.describe('Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('standard user logs in and lands on the inventory page', async ({ page }) => {
    await loginPage.login(USERS.standard.username, USERS.standard.password);

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.getByTestId('inventory-item')).toHaveCount(6);
  });

  test('invalid password is rejected with a clear error', async ({ page }) => {
    await loginPage.login(INVALID_CREDENTIALS.username, INVALID_CREDENTIALS.password);

    await expect(loginPage.errorMessage).toHaveText(
      'Epic sadface: Username and password do not match any user in this service',
    );
    // The user must stay on the login page, not slip through.
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });

  test('locked-out user is blocked with the correct message', async () => {
    await loginPage.login(USERS.lockedOut.username, USERS.lockedOut.password);

    await expect(loginPage.errorMessage).toHaveText(
      'Epic sadface: Sorry, this user has been locked out.',
    );
  });
});

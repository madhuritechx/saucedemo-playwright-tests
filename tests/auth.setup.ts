import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { USERS, AUTH_FILE } from './test-data';

/**
 * Logs in through the real UI once and saves the signed-in session to disk.
 * The cart and checkout suites reuse this session instead of logging in again,
 * which keeps them focused on their own behaviour and speeds the suite up.
 */
setup('authenticate as standard user', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login(USERS.standard.username, USERS.standard.password);

  // Confirm the login actually succeeded before we trust the saved state.
  await expect(page).toHaveURL(/inventory\.html/);
  await expect(page.getByTestId('inventory-list')).toBeVisible();

  await page.context().storageState({ path: AUTH_FILE });
});

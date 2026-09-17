import { test, expect } from '@playwright/test';
import { InventoryPage } from '../pages/inventory.page';
import { CartPage } from '../pages/cart.page';
import { PRODUCTS } from './test-data';

/**
 * Cart integrity — the badge count and cart contents must stay correct as
 * items are added and removed. Reuses the signed-in session from auth.setup.
 */
test.describe('Cart', () => {
  test('badge and cart contents stay in sync when adding and removing items', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await page.goto('/inventory.html');

    // Cart starts empty (no badge shown).
    expect(await inventory.getCartCount()).toBe(0);

    await inventory.addItemToCart(PRODUCTS.backpack);
    await inventory.addItemToCart(PRODUCTS.bikeLight);
    await expect(inventory.cartBadge).toHaveText('2');

    // Removing one item decrements the badge.
    await inventory.removeItemFromCart(PRODUCTS.bikeLight);
    await expect(inventory.cartBadge).toHaveText('1');

    // The cart holds exactly the item that is still selected.
    await inventory.openCart();
    const cart = new CartPage(page);
    await expect(page).toHaveURL(/cart\.html/);
    expect(await cart.getItemNames()).toEqual([PRODUCTS.backpack]);
  });
});

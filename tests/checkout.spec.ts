import { test, expect } from '@playwright/test';
import { InventoryPage } from '../pages/inventory.page';
import { CartPage } from '../pages/cart.page';
import { CheckoutPage } from '../pages/checkout.page';
import { PRODUCTS } from './test-data';
import { parseAmount } from '../utils/money';

/**
 * Checkout happy path — the core purchase journey end to end, with an
 * assertion that the money adds up. Reuses the signed-in session.
 */
test.describe('Checkout', () => {
  test('user completes a purchase and the totals are correct', async ({ page }) => {
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);

    await page.goto('/inventory.html');

    // Capture the prices shown on the product cards to verify them later.
    const backpackPrice = parseAmount(await inventory.getItemPrice(PRODUCTS.backpack));
    const bikeLightPrice = parseAmount(await inventory.getItemPrice(PRODUCTS.bikeLight));

    await inventory.addItemToCart(PRODUCTS.backpack);
    await inventory.addItemToCart(PRODUCTS.bikeLight);
    await inventory.openCart();

    await expect(cart.cartItems).toHaveCount(2);
    await cart.checkout();

    await checkout.fillInformation('Madhuri', 'Penmetsa', 'M1 1AA');

    // The overview must list exactly the products we chose — not just the
    // right number of rows or the right total (which could coincide).
    await expect(checkout.overviewItemNames).toHaveText([
      PRODUCTS.backpack,
      PRODUCTS.bikeLight,
    ]);

    // Money integrity: the item total matches the products, and
    // item total + tax equals the grand total shown to the customer.
    const subtotal = await checkout.getSubtotal();
    const tax = await checkout.getTax();
    const total = await checkout.getTotal();

    expect(subtotal).toBe(Number((backpackPrice + bikeLightPrice).toFixed(2)));
    expect(total).toBe(Number((subtotal + tax).toFixed(2)));

    await checkout.finish();

    await expect(page).toHaveURL(/checkout-complete\.html/);
    await expect(checkout.completeHeader).toHaveText('Thank you for your order!');
  });

  test('checkout is blocked when the first name is missing', async ({ page }) => {
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);

    await page.goto('/inventory.html');
    await inventory.addItemToCart(PRODUCTS.backpack);
    await inventory.openCart();
    await cart.checkout();

    // Try to continue with no customer details entered.
    await checkout.continueButton.click();

    await expect(checkout.errorMessage).toHaveText('Error: First Name is required');
    await expect(page).toHaveURL(/checkout-step-one\.html/);
  });
});

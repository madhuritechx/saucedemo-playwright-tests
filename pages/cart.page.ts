import type { Page, Locator } from '@playwright/test';

/**
 * The shopping cart screen ( /cart.html ).
 */
export class CartPage {
  readonly cartItems: Locator;
  readonly itemNames: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.cartItems = page.locator('.cart_item');
    this.itemNames = this.cartItems.locator('.inventory_item_name');
    this.checkoutButton = page.getByTestId('checkout');
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }
}

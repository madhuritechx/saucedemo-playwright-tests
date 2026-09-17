import type { Page, Locator } from '@playwright/test';

/**
 * The shopping cart screen ( /cart.html ).
 */
export class CartPage {
  readonly cartItems: Locator;
  readonly itemNames: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.cartItems = page.getByTestId('inventory-item');
    this.itemNames = this.cartItems.getByTestId('inventory-item-name');
    this.checkoutButton = page.getByTestId('checkout');
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }
}

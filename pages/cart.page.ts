import { type Page, type Locator } from '@playwright/test';

/**
 * The shopping cart screen ( /cart.html ).
 */
export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly itemNames: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('.cart_item');
    this.itemNames = page.locator('.cart_item .inventory_item_name');
    this.checkoutButton = page.getByTestId('checkout');
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }
}

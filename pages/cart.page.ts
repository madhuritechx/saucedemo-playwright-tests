import { type Page, type Locator } from '@playwright/test';

/**
 * The shopping cart screen ( /cart.html ).
 */
export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.getByTestId('checkout');
  }

  /** The names of every product currently in the cart. */
  async getItemNames(): Promise<string[]> {
    return this.cartItems.locator('.inventory_item_name').allInnerTexts();
  }

  async getItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }
}

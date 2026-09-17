import type { Page, Locator } from '@playwright/test';

/**
 * The products / inventory screen shown after a successful login.
 */
export class InventoryPage {
  readonly cartBadge: Locator;
  readonly cartLink: Locator;

  constructor(readonly page: Page) {
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('.shopping_cart_link');
  }

  /** A single product card, located by its exact visible name. */
  private itemCard(itemName: string): Locator {
    return this.page.locator('.inventory_item').filter({
      has: this.page.getByText(itemName, { exact: true }),
    });
  }

  async addItemToCart(itemName: string): Promise<void> {
    await this.itemCard(itemName)
      .getByRole('button', { name: 'Add to cart', exact: true })
      .click();
  }

  async removeItemFromCart(itemName: string): Promise<void> {
    await this.itemCard(itemName)
      .getByRole('button', { name: 'Remove', exact: true })
      .click();
  }

  /** Reads the price shown on a product card, e.g. "$29.99". */
  async getItemPrice(itemName: string): Promise<string> {
    return (await this.itemCard(itemName).locator('.inventory_item_price').innerText()).trim();
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }
}

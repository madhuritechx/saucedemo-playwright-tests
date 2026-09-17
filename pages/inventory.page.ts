import type { Page, Locator } from '@playwright/test';

/**
 * The products / inventory screen shown after a successful login.
 */
export class InventoryPage {
  readonly cartBadge: Locator;
  readonly cartLink: Locator;

  constructor(readonly page: Page) {
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.cartLink = page.getByTestId('shopping-cart-link');
  }

  /** A single product card, located by its exact visible name. */
  private itemCard(itemName: string): Locator {
    return this.page.getByTestId('inventory-item').filter({
      has: this.page.getByText(itemName, { exact: true }),
    });
  }

  async addItemToCart(itemName: string): Promise<void> {
    await this.itemCard(itemName).getByRole('button', { name: 'Add to cart', exact: true }).click();
  }

  async removeItemFromCart(itemName: string): Promise<void> {
    await this.itemCard(itemName).getByRole('button', { name: 'Remove', exact: true }).click();
  }

  /** Reads the price shown on a product card, e.g. "$29.99". */
  async getItemPrice(itemName: string): Promise<string> {
    return (await this.itemCard(itemName).getByTestId('inventory-item-price').innerText()).trim();
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }
}

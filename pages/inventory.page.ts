import { type Page, type Locator } from '@playwright/test';

/** Turns "Sauce Labs Backpack" into the "sauce-labs-backpack" slug Sauce Demo
 *  uses inside its data-test hooks (e.g. add-to-cart-sauce-labs-backpack). */
function toSlug(itemName: string): string {
  return itemName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/**
 * The products / inventory screen shown after a successful login.
 */
export class InventoryPage {
  readonly page: Page;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('.shopping_cart_link');
  }

  /** A single product card, located by its visible name. */
  private itemCard(itemName: string): Locator {
    return this.page.locator('.inventory_item').filter({ hasText: itemName });
  }

  async addItemToCart(itemName: string): Promise<void> {
    await this.page.getByTestId(`add-to-cart-${toSlug(itemName)}`).click();
  }

  async removeItemFromCart(itemName: string): Promise<void> {
    await this.page.getByTestId(`remove-${toSlug(itemName)}`).click();
  }

  /** Reads the price shown on a product card, e.g. "$29.99". */
  async getItemPrice(itemName: string): Promise<string> {
    return (await this.itemCard(itemName).locator('.inventory_item_price').innerText()).trim();
  }

  /** The number on the cart badge, or 0 when the badge is not shown. */
  async getCartCount(): Promise<number> {
    if ((await this.cartBadge.count()) === 0) return 0;
    return Number(await this.cartBadge.innerText());
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }
}

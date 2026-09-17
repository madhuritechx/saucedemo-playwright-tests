import type { Page, Locator } from '@playwright/test';
import { parseAmount } from '../utils/money';

/**
 * The three checkout screens: information ( /checkout-step-one.html ),
 * overview ( /checkout-step-two.html ) and complete ( /checkout-complete.html ).
 */
export class CheckoutPage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly finishButton: Locator;
  readonly errorMessage: Locator;
  readonly overviewItemNames: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly completeHeader: Locator;

  constructor(page: Page) {
    this.firstNameInput = page.getByTestId('firstName');
    this.lastNameInput = page.getByTestId('lastName');
    this.postalCodeInput = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
    this.finishButton = page.getByTestId('finish');
    this.errorMessage = page.getByTestId('error');
    this.overviewItemNames = page.locator('.cart_item .inventory_item_name');
    this.subtotalLabel = page.locator('.summary_subtotal_label');
    this.taxLabel = page.locator('.summary_tax_label');
    this.totalLabel = page.locator('.summary_total_label');
    this.completeHeader = page.getByTestId('complete-header');
  }

  async fillInformation(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click();
  }

  /** Item total shown on the overview (before tax). */
  async getSubtotal(): Promise<number> {
    return parseAmount(await this.subtotalLabel.innerText());
  }

  async getTax(): Promise<number> {
    return parseAmount(await this.taxLabel.innerText());
  }

  async getTotal(): Promise<number> {
    return parseAmount(await this.totalLabel.innerText());
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }
}

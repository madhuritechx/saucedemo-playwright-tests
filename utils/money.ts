/**
 * Pulls the numeric amount out of any string containing a price, e.g.
 * "$29.99" -> 29.99 or "Item total: $39.98" -> 39.98.
 *
 * Scoped to Sauce Demo's simple `$dd.dd` format — not a general-purpose
 * currency parser. It fails loudly on anything it can't parse cleanly so a
 * bad value surfaces here rather than as a confusing NaN comparison later.
 */
export function parseAmount(text: string): number {
  const match = text.match(/\$([\d.]+)/);
  const amount = match ? Number(match[1]) : NaN;

  if (!Number.isFinite(amount)) {
    throw new Error(`Invalid currency amount in "${text}"`);
  }

  return amount;
}

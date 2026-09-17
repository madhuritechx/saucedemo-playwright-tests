/**
 * Pulls the number out of a price string, e.g. "$29.99" or "Item total: $39.98" -> 39.98.
 * Throws on anything it can't parse cleanly, so a bad value fails here rather than later.
 */
export function parseAmount(text: string): number {
  const match = text.match(/\$([\d.]+)/);
  const amount = match ? Number(match[1]) : NaN;

  if (!Number.isFinite(amount)) {
    throw new Error(`Invalid currency amount in "${text}"`);
  }

  return amount;
}

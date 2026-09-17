/** Pulls the numeric amount out of any string containing a price, e.g.
 *  "$29.99" -> 29.99 or "Item total: $39.98" -> 39.98. */
export function parseAmount(text: string): number {
  const match = text.match(/\$([\d.]+)/);
  if (!match) throw new Error(`No currency amount found in "${text}"`);
  return Number(match[1]);
}

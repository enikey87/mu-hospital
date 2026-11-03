export function quantity(value: number, forms: readonly [string, string, string]): string {
  const lastTwo = Math.abs(value) % 100;
  const last = lastTwo % 10;
  const form = lastTwo >= 11 && lastTwo <= 14 ? forms[2] : last === 1 ? forms[0] : last >= 2 && last <= 4 ? forms[1] : forms[2];
  return `${value} ${form}`;
}

const kroner = new Intl.NumberFormat('nb-NO', {
  style: 'currency',
  currency: 'NOK',
  maximumFractionDigits: 0,
});

const number = new Intl.NumberFormat('nb-NO');

export const formatKroner = (value: number) => kroner.format(value);

export const formatNumber = (value: number) => number.format(value);

/** Hvor stor andel av budsjettet som er brukt, i prosent. */
export function utilizationPercent(spent: number, budget: number): number {
  return Math.round((spent / budget) * 100);
}

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

const norwegianDate: Intl.DateTimeFormatOptions = {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
};

/** Kampanjeperiode på lesbart norsk format. */
export function formatDate(iso: string): string {
  // Datoene kommer som 2026-06-01. Norsk visning bruker punktum.
  return new Date(iso.replace(/-/g, '.')).toLocaleDateString('nb-NO', norwegianDate);
}

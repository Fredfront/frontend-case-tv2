import type { Campaign } from '../types';

export type SortKey = 'name' | 'budget' | 'impressions';
export type SortDirection = 'asc' | 'desc';

export const sortLabels: Record<SortKey, string> = {
  name: 'Kampanje',
  budget: 'Budsjett',
  impressions: 'Visninger',
};

export function sortCampaigns(
  campaigns: Campaign[],
  key: SortKey,
  direction: SortDirection,
): Campaign[] {
  const sorted = [...campaigns].sort((a, b) =>
    key === 'name' ? a.name.localeCompare(b.name, 'nb') : a[key] - b[key],
  );

  return direction === 'asc' ? sorted : sorted.reverse();
}

import { formatKroner, formatNumber, utilizationPercent } from '../utils/format';
import { sortLabels, type SortDirection, type SortKey } from '../utils/sort';
import type { Campaign } from '../types';

interface CampaignTableProps {
  campaigns: Campaign[];
  selectedIds: string[];
  sortKey: SortKey;
  sortDirection: SortDirection;
  onToggleSort: (key: SortKey) => void;
  onToggleSelected: (id: string) => void;
  onOpenCampaign: (id: string) => void;
}

export function CampaignTable({
  campaigns,
  selectedIds,
  sortKey,
  sortDirection,
  onToggleSort,
  onToggleSelected,
  onOpenCampaign,
}: CampaignTableProps) {
  if (campaigns.length === 0) {
    return <p className="empty-state">Ingen kampanjer traff søket.</p>;
  }

  function sortableHeader(column: SortKey, className?: string) {
    return (
      <th scope="col" className={className}>
        <button
          className="sort-button"
          type="button"
          onClick={() => onToggleSort(column)}
          aria-label={`Sorter på ${sortLabels[column].toLowerCase()}`}
        >
          {sortLabels[column]}
          {column === sortKey && (
            <span aria-hidden="true">{sortDirection === 'asc' ? ' ↑' : ' ↓'}</span>
          )}
        </button>
      </th>
    );
  }

  return (
    <table className="campaign-table">
      <thead>
        <tr>
          <th scope="col" className="campaign-table__select" />
          {sortableHeader('name')}
          <th scope="col">Annonsør</th>
          {sortableHeader('budget', 'numeric')}
          <th scope="col" className="numeric">
            Forbruk
          </th>
          {sortableHeader('impressions', 'numeric')}
          <th scope="col">Status</th>
        </tr>
      </thead>
      <tbody>
        {campaigns.map((campaign) => (
          <tr key={campaign.id}>
            <td className="campaign-table__select">
              <input
                type="checkbox"
                checked={selectedIds.includes(campaign.id)}
                onChange={() => onToggleSelected(campaign.id)}
                aria-label={`Velg ${campaign.name}`}
              />
            </td>
            <td>
              <button
                className="link-button"
                type="button"
                onClick={() => onOpenCampaign(campaign.id)}
              >
                {campaign.name}
              </button>
            </td>
            <td>{campaign.advertiser}</td>
            <td className="numeric">{formatKroner(campaign.budget)}</td>
            <td className="numeric">
              {utilizationPercent(campaign.spent, campaign.budget)} %
            </td>
            <td className="numeric">{formatNumber(campaign.impressions)}</td>
            <td>
              <span className={`status-dot status-dot--${campaign.status}`} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

import { useMemo, useState } from 'react';
import { ProgressPanel } from './case/ProgressPanel';
import { CampaignDetails } from './components/CampaignDetails';
import { CampaignTable } from './components/CampaignTable';
import { SearchField } from './components/SearchField';
import { StatusFilter, type StatusFilterValue } from './components/StatusFilter';
import { useCampaigns } from './hooks/useCampaigns';
import { formatKroner } from './utils/format';
import { sortCampaigns, type SortDirection, type SortKey } from './utils/sort';

export function App() {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>('alle');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [openCampaignId, setOpenCampaignId] = useState<string | null>(null);

  const { campaigns, isLoading, error } = useCampaigns(query);

  const visibleCampaigns = useMemo(() => {
    const filtered =
      statusFilter === 'alle'
        ? campaigns
        : campaigns.filter((campaign) => campaign.status === statusFilter);

    return sortCampaigns(filtered, sortKey, sortDirection);
  }, [campaigns, statusFilter, sortKey, sortDirection]);

  const selectedBudget = campaigns
    .filter((campaign) => selectedIds.includes(campaign.id))
    .reduce((sum, campaign) => sum + campaign.budget, 0);

  function handleToggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      return;
    }

    setSortKey(key);
    setSortDirection('asc');
  }

  function handleToggleSelected(id: string) {
    const index = selectedIds.indexOf(id);

    if (index === -1) {
      selectedIds.push(id);
    } else {
      selectedIds.splice(index, 1);
    }

    setSelectedIds(selectedIds);
  }

  return (
    <div className="page">
      <header className="page__header">
        <h1>Kampanjeoversikt</h1>
        <p className="page__lead">
          Intern oversikt over annonsekampanjer. Søk, filtrer, sorter og juster budsjett.
        </p>
      </header>

      <ProgressPanel />

      <div className="toolbar">
        <SearchField value={query} onChange={setQuery} />
        <StatusFilter value={statusFilter} onChange={setStatusFilter} />
      </div>

      <p className="summary">
        {selectedIds.length} valgt · totalt budsjett {formatKroner(selectedBudget)}
      </p>

      <div className="layout">
        <main className="layout__main">
          {error && <p className="error-state">{error}</p>}
          {isLoading && <p className="loading-state">Laster kampanjer …</p>}
          {!isLoading && !error && (
            <CampaignTable
              campaigns={visibleCampaigns}
              selectedIds={selectedIds}
              sortKey={sortKey}
              sortDirection={sortDirection}
              onToggleSort={handleToggleSort}
              onToggleSelected={handleToggleSelected}
              onOpenCampaign={setOpenCampaignId}
            />
          )}
        </main>

        {openCampaignId && (
          <CampaignDetails
            campaignId={openCampaignId}
            onClose={() => setOpenCampaignId(null)}
          />
        )}
      </div>
    </div>
  );
}

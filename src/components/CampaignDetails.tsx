import { useEffect, useState } from 'react';
import { fetchCampaign } from '../api/mockApi';
import { formatKroner, formatNumber, utilizationPercent } from '../utils/format';
import { BudgetEditor } from './BudgetEditor';
import type { Campaign } from '../types';

const statusLabels = {
  aktiv: 'Aktiv',
  pauset: 'Pauset',
  avsluttet: 'Avsluttet',
};

interface CampaignDetailsProps {
  campaignId: string;
  onClose: () => void;
}

export function CampaignDetails({ campaignId, onClose }: CampaignDetailsProps) {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);

    fetchCampaign(campaignId).then((result) => {
      setCampaign(result);
      setIsLoading(false);
    });
  }, [campaignId]);

  return (
    <aside className="details" aria-label="Kampanjedetaljer">
      <div className="details__header">
        <h2>{isLoading || !campaign ? 'Laster …' : campaign.name}</h2>
        <button className="button button--ghost" type="button" onClick={onClose}>
          Lukk
        </button>
      </div>

      {campaign && !isLoading && (
        <>
          <dl className="details__list">
            <dt>Annonsør</dt>
            <dd>{campaign.advertiser}</dd>
            <dt>Status</dt>
            <dd>{statusLabels[campaign.status]}</dd>
            <dt>Periode</dt>
            <dd>
              {campaign.startDate} – {campaign.endDate}
            </dd>
            <dt>Budsjett</dt>
            <dd>{formatKroner(campaign.budget)}</dd>
            <dt>Brukt</dt>
            <dd>
              {formatKroner(campaign.spent)} (
              {utilizationPercent(campaign.spent, campaign.budget)} %)
            </dd>
            <dt>Visninger</dt>
            <dd>{formatNumber(campaign.impressions)}</dd>
          </dl>

          <BudgetEditor campaign={campaign} />
        </>
      )}
    </aside>
  );
}

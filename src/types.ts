export type CampaignStatus = 'aktiv' | 'pauset' | 'avsluttet';

export interface Campaign {
  id: string;
  name: string;
  advertiser: string;
  status: CampaignStatus;
  /** Totalt budsjett i kroner */
  budget: number;
  /** Forbrukt beløp i kroner */
  spent: number;
  impressions: number;
  startDate: string;
  endDate: string;
}

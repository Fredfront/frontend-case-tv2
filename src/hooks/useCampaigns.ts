import { useEffect, useState } from 'react';
import { fetchCampaigns } from '../api/mockApi';
import type { Campaign } from '../types';

export function useCampaigns(query: string) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);

    fetchCampaigns(query)
      .then((result) => {
        setCampaigns(result);
        setError(null);
      })
      .catch((cause: unknown) => {
        setError(cause instanceof Error ? cause.message : 'Ukjent feil');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [query]);

  return { campaigns, isLoading, error };
}

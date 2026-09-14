import type { Campaign } from '../types';

/**
 * Mocket API. Later som det er en server i andre enden, med ujevn responstid.
 * Du skal ikke trenge å endre denne filen for å løse oppgaven.
 */
const database: Campaign[] = [
  {
    id: 'k-1001',
    name: 'Sommerkampanje Play',
    advertiser: 'Nordisk Reise',
    status: 'aktiv',
    budget: 1200000,
    spent: 640000,
    impressions: 4820000,
    startDate: '2026-06-01',
    endDate: '2026-08-31',
  },
  {
    id: 'k-1002',
    name: 'Black Friday Elektro',
    advertiser: 'Strømlyn Elektro',
    status: 'pauset',
    budget: 90000,
    spent: 12500,
    impressions: 310000,
    startDate: '2026-11-14',
    endDate: '2026-11-30',
  },
  {
    id: 'k-1003',
    name: 'Nyhetssponsorat høst',
    advertiser: 'Fjordbanken',
    status: 'aktiv',
    budget: 250000,
    spent: 250000,
    impressions: 980000,
    startDate: '2026-08-15',
    endDate: '2026-12-15',
  },
  {
    id: 'k-1004',
    name: 'Vinterferie i Alpene',
    advertiser: 'Nordisk Reise',
    status: 'avsluttet',
    budget: 75000,
    spent: 74200,
    impressions: 265000,
    startDate: '2026-01-05',
    endDate: '2026-02-28',
  },
  {
    id: 'k-1005',
    name: 'Ny app-lansering',
    advertiser: 'Betal Nå',
    status: 'aktiv',
    budget: 0,
    spent: 0,
    impressions: 0,
    startDate: '2026-10-01',
    endDate: '2026-10-31',
  },
  {
    id: 'k-1006',
    name: 'Julekalender 2026',
    advertiser: 'Nærbutikken',
    status: 'aktiv',
    budget: 430000,
    spent: 88000,
    impressions: 1240000,
    startDate: '2026-11-25',
    endDate: '2026-12-24',
  },
  {
    id: 'k-1007',
    name: 'Fotball-EM opptakt',
    advertiser: 'Tippelaget',
    status: 'avsluttet',
    budget: 980000,
    spent: 961000,
    impressions: 3990000,
    startDate: '2026-04-01',
    endDate: '2026-06-14',
  },
  {
    id: 'k-1008',
    name: 'Strømpriser vinter',
    advertiser: 'Vestkraft',
    status: 'pauset',
    budget: 150000,
    spent: 45000,
    impressions: 520000,
    startDate: '2026-09-01',
    endDate: '2027-03-01',
  },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Korte søk er tunge for serveren, lange søk er lette. Spennet er bredt nok at
 * svarene rekker å komme ut av rekkefølge når noen skriver i vanlig tempo.
 * Førstegangslasting er unntatt, slik at appen ikke virker treg å åpne.
 */
const latencyFor = (query: string) => {
  const length = query.trim().length;
  if (length === 0) return 400;
  return Math.max(100, 2400 - length * 450);
};

export async function fetchCampaigns(query: string): Promise<Campaign[]> {
  await delay(latencyFor(query));

  const needle = query.trim().toLowerCase();
  const matches = needle
    ? database.filter(
        (campaign) =>
          campaign.name.toLowerCase().includes(needle) ||
          campaign.advertiser.toLowerCase().includes(needle),
      )
    : database;

  return matches.map((campaign) => ({ ...campaign }));
}

export async function fetchCampaign(id: string): Promise<Campaign> {
  await delay(300);

  const campaign = database.find((candidate) => candidate.id === id);
  if (!campaign) {
    throw new Error(`Fant ingen kampanje med id ${id}`);
  }

  return { ...campaign };
}

let saveCount = 0;

export async function saveBudget(id: string, budget: number): Promise<Campaign> {
  await delay(700);

  // Serveren er ustabil: annenhver lagring feiler.
  saveCount += 1;
  if (saveCount % 2 === 0) {
    throw new Error('Serveren svarte 503. Prøv igjen.');
  }

  const campaign = database.find((candidate) => candidate.id === id);
  if (!campaign) {
    throw new Error(`Fant ingen kampanje med id ${id}`);
  }

  campaign.budget = budget;
  return { ...campaign };
}

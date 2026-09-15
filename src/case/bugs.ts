import { utilizationPercent } from '../utils/format';
import { sortCampaigns } from '../utils/sort';
import type { Campaign } from '../types';

/**
 * Definisjonen av oppgaven. Denne mappa er stillaset rundt caset, ikke en del
 * av appen du skal feilsøke – du trenger ikke endre noe her.
 */
export type Priority = 'Kritisk' | 'Høy' | 'Middels' | 'Lav';

export interface BugDefinition {
  id: string;
  /** Saksnummer, slik planleggerne refererer til den. */
  key: string;
  number: number;
  title: string;
  priority: Priority;
  /** Hvem som meldte saken, og i hvilken rolle. */
  reporter: string;
  /** Rapporten slik den ble skrevet. Vag med vilje – det er poenget. */
  report: string;
  /** Hvordan du reproduserer feilen, og dermed hvordan du vet at den er rettet. */
  reproduce: string;
  /**
   * Finnes bare på punkter appen kan verifisere selv. Mangler den, huker du av
   * punktet manuelt.
   */
  verify?: () => boolean;
}

export const prioritySlug: Record<Priority, string> = {
  Kritisk: 'kritisk',
  Høy: 'hoy',
  Middels: 'middels',
  Lav: 'lav',
};

function utilizationIsFixed(): boolean {
  // Kravet er bare at et budsjett på 0 ikke lenger gir NaN. Om du returnerer
  // null, 0 eller noe annet er en avveiing vi heller diskuterer.
  const zeroBudget = utilizationPercent(0, 0) as unknown;
  if (typeof zeroBudget === 'number' && Number.isNaN(zeroBudget)) return false;

  // …og at vanlige tilfeller fortsatt regnes riktig.
  const normal = utilizationPercent(60, 200) as unknown;
  if (typeof normal === 'number' && normal !== 30) return false;

  const table = document.querySelector('.campaign-table');
  return !(table?.textContent ?? '').includes('NaN');
}

function budgetSortIsFixed(): boolean {
  // Bare rekkefølgen sjekkes. Om kandidaten skiller på type, bruker
  // localeCompare med numeric: true eller noe helt annet er likegyldig.
  const sample = [150000, 1200000, 0, 90000].map(
    (budget) => ({ budget }) as unknown as Campaign,
  );

  const ascending = sortCampaigns(sample, 'budget', 'asc').map((item) => item.budget);
  if (ascending.join() !== '0,90000,150000,1200000') return false;

  const descending = sortCampaigns(sample, 'budget', 'desc').map((item) => item.budget);
  return descending.join() === '1200000,150000,90000,0';
}

function searchFieldHasAccessibleName(): boolean {
  const input = document.querySelector<HTMLInputElement>(
    '.search-field input, .search-field__input',
  );
  if (!input) return false;

  const hasLabelElement = (input.labels?.length ?? 0) > 0;
  const hasAriaLabel =
    !!input.getAttribute('aria-label')?.trim() || !!input.getAttribute('aria-labelledby');

  return hasLabelElement || hasAriaLabel;
}

function statusIsNotColourOnly(): boolean {
  const cells = Array.from(
    document.querySelectorAll('.campaign-table tbody tr > td:last-child'),
  );
  if (cells.length === 0) return false;

  return cells.every((cell) => {
    // textContent fanger også visuelt skjult tekst, som er en gyldig løsning.
    const hasText = (cell.textContent ?? '').trim().length > 0;
    const hasAccessibleName =
      !!cell.getAttribute('aria-label')?.trim() ||
      !!cell.querySelector('[aria-label]:not([aria-label=""])');

    return hasText || hasAccessibleName;
  });
}

function screenReaderInfoIsFixed(): boolean {
  return searchFieldHasAccessibleName() && statusIsNotColourOnly();
}

export const bugs: BugDefinition[] = [
  {
    id: 'search-race',
    key: 'ADWB-4471',
    number: 1,
    title: 'Søk gir feil treff',
    priority: 'Middels',
    reporter: 'Marte, kampanjeplanlegger',
    report:
      'Jeg søkte opp nyhetssponsoratet for å sjekke budsjettet, men fikk opp en haug med helt andre kampanjer i stedet. Hvis jeg skriver sakte ser det ut til å gå bedre? Skjønner ikke helt hva som skjer.',
    reproduce:
      'Skriv «nyhet» i søkefeltet uten å stoppe mellom tegnene, og se hva lista lander på. Følg med: den kan vise det riktige treffet et øyeblikk før det blir overskrevet.',
  },
  {
    id: 'selection-state',
    key: 'ADWB-4488',
    number: 2,
    title: 'Kan ikke velge flere kampanjer',
    priority: 'Høy',
    reporter: 'Marte, kampanjeplanlegger',
    report:
      'Jeg skal hente ut samlet budsjett for fire kampanjer til møtet i morgen tidlig. Krysser av i lista, men telleren over tabellen står bare på «0 valgt». Har prøvd i både Chrome og Safari. Må jeg regne det ut manuelt?',
    reproduce: 'Kryss av en rad og se om teksten over tabellen teller opp.',
  },
  {
    id: 'details-stale',
    key: 'ADWB-4455',
    number: 3,
    title: 'Detaljpanelet viser forrige kampanje',
    priority: 'Høy',
    reporter: 'Henrik, trafikkansvarlig',
    report:
      'Jeg klikker på en kampanje og ingenting skjer. Klikker jeg på en annen etterpå, spretter panelet opp – men da med den forrige kampanjen i stedet. Panelet ligger altså alltid ett klikk bak. Jeg var veldig nær å endre budsjettet på feil kampanje i dag. Dette er litt skummelt.',
    reproduce:
      'Klikk på «Fotball-EM opptakt», og deretter på «Julekalender 2026». Hvilken kampanje står i panelet til høyre?',
  },
  {
    id: 'save-error',
    key: 'ADWB-4491',
    number: 4,
    title: 'Vet ikke om budsjettet ble lagret',
    priority: 'Kritisk',
    reporter: 'Marte, kampanjeplanlegger',
    report:
      'Jeg endret budsjettet på julekalenderen. Knappen sa «Lagrer …» og der står den fortsatt, tjue minutter senere. Er det lagret eller ikke? Jeg tør ikke prøve på nytt i tilfelle det blir lagret to ganger.',
    reproduce:
      'Lagre et budsjett to ganger. Andre forsøk feiler på serveren – får du beskjed, og blir knappen brukbar igjen?',
  },
  {
    id: 'nan-percent',
    key: 'ADWB-4417',
    number: 5,
    title: 'Det står «NaN %» på en kampanje',
    priority: 'Høy',
    reporter: 'Sofie, kampanjeplanlegger',
    report:
      'Det står «NaN %» i forbrukskolonnen på app-lanseringen jeg opprettet i går. Hva betyr NaN? Er det noe jeg har gjort feil da jeg satte den opp? Kampanjen har ikke fått budsjett ennå, hvis det har noe å si.',
    reproduce: 'Se på raden «Ny app-lansering».',
    verify: utilizationIsFixed,
  },
  {
    id: 'budget-sort',
    key: 'ADWB-4402',
    number: 6,
    title: 'Sortering på budsjett gir feil rekkefølge',
    priority: 'Middels',
    reporter: 'Anders, controller',
    report:
      'Jeg sorterer på budsjett for å finne de største kampanjene, men rekkefølgen blir helt tilfeldig. Kampanjen på 1,2 millioner havner mellom 0 kr og 150 000 kr, og visninger oppfører seg like rart. Jeg tør ikke prioritere ut fra en liste jeg ikke kan stole på rekkefølgen i.',
    reproduce:
      'Klikk «Budsjett» i tabellhodet og les kolonnen ovenfra og ned. Sjekk «Visninger» også.',
    verify: budgetSortIsFixed,
  },
  {
    id: 'date-format',
    key: 'ADWB-4520',
    number: 7,
    title: 'Det står «Invalid Date» i perioden',
    priority: 'Middels',
    reporter: 'Ingrid, salgskoordinator',
    report:
      'Når jeg åpner en kampanje står det bare «Invalid Date – Invalid Date» der perioden skal være. Henrik sitter rett ved siden av meg, og på skjermen hans ser de samme kampanjene helt riktige ut. Er det noe galt med maskinen min? Jeg bruker Safari, hvis det har noe å si.',
    reproduce:
      'Åpne en kampanje og les feltet «Periode» i detaljpanelet. Sjekk i mer enn én nettleser – saken er meldt fra Safari.',
  },
];

export const autoVerifiedCount = bugs.filter((bug) => bug.verify).length;

/**
 * Saker som ikke er feil, men som krever en vurdering. De teller ikke i
 * framdriften – her er konklusjonen din poenget, ikke en kodeendring.
 */
export interface ReviewTicket {
  id: string;
  key: string;
  title: string;
  kind: 'Trenger avklaring' | 'Krav';
  priority: Priority;
  reporter: string;
  report: string;
  task: string;
  /** Varsler hvis en retting har innført en regresjon. */
  regression?: () => string | null;
}

function utilizationRegression(): string | null {
  const full = utilizationPercent(250000, 250000) as unknown;
  const half = utilizationPercent(60, 200) as unknown;

  if (typeof full === 'number' && full !== 100) {
    return `Nyhetssponsorat høst viser nå ${full} % i stedet for 100 %. Du har endret forbruksberegningen – var saken egentlig en feil?`;
  }

  if (typeof half === 'number' && half !== 30) {
    return `En kampanje med 60 av 200 kr brukt viser nå ${half} % i stedet for 30 %. Forbruksberegningen er ikke lenger riktig.`;
  }

  return null;
}

export const reviewTickets: ReviewTicket[] = [
  {
    id: 'utilization-question',
    key: 'ADWB-4508',
    title: 'Forbruket på nyhetssponsoratet ser feil ut',
    kind: 'Trenger avklaring',
    priority: 'Middels',
    reporter: 'Jonas, salgssjef',
    report:
      'Nyhetssponsorat høst står med 100 % forbruk, men kampanjen går helt til midten av desember. Det tallet kan ikke være riktig – vi har jo ikke brukt opp hele budsjettet ennå. Kan noen rette det?',
    task: 'Undersøk nyhetssponsorar budsjett og brukt budsjett.',
    regression: utilizationRegression,
  },
];

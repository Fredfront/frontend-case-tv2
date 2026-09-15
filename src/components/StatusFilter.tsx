import type { CampaignStatus } from '../types';

export type StatusFilterValue = CampaignStatus | 'alle';

const options: { value: StatusFilterValue; label: string }[] = [
  { value: 'alle', label: 'Alle' },
  { value: 'aktiv', label: 'Aktive' },
  { value: 'pauset', label: 'Pausede' },
  { value: 'avsluttet', label: 'Avsluttede' },
];

interface StatusFilterProps {
  value: StatusFilterValue;
  onChange: (value: StatusFilterValue) => void;
}

export function StatusFilter({ value, onChange }: StatusFilterProps) {
  return (
    <div className="status-filter">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`chip ${option.value === value ? 'chip--selected' : ''}`}
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

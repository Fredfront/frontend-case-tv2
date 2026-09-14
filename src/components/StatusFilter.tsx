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
        <div
          key={option.value}
          className={`chip ${option.value === value ? 'chip--selected' : ''}`}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </div>
      ))}
    </div>
  );
}

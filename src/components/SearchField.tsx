interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchField({ value, onChange }: SearchFieldProps) {
  return (
    <div className="search-field">
      <input
        className="search-field__input"
        type="text"
        placeholder="Søk etter kampanje eller annonsør"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

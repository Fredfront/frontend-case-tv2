import { useState } from 'react';
import { saveBudget } from '../api/mockApi';
import type { Campaign } from '../types';

interface BudgetEditorProps {
  campaign: Campaign;
}

export function BudgetEditor({ campaign }: BudgetEditorProps) {
  const [value, setValue] = useState(String(campaign.budget));
  const [isSaving, setIsSaving] = useState(false);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsSaving(true);

    saveBudget(campaign.id, Number(value)).then(() => {
      setIsSaving(false);
    });
  }

  return (
    <form className="budget-editor" onSubmit={handleSubmit}>
      <label className="budget-editor__label" htmlFor="budget">
        Nytt budsjett (kr)
      </label>
      <div className="budget-editor__row">
        <input
          id="budget"
          className="budget-editor__input"
          type="number"
          min={0}
          step={1000}
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
        <button className="button" type="submit" disabled={isSaving}>
          {isSaving ? 'Lagrer …' : 'Lagre'}
        </button>
      </div>
    </form>
  );
}

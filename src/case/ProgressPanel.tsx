import { useEffect, useState } from 'react';
import { autoVerifiedCount, bugs, prioritySlug, reviewTickets } from './bugs';
import './case.css';

const STORAGE_KEY = 'case-progress-manual-v1';
const HANDLED_KEY = 'case-progress-handled-v1';
const OPEN_KEY = 'case-progress-open-v1';

function readManualProgress(): string[] {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

function readHandled(): string[] {
  try {
    const stored = window.localStorage.getItem(HANDLED_KEY);
    if (!stored) return [];
    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

function runRegressionWarnings(): Record<string, string> {
  const warnings: Record<string, string> = {};

  for (const ticket of reviewTickets) {
    if (!ticket.regression) continue;
    try {
      const warning = ticket.regression();
      if (warning) warnings[ticket.id] = warning;
    } catch {
      // En regresjonssjekk skal aldri velte panelet.
    }
  }

  return warnings;
}

function runAutomaticChecks(): string[] {
  return bugs
    .filter((bug) => {
      if (!bug.verify) return false;
      try {
        return bug.verify();
      } catch {
        return false;
      }
    })
    .map((bug) => bug.id);
}

const sameIds = (a: string[], b: string[]) =>
  a.length === b.length && a.every((id, index) => id === b[index]);

/**
 * Framdriftspanel for case-oppgaven. All state bor bevisst inne i denne
 * komponenten, slik at den periodiske sjekken ikke rendrer resten av appen på
 * nytt – det ville skjult en av feilene du skal finne.
 */
export function ProgressPanel() {
  const [manualIds, setManualIds] = useState<string[]>(readManualProgress);
  const [autoIds, setAutoIds] = useState<string[]>([]);
  const [warnings, setWarnings] = useState<Record<string, string>>({});
  const [handledIds, setHandledIds] = useState<string[]>(readHandled);
  const [isOpen, setIsOpen] = useState(
    () => window.localStorage.getItem(OPEN_KEY) !== 'false',
  );

  useEffect(() => {
    function check() {
      const passing = runAutomaticChecks();
      setAutoIds((current) => (sameIds(current, passing) ? current : passing));

      const next = runRegressionWarnings();
      setWarnings((current) =>
        JSON.stringify(current) === JSON.stringify(next) ? current : next,
      );
    }

    check();
    const timer = window.setInterval(check, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(manualIds));
  }, [manualIds]);

  useEffect(() => {
    window.localStorage.setItem(HANDLED_KEY, JSON.stringify(handledIds));
  }, [handledIds]);

  useEffect(() => {
    window.localStorage.setItem(OPEN_KEY, String(isOpen));
  }, [isOpen]);

  function toggleManual(id: string) {
    setManualIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  function toggleHandled(id: string) {
    setHandledIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  function reset() {
    setManualIds([]);
    setHandledIds([]);
  }

  const isFixed = (id: string) => autoIds.includes(id) || manualIds.includes(id);
  const fixedCount = bugs.filter((bug) => isFixed(bug.id)).length;
  const percent = Math.round((fixedCount / bugs.length) * 100);
  const isComplete = fixedCount === bugs.length;

  return (
    <section
      className={`case ${isComplete ? 'case--complete' : ''}`}
      aria-label="Oppgave"
    >
      <div className="case__top">
        <h2 className="case__title">
          <span className="case__title-icon" aria-hidden="true">
            🐛
          </span>
          Feilsøkingsoppdrag
        </h2>

        <p className="case__count" role="status">
          {fixedCount} av {bugs.length} rettet
        </p>

        <button
          className="case__toggle"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
        >
          {isOpen ? 'Skjul' : 'Vis'}
        </button>
      </div>

      <div
        className="case__bar"
        role="progressbar"
        aria-valuenow={fixedCount}
        aria-valuemin={0}
        aria-valuemax={bugs.length}
        aria-label="Framdrift"
      >
        <div className="case__bar-fill" style={{ width: `${percent}%` }} />
      </div>

      {isOpen && (
        <>
          {isComplete ? (
            <p className="case__lead case__lead--done">
              <span aria-hidden="true">🎉</span> Alle {bugs.length} rettet. Godt jobbet!
            </p>
          ) : (
            <p className="case__lead">
              Appen har {bugs.length} innebygde feil. {autoVerifiedCount} av dem sjekker
              appen selv – de huker seg av når rettingen din virker. De øvrige{' '}
              {bugs.length - autoVerifiedCount} må du verifisere og huke av selv.
            </p>
          )}

          <ul className="board">
            {bugs.map((bug) => {
              const fixed = isFixed(bug.id);
              const isAutomatic = Boolean(bug.verify);
              const inputId = `case-${bug.id}`;

              return (
                <li key={bug.id} className={`ticket ${fixed ? 'ticket--fixed' : ''}`}>
                  <div className="ticket__head">
                    <span className="ticket__type" aria-hidden="true">
                      🐞
                    </span>
                    <span className="ticket__key">{bug.key}</span>
                    <span
                      className={`ticket__priority ticket__priority--${prioritySlug[bug.priority]}`}
                    >
                      {bug.priority}
                    </span>
                    <span
                      className={`ticket__status ${fixed ? 'ticket__status--fixed' : ''}`}
                    >
                      {fixed ? 'Løst' : 'Åpen'}
                    </span>
                  </div>

                  <h3 className="ticket__title">{bug.title}</h3>

                  <blockquote className="ticket__report">{bug.report}</blockquote>

                  <p className="ticket__reporter">Meldt av {bug.reporter}</p>

                  <div className="ticket__foot">
                    <p className="ticket__test">
                      <span className="ticket__test-label">Slik tester du</span>
                      {bug.reproduce}
                    </p>

                    {isAutomatic ? (
                      <p className={`ticket__auto ${fixed ? 'ticket__auto--fixed' : ''}`}>
                        {fixed ? '✓ Verifisert automatisk' : 'Verifiseres automatisk'}
                      </p>
                    ) : (
                      <label className="ticket__check" htmlFor={inputId}>
                        <input
                          id={inputId}
                          type="checkbox"
                          checked={fixed}
                          onChange={() => toggleManual(bug.id)}
                        />
                        Markér som løst
                      </label>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="review">
            <h3 className="review__heading">
              Krever en vurdering
              <span className="review__note">teller ikke i framdriften</span>
            </h3>

            <ul className="board">
              {reviewTickets.map((ticket) => {
                const handled = handledIds.includes(ticket.id);
                const warning = warnings[ticket.id];
                const inputId = `case-${ticket.id}`;

                return (
                  <li
                    key={ticket.id}
                    className={`ticket ticket--review ${handled ? 'ticket--handled' : ''}`}
                  >
                    <div className="ticket__head">
                      <span className="ticket__type" aria-hidden="true">
                        {ticket.kind === 'Krav' ? '📋' : '❓'}
                      </span>
                      <span className="ticket__key">{ticket.key}</span>
                      <span
                        className={`ticket__priority ticket__priority--${prioritySlug[ticket.priority]}`}
                      >
                        {ticket.priority}
                      </span>
                      <span className="ticket__status ticket__status--review">
                        {ticket.kind}
                      </span>
                    </div>

                    <h4 className="ticket__title">{ticket.title}</h4>

                    <blockquote className="ticket__report">{ticket.report}</blockquote>

                    <p className="ticket__reporter">Meldt av {ticket.reporter}</p>

                    {warning && (
                      <p className="ticket__warning" role="status">
                        <span aria-hidden="true">⚠</span> {warning}
                      </p>
                    )}

                    <div className="ticket__foot">
                      <p className="ticket__test">
                        <span className="ticket__test-label">Oppgaven din</span>
                        {ticket.task}
                      </p>

                      <label className="ticket__check" htmlFor={inputId}>
                        <input
                          id={inputId}
                          type="checkbox"
                          checked={handled}
                          onChange={() => toggleHandled(ticket.id)}
                        />
                        Behandlet
                      </label>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="case__footer">
            <p className="case__footer-note">
              Detaljene for hver feil står i <code>README.md</code>.
            </p>
            <button className="case__reset" type="button" onClick={reset}>
              Nullstill avkryssing
            </button>
          </div>
        </>
      )}
    </section>
  );
}

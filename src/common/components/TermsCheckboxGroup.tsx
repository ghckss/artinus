import type { TermConfig } from '@/config/serviceTypes';

interface TermsCheckboxGroupProps {
  terms: TermConfig[];
  termState: Record<string, boolean>;
  allChecked: boolean;
  onToggleTerm: (key: string, checked: boolean) => void;
  onToggleAll: (checked: boolean) => void;
}

export function TermsCheckboxGroup({
  terms,
  termState,
  allChecked,
  onToggleTerm,
  onToggleAll
}: TermsCheckboxGroupProps) {
  return (
    <section className="terms-group form-section" aria-labelledby="terms-heading">
      <h2 className="form-section-title" id="terms-heading">
        약관 동의
      </h2>

      <label className="terms-row terms-all">
        <input
          type="checkbox"
          checked={allChecked}
          onChange={(event) => onToggleAll(event.target.checked)}
        />
        <span className="terms-text">전체 약관에 동의합니다</span>
      </label>

      <div className="terms-list">
        {terms.map((term) => (
          <label key={term.key} className="terms-row">
            <input
              type="checkbox"
              checked={termState[term.key]}
              onChange={(event) => onToggleTerm(term.key, event.target.checked)}
            />
            <span className="terms-text">{term.label}</span>
            <span className={`terms-badge ${term.required ? 'required' : 'optional'}`}>
              {term.required ? '필수' : '선택'}
            </span>
          </label>
        ))}
      </div>
    </section>
  );
}

export interface SubmitRequirement {
  label: string;
  done: boolean;
}

interface SubmitSectionProps {
  canSubmit: boolean;
  requirements: SubmitRequirement[];
  onSubmit: () => void;
}

export function SubmitSection({ canSubmit, requirements, onSubmit }: SubmitSectionProps) {
  return (
    <section className="submit-section form-section">
      {!canSubmit ? (
        <ul className="submit-checklist" aria-label="가입 조건">
          {requirements.map((requirement) => (
            <li key={requirement.label} data-done={requirement.done}>
              {requirement.label}
            </li>
          ))}
        </ul>
      ) : null}
      <button type="button" className="submit-button" disabled={!canSubmit} onClick={onSubmit}>
        가입하기
      </button>
      <p className="submit-hint">
        {canSubmit ? '모든 가입 조건을 충족했습니다.' : '남은 조건을 완료하면 가입할 수 있습니다.'}
      </p>
    </section>
  );
}

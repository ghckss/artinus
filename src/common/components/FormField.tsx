import type { InputFieldConfig } from '@/common/Types';

export interface FieldRendererProps {
  field: InputFieldConfig;
  value: string;
  error?: string | null;
  onChange: (value: string) => void;
  onBlur?: () => void;
}

/** 텍스트 계열(text/password/date/tel/email) 입력을 처리하는 기본 렌더러. */
export function FormField({ field, value, error, onChange, onBlur }: FieldRendererProps) {
  const errorId = `${field.key}-error`;
  const hasError = Boolean(error);

  return (
    <div className="form-field">
      <label htmlFor={field.key}>
        {field.label}
        {field.required ? (
          <span className="field-required" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>
      <input
        id={field.key}
        name={field.key}
        type={field.type}
        placeholder={field.placeholder}
        value={value}
        required={field.required}
        aria-invalid={hasError}
        aria-describedby={hasError ? errorId : undefined}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
      />
      {hasError ? (
        <p className="field-error" id={errorId} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

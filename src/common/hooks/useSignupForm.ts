import { useMemo, useState } from 'react';
import type { FieldConfig, InputFieldConfig } from '@/config/serviceTypes';

export type FormState = Record<string, string>;
export type FormErrors = Record<string, string | null>;

/** 휴대폰 인증을 제외한 일반 입력 필드의 값/검증 상태를 관리한다. */
export function useSignupForm(allFields: FieldConfig[]) {
  const fields = useMemo(
    () => allFields.filter((field): field is InputFieldConfig => field.type !== 'phone'),
    [allFields]
  );

  const initialValues = useMemo(
    () => fields.reduce<FormState>((acc, field) => ({ ...acc, [field.key]: '' }), {}),
    [fields]
  );

  const [values, setValues] = useState<FormState>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});

  const updateField = (key: string, value: string) => {
    const next = { ...values, [key]: value };
    setValues(next);
    setErrors((current) => {
      // 편집 중인 필드는 에러를 비우고(입력 중 방해 방지), 이미 값이 있는 다른 필드는
      // 새 값 기준으로 재검증한다. 비밀번호 변경 시 비밀번호 확인 일치 여부가 즉시 갱신된다.
      const recomputed: FormErrors = { ...current, [key]: null };
      fields.forEach((field) => {
        if (field.key === key) return;
        if ((next[field.key] ?? '').length > 0) {
          recomputed[field.key] = resolveFieldError(field, next);
        }
      });
      return recomputed;
    });
  };

  const resolveFieldError = (field: InputFieldConfig, currentValues: FormState): string | null => {
    const value = currentValues[field.key] ?? '';
    if (field.required && !value.trim()) {
      return `${field.label}은(는) 필수 항목입니다.`;
    }
    for (const rule of field.rules ?? []) {
      const error = rule(value, currentValues);
      if (error) return error;
    }
    return null;
  };

  const validateField = (key: string) => {
    const field = fields.find((item) => item.key === key);
    if (!field) return;
    setErrors((current) => ({ ...current, [key]: resolveFieldError(field, values) }));
  };

  const validate = () => {
    const nextErrors: FormErrors = {};

    fields.forEach((field) => {
      const error = resolveFieldError(field, values);
      if (error) nextErrors[field.key] = error;
    });

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  /** 제출 버튼 활성화 판단용: 현재 값 기준 모든 입력 필드가 유효한지. */
  const isValid = useMemo(
    () => fields.every((field) => !resolveFieldError(field, values)),
    [fields, values]
  );

  const getFieldError = (key: string) => errors[key] ?? null;

  return {
    values,
    errors,
    updateField,
    validate,
    validateField,
    getFieldError,
    isValid
  };
}

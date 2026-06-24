import type { ValidationRule } from '../types/service';

/**
 * 재사용 가능한 검증 규칙 모음.
 * 필드 설정에서 `rules: [minLength(8), ...]` 형태로 조합해 선언적으로 검증을 구성한다.
 * 빈 값(선택 입력 미작성)은 각 규칙에서 통과시키고, 필수 여부는 폼 훅이 별도로 처리한다.
 */

export const minLength = (length: number, message?: string): ValidationRule => (value) => {
  if (!value) return null;
  return value.length >= length ? null : message ?? `최소 ${length}자 이상 입력해주세요.`;
};

export const matches = (targetKey: string, message: string): ValidationRule => (value, values) => {
  if (!value) return null;
  return value === values[targetKey] ? null : message;
};

export const pattern = (regExp: RegExp, message: string): ValidationRule => (value) => {
  if (!value) return null;
  return regExp.test(value) ? null : message;
};

export const minAge = (years: number, message?: string): ValidationRule => (value) => {
  if (!value) return null;
  const birth = new Date(value);
  if (Number.isNaN(birth.getTime())) return '유효한 날짜를 입력해주세요.';

  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }

  return age >= years ? null : message ?? `만 ${years}세 이상만 가입할 수 있습니다.`;
};

/** 입력값 검증 규칙. 여러 규칙을 조합해 필드 검증을 선언적으로 구성한다. */
export type ValidationRule = (value: string, values: Record<string, string>) => string | null;

/** 일반 입력 필드 타입. 새 타입은 fields 렌더러 레지스트리에 등록하면 추가된다. */
export type InputFieldType = 'text' | 'password' | 'date' | 'tel' | 'email';

export interface InputFieldConfig {
  key: string;
  label: string;
  type: InputFieldType;
  placeholder?: string;
  required: boolean;
  rules?: ValidationRule[];
}

/** 휴대폰 인증 블록. 일반 입력과 상태 모델이 달라 별도 타입으로 둔다. */
export interface PhoneFieldConfig {
  key: string;
  label: string;
  type: 'phone';
  required: boolean;
}

/** 폼에 노출되는 항목. type을 판별자로 쓰는 discriminated union. */
export type FieldConfig = InputFieldConfig | PhoneFieldConfig;

export interface TermConfig {
  key: string;
  label: string;
  required: boolean;
  description?: string;
}

export interface ServiceConfig {
  name: string;
  title: string;
  bannerText: string;
  bannerIcon?: string;
  themeColor: string;
  /** 화면에 노출되는 순서 그대로 정의한다(휴대폰 인증 위치 포함). */
  fields: FieldConfig[];
  terms: TermConfig[];
}

import type { FC } from 'react';
import { FormField, type FieldRendererProps } from '@/common/components/FormField';
import type { InputFieldType } from '@/config/serviceTypes';

/**
 * 입력 타입 → 렌더러 매핑.
 * 새 입력 타입(select, checkbox 등)을 추가할 때는 전용 렌더러를 만들어 여기에 등록하면 된다.
 * 텍스트 계열은 input의 type 속성만 다르므로 FormField 하나가 공통 처리한다.
 */
export const fieldRenderers: Record<InputFieldType, FC<FieldRendererProps>> = {
  text: FormField,
  password: FormField,
  date: FormField,
  tel: FormField,
  email: FormField
};

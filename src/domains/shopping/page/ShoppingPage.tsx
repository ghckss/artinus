import { SignupForm } from '@/common/components/SignupForm';
import type { ServiceConfig } from '@/common/Types';
import { matches, minAge, minLength } from '@/common/rules';

/** 쇼핑 멤버십 도메인 회원가입 설정. */
const shoppingService: ServiceConfig = {
  name: 'shopping',
  title: '쇼핑 멤버십 회원가입',
  bannerText: '특별한 혜택을 지금 만나보세요.',
  bannerIcon: '🟠',
  themeColor: '#ea580c',
  fields: [
    { key: 'id', label: '아이디', type: 'text', placeholder: '아이디를 입력하세요', required: true },
    {
      key: 'password',
      label: '비밀번호',
      type: 'password',
      placeholder: '비밀번호를 입력하세요',
      required: true,
      rules: [minLength(8, '비밀번호는 최소 8자 이상이어야 합니다.')]
    },
    {
      key: 'confirmPassword',
      label: '비밀번호 확인',
      type: 'password',
      placeholder: '비밀번호를 다시 입력하세요',
      required: true,
      rules: [matches('password', '비밀번호가 일치하지 않습니다.')]
    },
    {
      key: 'birthDate',
      label: '생년월일',
      type: 'date',
      placeholder: '생년월일을 입력하세요',
      required: true,
      rules: [minAge(14)]
    },
    { key: 'phone', label: '휴대폰 인증', type: 'phone', required: true }
  ],
  terms: [
    { key: 'termsOfService', label: '서비스 이용약관 동의', required: true },
    { key: 'privacyPolicy', label: '개인정보 수집 및 이용 동의', required: true },
    { key: 'ageConfirmation', label: '만 14세 이상입니다', required: true },
    { key: 'marketing', label: '마케팅 수신 동의', required: false }
  ]
};

/** 쇼핑 멤버십 도메인 회원가입 페이지. */
export function ShoppingPage() {
  return <SignupForm service={shoppingService} />;
}

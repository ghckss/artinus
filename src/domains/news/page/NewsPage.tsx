import { SignupForm } from '@/common/components/SignupForm';
import type { ServiceConfig } from '@/common/Types';
import { matches, minLength } from '@/common/rules';

/** 뉴스 구독 도메인 회원가입 설정. 휴대폰 인증을 가장 먼저 노출한다. */
const newsService: ServiceConfig = {
  name: 'news',
  title: '뉴스 구독 회원가입',
  bannerText: '최신 뉴스를 빠르게 받아보세요.',
  bannerIcon: '🟢',
  themeColor: '#15803d',
  fields: [
    { key: 'phone', label: '휴대폰 인증', type: 'phone', required: true },
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
    }
  ],
  terms: [
    { key: 'termsOfService', label: '서비스 이용약관 동의', required: true },
    { key: 'privacyPolicy', label: '개인정보 수집 및 이용 동의', required: true },
    { key: 'marketing', label: '마케팅 수신 동의', required: false }
  ]
};

/** 뉴스 구독 도메인 회원가입 페이지. */
export function NewsPage() {
  return <SignupForm service={newsService} />;
}

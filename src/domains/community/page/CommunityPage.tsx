import { SignupForm } from '@/common/components/SignupForm';
import type { ServiceConfig } from '@/common/Types';
import { matches, minLength } from '@/common/rules';

/** 커뮤니티 도메인 회원가입 설정. */
const communityService: ServiceConfig = {
  name: 'community',
  title: '커뮤니티 회원가입',
  bannerText: '우리 커뮤니티에서 새로운 시작을 해보세요.',
  bannerIcon: '🟣',
  themeColor: '#6b21a8',
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
    { key: 'phone', label: '휴대폰 인증', type: 'phone', required: true }
  ],
  terms: [
    { key: 'termsOfService', label: '서비스 이용약관 동의', required: true },
    { key: 'privacyPolicy', label: '개인정보 수집 및 이용 동의', required: true }
  ]
};

/** 커뮤니티 도메인 회원가입 페이지. */
export function CommunityPage() {
  return <SignupForm service={communityService} />;
}

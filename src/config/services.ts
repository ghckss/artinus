import type { InputFieldConfig, PhoneFieldConfig, ServiceConfig } from '../types/service';
import { matches, minAge, minLength } from '../validation/rules';

/**
 * 공통 필드 정의. 서비스 설정에서 재사용하며, 순서는 각 서비스의 fields 배열에서 결정한다.
 * 휴대폰 인증(phone)도 하나의 필드로 취급하므로 서비스마다 노출 위치를 자유롭게 바꿀 수 있다.
 */
const fields = {
  id: {
    key: 'id',
    label: '아이디',
    type: 'text',
    placeholder: '아이디를 입력하세요',
    required: true
  },
  password: {
    key: 'password',
    label: '비밀번호',
    type: 'password',
    placeholder: '비밀번호를 입력하세요',
    required: true,
    rules: [minLength(8, '비밀번호는 최소 8자 이상이어야 합니다.')]
  },
  confirmPassword: {
    key: 'confirmPassword',
    label: '비밀번호 확인',
    type: 'password',
    placeholder: '비밀번호를 다시 입력하세요',
    required: true,
    rules: [matches('password', '비밀번호가 일치하지 않습니다.')]
  },
  birthDate: {
    key: 'birthDate',
    label: '생년월일',
    type: 'date',
    placeholder: '생년월일을 입력하세요',
    required: true,
    rules: [minAge(14)]
  },
  phone: {
    key: 'phone',
    label: '휴대폰 인증',
    type: 'phone',
    required: true
  }
} satisfies Record<string, InputFieldConfig | PhoneFieldConfig>;

export const services: Record<string, ServiceConfig> = {
  community: {
    name: 'community',
    title: '커뮤니티 회원가입',
    bannerText: '우리 커뮤니티에서 새로운 시작을 해보세요.',
    bannerIcon: '🟣',
    themeColor: '#6b21a8',
    fields: [fields.id, fields.password, fields.confirmPassword, fields.phone],
    terms: [
      { key: 'termsOfService', label: '서비스 이용약관 동의', required: true },
      { key: 'privacyPolicy', label: '개인정보 수집 및 이용 동의', required: true }
    ]
  },
  news: {
    name: 'news',
    title: '뉴스 구독 회원가입',
    bannerText: '최신 뉴스를 빠르게 받아보세요.',
    bannerIcon: '🟢',
    themeColor: '#15803d',
    // 뉴스 서비스는 휴대폰 인증을 가장 먼저 노출한다.
    fields: [fields.phone, fields.password, fields.confirmPassword],
    terms: [
      { key: 'termsOfService', label: '서비스 이용약관 동의', required: true },
      { key: 'privacyPolicy', label: '개인정보 수집 및 이용 동의', required: true },
      { key: 'marketing', label: '마케팅 수신 동의', required: false }
    ]
  },
  shopping: {
    name: 'shopping',
    title: '쇼핑 멤버십 회원가입',
    bannerText: '특별한 혜택을 지금 만나보세요.',
    bannerIcon: '🟠',
    themeColor: '#ea580c',
    fields: [fields.id, fields.password, fields.confirmPassword, fields.birthDate, fields.phone],
    terms: [
      { key: 'termsOfService', label: '서비스 이용약관 동의', required: true },
      { key: 'privacyPolicy', label: '개인정보 수집 및 이용 동의', required: true },
      { key: 'ageConfirmation', label: '만 14세 이상입니다', required: true },
      { key: 'marketing', label: '마케팅 수신 동의', required: false }
    ]
  }
};

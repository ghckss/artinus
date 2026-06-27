import { PageLayout } from '@/common/components/PageLayout';
import { FormField } from '@/common/components/FormField';
import { PhoneVerification } from '@/common/components/PhoneVerification';
import { TermsCheckboxGroup } from '@/common/components/TermsCheckboxGroup';
import { SubmitSection } from '@/common/components/SubmitSection';
import type { SubmitRequirement } from '@/common/components/SubmitSection';
import { useSignupForm } from '@/common/hooks/useSignupForm';
import { usePhoneVerification } from '@/common/hooks/usePhoneVerification';
import { useTermsSync } from '@/common/hooks/useTermsSync';
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

/** 커뮤니티 도메인 회원가입 페이지. 공통 컴포넌트/훅을 직접 조합한다. */
export function CommunityPage() {
  const service = communityService;
  const form = useSignupForm(service.fields);
  const phone = usePhoneVerification();
  const { termState, requiredChecked, allChecked, toggleTerm, toggleAll } = useTermsSync(service.terms);

  const hasPhoneField = service.fields.some((field) => field.type === 'phone');
  const phoneVerified = !hasPhoneField || phone.status === 'success';
  const isFormValid = form.isValid && phoneVerified && requiredChecked;

  const requirements: SubmitRequirement[] = [
    { label: '필수 입력 항목 작성', done: form.isValid },
    ...(hasPhoneField ? [{ label: '휴대폰 인증 완료', done: phoneVerified }] : []),
    { label: '필수 약관 동의', done: requiredChecked }
  ];

  const handleSubmit = () => {
    if (!form.validate()) return;
    if (!isFormValid) return;
    window.alert('가입 조건을 모두 충족했습니다. 실제 가입 처리는 구현되지 않았습니다.');
  };

  return (
    <PageLayout
      title={service.title}
      bannerText={service.bannerText}
      bannerIcon={service.bannerIcon}
      themeColor={service.themeColor}
    >
      <form className="signup-form" onSubmit={(event) => event.preventDefault()}>
        {service.fields.map((field) => {
          if (field.type === 'phone') {
            return (
              <PhoneVerification
                key={field.key}
                mobile={phone.mobile}
                code={phone.code}
                status={phone.status}
                error={phone.error}
                countdown={phone.countdown}
                isRequesting={phone.isRequesting}
                canRequest={phone.canRequestCode}
                mobileValid={phone.isValidMobile}
                onMobileChange={phone.setMobile}
                onCodeChange={phone.setCode}
                onRequestCode={phone.requestCode}
                onVerifyCode={phone.verifyCode}
              />
            );
          }

          return (
            <FormField
              key={field.key}
              field={field}
              value={form.values[field.key] ?? ''}
              error={form.getFieldError(field.key)}
              onChange={(value) => form.updateField(field.key, value)}
              onBlur={() => form.validateField(field.key)}
            />
          );
        })}
        <TermsCheckboxGroup
          terms={service.terms}
          termState={termState}
          allChecked={allChecked}
          onToggleTerm={toggleTerm}
          onToggleAll={toggleAll}
        />
        <SubmitSection canSubmit={isFormValid} requirements={requirements} onSubmit={handleSubmit} />
      </form>
    </PageLayout>
  );
}

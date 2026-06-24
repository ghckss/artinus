import { services } from './config/services';
import { PageShell } from './components/PageShell';
import { FormField } from './components/FormField';
import { fieldRenderers } from './fields/registry';
import { PhoneVerification } from './components/PhoneVerification';
import { TermsCheckboxGroup } from './components/TermsCheckboxGroup';
import { SubmitSection } from './components/SubmitSection';
import type { SubmitRequirement } from './components/SubmitSection';
import { useSignupForm } from './hooks/useSignupForm';
import { usePhoneVerification } from './hooks/usePhoneVerification';
import { useTermsSync } from './hooks/useTermsSync';

interface AppProps {
  serviceName: string;
}

export function App({ serviceName }: AppProps) {
  const service = services[serviceName] ?? services.community;
  const form = useSignupForm(service.fields);
  const phoneVerification = usePhoneVerification();
  const { termState, requiredChecked, allChecked, toggleTerm, toggleAll } = useTermsSync(service.terms);

  const hasPhoneField = service.fields.some((field) => field.type === 'phone');
  const phoneVerified = !hasPhoneField || phoneVerification.status === 'success';
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
    <PageShell
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
                mobile={phoneVerification.mobile}
                code={phoneVerification.code}
                status={phoneVerification.status}
                error={phoneVerification.error}
                countdown={phoneVerification.countdown}
                isRequesting={phoneVerification.isRequesting}
                onMobileChange={phoneVerification.setMobile}
                onCodeChange={phoneVerification.setCode}
                onRequestCode={phoneVerification.requestCode}
                onVerifyCode={phoneVerification.verifyCode}
              />
            );
          }

          const Renderer = fieldRenderers[field.type] ?? FormField;
          return (
            <Renderer
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
    </PageShell>
  );
}

import type { FC } from 'react';
import type { VerificationStatus } from '../hooks/usePhoneVerification';

interface PhoneVerificationProps {
  mobile: string;
  code: string;
  status: VerificationStatus;
  error: string | null;
  countdown: number;
  isRequesting: boolean;
  onMobileChange: (value: string) => void;
  onCodeChange: (value: string) => void;
  onRequestCode: () => void;
  onVerifyCode: () => void;
}

const STATUS_LABEL: Record<VerificationStatus, string> = {
  idle: '인증 대기',
  pending: '인증번호 입력 중',
  success: '인증 완료',
  failure: '인증 실패',
  expired: '시간 만료'
};

function formatCountdown(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return `${minutes}:${String(remaining).padStart(2, '0')}`;
}

export const PhoneVerification: FC<PhoneVerificationProps> = ({
  mobile,
  code,
  status,
  error,
  countdown,
  isRequesting,
  onMobileChange,
  onCodeChange,
  onRequestCode,
  onVerifyCode
}) => {
  const isVerified = status === 'success';
  const isCodeStage = status === 'pending';
  const canRequest = !isVerified && !isRequesting && status !== 'pending' && mobile.trim().length > 0;

  return (
    <section className="phone-verification form-section" aria-labelledby="phone-heading">
      <h2 className="form-section-title" id="phone-heading">
        휴대폰 인증
      </h2>

      <div className="form-field">
        <label htmlFor="mobile">
          휴대폰 번호
          <span className="field-required" aria-hidden="true">
            *
          </span>
        </label>
        <div className="input-with-button">
          <input
            id="mobile"
            type="tel"
            inputMode="numeric"
            placeholder="01012345678"
            value={mobile}
            disabled={isVerified}
            onChange={(event) => onMobileChange(event.target.value)}
          />
          <button type="button" className="btn-secondary" onClick={onRequestCode} disabled={!canRequest}>
            {status === 'idle' ? '인증번호 받기' : isVerified ? '인증 완료' : '재요청'}
          </button>
        </div>
      </div>

      <div className="code-field">
        <div className="code-label-row">
          <label htmlFor="verificationCode">인증번호</label>
          {isCodeStage ? (
            <span className="code-timer" data-urgent={countdown <= 30} aria-live="polite">
              남은 시간 {formatCountdown(countdown)}
            </span>
          ) : null}
        </div>
        <div className="input-with-button">
          <input
            id="verificationCode"
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="6자리 코드"
            value={code}
            onChange={(event) => onCodeChange(event.target.value)}
            disabled={!isCodeStage}
          />
          <button type="button" onClick={onVerifyCode} disabled={!isCodeStage || isRequesting || code.trim().length === 0}>
            {isRequesting ? (
              <>
                <span className="spinner" aria-hidden="true" />
                검증 중
              </>
            ) : (
              '인증번호 검증'
            )}
          </button>
        </div>
      </div>

      <div className="status-row" aria-live="polite">
        <span className={`status-chip status-${status}`}>{STATUS_LABEL[status]}</span>
      </div>

      {error ? (
        <p className="field-error" role="alert">
          {error}
        </p>
      ) : null}
    </section>
  );
};

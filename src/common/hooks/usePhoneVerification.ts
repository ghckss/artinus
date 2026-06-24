import { useCallback, useEffect, useMemo, useState } from 'react';
import { verifyPhoneCode, VerifyResult } from '@/common/api/verifyApi';

export type VerificationStatus = 'idle' | 'pending' | 'success' | 'failure' | 'expired';

export function usePhoneVerification() {
  const [mobile, setMobile] = useState('');
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<VerificationStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = window.setInterval(() => {
      setCountdown((current) => Math.max(0, current - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [countdown]);

  useEffect(() => {
    if (countdown === 0 && status === 'pending') {
      setStatus('expired');
      setError('인증 시간이 만료되었습니다. 다시 시도해주세요.');
    }
  }, [countdown, status]);

  const canRequestCode = useMemo(
    () => mobile.trim().length > 0 && !isRequesting && status !== 'pending',
    [mobile, isRequesting, status]
  );

  const requestCode = useCallback(() => {
    if (!canRequestCode) return;
    setStatus('pending');
    setError(null);
    setCode('');
    setCountdown(180);
  }, [canRequestCode]);

  const verifyCode = useCallback(async () => {
    if (status !== 'pending' || isRequesting) return;
    setIsRequesting(true);
    setError(null);

    try {
      const result: VerifyResult = await verifyPhoneCode(mobile, code);
      if ('error' in result) {
        setStatus('failure');
        setError('일시적 오류가 발생했습니다. 다시 시도해주세요.');
      } else if (result.verified) {
        setStatus('success');
        setError(null);
      } else {
        setStatus('failure');
        setError('인증번호가 일치하지 않습니다. 다시 확인해주세요.');
      }
    } catch {
      setStatus('failure');
      setError('인증 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsRequesting(false);
    }
  }, [code, isRequesting, mobile, status]);

  const reset = useCallback(() => {
    setStatus('idle');
    setError(null);
    setCode('');
    setCountdown(0);
    setIsRequesting(false);
  }, []);

  return {
    mobile,
    setMobile,
    code,
    setCode,
    status,
    error,
    countdown,
    isRequesting,
    requestCode,
    verifyCode,
    reset,
    canRequestCode
  };
}

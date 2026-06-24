export type VerifyResult =
  | { verified: true }
  | { verified: false; reason: 'MISMATCH' }
  | { error: 'INTERNAL' };

const randomDelay = () => 500 + Math.random() * 1000;

export async function verifyPhoneCode(mobile: string, code: string): Promise<VerifyResult> {
  await new Promise((resolve) => setTimeout(resolve, randomDelay()));

  if (code === '123456') {
    return { verified: true };
  }

  if (code === '999999') {
    return { error: 'INTERNAL' };
  }

  return { verified: false, reason: 'MISMATCH' };
}

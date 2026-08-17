import { createHmac, timingSafeEqual } from 'crypto';

type PremiumPayload = {
  sid: string;
  product: 'saju-premium';
  exp: number;
};

function secret() {
  const value = process.env.PREMIUM_TOKEN_SECRET;
  if (value) return value;
  if (process.env.NODE_ENV !== 'production') return 'multi-saju-dev-secret-change-me';
  throw new Error('PREMIUM_TOKEN_SECRET is not configured');
}

function signature(encodedPayload: string) {
  return createHmac('sha256', secret()).update(encodedPayload).digest('base64url');
}

export function signPremiumToken(sessionId: string) {
  const payload: PremiumPayload = {
    sid: sessionId,
    product: 'saju-premium',
    exp: Date.now() + 24 * 60 * 60 * 1000,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${encodedPayload}.${signature(encodedPayload)}`;
}

export function verifyPremiumToken(token: string | null | undefined) {
  if (!token) return null;
  const [encodedPayload, providedSignature] = token.split('.');
  if (!encodedPayload || !providedSignature) return null;

  const expectedSignature = signature(encodedPayload);
  const expected = Buffer.from(expectedSignature);
  const provided = Buffer.from(providedSignature);
  if (expected.length !== provided.length || !timingSafeEqual(expected, provided)) return null;

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8')) as PremiumPayload;
    if (payload.product !== 'saju-premium' || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

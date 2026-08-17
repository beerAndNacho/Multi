import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { signPremiumToken } from '../../../lib/premium';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: '결제 환경변수가 설정되지 않았습니다.' }, { status: 503 });
  }

  try {
    const { sessionId } = (await request.json()) as { sessionId?: string };
    if (!sessionId) {
      return NextResponse.json({ error: '결제 세션 ID가 없습니다.' }, { status: 400 });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid' || session.metadata?.product !== 'saju-premium') {
      return NextResponse.json({ error: '완료된 프리미엄 결제를 확인하지 못했습니다.' }, { status: 403 });
    }

    return NextResponse.json({ token: signPremiumToken(session.id) });
  } catch (error) {
    console.error('verify checkout error', error);
    return NextResponse.json({ error: '결제 확인 중 오류가 발생했습니다.' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: '결제 환경변수가 아직 설정되지 않았습니다.' },
      { status: 503 },
    );
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const origin = new URL(request.url).origin;
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'krw',
            unit_amount: 4900,
            product_data: {
              name: '사주 AI 프리미엄 리포트',
              description: '결제 후 24시간 동안 AI 상세 사주 해석을 이용할 수 있습니다.',
            },
          },
        },
      ],
      metadata: {
        product: 'saju-premium',
      },
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?checkout=cancelled`,
      locale: 'ko',
    });

    if (!session.url) {
      return NextResponse.json({ error: '결제 페이지 URL을 만들지 못했습니다.' }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('checkout error', error);
    return NextResponse.json({ error: '결제 세션 생성 중 오류가 발생했습니다.' }, { status: 500 });
  }
}

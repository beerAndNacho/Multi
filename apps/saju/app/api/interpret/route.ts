import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { verifyPremiumToken } from '../../../lib/premium';

export const runtime = 'nodejs';

type InterpretRequest = {
  profile?: {
    calendarType?: string;
    birthDate?: string;
    birthTime?: string;
    timeKnown?: boolean;
    gender?: string;
  };
  report?: {
    pillars?: Array<{ label: string; value: string; element: string }>;
    counts?: Record<string, number>;
    strongest?: string;
    weakest?: string;
    dayMaster?: string;
    dayMasterElement?: string;
    zodiac?: string;
  };
};

export async function POST(request: Request) {
  const auth = request.headers.get('authorization');
  const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!verifyPremiumToken(token)) {
    return NextResponse.json({ error: '프리미엄 이용권이 필요합니다.' }, { status: 401 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: 'AI 환경변수가 아직 설정되지 않았습니다.' }, { status: 503 });
  }

  try {
    const body = (await request.json()) as InterpretRequest;
    if (!body.report?.pillars?.length) {
      return NextResponse.json({ error: '사주 계산 결과가 없습니다.' }, { status: 400 });
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || 'gpt-5',
      input: [
        {
          role: 'system',
          content: '당신은 전통 명리학 용어를 현대적인 자기성찰 언어로 풀어주는 한국어 리포트 작성자입니다. 운명을 단정하거나 공포를 조장하지 말고, 재정·건강·법률 결정을 지시하지 마세요. 제공된 사주 원국과 오행 분포만 사용하고 알 수 없는 정보는 추측하지 마세요.',
        },
        {
          role: 'user',
          content: `아래 데이터를 바탕으로 프리미엄 사주 리포트를 작성해 주세요.\n\n입력 정보:\n${JSON.stringify(body.profile, null, 2)}\n\n계산 결과:\n${JSON.stringify(body.report, null, 2)}\n\n다음 제목을 정확히 사용해 한국어로 작성하세요:\n1. 핵심 성향\n2. 일과 돈의 흐름\n3. 관계와 소통\n4. 균형을 위한 실천\n\n각 섹션은 3~5문장, 구체적이되 단정적 예언은 피하고, 마지막에 한 줄 요약을 덧붙이세요.`,
        },
      ],
    });

    return NextResponse.json({ text: response.output_text });
  } catch (error) {
    console.error('AI interpretation error', error);
    return NextResponse.json({ error: 'AI 상세 해석을 만드는 중 오류가 발생했습니다.' }, { status: 500 });
  }
}

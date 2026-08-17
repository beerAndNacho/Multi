# 오늘의 명리 · Multi Project 001

Next.js 기반 사주/오행 리포트 MVP입니다.

## 기능

- 양력 / 음력 입력
- 음력 윤달 입력
- 출생시간 미상 지원
- 년주 / 월주 / 일주 / 시주
- 일간과 띠 표시
- 목·화·토·금·수 오행 분포
- 기본 성향 / 일 / 돈 / 관계 리포트
- 보완 오행 기반 실천 루틴
- Stripe 1회 결제
- 결제 완료 서버 검증
- 24시간 프리미엄 토큰
- OpenAI Responses API 기반 AI 상세해석

## 로컬 실행

저장소 루트에서:

```bash
npm install
cp apps/saju/.env.example apps/saju/.env.local
npm run dev:saju
```

브라우저에서 `http://localhost:3000`을 엽니다.

## 환경변수

`apps/saju/.env.local`:

```env
OPENAI_API_KEY=...
OPENAI_MODEL=gpt-5
STRIPE_SECRET_KEY=...
PREMIUM_TOKEN_SECRET=...
```

## 결제 흐름

1. 무료 사주 리포트 계산
2. 브라우저에 마지막 입력 정보 저장
3. `/api/checkout`에서 Stripe Checkout Session 생성
4. 결제 완료 후 `/success`로 복귀
5. `/api/verify-checkout`에서 Stripe 결제 상태와 상품 metadata 확인
6. 결제가 확인되면 24시간 프리미엄 서명 토큰 발급
7. `/api/interpret`가 유효한 프리미엄 토큰을 확인한 뒤 AI 상세해석 생성

## 가격

현재 MVP 가격은 **4,900원 1회 결제**로 코드에 설정되어 있습니다. 출시 전 A/B 테스트나 가격 정책에 맞춰 `/app/api/checkout/route.ts`에서 조정하세요.

## 해석 정책

오행의 부족 요소는 정밀한 용신 판정으로 표시하지 않고 `보완 포인트`라는 간이 지표로 제공합니다. AI 해석 역시 원국과 계산된 오행 데이터 범위 안에서 자기성찰형 문장으로 작성하도록 제한합니다.

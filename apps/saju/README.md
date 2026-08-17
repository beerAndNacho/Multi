# 오늘의 명리 · Multi Project 001

Next.js 기반 사주·오행·궁합 리포트 서비스입니다.

제품 전체 설계는 [`docs/PROJECT-001-SAJU-PLAN.md`](../../docs/PROJECT-001-SAJU-PLAN.md)를 기준으로 유지합니다.

## 무료 기능

- 성별 입력
- 양력 / 음력 입력
- 음력 윤달 입력
- 출생시간 미상 지원
- 결과 후 날짜·시간·성별 재입력
- 년주 / 월주 / 일주 / 시주
- 일간과 띠 표시
- 목·화·토·금·수 오행 분포
- 기본 성향 / 일 / 돈 / 관계 리포트
- 보완 오행 기반 실천 루틴

## 궁합

A/B가 같은 `BirthProfile` 모델과 `calculateSaju()` 계산 엔진을 사용합니다.

각 사람 입력:

- 이름 또는 호칭
- 성별
- 양력 / 음력
- 생년월일
- 출생시간
- 시간 모름
- 윤달

관계 유형:

- 연애
- 결혼
- 친구
- 직장·동료

궁합 결과는 단일 점수만 제공하지 않고 아래 4개 참고 지표를 함께 표시합니다.

- 오행 조화
- 상호 보완
- 일간 관계
- 음양 리듬

최종 점수는 관계 유형에 따라 네 지표의 가중치를 조정해 계산합니다. 관계의 미래나 성공 여부를 예측하는 값이 아니라 자기이해용 밸런스 지표입니다.

## 코드 구조

- `lib/saju-core.ts`: 공통 타입, 입력 검증, 원국 계산, 궁합 계산
- `components/BirthProfileFields.tsx`: 사주/궁합 공용 출생정보 폼
- `app/page.tsx`: 내 사주 + 궁합 UX
- `app/api/*`: 결제 검증과 AI 프리미엄 해석

## 프리미엄 구조

- Stripe 4,900원 1회 결제
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

무료 사주/궁합 계산은 위 키 없이도 동작하도록 분리되어 있습니다.

## 결제 흐름

1. 무료 사주 리포트 계산
2. 브라우저에 마지막 입력 정보 저장
3. `/api/checkout`에서 Stripe Checkout Session 생성
4. 결제 완료 후 `/success`로 복귀
5. `/api/verify-checkout`에서 Stripe 결제 상태와 상품 metadata 확인
6. 결제가 확인되면 24시간 프리미엄 서명 토큰 발급
7. `/api/interpret`가 유효한 프리미엄 토큰을 확인한 뒤 AI 상세해석 생성

## 해석 정책

오행의 부족 요소는 정밀한 용신 판정으로 표시하지 않고 `보완 포인트`라는 간이 지표로 제공합니다. 궁합도 전통 명리 요소를 단순화한 자기이해형 비교이며 미래의 관계 결과를 단정하지 않습니다.

## CI

`main`에 `apps/saju/**` 변경이 들어오면 GitHub Actions에서 Node.js 22로 의존성을 설치한 뒤 TypeScript 검사와 Next.js 프로덕션 빌드를 실행합니다.

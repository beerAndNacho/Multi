# Multi

100개의 실용적인 미니 웹 프로젝트를 한 저장소에서 관리하는 모노레포입니다.

## Projects

| # | Project | Path | Status |
|---|---|---|---|
| 001 | 오늘의 명리 · 사주와 궁합 | `apps/saju` | ✅ MVP v3 |

## 100 Project Roadmap

- [`docs/PROJECT-CATALOG-100.md`](docs/PROJECT-CATALOG-100.md) — 001~100 전체 후보, 권장 제작 순서, 수익모델, 운영난이도, AI 비용

## Project 001 highlights

- 공통 `BirthProfile` 기반 사주/궁합 입력 구조
- 성별 / 양력 / 음력 / 윤달 / 출생시간 미상
- 결과 후 날짜·시간·성별 반복 수정
- 사주 원국 · 일간 · 띠 · 오행 분석
- 기본 성향 · 일 · 돈 · 관계 · 보완 루틴
- 궁합 관계 유형: 연애 / 결혼 / 친구 / 직장·동료
- 궁합 세부 지표: 오행 조화 / 상호 보완 / 일간 관계 / 음양 리듬
- Stripe 4,900원 1회 결제 구조
- 결제 완료 서버 검증 + 24시간 프리미엄 토큰
- OpenAI Responses API 기반 AI 상세해석
- GitHub Actions TypeScript + Next.js production build 검증

## Project 001 product plan

- [`docs/PROJECT-001-SAJU-PLAN.md`](docs/PROJECT-001-SAJU-PLAN.md)
- [`docs/PROJECT-001-SAJU-HANDOFF.md`](docs/PROJECT-001-SAJU-HANDOFF.md)
- Live demo: `https://beerandnacho.github.io/saju/`

## Run

```bash
npm install
npm run dev:saju
```

각 프로젝트는 `apps/<project-name>` 아래에 독립적인 앱으로 추가합니다.

# Multi

100개의 실용적인 미니 웹 프로젝트를 한 저장소에서 관리하는 모노레포입니다.

## Projects

| # | Project | Path | Status |
|---|---|---|---|
| 001 | 오늘의 명리 · 사주 AI 리포트 | `apps/saju` | ✅ MVP v2 |

## Project 001 highlights

- 양력 / 음력 / 윤달 입력
- 출생시간 미상 지원
- 사주 원국 · 일간 · 띠 · 오행 분석
- 기본 성향 · 일 · 돈 · 관계 · 보완 루틴
- Stripe 4,900원 1회 결제 구조
- 결제 완료 서버 검증 + 24시간 프리미엄 토큰
- OpenAI Responses API 기반 AI 상세해석
- GitHub Actions TypeScript + Next.js build 검증

## Run

```bash
npm install
npm run dev:saju
```

각 프로젝트는 `apps/<project-name>` 아래에 독립적인 앱으로 추가합니다.

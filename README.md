# Multi

100개의 실용적인 미니 웹 프로젝트와 수익화 실험 앱을 한 저장소에서 관리하는 모노레포입니다.

## Projects

| # | Project | Path | Status |
|---|---|---|---|
| 001 | 오늘의 명리 · 사주와 궁합 | `apps/saju` | ✅ MVP v3 |
| 005 | 프리랜서 3.3% 계산기 | `apps/freelancer-33` | 🧪 MVP |
| LAB-01 | 우리 둘 데이트 코스 | `apps/date-course` | 🧪 Personalized MVP |

## 100 Project Roadmap

- [`docs/PROJECT-CATALOG-100.md`](docs/PROJECT-CATALOG-100.md) — 001~100 전체 후보, 권장 제작 순서, 수익모델, 운영난이도, AI 비용

## LAB-01 highlights

- 한 화면 한 질문 방식의 개인화 위저드
- 지역 / 관계 단계 / 예산 / 시간 / 실내·야외 / 분위기 / 이동수단 기반 추천
- 시간대별 데이트 플로우와 개인화 이유 제공
- 같은 조건에서 다른 코스 재생성
- 결과 저장 / Web Share / 클립보드 공유
- localStorage 기반 이전 설정 복원
- GA4 + Microsoft Clarity 환경변수 기반 조건부 계측
- 서버/API 비용 없는 정적 export
- 특정 매장 실시간 데이터 없이 지역·활동 조합으로 MVP 검증

## LAB-01 analytics events

- `date_wizard_start`
- `date_question_complete`
- `date_course_generated`
- `date_course_regenerate`
- `date_course_save`
- `share`
- `date_course_restart`

## Run

```bash
npm install
npm run dev:saju
npm run dev:freelancer-33
npm run dev:date-course
```

각 프로젝트는 `apps/<project-name>` 아래에 독립적인 앱으로 추가합니다.

# Multi

100개의 실용적인 미니 웹 프로젝트와 수익화 실험 앱을 한 저장소에서 관리하는 모노레포입니다.

## Projects

| # | Project | Path | Status |
|---|---|---|---|
| 001 | 오늘의 명리 · 사주와 궁합 | `apps/saju` | ✅ MVP v3 |
| 005 | 프리랜서 3.3% 계산기 | `apps/freelancer-33` | 🧪 MVP |
| LAB-01 | 우리 둘 데이트 코스 | `apps/date-course` | 🧪 Personalized MVP |
| LAB-02 | 퇴근하고 뭐 하지? | `apps/after-work` | 🧪 Personalized MVP |

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

## LAB-02 highlights

- 체력 / 남은 시간 / 예산 / 동행 / 공간 / 기분을 한 화면에서 즉시 조정
- 조건을 바꾸면 퇴근 후 추천과 시간대별 실행 플랜이 즉시 변경
- 추천 다시 받기 / 대안 선택 / 저장 / 공유
- localStorage 기반 설정 복원
- GA4 + Microsoft Clarity 조건부 계측 자리 포함
- `taste-skill`의 anti-slop 원칙을 참고한 저채도 편집형 레이아웃
- 서버/API 비용 없는 단일 정적 HTML MVP

## Run

```bash
npm install
npm run dev:saju
npm run dev:freelancer-33
npm run dev:date-course
```

`LAB-02`는 `apps/after-work/index.html`을 직접 열거나 정적 호스팅에 배포하면 됩니다.

각 프로젝트는 `apps/<project-name>` 아래에 독립적으로 추가합니다.

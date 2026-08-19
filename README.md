# Multi

100개의 실용적인 미니 웹 프로젝트와 수익화 실험 앱을 한 저장소에서 관리하는 모노레포입니다.

## 오늘결정 · Personalized LAB 100

`apps/lab-hub`는 LAB-01~100을 검색·카테고리·현재 상황 추천·최근 사용으로 탐색하는 통합 허브입니다.

- 공개 허브: `https://beerandnacho.github.io/labs/`
- 전체 카탈로그: [`docs/PERSONALIZED-LABS-100.md`](docs/PERSONALIZED-LABS-100.md)
- LAB-03~100 독립 주소: `/labs/<slug>/`
- 이전 `?lab=<slug>` 주소도 독립 주소로 이동
- 선택값과 최근 사용은 브라우저 `localStorage`에만 저장
- 서버·유료 API 없이 정적 파일로 동작

## Source map

| 범위 | 소스 |
|---|---|
| LAB-01 · 우리 둘 데이트 코스 | `apps/date-course` |
| LAB-02 · 퇴근하고 뭐 하지? | `apps/after-work` |
| LAB-03~100 | `apps/personalized-labs` |
| 통합 허브 | `apps/lab-hub` |

## LAB-03~100 runtime

- `index.html` — 런타임 진입점
- `labs-index.js` — 100개 LAB 메타데이터
- `labs-a.js`~`labs-f.js` — 질문·결과·매칭 데이터
- `labs-expand-*.js` — LAB-27~100 질문·결과와 25종 레이아웃 확장기
- `layout-bodies-a.js`~`layout-bodies-c.js` — LAB-03~26 독립 HTML 구조
- `layout-css-a.js`~`layout-css-c.js` — LAB-03~26 전용 스타일
- `layout-base.js` — 최소 공통 접근성·컨트롤 규칙
- `core.js` — 개인화 계산, clean URL, 최근 사용, 저장·공유, GA4·Clarity 훅

## Design / analytics

- `taste-skill` anti-slop 원칙을 참고해 AI-purple 기본값, 반복 카드, 가짜 점수, 과한 장식 문구를 피합니다.
- LAB별로 훈련일지·카탈로그·전표·노트·터미널·지도·계약서·갤러리 등 서로 다른 화면 구조를 사용합니다.
- 모든 LAB는 최소 4개 질문, 4개 결과, 추천 이유, 3단계 실행안, 대안 결과, 저장·공유를 제공합니다.
- 허브와 개별 LAB에 GA4·Microsoft Clarity 연결 자리가 포함되어 있습니다.

## Existing projects

- `apps/saju` — 오늘의 명리 · 사주와 궁합
- `apps/freelancer-33` — 프리랜서 3.3% 계산기

## Validation

GitHub Actions의 `personalized-labs-ci`가 다음을 검사합니다.

- 모든 데이터·레이아웃·스타일·런타임 JavaScript 문법
- LAB 메타데이터 100개
- 런타임 LAB-03~100 총 98개
- 각 LAB의 질문·결과·HTML 구조·CSS 누락 여부
- 통합 허브 필수 파일

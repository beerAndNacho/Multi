# Multi

100개의 실용적인 미니 웹 프로젝트와 수익화 실험 앱을 한 저장소에서 관리하는 모노레포입니다.

## 오늘결정 허브

`apps/lab-hub`는 LAB-01~26을 검색·카테고리·상황별 추천·최근 사용으로 탐색하는 통합 허브입니다.

- 공개 허브: `https://beerandnacho.github.io/labs/`
- 기존 `?lab=<slug>` 주소는 독립 경로로 이동
- LAB-03~26 독립 경로: `/labs/<slug>/`
- 최근 사용 기록과 LAB별 설정은 `localStorage`에만 저장

## Personalized Labs

| LAB | 서비스 | 소스 |
|---:|---|---|
| 01 | 우리 둘 데이트 코스 | `apps/date-course` |
| 02 | 퇴근하고 뭐 하지? | `apps/after-work` |
| 03 | 오늘 러닝 뭐하지? | `apps/personalized-labs` |
| 04 | 선물 뭐 사지? | `apps/personalized-labs` |
| 05 | 오늘 뭐 입지? | `apps/personalized-labs` |
| 06 | 이번 주말 혼자 뭐하지? | `apps/personalized-labs` |
| 07 | 내 취미 뭐가 맞을까? | `apps/personalized-labs` |
| 08 | 냉장고에 있는 걸로 뭐 먹지? | `apps/personalized-labs` |
| 09 | 방 정리 어디부터 하지? | `apps/personalized-labs` |
| 10 | 오늘 공부 뭐 하지? | `apps/personalized-labs` |
| 11 | 이번 주말 어디 가지? | `apps/personalized-labs` |
| 12 | 이 옷, 버릴까? | `apps/personalized-labs` |
| 13 | 오늘 집에서 뭐 해먹지? | `apps/personalized-labs` |
| 14 | 내 소비 어디서 새고 있지? | `apps/personalized-labs` |
| 15 | 오늘 나한테 필요한 휴식은? | `apps/personalized-labs` |
| 16 | 내게 맞는 사이드 프로젝트 | `apps/personalized-labs` |
| 17 | 오늘 아이랑 뭐 하지? | `apps/personalized-labs` |
| 18 | 반려동물과 오늘 뭐 하지? | `apps/personalized-labs` |
| 19 | 내 방에 무슨 인테리어가 맞지? | `apps/personalized-labs` |
| 20 | 지금 연락할까 말까? | `apps/personalized-labs` |
| 21 | 회식 메뉴 뭐 먹지? | `apps/personalized-labs` |
| 22 | 오늘 머리 어떻게 하지? | `apps/personalized-labs` |
| 23 | 이직할까 말까? | `apps/personalized-labs` |
| 24 | 이번 달 뭐 하나 끊을까? | `apps/personalized-labs` |
| 25 | 내 취향에 맞는 동네 찾기 | `apps/personalized-labs` |
| 26 | 오늘 이거 사도 될까? | `apps/personalized-labs` |

## LAB-03~26 runtime

- `index.html` — 런타임 진입점
- `labs-a.js`, `labs-b.js`, `labs-c.js` — 서비스별 질문·결과 데이터
- `layout-bodies-a.js`, `layout-bodies-b.js`, `layout-bodies-c.js` — LAB별 독립 HTML 구조
- `layout-css-a.js`, `layout-css-b.js`, `layout-css-c.js` — 주제별 전용 UI 스타일
- `layout-base.js` — 공통 접근성·버튼·타이포 최소 규칙
- `core.js` — 개인화 점수, clean URL, 최근 사용, 저장·공유, GA4·Clarity 훅

## Design / Analytics

- `taste-skill` anti-slop 원칙을 참고해 AI-purple 기본값, 반복 카드, 가짜 정밀 점수, 과한 장식 문구를 피합니다.
- LAB별로 훈련일지·카탈로그·패션 레일·전표·노트·메신저·영수증 등 서로 다른 구조를 사용합니다.
- 선택 즉시 개인화, 추천 이유, 실행 3단계, 대안 결과, 저장·공유를 제공합니다.
- 허브와 개별 LAB 모두 GA4와 Microsoft Clarity ID 연결 자리가 포함되어 있습니다.
- 서버나 유료 API 없이 정적 파일로 동작합니다.

## Existing projects

- `apps/saju` — 오늘의 명리 · 사주와 궁합
- `apps/freelancer-33` — 프리랜서 3.3% 계산기
- `apps/date-course` — 우리 둘 데이트 코스
- `apps/after-work` — 퇴근하고 뭐 하지?

## Validation

GitHub Actions의 `personalized-labs-ci`가 허브의 인라인 JavaScript와 LAB 데이터·레이아웃·런타임 문법, 필수 파일 존재 여부를 검사합니다.

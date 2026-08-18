# Multi

100개의 실용적인 미니 웹 프로젝트와 수익화 실험 앱을 한 저장소에서 관리하는 모노레포입니다.

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

LAB-03~25는 `apps/personalized-labs/`에서 관리하며 URL의 `?lab=<slug>`로 서비스를 선택합니다.

## LAB-03~25 runtime

- `index.html` — 런타임 진입점
- `labs-a.js`, `labs-b.js` — 서비스별 질문·결과 데이터
- `layout-bodies-a.js`, `layout-bodies-b.js` — LAB별 독립 HTML 구조
- `layout-css-a.js`, `layout-css-b.js` — 주제별 전용 UI 스타일
- `layout-base.js` — 공통 접근성·버튼·타이포 최소 규칙
- `core.js` — 개인화 점수, 렌더링, 저장·공유, GA4·Clarity 훅

## Design / Analytics

- `taste-skill` anti-slop 원칙을 참고해 AI-purple 기본값, 반복 카드, 가짜 정밀 점수, 과한 장식 문구를 피합니다.
- LAB-03~25는 동일 셸의 색상 교체가 아니라 서비스별 HTML 구조와 스타일을 사용합니다.
- 선택 즉시 개인화, 추천 이유, 실행 3단계, 대안 결과, 저장·공유를 제공합니다.
- GA4와 Microsoft Clarity ID 연결 자리가 포함되어 있습니다.
- 선택값은 `localStorage`에 저장하며 서버나 유료 API 없이 동작합니다.

## Existing projects

- `apps/saju` — 오늘의 명리 · 사주와 궁합
- `apps/freelancer-33` — 프리랜서 3.3% 계산기
- `apps/date-course` — 우리 둘 데이트 코스
- `apps/after-work` — 퇴근하고 뭐 하지?

## Validation

GitHub Actions의 `personalized-labs-ci`가 LAB 데이터·레이아웃·런타임 JavaScript 문법과 필수 파일 존재 여부를 검사합니다.

# Multi

100개의 실용적인 미니 웹 프로젝트와 수익화 실험 앱을 한 저장소에서 관리하는 모노레포입니다.

## Personalized Labs

- LAB-01 우리 둘 데이트 코스 — `apps/date-course`
- LAB-02 퇴근하고 뭐 하지? — `apps/after-work`
- LAB-03 오늘 러닝 뭐하지?
- LAB-04 선물 뭐 사지?
- LAB-05 오늘 뭐 입지?
- LAB-06 이번 주말 혼자 뭐하지?
- LAB-07 내 취미 뭐가 맞을까?
- LAB-08 냉장고에 있는 걸로 뭐 먹지?
- LAB-09 방 정리 어디부터 하지?
- LAB-10 오늘 공부 뭐 하지?
- LAB-11 이번 주말 어디 가지?
- LAB-12 이 옷, 버릴까?
- LAB-13 오늘 집에서 뭐 해먹지?
- LAB-14 내 소비 어디서 새고 있지?
- LAB-15 오늘 나한테 필요한 휴식은?
- LAB-16 내게 맞는 사이드 프로젝트
- LAB-17 오늘 아이랑 뭐 하지?
- LAB-18 반려동물과 오늘 뭐 하지?
- LAB-19 내 방에 무슨 인테리어가 맞지?
- LAB-20 지금 연락할까 말까?
- LAB-21 회식 메뉴 뭐 먹지?
- LAB-22 오늘 머리 어떻게 하지?
- LAB-23 이직할까 말까?
- LAB-24 이번 달 뭐 하나 끊을까?
- LAB-25 내 취향에 맞는 동네 찾기

LAB-03~25는 `apps/personalized-labs/`의 공통 런타임과 데이터셋으로 관리합니다. URL의 `?lab=<slug>`로 각 앱을 전환합니다.

## Design / Analytics

- `taste-skill` anti-slop 방향 적용: AI-purple 기본값, 반복 카드, 가짜 정밀 점수, 과한 eyebrow/장식 문구 회피
- 7개 레이아웃 패밀리(split/catalog/rail/poster/top/ledger/stack)를 주제에 맞게 순환
- 선택 즉시 개인화, 추천 이유, 실행 3단계, 대안 결과, 저장/공유
- GA4 + Microsoft Clarity ID 자리 포함
- localStorage 기반 선택값 저장
- 서버/API 비용 없는 정적 MVP

## Existing projects

- `apps/saju` — 오늘의 명리 · 사주와 궁합
- `apps/freelancer-33` — 프리랜서 3.3% 계산기
- `apps/date-course` — 우리 둘 데이트 코스
- `apps/after-work` — 퇴근하고 뭐 하지?

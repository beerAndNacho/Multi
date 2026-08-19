# 오늘결정 허브

LAB-01~100을 한곳에서 탐색하는 정적 개인화 도구 허브입니다.

## 기능

- 현재 고민·가능 시간·결정 에너지 기반 LAB 3개 추천
- 12개 카테고리 필터와 제목·상황 검색
- 최근 사용 도구 복원
- 기존 `?lab=<slug>` URL을 `/labs/<slug>/`로 이동
- GA4·Microsoft Clarity 조건부 계측 자리

## 파일

- `index.html` — 허브 문서 구조
- `hub.css` — 편집형 100개 색인 UI
- `hub.js` — 추천·검색·필터·최근 사용
- `labs-index.js` — LAB-01~100 메타데이터

## 배포

GitHub Pages의 `/labs/`에 위 파일을 배포하며 개별 도구는 `/labs/<slug>/`에서 공유 런타임을 불러옵니다.

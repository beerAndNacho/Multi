# 오늘결정 허브

LAB-01~26을 한곳에서 탐색하는 정적 서비스 허브입니다.

## 기능

- 현재 고민·가능 시간·결정 에너지 기반 LAB 3개 추천
- 카테고리 필터와 제목·상황 검색
- 최근 사용 도구 복원
- 기존 `?lab=<slug>` URL을 `/labs/<slug>/`로 이동
- GA4·Microsoft Clarity 조건부 계측 자리

## 배포

`index.html` 하나를 GitHub Pages의 `/labs/`에 배포합니다. 개별 LAB는 `/labs/<slug>/` 경로에서 공유 런타임을 불러옵니다.

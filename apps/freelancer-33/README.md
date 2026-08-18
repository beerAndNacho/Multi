# 프리랜서 3.3% 계산기

검색 유입과 광고 수익화를 검증하기 위한 비용 0원형 정적 웹 도구입니다.

## MVP

- 세전 → 세후 3.3% 원천징수 계산
- 세후 → 세전 역산
- 소득세 / 지방소득세 분리 표시
- 동일 단가의 월 건수 기반 월·연간 예상
- 결과 복사 및 Web Share
- FAQ / 검색 의도형 본문
- WebApplication 구조화 데이터
- AdSense 슬롯 환경변수 연결
- 입력값 서버 전송 없음

## 계산 기준

원천징수 대상 사업소득을 가정해 소득세 3%와 지방소득세를 계산합니다.
3.3% 원천징수는 최종 종합소득세 확정액이 아니므로 화면에서도 이를 명시합니다.

기준일: 2026-08-18

## Run

```bash
npm install
npm run dev:freelancer-33
```

## Verify

```bash
npm run lint:freelancer-33
npm run build:freelancer-33
```

## Monetization env

`.env.example` 참고.

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_ADSENSE_CLIENT`
- `NEXT_PUBLIC_ADSENSE_SLOT_TOP`
- `NEXT_PUBLIC_ADSENSE_SLOT_MIDDLE`

트래픽 검증 전에는 AI API나 유료 백엔드를 사용하지 않습니다.

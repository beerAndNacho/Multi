# 우리 둘 데이트 코스

개인화 질문 7개를 바탕으로 시간대별 데이트 플로우를 만드는 정적 웹앱입니다.

## Run

```bash
npm run dev:date-course
```

## Analytics

`.env.local`:

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_CLARITY_PROJECT_ID=xxxxxxxxxx
```

ID가 비어 있으면 분석 스크립트를 로드하지 않습니다.

## Deploy

`next build` 결과는 `apps/date-course/out`에 생성됩니다. GitHub Pages 테스트 경로는 `/date-course/`를 기준으로 합니다.

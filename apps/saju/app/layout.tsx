import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '오늘의 명리 · 사주와 궁합',
  description: '사주 원국, 일간, 띠, 오행 균형과 두 사람의 궁합 밸런스를 확인하는 명리 리포트',
  openGraph: {
    title: '오늘의 명리 · 사주와 궁합',
    description: '내 사주의 흐름과 두 사람의 오행 궁합을 한눈에 확인해보세요.',
    type: 'website',
    locale: 'ko_KR',
  },
  twitter: {
    card: 'summary_large_image',
    title: '오늘의 명리 · 사주와 궁합',
    description: '사주 원국 · 일간 · 띠 · 오행 균형 · 궁합',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}

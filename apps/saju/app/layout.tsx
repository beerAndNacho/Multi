import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '사주 오행 리포트',
  description: '생년월일과 출생시간으로 확인하는 간단한 사주 오행 리포트',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}

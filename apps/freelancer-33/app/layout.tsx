import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

export const metadata: Metadata = {
  title: {
    default: '프리랜서 3.3% 계산기 | 세전·세후·역산',
    template: '%s | 3.3 계산기',
  },
  description: '프리랜서 3.3% 원천징수 금액과 실제 수령액을 즉시 계산하세요. 세전→세후, 세후→세전 역산, 월·연간 수입 추정까지 한 번에 확인합니다.',
  keywords: ['3.3 계산기', '프리랜서 세금', '프리랜서 실수령액', '3.3 역산', '원천징수 계산기', '사업소득 3.3'],
  openGraph: {
    title: '프리랜서 3.3% 계산기',
    description: '세전·세후·3.3% 역산을 빠르게 계산하세요.',
    type: 'website',
    locale: 'ko_KR',
    url: siteUrl || undefined,
  },
  alternates: siteUrl ? { canonical: siteUrl } : undefined,
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>
        {adsenseClient ? (
          <Script
            id="adsense-script"
            async
            strategy="afterInteractive"
            crossOrigin="anonymous"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
          />
        ) : null}
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const clarityId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

export const metadata: Metadata = {
  metadataBase: new URL("https://beerandnacho.github.io"),
  title: "우리 둘 데이트 코스 | 취향 맞춤 데이트 플래너",
  description: "지역, 관계 단계, 예산, 시간, 분위기를 고르면 우리 둘에게 맞는 데이트 코스를 무료로 만들어드립니다.",
  alternates: { canonical: "/date-course/" },
  openGraph: {
    title: "우리 둘 데이트 코스",
    description: "몇 가지 질문에 답하면 우리 둘에게 맞는 데이트 코스를 만들어드려요.",
    type: "website",
    url: "https://beerandnacho.github.io/date-course/",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>
        {children}
        {gaId ? (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
            <Script id="ga4" strategy="afterInteractive">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('js', new Date());
              gtag('config', '${gaId}');
            `}</Script>
          </>
        ) : null}
        {clarityId ? (
          <Script id="clarity" strategy="afterInteractive">{`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src='https://www.clarity.ms/tag/'+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, 'clarity', 'script', '${clarityId}');
          `}</Script>
        ) : null}
      </body>
    </html>
  );
}

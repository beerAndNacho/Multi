'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export default function AdSlot({ slot }: { slot?: string }) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  useEffect(() => {
    if (!client || !slot) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Ad blockers or delayed script loading can make this unavailable.
    }
  }, [client, slot]);

  if (!client || !slot) {
    return (
      <aside className="ad-placeholder" aria-label="광고 영역">
        <span>AD</span>
        <p>AdSense 승인 후 광고가 표시될 자리입니다.</p>
      </aside>
    );
  }

  return (
    <ins
      className="adsbygoogle ad-live"
      style={{ display: 'block' }}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}

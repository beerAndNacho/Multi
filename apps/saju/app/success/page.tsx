'use client';

import { useEffect, useState } from 'react';

export default function SuccessPage() {
  const [message, setMessage] = useState('결제를 확인하고 프리미엄 이용권을 활성화하고 있습니다.');

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get('session_id');
    if (!sessionId) {
      setMessage('결제 세션 정보를 찾지 못했습니다.');
      return;
    }

    fetch('/api/verify-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || '결제 확인에 실패했습니다.');
        localStorage.setItem('saju:premium-token', data.token);
        window.location.replace('/?premium=1');
      })
      .catch((error: Error) => setMessage(error.message));
  }, []);

  return (
    <main className="successShell">
      <div className="successCard">
        <div className="successSeal">福</div>
        <span className="eyebrow">PREMIUM REPORT</span>
        <h1>프리미엄 리포트 활성화</h1>
        <p>{message}</p>
        <a href="/">처음 화면으로 돌아가기</a>
      </div>
    </main>
  );
}

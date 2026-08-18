'use client';

import { useMemo, useState } from 'react';
import { calculateFromGross, calculateFromNet, formatWon } from '@/lib/calc';

type Mode = 'gross' | 'net';

const PRESETS = [100000, 300000, 500000, 1000000, 3000000];

function parseDigits(value: string) {
  const digits = value.replace(/[^0-9]/g, '');
  return digits ? Number(digits) : 0;
}

function formatInput(value: number) {
  return value ? value.toLocaleString('ko-KR') : '';
}

export default function Calculator() {
  const [mode, setMode] = useState<Mode>('gross');
  const [amount, setAmount] = useState(1000000);
  const [monthlyJobs, setMonthlyJobs] = useState(1);
  const [copied, setCopied] = useState(false);

  const result = useMemo(
    () => (mode === 'gross' ? calculateFromGross(amount) : calculateFromNet(amount)),
    [mode, amount],
  );

  const month = useMemo(() => ({
    gross: result.gross * monthlyJobs,
    tax: result.totalTax * monthlyJobs,
    net: result.net * monthlyJobs,
  }), [result, monthlyJobs]);

  const annual = useMemo(() => ({
    gross: month.gross * 12,
    tax: month.tax * 12,
    net: month.net * 12,
  }), [month]);

  const summary = [
    `프리랜서 3.3% 계산 결과`,
    `세전 금액: ${formatWon(result.gross)}`,
    `소득세 3%: ${formatWon(result.incomeTax)}`,
    `지방소득세: ${formatWon(result.localIncomeTax)}`,
    `총 원천징수: ${formatWon(result.totalTax)}`,
    `예상 실수령액: ${formatWon(result.net)}`,
  ].join('\n');

  const copyResult = async () => {
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const shareResult = async () => {
    if (navigator.share) {
      await navigator.share({ title: '프리랜서 3.3% 계산 결과', text: summary });
      return;
    }
    await copyResult();
  };

  return (
    <section className="calculator-shell" id="calculator" aria-labelledby="calculator-title">
      <div className="calculator-head">
        <div>
          <span className="eyebrow">2026 기준 · 로컬 계산</span>
          <h2 id="calculator-title">프리랜서 3.3% 계산기</h2>
          <p>입력한 금액은 서버로 전송하지 않습니다.</p>
        </div>
        <div className="mode-tabs" aria-label="계산 방식 선택">
          <button className={mode === 'gross' ? 'active' : ''} onClick={() => setMode('gross')}>세전 → 세후</button>
          <button className={mode === 'net' ? 'active' : ''} onClick={() => setMode('net')}>세후 → 세전</button>
        </div>
      </div>

      <div className="input-card">
        <label htmlFor="amount">{mode === 'gross' ? '지급받기로 한 세전 금액' : '받고 싶은 세후 금액'}</label>
        <div className="money-input">
          <input
            id="amount"
            inputMode="numeric"
            value={formatInput(amount)}
            onChange={(event) => setAmount(parseDigits(event.target.value))}
            placeholder="1,000,000"
            aria-describedby="amount-help"
          />
          <span>원</span>
        </div>
        <p id="amount-help" className="input-help">용역비·원고료·외주비 등 3.3% 원천징수 대상 사업소득을 가정합니다.</p>
        <div className="preset-row">
          {PRESETS.map((preset) => (
            <button key={preset} onClick={() => setAmount(preset)}>{preset >= 10000 ? `${preset / 10000}만` : preset}</button>
          ))}
          <button className="ghost" onClick={() => setAmount(0)}>초기화</button>
        </div>
      </div>

      <div className="result-grid" aria-live="polite">
        <article className="result-main">
          <span>{mode === 'gross' ? '예상 실수령액' : '필요 세전 금액'}</span>
          <strong>{formatWon(mode === 'gross' ? result.net : result.gross)}</strong>
          <p>{result.gross ? `총 원천징수 ${formatWon(result.totalTax)}` : '금액을 입력하면 바로 계산됩니다.'}</p>
        </article>

        <article className="breakdown-card">
          <div><span>세전 금액</span><b>{formatWon(result.gross)}</b></div>
          <div><span>소득세 3%</span><b>- {formatWon(result.incomeTax)}</b></div>
          <div><span>지방소득세</span><b>- {formatWon(result.localIncomeTax)}</b></div>
          <div className="total-line"><span>실수령액</span><b>{formatWon(result.net)}</b></div>
        </article>
      </div>

      <div className="planning-card">
        <div className="planning-copy">
          <span className="eyebrow">월 수입 빠른 추정</span>
          <h3>이 금액을 한 달에 몇 건 받나요?</h3>
          <p>건수를 바꾸면 월·연간 세전/세후 규모를 함께 볼 수 있습니다.</p>
        </div>
        <div className="stepper" aria-label="월 예상 건수">
          <button onClick={() => setMonthlyJobs((value) => Math.max(1, value - 1))}>−</button>
          <strong>{monthlyJobs}건</strong>
          <button onClick={() => setMonthlyJobs((value) => Math.min(100, value + 1))}>＋</button>
        </div>
        <div className="projection-grid">
          <div><span>월 세전</span><b>{formatWon(month.gross)}</b></div>
          <div><span>월 실수령</span><b>{formatWon(month.net)}</b></div>
          <div><span>연 세전</span><b>{formatWon(annual.gross)}</b></div>
          <div><span>연 실수령</span><b>{formatWon(annual.net)}</b></div>
        </div>
      </div>

      <div className="action-row">
        <button className="primary-action" onClick={copyResult}>{copied ? '복사 완료' : '결과 복사'}</button>
        <button className="secondary-action" onClick={shareResult}>공유하기</button>
      </div>
    </section>
  );
}

'use client';

import { FormEvent, useMemo, useState } from 'react';
import { Solar } from 'lunar-javascript';

type ElementKey = '목' | '화' | '토' | '금' | '수';

type Pillar = {
  label: string;
  value: string;
  element: string;
};

type Report = {
  pillars: Pillar[];
  counts: Record<ElementKey, number>;
  strongest: ElementKey;
  weakest: ElementKey;
  summary: string;
};

const ELEMENTS: ElementKey[] = ['목', '화', '토', '금', '수'];
const ELEMENT_MAP: Record<string, ElementKey> = {
  木: '목', 火: '화', 土: '토', 金: '금', 水: '수',
};

const descriptions: Record<ElementKey, string> = {
  목: '성장, 기획, 확장, 새로운 시작과 연결되는 기운',
  화: '표현, 추진력, 열정, 존재감을 드러내는 기운',
  토: '안정, 현실성, 중재, 꾸준함과 연결되는 기운',
  금: '판단, 결단, 원칙, 정리 능력과 연결되는 기운',
  수: '사고, 유연함, 학습, 정보와 흐름에 연결되는 기운',
};

function buildReport(year: number, month: number, day: number, hour: number, minute: number): Report {
  const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
  const eightChar = solar.getLunar().getEightChar();

  const pillars: Pillar[] = [
    { label: '년주', value: eightChar.getYear(), element: eightChar.getYearWuXing() },
    { label: '월주', value: eightChar.getMonth(), element: eightChar.getMonthWuXing() },
    { label: '일주', value: eightChar.getDay(), element: eightChar.getDayWuXing() },
    { label: '시주', value: eightChar.getTime(), element: eightChar.getTimeWuXing() },
  ];

  const counts: Record<ElementKey, number> = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };

  for (const pillar of pillars) {
    for (const char of pillar.element) {
      const key = ELEMENT_MAP[char];
      if (key) counts[key] += 1;
    }
  }

  const sorted = [...ELEMENTS].sort((a, b) => counts[b] - counts[a]);
  const strongest = sorted[0];
  const weakest = sorted[sorted.length - 1];
  const summary = `${strongest} 기운이 가장 두드러지고 ${weakest} 기운이 상대적으로 적습니다. 강한 ${strongest}의 장점을 살리되, ${weakest}의 성향을 의식적으로 보완하는 방향으로 해석할 수 있습니다.`;

  return { pillars, counts, strongest, weakest, summary };
}

export default function Home() {
  const [birthDate, setBirthDate] = useState('1990-01-01');
  const [birthTime, setBirthTime] = useState('12:00');
  const [gender, setGender] = useState('male');
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState('');

  const maxCount = useMemo(() => report ? Math.max(...Object.values(report.counts), 1) : 1, [report]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    const [year, month, day] = birthDate.split('-').map(Number);
    const [hour, minute] = birthTime.split(':').map(Number);

    if (!year || !month || !day || Number.isNaN(hour) || Number.isNaN(minute)) {
      setError('생년월일과 출생시간을 확인해 주세요.');
      return;
    }

    try {
      setReport(buildReport(year, month, day, hour, minute));
    } catch {
      setError('해당 날짜의 사주를 계산하지 못했습니다. 입력값을 다시 확인해 주세요.');
    }
  }

  return (
    <main className="shell">
      <section className="hero">
        <span className="eyebrow">MULTI · PROJECT 001</span>
        <h1>내 사주의 오행 균형을<br />한눈에 확인하세요.</h1>
        <p>생년월일과 출생시간을 입력하면 사주 네 기둥과 오행 분포를 간단한 리포트로 보여줍니다.</p>
      </section>

      <section className="panel formPanel">
        <form onSubmit={submit}>
          <div className="grid">
            <label>
              <span>생년월일</span>
              <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} required />
            </label>
            <label>
              <span>출생시간</span>
              <input type="time" value={birthTime} onChange={(e) => setBirthTime(e.target.value)} required />
            </label>
            <label>
              <span>성별</span>
              <select value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="male">남성</option>
                <option value="female">여성</option>
              </select>
            </label>
          </div>
          <button type="submit">사주 리포트 보기</button>
          {error && <p className="error">{error}</p>}
        </form>
      </section>

      {report && (
        <section className="results">
          <div className="panel">
            <div className="sectionTitle">
              <span>사주 원국</span>
              <strong>{gender === 'male' ? '남성' : '여성'} 기준</strong>
            </div>
            <div className="pillars">
              {report.pillars.map((pillar) => (
                <article key={pillar.label} className="pillar">
                  <small>{pillar.label}</small>
                  <b>{pillar.value}</b>
                  <span>{pillar.element}</span>
                </article>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="sectionTitle">
              <span>오행 분포</span>
              <strong>총 8글자 기준</strong>
            </div>
            <div className="elementList">
              {ELEMENTS.map((element) => (
                <div className="elementRow" key={element}>
                  <div className="elementName"><b>{element}</b><span>{report.counts[element]}</span></div>
                  <div className="bar"><i style={{ width: `${(report.counts[element] / maxCount) * 100}%` }} /></div>
                  <p>{descriptions[element]}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="panel insight">
            <span className="eyebrow">오늘의 기본 해석</span>
            <h2>{report.strongest}의 힘을 살리고, {report.weakest}를 보완하세요.</h2>
            <p>{report.summary}</p>
            <div className="notice">본 서비스는 전통 명리학 정보를 재미와 자기이해 목적으로 제공하는 MVP입니다. 중요한 재정·건강·법률 의사결정의 근거로 사용하지 마세요.</div>
          </div>
        </section>
      )}

      <footer>Multi Project 001 · Saju Element Report</footer>
    </main>
  );
}

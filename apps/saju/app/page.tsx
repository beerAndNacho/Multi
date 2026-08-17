'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import BirthProfileFields from '../components/BirthProfileFields';
import {
  BALANCE_GUIDES,
  ELEMENTS,
  ELEMENT_DESCRIPTION,
  BirthProfile,
  CompatibilityResult,
  RelationshipType,
  SajuChart,
  buildBasicInterpretation,
  calculateCompatibility,
  calculateSaju,
} from '../lib/saju-core';

const DEFAULT_PROFILE: BirthProfile = {
  name: '',
  gender: 'male',
  calendarType: 'solar',
  birthDate: '1990-01-01',
  birthTime: '12:00',
  timeKnown: true,
  leapMonth: false,
};

const RELATIONSHIP_LABEL: Record<RelationshipType, string> = {
  romance: '연애',
  marriage: '결혼',
  friend: '친구',
  work: '직장·동료',
};

function genderLabel(profile: BirthProfile) {
  return profile.gender === 'male' ? '남성' : '여성';
}

export default function Home() {
  const [profile, setProfile] = useState<BirthProfile>(DEFAULT_PROFILE);
  const [chart, setChart] = useState<SajuChart | null>(null);
  const [sajuError, setSajuError] = useState('');

  const [personA, setPersonA] = useState<BirthProfile>({ ...DEFAULT_PROFILE, name: '나' });
  const [personB, setPersonB] = useState<BirthProfile>({ ...DEFAULT_PROFILE, name: '상대' });
  const [relationshipType, setRelationshipType] = useState<RelationshipType>('romance');
  const [compatibility, setCompatibility] = useState<CompatibilityResult | null>(null);
  const [compatibilityError, setCompatibilityError] = useState('');

  const [premiumToken, setPremiumToken] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiText, setAiText] = useState('');

  const interpretation = useMemo(() => chart ? buildBasicInterpretation(chart) : null, [chart]);
  const maxCount = useMemo(() => chart ? Math.max(...Object.values(chart.counts), 1) : 1, [chart]);

  useEffect(() => {
    const token = localStorage.getItem('saju:premium-token') || '';
    setPremiumToken(token);

    const params = new URLSearchParams(window.location.search);
    if (params.get('premium') !== '1') return;

    const raw = localStorage.getItem('saju:last-input');
    if (!raw) return;

    try {
      const saved = JSON.parse(raw) as BirthProfile;
      const restored = calculateSaju(saved);
      setProfile(saved);
      setChart(restored);
    } catch {
      localStorage.removeItem('saju:last-input');
    }
  }, []);

  function submitSaju(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSajuError('');
    setAiText('');

    try {
      const nextChart = calculateSaju(profile);
      setChart(nextChart);
      requestAnimationFrame(() => document.getElementById('saju-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    } catch (error) {
      setSajuError(error instanceof Error ? error.message : '입력한 정보를 계산하지 못했습니다.');
    }
  }

  function copyProfileToA() {
    setPersonA({ ...profile, name: profile.name?.trim() || '나' });
    setCompatibility(null);
    setCompatibilityError('');
    requestAnimationFrame(() => document.getElementById('compatibility')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  }

  function submitCompatibility(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCompatibilityError('');

    try {
      const chartA = calculateSaju(personA);
      const chartB = calculateSaju(personB);
      const result = calculateCompatibility(chartA, chartB, relationshipType);
      setCompatibility(result);
      requestAnimationFrame(() => document.getElementById('compatibility-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    } catch (error) {
      setCompatibilityError(error instanceof Error ? error.message : '두 사람의 정보를 계산하지 못했습니다.');
    }
  }

  async function startCheckout() {
    if (!chart) return;
    setCheckoutLoading(true);
    setSajuError('');
    localStorage.setItem('saju:last-input', JSON.stringify(profile));

    try {
      const response = await fetch('/api/checkout', { method: 'POST' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || '결제 페이지를 만들지 못했습니다.');
      window.location.href = data.url;
    } catch (error) {
      setSajuError(error instanceof Error ? error.message : '결제를 시작하지 못했습니다.');
      setCheckoutLoading(false);
    }
  }

  async function generateAiReport() {
    if (!chart || !premiumToken || !interpretation) return;
    setAiLoading(true);
    setSajuError('');

    try {
      const response = await fetch('/api/interpret', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${premiumToken}`,
        },
        body: JSON.stringify({ profile, report: { ...chart, ...interpretation } }),
      });
      const data = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('saju:premium-token');
          setPremiumToken('');
        }
        throw new Error(data.error || 'AI 해석을 만들지 못했습니다.');
      }
      setAiText(data.text);
    } catch (error) {
      setSajuError(error instanceof Error ? error.message : 'AI 해석을 만들지 못했습니다.');
    } finally {
      setAiLoading(false);
    }
  }

  return (
    <main className="shell">
      <header className="topbar">
        <div className="brand"><span>萬</span><b>오늘의 명리</b></div>
        <span className="projectBadge">MULTI · 001 / 100</span>
      </header>

      <nav className="serviceNav" aria-label="서비스 메뉴">
        <a href="#saju">내 사주</a>
        <a href="#compatibility">궁합</a>
      </nav>

      <section className="hero">
        <div className="heroCopy">
          <span className="eyebrow">SAJU · FIVE ELEMENT · COMPATIBILITY</span>
          <h1>타고난 흐름을<br /><em>가볍고 선명하게.</em></h1>
          <p>한 사람의 사주 원국과 오행 균형부터 두 사람의 관계 밸런스까지, 같은 출생정보 기준으로 일관되게 계산합니다.</p>
          <div className="heroFacts">
            <span>✓ 양력·음력·윤달</span>
            <span>✓ 출생시간 미상</span>
            <span>✓ 사주 원국·오행</span>
            <span>✓ 성별 포함 궁합</span>
          </div>
        </div>
        <aside className="heroSeal"><span>命</span><small>나를 이해하는<br />작은 데이터</small></aside>
      </section>

      <section id="saju" className="sectionBlock">
        <div className="sectionIntro">
          <span className="eyebrow">01 · MY SAJU</span>
          <h2>내 사주 보기</h2>
          <p>결과를 본 뒤에도 입력 폼은 그대로 유지됩니다. 날짜·시간·성별을 바꿔 계속 다시 계산할 수 있습니다.</p>
        </div>

        <section className="panel formPanel">
          <form onSubmit={submitSaju}>
            <BirthProfileFields profile={profile} onChange={setProfile} />
            <button className="primaryButton" type="submit">무료 사주 리포트 보기</button>
            {sajuError && <p className="error">{sajuError}</p>}
          </form>
        </section>

        {chart && interpretation && (
          <div id="saju-result" className="results">
            <section className="panel summaryPanel">
              <div className="sectionTitle">
                <div><small>SAJU CHART</small><h2>나의 기본 원국</h2></div>
                <span>{genderLabel(chart.profile)} · {chart.totalChars}글자 기준</span>
              </div>
              <div className="dateLine"><span>양력 {chart.solarDate}</span><i>·</i><span>음력 {chart.lunarDate}</span></div>
              <div className="identityGrid">
                <article><small>일간</small><b>{chart.dayMaster}</b><span>{chart.dayMasterYinYang}{chart.dayMasterElement}</span></article>
                <article><small>띠</small><b>{chart.zodiac}띠</b><span>태어난 해의 상징</span></article>
                <article><small>강한 기운</small><b>{chart.strongest}</b><span>{ELEMENT_DESCRIPTION[chart.strongest]}</span></article>
                <article><small>보완 포인트</small><b>{chart.weakest}</b><span>{ELEMENT_DESCRIPTION[chart.weakest]}</span></article>
              </div>
              <div className={`pillars ${chart.totalChars === 6 ? 'three' : ''}`}>
                {chart.pillars.map((pillar) => (
                  <article className="pillar" key={pillar.label}><small>{pillar.label}</small><b>{pillar.value}</b><span>{pillar.element}</span></article>
                ))}
              </div>
              {!chart.profile.timeKnown && <p className="timeNotice">출생시간 미상으로 시주를 제외한 6글자 기준 결과입니다. 시간을 알게 되면 위 입력에서 체크를 해제하고 다시 계산할 수 있습니다.</p>}
            </section>

            <section className="panel">
              <div className="sectionTitle"><div><small>FIVE ELEMENTS</small><h2>오행 분포</h2></div><span>원국 {chart.totalChars}글자</span></div>
              <div className="elementList">
                {ELEMENTS.map((element) => (
                  <div className="elementRow" key={element}>
                    <div className="elementName"><b>{element}</b><span>{chart.counts[element]}</span></div>
                    <div className="bar"><i style={{ width: `${(chart.counts[element] / maxCount) * 100}%` }} /></div>
                    <p>{ELEMENT_DESCRIPTION[element]}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="panel insightPanel">
              <span className="eyebrow">BASIC READING</span>
              <h2>{chart.strongest}의 힘을 살리고, {chart.weakest}를 보완하세요.</h2>
              <p>{interpretation.summary}</p>
              <div className="readingGrid">
                <article><span>일과 강점</span><p>{interpretation.career}</p></article>
                <article><span>돈을 다루는 방식</span><p>{interpretation.money}</p></article>
                <article><span>관계와 소통</span><p>{interpretation.relationship}</p></article>
              </div>
              <div className="tipList">
                {BALANCE_GUIDES[chart.weakest].map((tip) => <div className="tip" key={tip}>✓ {tip}</div>)}
              </div>
              <div className="resultActions">
                <a className="secondaryButton buttonLike" href="#saju">입력 수정해서 다시 보기</a>
                <button type="button" className="secondaryButton" onClick={copyProfileToA}>이 정보를 궁합 A에 사용</button>
              </div>
            </section>

            <section className="premiumPanel">
              <div><span className="eyebrow">PREMIUM</span><h2>AI 상세 사주 리포트</h2><p>무료 결과를 바탕으로 성향·일·돈·관계·실천 포인트를 더 긴 문장으로 정리합니다.</p></div>
              {premiumToken ? (
                <button className="premiumButton" type="button" disabled={aiLoading} onClick={generateAiReport}>{aiLoading ? 'AI가 해석 중...' : '구매한 AI 리포트 생성하기'}</button>
              ) : (
                <button className="premiumButton" type="button" disabled={checkoutLoading} onClick={startCheckout}>{checkoutLoading ? '결제 페이지 준비 중...' : '4,900원 · AI 상세해석 열기'}</button>
              )}
              {aiText && <div className="aiReport"><span>AI DETAIL REPORT</span>{aiText.split('\n').map((line, index) => line.trim() ? <p key={`${index}-${line}`}>{line}</p> : null)}</div>}
            </section>
          </div>
        )}
      </section>

      <section id="compatibility" className="sectionBlock compatibilitySection">
        <div className="sectionIntro">
          <span className="eyebrow">02 · COMPATIBILITY</span>
          <h2>두 사람의 궁합 밸런스</h2>
          <p>성별을 포함한 동일한 출생정보 모델로 두 사람을 각각 계산한 뒤, 오행 조화·상호 보완·일간 관계·음양 리듬을 나누어 보여줍니다.</p>
        </div>

        <form className="panel compatibilityForm" onSubmit={submitCompatibility}>
          <label className="relationshipSelect">
            <span>어떤 관계를 보고 싶나요?</span>
            <select value={relationshipType} onChange={(event) => setRelationshipType(event.target.value as RelationshipType)}>
              {Object.entries(RELATIONSHIP_LABEL).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>

          <div className="peopleGrid">
            <fieldset className="personCard">
              <legend>A · 나</legend>
              <BirthProfileFields profile={personA} onChange={(next) => { setPersonA(next); setCompatibility(null); }} showName nameLabel="이름 또는 호칭" compact />
            </fieldset>
            <fieldset className="personCard">
              <legend>B · 상대</legend>
              <BirthProfileFields profile={personB} onChange={(next) => { setPersonB(next); setCompatibility(null); }} showName nameLabel="이름 또는 호칭" compact />
            </fieldset>
          </div>

          <div className="compatibilityActions">
            <button type="button" className="secondaryButton" onClick={copyProfileToA}>위의 내 사주 입력값을 A에 가져오기</button>
            <button type="submit" className="primaryButton">{RELATIONSHIP_LABEL[relationshipType]} 궁합 밸런스 보기</button>
          </div>
          {compatibilityError && <p className="error">{compatibilityError}</p>}
        </form>

        {compatibility && (
          <section id="compatibility-result" className="panel compatibilityResult">
            <div className="compatibilityTop">
              <div className="scoreRing" style={{ '--score': `${compatibility.score * 3.6}deg` } as React.CSSProperties}>
                <div><b>{compatibility.score}</b><span>/ 100</span></div>
              </div>
              <div>
                <span className="eyebrow">{RELATIONSHIP_LABEL[relationshipType].toUpperCase()} BALANCE</span>
                <h2>{compatibility.headline}</h2>
                <p>{compatibility.summary}</p>
              </div>
            </div>

            <div className="breakdownGrid">
              <article><span>오행 조화</span><b>{compatibility.breakdown.distribution}</b><div><i style={{ width: `${compatibility.breakdown.distribution}%` }} /></div></article>
              <article><span>상호 보완</span><b>{compatibility.breakdown.complement}</b><div><i style={{ width: `${compatibility.breakdown.complement}%` }} /></div></article>
              <article><span>일간 관계</span><b>{compatibility.breakdown.dayMaster}</b><div><i style={{ width: `${compatibility.breakdown.dayMaster}%` }} /></div></article>
              <article><span>음양 리듬</span><b>{compatibility.breakdown.yinYang}</b><div><i style={{ width: `${compatibility.breakdown.yinYang}%` }} /></div></article>
            </div>

            <div className="compatibilityCards">
              <article><small>잘 맞는 점</small><p>{compatibility.good}</p></article>
              <article><small>보완 포인트</small><p>{compatibility.care}</p></article>
              <article><small>두 사람의 핵심</small><p>{compatibility.core}</p></article>
            </div>

            <p className="notice">궁합 지수는 관계의 미래나 성공 여부를 예측하는 값이 아니라, 전통 명리 요소를 단순화해 두 사람의 리듬을 비교하는 참고용 자기이해 지표입니다.</p>
            <a className="secondaryButton buttonLike" href="#compatibility">두 사람 정보 수정해서 다시 보기</a>
          </section>
        )}
      </section>

      <footer>
        <p>오늘의 명리 · Multi Project 001</p>
        <span>전통 명리 정보를 재미와 자기이해 목적으로 제공합니다. 건강·재정·법률 등 중요한 판단의 근거로 사용하지 마세요.</span>
      </footer>
    </main>
  );
}

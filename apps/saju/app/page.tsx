'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Lunar, Solar } from 'lunar-javascript';

type ElementKey = '목' | '화' | '토' | '금' | '수';
type CalendarType = 'solar' | 'lunar';
type Gender = 'male' | 'female';

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
  dayMaster: string;
  dayMasterElement: ElementKey;
  dayMasterYinYang: string;
  zodiac: string;
  solarDate: string;
  lunarDate: string;
  summary: string;
  career: string;
  money: string;
  relationship: string;
  balanceTips: string[];
  totalChars: number;
};

type SavedInput = {
  birthDate: string;
  birthTime: string;
  timeKnown: boolean;
  gender: Gender;
  calendarType: CalendarType;
  leapMonth: boolean;
};

const ELEMENTS: ElementKey[] = ['목', '화', '토', '금', '수'];
const ELEMENT_MAP: Record<string, ElementKey> = {
  木: '목', 火: '화', 土: '토', 金: '금', 水: '수',
};

const GAN_INFO: Record<string, { name: string; element: ElementKey; yinYang: string }> = {
  甲: { name: '갑', element: '목', yinYang: '양' },
  乙: { name: '을', element: '목', yinYang: '음' },
  丙: { name: '병', element: '화', yinYang: '양' },
  丁: { name: '정', element: '화', yinYang: '음' },
  戊: { name: '무', element: '토', yinYang: '양' },
  己: { name: '기', element: '토', yinYang: '음' },
  庚: { name: '경', element: '금', yinYang: '양' },
  辛: { name: '신', element: '금', yinYang: '음' },
  壬: { name: '임', element: '수', yinYang: '양' },
  癸: { name: '계', element: '수', yinYang: '음' },
};

const ZODIAC_MAP: Record<string, string> = {
  鼠: '쥐', 牛: '소', 虎: '호랑이', 兔: '토끼', 龙: '용', 龍: '용', 蛇: '뱀',
  马: '말', 馬: '말', 羊: '양', 猴: '원숭이', 鸡: '닭', 雞: '닭', 狗: '개', 猪: '돼지', 豬: '돼지',
};

const descriptions: Record<ElementKey, string> = {
  목: '성장 · 기획 · 확장 · 새로운 시작',
  화: '표현 · 추진력 · 열정 · 존재감',
  토: '안정 · 현실성 · 중재 · 지속성',
  금: '판단 · 결단 · 원칙 · 정리',
  수: '사고 · 유연함 · 학습 · 정보',
};

const balanceGuides: Record<ElementKey, string[]> = {
  목: ['새로운 기술이나 취미를 배우며 성장 자극을 만들기', '계획을 작은 실행 단위로 쪼개 시작 횟수를 늘리기', '새로운 사람·환경과 연결되는 시간을 의식적으로 확보하기'],
  화: ['생각을 말·글·콘텐츠로 밖에 표현하는 습관 만들기', '짧고 선명한 목표를 정해 추진력을 끌어올리기', '몸을 움직이는 활동으로 에너지 순환을 만들기'],
  토: ['수면·식사·업무 시간을 일정하게 만들어 기본 리듬 잡기', '큰 변화보다 반복 가능한 작은 루틴을 우선하기', '돈과 일정처럼 현실 자원을 숫자로 정리해 보기'],
  금: ['해야 할 일과 하지 않을 일을 명확히 구분하기', '정리·삭제·마감처럼 끝을 만드는 행동을 늘리기', '감정과 사실을 분리해서 판단 기준을 적어 보기'],
  수: ['혼자 생각하고 정리하는 시간을 일정에 넣기', '읽기·기록·대화를 통해 새로운 정보를 받아들이기', '계획이 틀어졌을 때 대안을 두세 개 준비해 유연성을 높이기'],
};

function buildReport(input: SavedInput): Report {
  const [year, rawMonth, day] = input.birthDate.split('-').map(Number);
  const [rawHour, rawMinute] = input.birthTime.split(':').map(Number);
  const hour = input.timeKnown ? rawHour : 12;
  const minute = input.timeKnown ? rawMinute : 0;

  if (!year || !rawMonth || !day || Number.isNaN(hour) || Number.isNaN(minute)) {
    throw new Error('invalid birth input');
  }

  const lunar = input.calendarType === 'lunar'
    ? Lunar.fromYmdHms(year, input.leapMonth ? -rawMonth : rawMonth, day, hour, minute, 0)
    : Solar.fromYmdHms(year, rawMonth, day, hour, minute, 0).getLunar();

  const eightChar = lunar.getEightChar();
  const allPillars: Pillar[] = [
    { label: '년주', value: eightChar.getYear(), element: eightChar.getYearWuXing() },
    { label: '월주', value: eightChar.getMonth(), element: eightChar.getMonthWuXing() },
    { label: '일주', value: eightChar.getDay(), element: eightChar.getDayWuXing() },
    { label: '시주', value: eightChar.getTime(), element: eightChar.getTimeWuXing() },
  ];
  const pillars = input.timeKnown ? allPillars : allPillars.slice(0, 3);

  const counts: Record<ElementKey, number> = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
  for (const pillar of pillars) {
    for (const char of pillar.element) {
      const key = ELEMENT_MAP[char];
      if (key) counts[key] += 1;
    }
  }

  const sorted = [...ELEMENTS].sort((a, b) => counts[b] - counts[a]);
  const strongest = sorted[0];
  const weakest = [...ELEMENTS].sort((a, b) => counts[a] - counts[b])[0];
  const dayGan = eightChar.getDay().slice(0, 1);
  const dayInfo = GAN_INFO[dayGan] || { name: dayGan, element: strongest, yinYang: '' };
  const zodiacRaw = lunar.getYearShengXiao();
  const zodiac = ZODIAC_MAP[zodiacRaw] || zodiacRaw;

  const summary = `${dayInfo.yinYang}${dayInfo.element} 성향의 ${dayInfo.name} 일간을 중심으로, 전체 원국에서는 ${strongest} 기운이 가장 두드러집니다. ${weakest} 기운은 상대적으로 적어 의식적으로 보완 포인트를 만들면 전체 균형을 이해하는 데 도움이 됩니다.`;
  const career = `${strongest} 기운의 강점을 업무 방식에 살리는 편이 자연스럽습니다. ${descriptions[strongest]}에 해당하는 환경에서 강점이 드러날 가능성을 살펴보고, ${weakest} 성향이 필요한 업무는 루틴이나 협업으로 보완해 보세요.`;
  const money = `재물 흐름은 특정 사건을 예언하기보다 돈을 다루는 습관으로 보는 편이 실용적입니다. 강한 ${strongest} 성향이 소비·저축·투자 판단에 어떻게 나타나는지 기록하고, 부족한 ${weakest} 특성을 예산·규칙·검토 과정에 넣어 균형을 만들어 보세요.`;
  const relationship = `${dayInfo.name} 일간의 기본 리듬과 강한 ${strongest} 기운이 소통 방식에 드러날 수 있습니다. 상대에게 기대하는 속도와 표현 방식을 명확히 말하고, ${weakest} 성향의 행동을 의식적으로 추가하면 관계 패턴을 넓혀 보는 데 도움이 됩니다.`;

  return {
    pillars,
    counts,
    strongest,
    weakest,
    dayMaster: `${dayGan}(${dayInfo.name})`,
    dayMasterElement: dayInfo.element,
    dayMasterYinYang: dayInfo.yinYang,
    zodiac,
    solarDate: lunar.getSolar().toYmd(),
    lunarDate: lunar.toString(),
    summary,
    career,
    money,
    relationship,
    balanceTips: balanceGuides[weakest],
    totalChars: input.timeKnown ? 8 : 6,
  };
}

export default function Home() {
  const [birthDate, setBirthDate] = useState('1990-01-01');
  const [birthTime, setBirthTime] = useState('12:00');
  const [timeKnown, setTimeKnown] = useState(true);
  const [gender, setGender] = useState<Gender>('male');
  const [calendarType, setCalendarType] = useState<CalendarType>('solar');
  const [leapMonth, setLeapMonth] = useState(false);
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState('');
  const [premiumToken, setPremiumToken] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiText, setAiText] = useState('');

  const currentInput: SavedInput = { birthDate, birthTime, timeKnown, gender, calendarType, leapMonth };
  const maxCount = useMemo(() => report ? Math.max(...Object.values(report.counts), 1) : 1, [report]);

  useEffect(() => {
    const token = localStorage.getItem('saju:premium-token') || '';
    setPremiumToken(token);

    const params = new URLSearchParams(window.location.search);
    if (params.get('premium') !== '1') return;

    const raw = localStorage.getItem('saju:last-input');
    if (!raw) return;
    try {
      const saved = JSON.parse(raw) as SavedInput;
      setBirthDate(saved.birthDate);
      setBirthTime(saved.birthTime);
      setTimeKnown(saved.timeKnown);
      setGender(saved.gender);
      setCalendarType(saved.calendarType);
      setLeapMonth(saved.leapMonth);
      setReport(buildReport(saved));
    } catch {
      localStorage.removeItem('saju:last-input');
    }
  }, []);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setAiText('');
    try {
      setReport(buildReport(currentInput));
    } catch {
      setError('입력한 날짜를 계산하지 못했습니다. 양력/음력, 윤달 여부와 날짜를 다시 확인해 주세요.');
    }
  }

  async function startCheckout() {
    if (!report) return;
    setCheckoutLoading(true);
    setError('');
    localStorage.setItem('saju:last-input', JSON.stringify(currentInput));

    try {
      const response = await fetch('/api/checkout', { method: 'POST' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || '결제 페이지를 만들지 못했습니다.');
      window.location.href = data.url;
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : '결제를 시작하지 못했습니다.');
      setCheckoutLoading(false);
    }
  }

  async function generateAiReport() {
    if (!report || !premiumToken) return;
    setAiLoading(true);
    setError('');

    try {
      const response = await fetch('/api/interpret', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${premiumToken}`,
        },
        body: JSON.stringify({
          profile: {
            calendarType,
            birthDate,
            birthTime: timeKnown ? birthTime : 'unknown',
            timeKnown,
            gender,
          },
          report,
        }),
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
    } catch (aiError) {
      setError(aiError instanceof Error ? aiError.message : 'AI 해석을 만들지 못했습니다.');
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

      <section className="hero">
        <div className="heroCopy">
          <span className="eyebrow">SAJU · FIVE ELEMENT REPORT</span>
          <h1>타고난 흐름을<br /><em>가볍고 선명하게.</em></h1>
          <p>생년월일과 시간을 바탕으로 사주 네 기둥, 일간, 오행 균형을 계산하고 현대적인 자기이해 리포트로 풀어봅니다.</p>
          <div className="heroFacts">
            <span>✓ 양력·음력 지원</span><span>✓ 출생시간 미상 가능</span><span>✓ AI 상세해석</span>
          </div>
        </div>
        <div className="heroSeal" aria-hidden="true"><i>命</i><small>五行</small></div>
      </section>

      <section className="panel formPanel">
        <div className="panelHeading">
          <div><span className="step">01</span><h2>출생 정보</h2></div>
          <p>입력 정보는 현재 브라우저에서 계산에만 사용됩니다.</p>
        </div>
        <form onSubmit={submit}>
          <div className="segmented" aria-label="달력 종류">
            <button type="button" className={calendarType === 'solar' ? 'active' : ''} onClick={() => { setCalendarType('solar'); setLeapMonth(false); }}>양력</button>
            <button type="button" className={calendarType === 'lunar' ? 'active' : ''} onClick={() => setCalendarType('lunar')}>음력</button>
          </div>

          <div className="grid">
            <label>
              <span>{calendarType === 'solar' ? '양력 생년월일' : '음력 생년월일'}</span>
              <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} required />
            </label>
            <label className={!timeKnown ? 'mutedField' : ''}>
              <span>출생시간</span>
              <input type="time" value={birthTime} onChange={(e) => setBirthTime(e.target.value)} disabled={!timeKnown} required={timeKnown} />
            </label>
            <label>
              <span>성별</span>
              <select value={gender} onChange={(e) => setGender(e.target.value as Gender)}>
                <option value="male">남성</option>
                <option value="female">여성</option>
              </select>
            </label>
          </div>

          <div className="optionRow">
            <label className="checkLabel">
              <input type="checkbox" checked={!timeKnown} onChange={(e) => setTimeKnown(!e.target.checked)} />
              <span>출생시간을 몰라요</span>
            </label>
            {calendarType === 'lunar' && (
              <label className="checkLabel">
                <input type="checkbox" checked={leapMonth} onChange={(e) => setLeapMonth(e.target.checked)} />
                <span>윤달이에요</span>
              </label>
            )}
          </div>

          <button className="primaryButton" type="submit"><span>무료 사주 리포트 보기</span><b>→</b></button>
          {error && <p className="error">{error}</p>}
        </form>
      </section>

      {report && (
        <section className="results">
          <div className="resultIntro">
            <span className="eyebrow">YOUR SAJU REPORT</span>
            <h2>{report.dayMaster} 일간의<br /><em>{report.strongest} 기운이 돋보이는 사주</em></h2>
            <div className="dateMeta"><span>양력 {report.solarDate}</span><span>음력 {report.lunarDate}</span><span>{report.zodiac}띠</span></div>
          </div>

          <div className="panel">
            <div className="panelHeading compact">
              <div><span className="step">02</span><h2>사주 원국</h2></div>
              <p>{timeKnown ? '년 · 월 · 일 · 시 네 기둥' : '출생시간 미상 · 시주 제외'}</p>
            </div>
            <div className={`pillars ${!timeKnown ? 'three' : ''}`}>
              {report.pillars.map((pillar) => (
                <article key={pillar.label} className="pillar">
                  <small>{pillar.label}</small>
                  <b>{pillar.value}</b>
                  <span>{pillar.element}</span>
                </article>
              ))}
            </div>
            <div className="dayMasterCard">
              <span>나를 나타내는 일간</span>
              <strong>{report.dayMaster}</strong>
              <p>{report.dayMasterYinYang}{report.dayMasterElement} 기운 · 전체 해석의 중심축</p>
            </div>
          </div>

          <div className="panel">
            <div className="panelHeading compact">
              <div><span className="step">03</span><h2>오행 밸런스</h2></div>
              <p>원국 {report.totalChars}글자 기준</p>
            </div>
            <div className="elementList">
              {ELEMENTS.map((element) => (
                <div className={`elementRow element-${element}`} key={element}>
                  <div className="elementName"><b>{element}</b><span>{report.counts[element]}</span></div>
                  <div className="bar"><i style={{ width: `${(report.counts[element] / maxCount) * 100}%` }} /></div>
                  <p>{descriptions[element]}</p>
                </div>
              ))}
            </div>
            <div className="balanceSummary">
              <div><small>가장 강한 기운</small><b>{report.strongest}</b></div>
              <div><small>보완 포인트</small><b>{report.weakest}</b></div>
              <p>‘보완 포인트’는 정밀 용신 판정이 아니라 오행 분포를 단순화한 자기점검 지표입니다.</p>
            </div>
          </div>

          <div className="insightGrid">
            <article className="panel insightCard"><span>CORE</span><h3>핵심 성향</h3><p>{report.summary}</p></article>
            <article className="panel insightCard"><span>WORK</span><h3>일과 강점</h3><p>{report.career}</p></article>
            <article className="panel insightCard"><span>MONEY</span><h3>돈을 다루는 방식</h3><p>{report.money}</p></article>
            <article className="panel insightCard"><span>RELATION</span><h3>관계와 소통</h3><p>{report.relationship}</p></article>
          </div>

          <div className="panel balancePanel">
            <div className="panelHeading compact">
              <div><span className="step">04</span><h2>{report.weakest} 기운 보완 루틴</h2></div>
              <p>오늘부터 적용할 수 있는 작은 행동</p>
            </div>
            <ol>{report.balanceTips.map((tip, index) => <li key={tip}><span>{String(index + 1).padStart(2, '0')}</span><p>{tip}</p></li>)}</ol>
          </div>

          <div className={`premiumPanel ${premiumToken ? 'unlocked' : ''}`}>
            <div className="premiumGlow" />
            <div className="premiumHead">
              <span className="premiumIcon">✦</span>
              <div><span className="eyebrow">AI PREMIUM</span><h2>{premiumToken ? '프리미엄 리포트가 열렸습니다.' : '더 깊은 해석이 필요하다면'}</h2></div>
            </div>
            <p className="premiumLead">원국과 오행 분포를 바탕으로 핵심 성향, 일과 돈, 관계, 균형을 위한 실천을 AI가 한 번 더 깊게 풀어드립니다.</p>

            {!premiumToken ? (
              <>
                <div className="premiumPreview">
                  <div><b>01</b><span>핵심 성향 심층 분석</span></div>
                  <div><b>02</b><span>일과 돈의 흐름</span></div>
                  <div><b>03</b><span>관계와 소통 패턴</span></div>
                  <div><b>04</b><span>개인화 실천 가이드</span></div>
                </div>
                <button className="premiumButton" onClick={startCheckout} disabled={checkoutLoading}>
                  <span>{checkoutLoading ? '결제 페이지 준비 중…' : 'AI 프리미엄 리포트 열기'}</span><strong>₩4,900</strong>
                </button>
                <small className="paymentNote">1회 결제 · 결제 후 24시간 프리미엄 AI 해석 이용</small>
              </>
            ) : (
              <>
                {!aiText && <button className="premiumButton" onClick={generateAiReport} disabled={aiLoading}><span>{aiLoading ? 'AI가 리포트를 작성 중…' : '내 AI 상세해석 생성하기'}</span><strong>✦</strong></button>}
                {aiText && <div className="aiReport"><span className="eyebrow">PERSONAL INTERPRETATION</span><div>{aiText}</div></div>}
              </>
            )}
          </div>

          <div className="notice">이 서비스는 전통 명리학 데이터를 재미와 자기이해 관점에서 정리합니다. 결과는 가능성을 탐색하는 참고 정보이며 미래 사건을 확정적으로 예측하지 않습니다.</div>
        </section>
      )}

      <footer><span>萬</span><p>Multi Project 001 · 오늘의 명리</p><small>100개의 작은 서비스를 만드는 프로젝트</small></footer>
    </main>
  );
}

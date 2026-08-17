import { Lunar, Solar } from 'lunar-javascript';

export type ElementKey = '목' | '화' | '토' | '금' | '수';
export type CalendarType = 'solar' | 'lunar';
export type Gender = 'male' | 'female';
export type RelationshipType = 'romance' | 'marriage' | 'friend' | 'work';

export type BirthProfile = {
  name?: string;
  gender: Gender;
  calendarType: CalendarType;
  birthDate: string;
  birthTime: string;
  timeKnown: boolean;
  leapMonth: boolean;
};

export type Pillar = {
  label: string;
  value: string;
  element: string;
};

export type SajuChart = {
  profile: BirthProfile;
  pillars: Pillar[];
  counts: Record<ElementKey, number>;
  frequencies: Record<ElementKey, number>;
  strongest: ElementKey;
  weakest: ElementKey;
  dayMaster: string;
  dayMasterElement: ElementKey;
  dayMasterYinYang: '음' | '양' | '';
  zodiac: string;
  solarDate: string;
  lunarDate: string;
  totalChars: 6 | 8;
};

export type CompatibilityBreakdown = {
  distribution: number;
  complement: number;
  dayMaster: number;
  yinYang: number;
};

export type CompatibilityResult = {
  score: number;
  level: string;
  breakdown: CompatibilityBreakdown;
  headline: string;
  summary: string;
  good: string;
  care: string;
  core: string;
};

export const ELEMENTS: ElementKey[] = ['목', '화', '토', '금', '수'];

export const ELEMENT_DESCRIPTION: Record<ElementKey, string> = {
  목: '성장 · 기획 · 확장 · 새로운 시작',
  화: '표현 · 추진력 · 열정 · 존재감',
  토: '안정 · 현실성 · 중재 · 지속성',
  금: '판단 · 결단 · 원칙 · 정리',
  수: '사고 · 유연함 · 학습 · 정보',
};

export const BALANCE_GUIDES: Record<ElementKey, string[]> = {
  목: ['새로운 기술이나 취미를 배우며 성장 자극 만들기', '계획을 작은 실행 단위로 쪼개 시작 횟수 늘리기', '새로운 사람·환경과 연결되는 시간 확보하기'],
  화: ['생각을 말·글·콘텐츠로 밖에 표현하기', '짧고 선명한 목표로 추진력 끌어올리기', '몸을 움직이는 활동으로 에너지 순환 만들기'],
  토: ['수면·식사·업무 시간을 일정하게 유지하기', '반복 가능한 작은 루틴을 우선하기', '돈과 일정을 숫자로 정리하기'],
  금: ['해야 할 일과 하지 않을 일을 구분하기', '정리·삭제·마감처럼 끝을 만드는 행동 늘리기', '감정과 사실을 분리해 판단 기준 적기'],
  수: ['혼자 생각하고 정리하는 시간을 일정에 넣기', '읽기·기록·대화로 새로운 정보 받아들이기', '대안을 두세 개 준비해 유연성 높이기'],
};

const ELEMENT_MAP: Record<string, ElementKey> = { 木: '목', 火: '화', 土: '토', 金: '금', 水: '수' };

const GAN_INFO: Record<string, { name: string; element: ElementKey; yinYang: '음' | '양' }> = {
  甲: { name: '갑', element: '목', yinYang: '양' }, 乙: { name: '을', element: '목', yinYang: '음' },
  丙: { name: '병', element: '화', yinYang: '양' }, 丁: { name: '정', element: '화', yinYang: '음' },
  戊: { name: '무', element: '토', yinYang: '양' }, 己: { name: '기', element: '토', yinYang: '음' },
  庚: { name: '경', element: '금', yinYang: '양' }, 辛: { name: '신', element: '금', yinYang: '음' },
  壬: { name: '임', element: '수', yinYang: '양' }, 癸: { name: '계', element: '수', yinYang: '음' },
};

const ZODIAC_MAP: Record<string, string> = {
  鼠: '쥐', 牛: '소', 虎: '호랑이', 兔: '토끼', 龙: '용', 龍: '용', 蛇: '뱀',
  马: '말', 馬: '말', 羊: '양', 猴: '원숭이', 鸡: '닭', 雞: '닭', 狗: '개', 猪: '돼지', 豬: '돼지',
};

const GENERATES: Record<ElementKey, ElementKey> = { 목: '화', 화: '토', 토: '금', 금: '수', 수: '목' };
const CONTROLS: Record<ElementKey, ElementKey> = { 목: '토', 토: '수', 수: '화', 화: '금', 금: '목' };

const RELATION_LABEL: Record<RelationshipType, string> = {
  romance: '연애', marriage: '결혼', friend: '친구', work: '직장·동료',
};

const WEIGHTS: Record<RelationshipType, CompatibilityBreakdown> = {
  romance: { distribution: 30, complement: 25, dayMaster: 30, yinYang: 15 },
  marriage: { distribution: 30, complement: 30, dayMaster: 25, yinYang: 15 },
  friend: { distribution: 35, complement: 30, dayMaster: 25, yinYang: 10 },
  work: { distribution: 30, complement: 35, dayMaster: 25, yinYang: 10 },
};

function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, Math.round(value)));
}

export function validateBirthProfile(profile: BirthProfile): string | null {
  if (!profile.gender) return '성별을 선택해 주세요.';
  if (!profile.birthDate) return '생년월일을 입력해 주세요.';

  const [year, month, day] = profile.birthDate.split('-').map(Number);
  if (!year || !month || !day) return '생년월일 형식을 확인해 주세요.';
  if (month < 1 || month > 12 || day < 1 || day > 31) return '생년월일을 확인해 주세요.';

  if (profile.timeKnown) {
    if (!profile.birthTime) return '출생시간을 입력하거나 시간 모름을 선택해 주세요.';
    const [hour, minute] = profile.birthTime.split(':').map(Number);
    if (Number.isNaN(hour) || Number.isNaN(minute) || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
      return '출생시간을 확인해 주세요.';
    }
  }

  return null;
}

export function calculateSaju(profile: BirthProfile): SajuChart {
  const validation = validateBirthProfile(profile);
  if (validation) throw new Error(validation);

  const [year, rawMonth, day] = profile.birthDate.split('-').map(Number);
  const [rawHour = 12, rawMinute = 0] = profile.birthTime.split(':').map(Number);
  const hour = profile.timeKnown ? rawHour : 12;
  const minute = profile.timeKnown ? rawMinute : 0;

  const lunar = profile.calendarType === 'lunar'
    ? Lunar.fromYmdHms(year, profile.leapMonth ? -rawMonth : rawMonth, day, hour, minute, 0)
    : Solar.fromYmdHms(year, rawMonth, day, hour, minute, 0).getLunar();

  const eightChar = lunar.getEightChar();
  const allPillars: Pillar[] = [
    { label: '년주', value: eightChar.getYear(), element: eightChar.getYearWuXing() },
    { label: '월주', value: eightChar.getMonth(), element: eightChar.getMonthWuXing() },
    { label: '일주', value: eightChar.getDay(), element: eightChar.getDayWuXing() },
    { label: '시주', value: eightChar.getTime(), element: eightChar.getTimeWuXing() },
  ];
  const pillars = profile.timeKnown ? allPillars : allPillars.slice(0, 3);
  const totalChars = (profile.timeKnown ? 8 : 6) as 6 | 8;

  const counts: Record<ElementKey, number> = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
  for (const pillar of pillars) {
    for (const char of pillar.element) {
      const key = ELEMENT_MAP[char];
      if (key) counts[key] += 1;
    }
  }

  const frequencies = Object.fromEntries(
    ELEMENTS.map((element) => [element, counts[element] / totalChars]),
  ) as Record<ElementKey, number>;

  const strongest = [...ELEMENTS].sort((a, b) => counts[b] - counts[a])[0];
  const weakest = [...ELEMENTS].sort((a, b) => counts[a] - counts[b])[0];
  const dayGan = eightChar.getDay().slice(0, 1);
  const dayInfo = GAN_INFO[dayGan] || { name: dayGan, element: strongest, yinYang: '' as const };
  const zodiacRaw = lunar.getYearShengXiao();

  return {
    profile,
    pillars,
    counts,
    frequencies,
    strongest,
    weakest,
    dayMaster: `${dayGan}(${dayInfo.name})`,
    dayMasterElement: dayInfo.element,
    dayMasterYinYang: dayInfo.yinYang,
    zodiac: ZODIAC_MAP[zodiacRaw] || zodiacRaw,
    solarDate: lunar.getSolar().toYmd(),
    lunarDate: lunar.toString(),
    totalChars,
  };
}

function distributionScore(a: SajuChart, b: SajuChart) {
  const l1Distance = ELEMENTS.reduce((sum, element) => sum + Math.abs(a.frequencies[element] - b.frequencies[element]), 0);
  return clamp(100 * (1 - l1Distance / 2));
}

function complementScore(a: SajuChart, b: SajuChart) {
  const aNeeds = 1 - a.frequencies[a.weakest];
  const bNeeds = 1 - b.frequencies[b.weakest];
  const bProvides = b.frequencies[a.weakest];
  const aProvides = a.frequencies[b.weakest];
  const raw = ((bProvides * aNeeds) + (aProvides * bNeeds)) / 2;
  return clamp(45 + raw * 90);
}

function dayMasterScore(a: SajuChart, b: SajuChart) {
  const ae = a.dayMasterElement;
  const be = b.dayMasterElement;
  if (ae === be) return 82;
  if (GENERATES[ae] === be || GENERATES[be] === ae) return 92;
  if (CONTROLS[ae] === be || CONTROLS[be] === ae) return 64;
  return 76;
}

function yinYangScore(a: SajuChart, b: SajuChart) {
  if (!a.dayMasterYinYang || !b.dayMasterYinYang) return 75;
  return a.dayMasterYinYang === b.dayMasterYinYang ? 76 : 90;
}

function scoreLevel(score: number) {
  if (score >= 90) return '매우 높은 조화';
  if (score >= 80) return '강한 조화';
  if (score >= 70) return '편안한 조화';
  if (score >= 60) return '조율하면 좋은 관계';
  return '차이를 이해하면 좋은 관계';
}

function relationTip(type: RelationshipType) {
  if (type === 'romance') return '감정 표현 속도와 애정 확인 방식이 다를 수 있으니 말로 기대치를 확인하는 것이 좋습니다.';
  if (type === 'marriage') return '생활 리듬·돈·역할 분담처럼 현실적인 기준을 미리 맞추는 것이 관계 안정에 도움이 됩니다.';
  if (type === 'friend') return '함께 즐기는 방식과 혼자 쉬는 방식의 차이를 인정하면 관계가 편안해집니다.';
  return '업무 속도·의사결정 기준·피드백 방식을 먼저 합의하면 서로의 강점을 활용하기 쉽습니다.';
}

export function calculateCompatibility(a: SajuChart, b: SajuChart, type: RelationshipType): CompatibilityResult {
  const breakdown: CompatibilityBreakdown = {
    distribution: distributionScore(a, b),
    complement: complementScore(a, b),
    dayMaster: dayMasterScore(a, b),
    yinYang: yinYangScore(a, b),
  };
  const weights = WEIGHTS[type];
  const score = clamp(
    (breakdown.distribution * weights.distribution +
      breakdown.complement * weights.complement +
      breakdown.dayMaster * weights.dayMaster +
      breakdown.yinYang * weights.yinYang) / 100,
  );

  const aName = a.profile.name?.trim() || 'A';
  const bName = b.profile.name?.trim() || 'B';
  const sameStrong = a.strongest === b.strongest;
  const mutualComplement = b.strongest === a.weakest || a.strongest === b.weakest;
  const generated = GENERATES[a.dayMasterElement] === b.dayMasterElement || GENERATES[b.dayMasterElement] === a.dayMasterElement;

  const good = mutualComplement
    ? `${aName}와 ${bName}는 한쪽의 부족한 오행을 다른 쪽의 강한 오행이 채워 주는 구조가 보여 상호 보완 포인트가 분명합니다.`
    : sameStrong
      ? `두 사람 모두 ${a.strongest} 기운이 강해 중요하게 여기는 속도와 방식에 공통점이 생기기 쉽습니다.`
      : `두 사람의 강한 오행이 서로 달라 같은 상황을 다른 방식으로 해석하고 해결하는 장점이 있습니다.`;

  const care = a.weakest === b.weakest
    ? `두 사람 모두 ${a.weakest} 기운이 상대적으로 약해, 이 영역이 필요한 상황에서는 서로가 서로를 자동으로 보완해 줄 것이라 기대하지 않는 편이 좋습니다.`
    : `차이가 큰 영역에서는 누가 맞는지를 정하기보다 역할을 나누는 방식이 더 잘 맞을 수 있습니다. ${relationTip(type)}`;

  const relationText = generated
    ? '일간 오행은 서로 이어 주는 생(生)의 흐름이 보여 상대의 방식에서 자극과 확장을 얻기 쉽습니다.'
    : breakdown.dayMaster < 70
      ? '일간 오행은 긴장감이 생길 수 있는 관계라, 판단 속도와 표현 방식의 차이를 먼저 이해하는 것이 중요합니다.'
      : '일간 오행은 한쪽으로 크게 치우치지 않아 서로의 차이를 조율해 나가는 형태에 가깝습니다.';

  return {
    score,
    level: scoreLevel(score),
    breakdown,
    headline: `${RELATION_LABEL[type]} 관계의 밸런스는 ${score}점 · ${scoreLevel(score)}`,
    summary: `${aName}(${a.profile.gender === 'male' ? '남성' : '여성'})와 ${bName}(${b.profile.gender === 'male' ? '남성' : '여성'})의 오행 분포, 상호 보완, 일간 관계, 음양 리듬을 나누어 비교했습니다. ${relationText}`,
    good,
    care,
    core: `${aName}는 ${a.dayMaster} · ${a.strongest} 강 / ${a.weakest} 보완, ${bName}는 ${b.dayMaster} · ${b.strongest} 강 / ${b.weakest} 보완입니다. 이 지수는 관계의 미래를 예측하는 값이 아니라 서로의 리듬을 설명하기 위한 참고용 지표입니다.`,
  };
}

export function buildBasicInterpretation(chart: SajuChart) {
  const dayName = chart.dayMaster.replace(/[甲乙丙丁戊己庚辛壬癸]\((.*?)\)/, '$1');
  return {
    summary: `${chart.dayMasterYinYang}${chart.dayMasterElement} 성향의 ${dayName} 일간을 중심으로, 전체 원국에서는 ${chart.strongest} 기운이 가장 두드러집니다. ${chart.weakest} 기운은 상대적으로 적어 의식적인 보완 포인트를 만들면 전체 균형을 이해하는 데 도움이 됩니다.`,
    career: `${chart.strongest} 기운의 강점을 업무 방식에 살리는 편이 자연스럽습니다. ${ELEMENT_DESCRIPTION[chart.strongest]}에 해당하는 환경에서 강점이 드러날 가능성을 살펴보세요.`,
    money: `재물 흐름은 특정 사건을 예언하기보다 돈을 다루는 습관으로 보는 편이 실용적입니다. 강한 ${chart.strongest} 성향이 소비·저축·투자 판단에 어떻게 나타나는지 기록해 보세요.`,
    relationship: `${dayName} 일간의 기본 리듬과 강한 ${chart.strongest} 기운이 소통 방식에 드러날 수 있습니다. 상대에게 기대하는 속도와 표현 방식을 명확히 말하는 것이 도움이 됩니다.`,
    balanceTips: BALANCE_GUIDES[chart.weakest],
  };
}

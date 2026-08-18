import type { DateCourse, DateProfile } from "@/types/date";

const areaVibes: Record<string, string> = {
  성수: "트렌디한 공간과 산책을 자연스럽게 섞기 좋은 동네",
  연남: "골목 산책과 대화가 잘 어울리는 편안한 동네",
  잠실: "호수·쇼핑·야경을 한 번에 묶기 좋은 동네",
  익선동: "한옥 골목과 작은 공간을 천천히 즐기기 좋은 동네",
  을지로: "레트로한 골목과 취향 있는 공간을 발견하는 재미가 있는 동네",
  한남: "전시·카페·다이닝을 차분하게 이어가기 좋은 동네",
  광안리: "바다와 야경을 중심으로 분위기를 만들기 좋은 동네",
};

const activities = {
  대화: [
    ["☕", "조용한 카페에서 워밍업", "서로의 속도에 맞춰 이야기하기 좋은 자리부터 시작해요."],
    ["🚶", "천천히 걷는 동네 산책", "목적지보다 대화에 집중할 수 있게 이동 자체를 데이트로 만들어요."],
    ["🍽️", "대화가 이어지는 저녁", "너무 시끄럽지 않은 식사 공간을 골라 이야기를 자연스럽게 이어가요."],
    ["🍨", "가벼운 디저트 마무리", "부담 없이 오늘의 데이트를 정리할 시간을 남겨요."],
  ],
  감성: [
    ["🖼️", "작은 전시·서점 둘러보기", "서로의 취향을 발견할 수 있는 장면을 먼저 만들어요."],
    ["☕", "분위기 좋은 카페", "사진보다 대화와 공간의 분위기를 같이 즐겨요."],
    ["🌿", "풍경 있는 산책", "걷는 동안 자연스럽게 기억에 남을 장면을 만들어요."],
    ["🌙", "야경 또는 밤 산책", "마지막은 조금 느리게, 오늘의 분위기를 길게 남겨요."],
  ],
  활동: [
    ["🎯", "가벼운 체험으로 시작", "어색함을 줄이고 같이 웃을 수 있는 활동부터 시작해요."],
    ["🎮", "둘이 하는 미션형 활동", "승부보다 협동이 필요한 체험으로 분위기를 올려요."],
    ["🍜", "활동 후 편한 식사", "체험 뒤에는 편하게 이야기할 수 있는 식사 시간을 둬요."],
    ["🥤", "산책하며 음료 한 잔", "흥분된 텐션을 천천히 낮추며 마무리해요."],
  ],
  맛집: [
    ["🥐", "가벼운 첫 메뉴", "첫 장소부터 너무 무겁지 않게 작은 메뉴로 시작해요."],
    ["🍽️", "오늘의 메인 맛집", "예산의 가장 큰 비중을 메인 식사에 배정해요."],
    ["☕", "취향 맞추는 카페", "식사 후 서로 좋아하는 맛을 하나 더 찾아봐요."],
    ["🍰", "시그니처 디저트", "마지막 한 메뉴를 같이 고르는 재미를 남겨요."],
  ],
  특별함: [
    ["🎟️", "예약해 둔 특별한 경험", "평소와 다른 한 가지 경험을 코스의 중심에 둬요."],
    ["📸", "기억에 남는 포인트", "둘만의 사진이나 작은 기록을 남길 시간을 만들어요."],
    ["🍷", "조금 더 좋은 저녁", "평소보다 한 단계 특별한 식사에 예산을 집중해요."],
    ["🌙", "야경과 작은 이벤트", "마지막에 작은 편지나 선물을 건네기 좋은 여백을 둬요."],
  ],
} as const;

const budgetText: Record<DateProfile["budget"], string> = {
  "3만원 이하": "2인 약 20,000~35,000원",
  "5만원대": "2인 약 40,000~65,000원",
  "10만원대": "2인 약 80,000~120,000원",
  "15만원 이상": "2인 약 140,000원 이상",
};

const stepCount: Record<DateProfile["duration"], number> = {
  "2시간": 2,
  "4시간": 3,
  반나절: 4,
  하루: 4,
};

const timeSets: Record<DateProfile["duration"], string[]> = {
  "2시간": ["14:00", "15:10"],
  "4시간": ["14:00", "15:20", "17:10"],
  반나절: ["14:00", "15:30", "17:20", "19:00"],
  하루: ["11:30", "14:00", "17:00", "19:30"],
};

function hash(input: string) {
  return Array.from(input).reduce((acc, ch) => ((acc << 5) - acc + ch.charCodeAt(0)) | 0, 0);
}

export function generateDateCourse(profile: DateProfile, variant = 0): DateCourse {
  const seed = Math.abs(hash(JSON.stringify(profile) + variant));
  const source = [...activities[profile.mood]];
  const count = stepCount[profile.duration];
  const offset = seed % source.length;
  const ordered = [...source.slice(offset), ...source.slice(0, offset)].slice(0, count);
  const times = timeSets[profile.duration];
  const area = profile.area.trim() || "선택한 동네";
  const vibe = areaVibes[area] ?? "두 사람이 원하는 분위기에 맞춰 코스를 유연하게 만들기 좋은 지역";

  const relationshipReason: Record<DateProfile["relationship"], string> = {
    "첫 데이트": "첫 데이트라 이동을 복잡하게 만들지 않고, 대화와 자연스러운 종료 타이밍을 우선했어요.",
    썸: "썸 단계라 함께할 거리와 대화 시간을 반반 섞어 어색한 공백을 줄였어요.",
    연인: "익숙함 속에서도 새로운 장면이 생기도록 취향 활동과 여유 시간을 섞었어요.",
    장기연애: "늘 하던 코스처럼 느껴지지 않도록 한 가지 새로운 경험을 중심에 넣었어요.",
    기념일: "기념일답게 기억에 남을 포인트와 마지막 여운을 크게 잡았어요.",
  };

  const indoorReason: Record<DateProfile["indoor"], string> = {
    "실내 위주": "실내 체류 시간을 길게 잡아 날씨와 이동 피로의 영향을 줄였어요.",
    반반: "실내와 산책을 번갈아 넣어 지루하지 않으면서도 쉬어갈 수 있게 했어요.",
    "야외 위주": "걷고 풍경을 보는 시간이 충분하도록 이동 자체를 코스의 일부로 봤어요.",
  };

  const transportText: Record<DateProfile["transport"], string> = {
    도보: "도보 중심 · 장소 간 10~20분 이내 권장",
    대중교통: "도보 + 대중교통 · 환승 1회 이내 권장",
    차량: "차량 이동 · 주차 가능한 장소 우선 권장",
  };

  return {
    title: `${area}에서 즐기는 ${profile.mood} 중심 데이트`,
    subtitle: `${vibe}. ${profile.relationship}인 두 사람에게 ${profile.duration} 동안 부담 없이 이어지는 흐름으로 구성했어요.`,
    score: 92 + (seed % 7),
    tags: [profile.relationship, profile.mood, profile.indoor, profile.budget],
    budgetText: budgetText[profile.budget],
    moveText: transportText[profile.transport],
    steps: ordered.map((item, index) => ({
      time: times[index],
      icon: item[0],
      title: item[1],
      description: `${area} 안에서 ${item[2]}`,
      reason: index === 0 ? "첫 장소는 긴장도를 낮추는 역할" : index === ordered.length - 1 ? "마지막은 다음 만남을 약속하기 좋은 여운" : "앞뒤 일정의 텐션을 자연스럽게 연결",
    })),
    fitReasons: [relationshipReason[profile.relationship], indoorReason[profile.indoor], `${profile.budget} 예산 안에서 메인 경험에 지출이 몰리도록 구성했어요.`],
    tip: profile.relationship === "첫 데이트" ? "첫 데이트는 한 장소를 더 넣는 것보다, 잘 끝낼 타이밍을 남겨두는 편이 만족도가 높아요." : "마지막 장소 하나는 현장에서 둘이 같이 고르면 계획된 코스도 덜 정형적으로 느껴져요.",
  };
}

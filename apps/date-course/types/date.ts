export type Relationship = "첫 데이트" | "썸" | "연인" | "장기연애" | "기념일";
export type Budget = "3만원 이하" | "5만원대" | "10만원대" | "15만원 이상";
export type Duration = "2시간" | "4시간" | "반나절" | "하루";
export type IndoorPreference = "실내 위주" | "반반" | "야외 위주";
export type Mood = "대화" | "감성" | "활동" | "맛집" | "특별함";
export type Transport = "도보" | "대중교통" | "차량";

export type DateProfile = {
  area: string;
  relationship: Relationship;
  budget: Budget;
  duration: Duration;
  indoor: IndoorPreference;
  mood: Mood;
  transport: Transport;
};

export type CourseStep = {
  time: string;
  icon: string;
  title: string;
  description: string;
  reason: string;
};

export type DateCourse = {
  title: string;
  subtitle: string;
  score: number;
  tags: string[];
  budgetText: string;
  moveText: string;
  steps: CourseStep[];
  fitReasons: string[];
  tip: string;
};

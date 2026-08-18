"use client";

import { useEffect, useMemo, useState } from "react";
import { generateDateCourse } from "@/lib/generator";
import { trackEvent } from "@/lib/analytics";
import type { Budget, DateCourse, DateProfile, Duration, IndoorPreference, Mood, Relationship, Transport } from "@/types/date";

const AREAS = ["성수", "연남", "잠실", "익선동", "을지로", "한남", "광안리"];
const RELATIONSHIPS: Relationship[] = ["첫 데이트", "썸", "연인", "장기연애", "기념일"];
const BUDGETS: Budget[] = ["3만원 이하", "5만원대", "10만원대", "15만원 이상"];
const DURATIONS: Duration[] = ["2시간", "4시간", "반나절", "하루"];
const INDOORS: IndoorPreference[] = ["실내 위주", "반반", "야외 위주"];
const MOODS: Mood[] = ["대화", "감성", "활동", "맛집", "특별함"];
const TRANSPORTS: Transport[] = ["도보", "대중교통", "차량"];

const defaultProfile: DateProfile = {
  area: "성수",
  relationship: "썸",
  budget: "5만원대",
  duration: "4시간",
  indoor: "반반",
  mood: "대화",
  transport: "도보",
};

const questions = [
  ["어디에서 만날까요?", "동네만 정해도 코스의 분위기가 꽤 달라져요."],
  ["지금 두 사람은 어떤 사이인가요?", "관계 단계에 따라 대화와 활동의 비중을 조절할게요."],
  ["오늘 예산은 어느 정도인가요?", "2인 기준으로 생각해 주세요."],
  ["얼마나 함께할 예정인가요?", "짧은 만남은 여백을, 긴 데이트는 리듬을 중요하게 봐요."],
  ["실내와 야외 중 어디가 더 좋아요?", "날씨가 애매하다면 ‘반반’이 가장 무난해요."],
  ["오늘 가장 원하는 분위기는?", "하나만 고르면 코스의 중심을 확실하게 잡을 수 있어요."],
  ["이동은 어떻게 할까요?", "이동 피로까지 고려해서 장소 간 간격을 조절할게요."],
] as const;

function OptionButton({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return <button type="button" className={`option ${active ? "active" : ""}`} onClick={onClick}><span>{children}</span><b>{active ? "✓" : ""}</b></button>;
}

export default function DateCourseWizard() {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<DateProfile>(defaultProfile);
  const [course, setCourse] = useState<DateCourse | null>(null);
  const [variant, setVariant] = useState(0);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("date-course-profile");
      if (saved) setProfile({ ...defaultProfile, ...JSON.parse(saved) });
    } catch {}
  }, []);

  const progress = useMemo(() => ((step + 1) / questions.length) * 100, [step]);

  function answer<K extends keyof DateProfile>(key: K, value: DateProfile[K]) {
    setProfile((prev) => ({ ...prev, [key]: value }));
  }

  function next() {
    if (step === 0) trackEvent("date_wizard_start", { area_type: AREAS.includes(profile.area) ? "preset" : "custom" });
    trackEvent("date_question_complete", { step_number: step + 1 });
    if (step < questions.length - 1) setStep((s) => s + 1);
    else buildCourse(variant);
  }

  function buildCourse(nextVariant: number) {
    const nextCourse = generateDateCourse(profile, nextVariant);
    setCourse(nextCourse);
    setVariant(nextVariant);
    localStorage.setItem("date-course-profile", JSON.stringify(profile));
    trackEvent("date_course_generated", {
      relationship: profile.relationship,
      budget: profile.budget,
      duration: profile.duration,
      mood: profile.mood,
      indoor: profile.indoor,
      transport: profile.transport,
      area_type: AREAS.includes(profile.area) ? "preset" : "custom",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function regenerate() {
    const nextVariant = variant + 1;
    trackEvent("date_course_regenerate", { variant: nextVariant, mood: profile.mood });
    buildCourse(nextVariant);
  }

  async function shareCourse() {
    if (!course) return;
    const text = `${course.title}\n${course.steps.map((s) => `${s.time} ${s.title}`).join(" → ")}\n${course.budgetText}`;
    trackEvent("share", { content_type: "date_course", item_id: profile.mood });
    try {
      if (navigator.share) await navigator.share({ title: course.title, text, url: location.href });
      else {
        await navigator.clipboard.writeText(`${text}\n${location.href}`);
        setNotice("코스를 복사했어요.");
      }
    } catch {}
  }

  function saveCourse() {
    if (!course) return;
    localStorage.setItem("date-course-last-result", JSON.stringify({ profile, course }));
    trackEvent("date_course_save", { mood: profile.mood, relationship: profile.relationship });
    setNotice("이 기기에서 코스를 저장했어요.");
  }

  function restart() {
    setCourse(null);
    setStep(0);
    setNotice("");
    trackEvent("date_course_restart");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (course) {
    return (
      <main className="app-shell result-shell">
        <header className="mini-header"><button className="logo" onClick={restart}>우리 둘 코스</button><span>취향 맞춤 데이트 플래너</span></header>
        <section className="result-hero">
          <div className="result-kicker">당신들의 데이트 매칭</div>
          <div className="score-ring"><strong>{course.score}</strong><span>/ 100</span></div>
          <h1>{course.title}</h1>
          <p>{course.subtitle}</p>
          <div className="chips">{course.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        </section>

        <section className="summary-strip">
          <div><span>예상 예산</span><strong>{course.budgetText}</strong></div>
          <div><span>이동 방식</span><strong>{course.moveText}</strong></div>
        </section>

        <section className="timeline-card">
          <div className="section-heading"><span>YOUR DATE FLOW</span><h2>시간 순서대로 이렇게 가보세요</h2></div>
          <div className="timeline">
            {course.steps.map((item, index) => (
              <article className="timeline-item" key={`${item.time}-${item.title}`}>
                <div className="time">{item.time}</div>
                <div className="dot"><span>{item.icon}</span></div>
                <div className="step-copy"><small>STEP {index + 1}</small><h3>{item.title}</h3><p>{item.description}</p><em>{item.reason}</em></div>
              </article>
            ))}
          </div>
        </section>

        <section className="fit-card">
          <div className="section-heading"><span>WHY IT FITS</span><h2>왜 두 사람에게 맞을까요?</h2></div>
          <div className="reason-list">{course.fitReasons.map((reason, i) => <div key={reason}><b>0{i + 1}</b><p>{reason}</p></div>)}</div>
          <aside className="tip"><span>작은 팁</span><p>{course.tip}</p></aside>
        </section>

        <section className="result-actions">
          <button className="primary" onClick={regenerate}>같은 조건으로 다른 코스</button>
          <button onClick={shareCourse}>공유하기</button>
          <button onClick={saveCourse}>저장하기</button>
          <button className="text-button" onClick={restart}>조건 다시 고르기</button>
          {notice ? <p className="notice">{notice}</p> : null}
        </section>

        <section className="test-note"><b>테스트 버전</b><p>현재는 특정 가게의 실시간 영업정보가 아니라 지역 분위기와 활동 조합을 추천합니다. 다음 단계에서 지도·실시간 장소 추천을 연결할 수 있어요.</p></section>
      </main>
    );
  }

  const [title, description] = questions[step];

  return (
    <main className="app-shell">
      <header className="mini-header"><span className="logo">우리 둘 코스</span><span>약 1분</span></header>
      <div className="progress"><i style={{ width: `${progress}%` }} /></div>
      <section className="question-card">
        <div className="question-count">{String(step + 1).padStart(2, "0")} <span>/ {String(questions.length).padStart(2, "0")}</span></div>
        <h1>{title}</h1>
        <p className="question-description">{description}</p>

        <div className="options">
          {step === 0 && <>
            <div className="area-grid">{AREAS.map((v) => <OptionButton key={v} active={profile.area === v} onClick={() => answer("area", v)}>{v}</OptionButton>)}</div>
            <label className="custom-area"><span>다른 지역 직접 입력</span><input value={AREAS.includes(profile.area) ? "" : profile.area} placeholder="예: 수원 행궁동, 대전 둔산동" onChange={(e) => answer("area", e.target.value)} /></label>
          </>}
          {step === 1 && RELATIONSHIPS.map((v) => <OptionButton key={v} active={profile.relationship === v} onClick={() => answer("relationship", v)}>{v}</OptionButton>)}
          {step === 2 && BUDGETS.map((v) => <OptionButton key={v} active={profile.budget === v} onClick={() => answer("budget", v)}>{v}</OptionButton>)}
          {step === 3 && DURATIONS.map((v) => <OptionButton key={v} active={profile.duration === v} onClick={() => answer("duration", v)}>{v}</OptionButton>)}
          {step === 4 && INDOORS.map((v) => <OptionButton key={v} active={profile.indoor === v} onClick={() => answer("indoor", v)}>{v}</OptionButton>)}
          {step === 5 && MOODS.map((v) => <OptionButton key={v} active={profile.mood === v} onClick={() => answer("mood", v)}>{v}</OptionButton>)}
          {step === 6 && TRANSPORTS.map((v) => <OptionButton key={v} active={profile.transport === v} onClick={() => answer("transport", v)}>{v}</OptionButton>)}
        </div>

        <footer className="wizard-actions">
          <button type="button" className="back" disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))}>이전</button>
          <button type="button" className="next" disabled={step === 0 && !profile.area.trim()} onClick={next}>{step === questions.length - 1 ? "내 코스 만들기" : "다음"}<span>→</span></button>
        </footer>
      </section>
      <p className="privacy-line">입력값은 이 기기에만 저장되며 서버로 전송하지 않습니다.</p>
    </main>
  );
}

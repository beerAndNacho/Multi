import Calculator from '@/components/Calculator';
import AdSlot from '@/components/AdSlot';

const faq = [
  {
    question: '프리랜서 3.3%는 왜 떼나요?',
    answer: '원천징수 대상 사업소득을 지급할 때 소득세 3%와 그 소득세에 대한 지방소득세를 함께 미리 납부하는 구조입니다. 흔히 합쳐서 3.3%라고 부릅니다.',
  },
  {
    question: '3.3%를 떼면 세금 신고가 끝난 건가요?',
    answer: '아닙니다. 3.3%는 최종 확정세액이 아니라 미리 낸 세금에 가깝습니다. 다음 해 종합소득세 신고에서 실제 소득과 필요경비 등에 따라 환급되거나 추가 납부가 생길 수 있습니다.',
  },
  {
    question: '세후 금액에서 세전 금액도 역산할 수 있나요?',
    answer: '가능합니다. 상단에서 “세후 → 세전”을 선택하고 받고 싶은 실수령액을 입력하면 필요한 세전 금액을 계산합니다.',
  },
  {
    question: '계산한 금액이 외부 서버에 저장되나요?',
    answer: '아닙니다. 현재 계산은 브라우저에서만 처리하며 입력한 금액을 서버에 저장하지 않습니다.',
  },
];

export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: '프리랜서 3.3% 계산기',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'KRW' },
    description: '프리랜서 사업소득 3.3% 원천징수와 실수령액을 계산하는 무료 웹 도구',
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="site-header">
        <a className="brand" href="#top" aria-label="3.3 계산기 홈">
          <span className="brand-mark">3.3</span>
          <span>프리랜서 계산기</span>
        </a>
        <nav>
          <a href="#calculator">계산기</a>
          <a href="#guide">3.3% 가이드</a>
          <a href="#faq">FAQ</a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <span className="hero-badge">무료 · 가입 없음 · 서버 전송 없음</span>
          <h1>받을 돈에서 <em>3.3%</em>,<br />실제로 얼마 남을까?</h1>
          <p>프리랜서·외주·원고료·용역비의 세전과 세후를 바로 계산하고, 원하는 실수령액에 필요한 세전 금액도 역산하세요.</p>
          <div className="hero-actions">
            <a className="hero-primary" href="#calculator">지금 계산하기</a>
            <span>2026-08-18 기준</span>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="receipt-card">
            <span>PROJECT PAYMENT</span>
            <strong>1,000,000</strong>
            <div><span>원천징수</span><b>-33,000</b></div>
            <div className="receipt-total"><span>실수령</span><b>967,000</b></div>
          </div>
        </div>
      </section>

      <Calculator />

      <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP} />

      <section className="content-section" id="guide">
        <div className="section-heading">
          <span className="eyebrow">3.3% 핵심만 이해하기</span>
          <h2>계산은 단순하지만, 의미는 알아두는 게 좋습니다.</h2>
          <p>이 도구는 “지급 시점에 얼마가 빠지고 얼마를 받는지” 빠르게 확인하는 용도입니다.</p>
        </div>
        <div className="guide-grid">
          <article>
            <span className="guide-number">01</span>
            <h3>소득세 3%</h3>
            <p>원천징수 대상 사업소득에 대해 지급자가 일정 세액을 먼저 떼어 납부합니다.</p>
          </article>
          <article>
            <span className="guide-number">02</span>
            <h3>지방소득세 포함</h3>
            <p>소득세에 연동되는 지방소득세가 더해져 실무에서 흔히 “3.3% 공제”라고 표현합니다.</p>
          </article>
          <article>
            <span className="guide-number">03</span>
            <h3>최종 세금은 별도</h3>
            <p>원천징수는 최종 정산이 아닙니다. 실제 세금은 종합소득세 신고 때 소득·경비 등을 반영해 확정됩니다.</p>
          </article>
        </div>
      </section>

      <section className="example-section">
        <div className="section-heading compact">
          <span className="eyebrow">빠른 예시</span>
          <h2>많이 찾는 금액을 바로 비교해보세요.</h2>
        </div>
        <div className="example-table" role="table" aria-label="3.3% 계산 예시">
          <div className="example-row table-head" role="row"><span>세전</span><span>원천징수</span><span>예상 실수령</span></div>
          <div className="example-row" role="row"><b>300,000원</b><span>9,900원</span><strong>290,100원</strong></div>
          <div className="example-row" role="row"><b>500,000원</b><span>16,500원</span><strong>483,500원</strong></div>
          <div className="example-row" role="row"><b>1,000,000원</b><span>33,000원</span><strong>967,000원</strong></div>
          <div className="example-row" role="row"><b>3,000,000원</b><span>99,000원</span><strong>2,901,000원</strong></div>
        </div>
      </section>

      <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_MIDDLE} />

      <section className="faq-section" id="faq">
        <div className="section-heading compact">
          <span className="eyebrow">FAQ</span>
          <h2>프리랜서가 자주 묻는 질문</h2>
        </div>
        <div className="faq-list">
          {faq.map((item) => (
            <details key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="notice-section">
        <h2>계산 기준</h2>
        <p>본 페이지는 원천징수 대상 사업소득에 일반적으로 적용되는 소득세 3%와 지방소득세를 기준으로 단순 계산합니다. 계약 형태, 소득 구분, 실제 신고 결과에 따라 최종 세액은 달라질 수 있습니다.</p>
        <p className="source-note">기준일 2026-08-18 · 참고: 국세청 원천징수 세율 안내</p>
      </section>

      <footer>
        <div className="brand footer-brand"><span className="brand-mark">3.3</span><span>프리랜서 계산기</span></div>
        <p>빠르게 계산하고, 받은 돈을 더 명확하게 이해하세요.</p>
        <span>© 2026 Multi Tools</span>
      </footer>
    </main>
  );
}

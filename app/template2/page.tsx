"use client";

import { useEffect, useRef, useState } from "react";

const events = [
  { name: "عقد القران", date: "يوم الجمعة 12 جوان 2026", venue: "جامع الزيتونة، تونس العاصمة", time: "16:00" },
  { name: "العشاء", date: "يوم السبت 13 جوان 2026", venue: "قاعة الأفراح \u201Cليالي قرطاج\u201D، قرطاج", time: "20:00" },
  { name: "الحفل (العرس)", date: "يوم الأحد 14 جوان 2026", venue: "نزل \u201Cالمرادي قمرت\u201D، قمرت", time: "19:00" },
  { name: "ليلة الزفاف", date: "يوم الأحد 14 جوان 2026", venue: "نزل \u201Cالمرادي قمرت\u201D، قمرت", time: "23:30" },
];

export default function Template2Page() {
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [activatedBlocks, setActivatedBlocks] = useState([false, false, false, false]);

  // IntersectionObserver for general .anim elements
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.2 }
    );

    const elements = container.querySelectorAll(".anim");
    elements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, []);

  // IntersectionObserver for timeline blocks
  useEffect(() => {
    if (!listRef.current) return;
    const blocks = Array.from(listRef.current.querySelectorAll(".tl-block"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt((entry.target as HTMLElement).dataset.index || "0");
            setActiveIndex(index);
            setActivatedBlocks((prev) => {
              if (prev[index]) return prev;
              const next = [...prev];
              next[index] = true;
              return next;
            });
          }
        });
      },
      { threshold: 0.4, rootMargin: "0px 0px -10% 0px" }
    );
    blocks.forEach((b) => observer.observe(b));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400;700&family=Playfair+Display:wght@400;700&display=swap');

        :root {
          --bg: #08091a;
          --bg2: #0e1230;
          --pearl: #f0ece4;
          --gold: #d4af70;
          --card: rgba(255,255,255,0.04);
        }

        *, *::before, *::after {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .t2-body {
          background: var(--bg);
          color: var(--pearl);
          font-family: 'Noto Naskh Arabic', serif;
          direction: rtl;
          min-height: 100vh;
          overflow-x: hidden;
          position: relative;
        }

        .t2-body::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 100vh;
          background: radial-gradient(circle at 50% 0%, rgba(212,175,112,0.08), transparent 60%);
          pointer-events: none;
          z-index: 0;
        }

        .t2-content {
          max-width: 480px;
          margin: 0 auto;
          padding: 24px;
          position: relative;
          z-index: 1;
        }

        /* --- Animations base --- */
        .anim {
          opacity: 0;
          transition: opacity 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                      transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .anim.from-left {
          transform: translateX(-40px);
        }

        .anim.from-right {
          transform: translateX(40px);
        }

        .anim.scale-in {
          transform: scale(0.85);
        }

        .anim.fade-up {
          transform: translateY(20px);
        }

        .anim.visible {
          opacity: 1;
          transform: none;
        }

        /* --- Timeline (sticky sidebar) --- */
        .tl-wrapper {
          display: flex;
          gap: 0;
          position: relative;
          direction: rtl;
        }
        .tl-sidebar {
          position: sticky;
          top: 40vh;
          align-self: flex-start;
          width: 40%;
          padding: 20px;
        }
        .tl-list {
          flex: 1;
        }
        .tl-date {
          font-family: 'Noto Naskh Arabic', serif;
          font-size: 1.3rem;
          font-weight: 700;
          color: #d4af70;
          opacity: 1;
          transition: opacity 0.4s ease;
          margin-bottom: 16px;
          cursor: default;
          text-align: right;
        }
        .tl-date:not(.animate) {
          opacity: 0.25;
        }
        .tl-date:not(.animate) span {
          opacity: 1 !important;
          transform: none !important;
        }
        .tl-date span {
          display: inline-block;
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .tl-date.animate {
          opacity: 1;
        }
        .tl-date.animate span { opacity: 1; transform: none; }
        .tl-date.animate span:nth-child(1)  { transition-delay: 0.00s; }
        .tl-date.animate span:nth-child(2)  { transition-delay: 0.05s; }
        .tl-date.animate span:nth-child(3)  { transition-delay: 0.10s; }
        .tl-date.animate span:nth-child(4)  { transition-delay: 0.15s; }
        .tl-date.animate span:nth-child(5)  { transition-delay: 0.20s; }
        .tl-date.animate span:nth-child(6)  { transition-delay: 0.25s; }
        .tl-date.animate span:nth-child(7)  { transition-delay: 0.30s; }
        .tl-date.animate span:nth-child(8)  { transition-delay: 0.35s; }
        .tl-date.animate span:nth-child(9)  { transition-delay: 0.40s; }
        .tl-date.animate span:nth-child(10) { transition-delay: 0.45s; }
        .tl-date.animate span:nth-child(11) { transition-delay: 0.50s; }
        .tl-date.animate span:nth-child(12) { transition-delay: 0.55s; }
        .tl-date.animate span:nth-child(13) { transition-delay: 0.60s; }
        .tl-date.animate span:nth-child(14) { transition-delay: 0.65s; }
        .tl-date.animate span:nth-child(15) { transition-delay: 0.70s; }
        .tl-block {
          min-height: auto;
          display: flex;
          align-items: center;
          padding: 16px 20px 16px 0;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .tl-block.active {
          opacity: 1;
          transform: none;
        }
        .tl-block-inner {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(212,175,112,0.2);
          border-radius: 12px;
          padding: 24px;
          width: 100%;
          backdrop-filter: blur(8px);
        }
        .tl-block-inner::before {
          content: '\u25C6';
          display: block;
          color: #d4af70;
          font-size: 0.6rem;
          margin-bottom: 12px;
        }
        .tl-block-name {
          font-size: 0.75rem;
          color: rgba(212,175,112,0.6);
          margin-bottom: 8px;
        }
        .tl-block-date {
          font-family: 'Playfair Display', serif;
          font-size: 1rem;
          color: #f0ece4;
          margin-bottom: 6px;
        }
        .tl-block-venue {
          font-size: 0.85rem;
          color: rgba(240,236,228,0.65);
        }
        .tl-block-time {
          font-family: 'Playfair Display', serif;
          font-size: 1.2rem;
          color: #d4af70;
          margin-top: 10px;
          font-weight: 700;
        }

        /* --- Gold HR --- */
        .gold-hr {
          height: 1px;
          background: var(--gold);
          border: none;
          width: 0;
          margin: 20px auto;
          transition: width 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .gold-hr.visible {
          width: 100%;
        }

        /* --- Header --- */
        .header-title {
          font-size: 3.5rem;
          color: var(--gold);
          text-align: center;
          letter-spacing: 0.08em;
          font-weight: 700;
          padding: 48px 0 8px;
        }

        .header-lines {
          display: flex;
          align-items: center;
          gap: 16px;
          justify-content: center;
          padding-bottom: 24px;
        }

        .header-line {
          height: 1px;
          background: var(--gold);
          width: 0;
          transition: width 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .header-line.visible {
          width: 80px;
        }

        .header-dot {
          color: var(--gold);
          font-size: 0.7rem;
          flex-shrink: 0;
        }

        /* --- Bismillah --- */
        .bismillah {
          text-align: center;
          font-size: 1.35rem;
          color: var(--gold);
          opacity: 0.85;
          font-style: italic;
          padding: 16px 0;
        }

        /* --- Quran verse --- */
        .verse-box {
          border: 1px solid rgba(212,175,112,0.35);
          border-radius: 8px;
          padding: 20px 16px;
          text-align: center;
          font-size: 1.1rem;
          line-height: 2;
          margin: 16px 0;
          background: rgba(212,175,112,0.03);
        }

        /* --- Labels --- */
        .label-text {
          text-align: center;
          font-size: 1.15rem;
          color: var(--gold);
          padding: 24px 0 12px;
        }

        .label-text .sym {
          margin-inline-end: 6px;
        }

        /* --- Family names --- */
        .family-line {
          text-align: center;
          font-size: 1.05rem;
          line-height: 2;
          padding: 4px 0;
        }

        /* --- Couple names --- */
        .couple-section {
          text-align: center;
          padding: 24px 0;
        }

        .couple-name {
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--gold);
          padding: 8px 0;
        }

        .couple-symbol {
          font-size: 1.2rem;
          color: var(--gold);
          padding: 4px 0;
        }

        .couple-intro {
          font-size: 1rem;
          color: var(--pearl);
          opacity: 0.8;
          padding: 4px 0;
        }

        /* --- Program section --- */
        .program-title {
          text-align: center;
          font-size: 1.6rem;
          font-weight: 700;
          color: var(--gold);
          padding: 32px 0 8px;
        }

        .program-underline {
          height: 1px;
          background: var(--gold);
          width: 0;
          margin: 0 auto 24px;
          transition: width 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .program-underline.visible {
          width: 120px;
        }


        /* --- Dua --- */
        .dua-section {
          padding: 32px 0 16px;
        }

        .dua-line {
          text-align: center;
          font-size: 1.05rem;
          line-height: 2.2;
          padding: 6px 0;
        }

        .dua-line .sym {
          color: var(--gold);
          margin-inline-end: 6px;
          font-size: 0.75rem;
          vertical-align: middle;
        }

        /* --- Footer --- */
        .footer-text {
          text-align: center;
          font-size: 1.2rem;
          color: var(--gold);
          padding: 32px 0 48px;
          font-weight: 700;
        }

        /* --- Floating particles --- */
        .particles {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }

        .particle {
          position: absolute;
          width: 2px;
          height: 2px;
          background: var(--gold);
          border-radius: 50%;
          opacity: 0.25;
          animation: floatUp linear infinite;
        }

        @keyframes floatUp {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 0.25;
          }
          90% {
            opacity: 0.25;
          }
          100% {
            transform: translateY(-100vh) translateX(30px);
            opacity: 0;
          }
        }
      `}</style>

      <div className="t2-body" ref={containerRef}>
        {/* Floating particles */}
        <div className="particles">
          {Array.from({ length: 20 }).map((_, i) => (
            <span
              key={i}
              className="particle"
              style={{
                left: `${(i * 5.26) % 100}%`,
                bottom: `-${(i * 13) % 40}px`,
                animationDuration: `${8 + (i % 7) * 2}s`,
                animationDelay: `${(i * 0.7) % 10}s`,
              }}
            />
          ))}
        </div>

        <div className="t2-content">
          {/* 1. Header */}
          <h1 className="header-title anim scale-in">دعوة زفاف</h1>
          <div className="header-lines">
            <span className="header-line anim" />
            <span className="header-dot">&#9670;</span>
            <span className="header-line anim" />
          </div>

          <hr className="gold-hr anim" />

          {/* 2. Bismillah */}
          <p className="bismillah anim fade-up">بسم الله الرحمن الرحيم</p>

          {/* 3. Quran verse */}
          <div className="verse-box anim from-right">
            <p>
              &ldquo;وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ
              أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا&rdquo;
            </p>
          </div>

          <hr className="gold-hr anim" />

          {/* 4. Families label */}
          <p className="label-text anim from-left">
            <span className="sym">&#9670;</span>يتشرف كل من:
          </p>

          {/* 5. Groom family */}
          <p className="family-line anim from-right">
            السيد محمد بن أحمد القروي — والسيدة فاطمة بنت علي القروي
          </p>
          <p className="family-line anim from-left">
            بدعوتكم لحضور حفل زفاف ابنهم:
          </p>

          {/* 6. Couple names */}
          <div className="couple-section">
            <p className="couple-name anim from-right">يوسف محمد القروي</p>
            <p className="couple-intro anim fade-up">على كريمة:</p>
            <p className="family-line anim from-left">
              السيد خالد بن حسين التونسي — والسيدة آمنة بنت محمود التونسي
            </p>
            <p className="couple-symbol anim scale-in">&#10022;</p>
            <p className="couple-name anim from-left">سارة خالد التونسي</p>
          </div>

          <hr className="gold-hr anim" />

          {/* 7. Program title */}
          <h2 className="program-title anim scale-in">برنامج الأفراح</h2>
          <div className="program-underline anim" />

          {/* 8. Timeline — sticky sidebar + scrollable blocks */}
          <div className="tl-wrapper">
            {/* Sticky sidebar with event names */}
            <div className="tl-sidebar">
              {events.map((evt, i) => (
                <div
                  key={i}
                  className={`tl-date${activeIndex === i ? " animate" : ""}`}
                >
                  {evt.name.split("").map((char, ci) => (
                    <span
                      key={ci}
                      style={{ transitionDelay: `${ci * 0.05}s` }}
                    >
                      {char === " " ? "\u00A0" : char}
                    </span>
                  ))}
                </div>
              ))}
            </div>

            {/* Scrollable content blocks */}
            <div className="tl-list" ref={listRef}>
              {events.map((evt, i) => (
                <div
                  key={i}
                  data-index={i}
                  className={`tl-block${activatedBlocks[i] ? " active" : ""}`}
                >
                  <div className="tl-block-inner">
                    <p className="tl-block-name">{evt.name}</p>
                    <p className="tl-block-date">{evt.date}</p>
                    <p className="tl-block-venue">{evt.venue}</p>
                    <p className="tl-block-time">{evt.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <hr className="gold-hr anim" />

          {/* 9. Dua */}
          <div className="dua-section">
            <p className="dua-line anim from-left">
              <span className="sym">&#9670;</span>
              اللهم بارك لهما وبارك عليهما واجمع بينهما في خير
            </p>
            <p className="dua-line anim from-left">
              اللهم اجعل بينهما مودة ورحمة، وارزقهما السعادة والهناء طوال
              حياتهما
            </p>
            <p className="dua-line anim from-left">
              اللهم ارزقهما الذرية الصالحة واجعل بيتهما عامرًا بالإيمان
              والمحبة
            </p>
          </div>

          <hr className="gold-hr anim" />

          {/* 10. Footer */}
          <p className="footer-text anim fade-up">حضوركم يشرفنا ويسعدنا</p>
        </div>
      </div>
    </>
  );
}

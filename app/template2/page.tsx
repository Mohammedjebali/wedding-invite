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
  const blocksRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activated, setActivated] = useState([true, false, false, false]);

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
    if (!blocksRef.current) return;
    const blocks = Array.from(blocksRef.current.querySelectorAll('.ctl-block')) as HTMLElement[];
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const idx = parseInt((entry.target as HTMLElement).dataset.index || '0');
          setActiveIndex(idx);
          setActivated(prev => {
            const next = [...prev];
            next[idx] = true;
            return next;
          });
        }
      });
    }, { threshold: 0.5, rootMargin: "-30% 0px -30% 0px" });
    blocks.forEach(b => obs.observe(b));
    return () => obs.disconnect();
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

        /* --- Timeline section container --- */
        .t2-timeline-section {
          width: 100%;
          max-width: 480px;
          margin: 0 auto;
          padding: 0 16px;
          box-sizing: border-box;
        }
        /* --- Center-line Timeline --- */
        .ctl-wrapper {
          position: relative;
          padding: 20px 0 40px;
        }
        /* The vertical center line */
        .ctl-wrapper::before {
          content: '';
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 2px;
          background: rgba(212,175,112,0.4);
          transform: translateX(-50%);
        }
        .ctl-block {
          position: relative;
          display: flex;
          width: 100%;
          margin-bottom: 48px;
          align-items: flex-start;
          direction: ltr;
        }
        /* LEFT events (0, 2) */
        .ctl-block.tl-left {
          flex-direction: row;
          justify-content: flex-end;
          padding-right: calc(50% + 24px);
        }
        /* RIGHT events (1, 3) */
        .ctl-block.tl-right {
          flex-direction: row;
          justify-content: flex-start;
          padding-left: calc(50% + 24px);
        }
        /* Circle on center line */
        .ctl-circle {
          position: absolute;
          left: 50%;
          top: 24px;
          transform: translateX(-50%) scale(0);
          width: 14px;
          height: 14px;
          border: 2px solid #d4af70;
          border-radius: 50%;
          background: #08091a;
          box-shadow: 0 0 8px rgba(212,175,112,0.5);
          opacity: 0;
          transition: opacity 0.4s ease 0.1s, transform 0.4s ease 0.1s;
        }
        .ctl-block.active .ctl-circle { opacity: 1; transform: translateX(-50%) scale(1); }
        .ctl-circle::before {
          content: '';
          position: absolute;
          left: 50%; top: 50%;
          transform: translate(-50%, -50%);
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #d4af70;
        }
        .ctl-block-inner {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(212,175,112,0.2);
          border-radius: 10px;
          padding: 16px;
          backdrop-filter: blur(8px);
          width: 100%;
          direction: rtl;
          text-align: right;
          opacity: 0;
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .ctl-block.tl-left .ctl-block-inner { transform: translateX(-20px); }
        .ctl-block.tl-right .ctl-block-inner { transform: translateX(20px); }
        .ctl-block.active .ctl-block-inner { opacity: 1; transform: none; }
        .ctl-block-name { font-size: 1rem; color: #d4af70; font-weight: 700; margin-bottom: 6px; font-family: 'Noto Naskh Arabic', serif; }
        .ctl-block-date { font-family: 'Playfair Display', serif; font-size: 0.82rem; color: rgba(240,236,228,0.65); margin-bottom: 3px; }
        .ctl-block-venue { font-size: 0.78rem; color: rgba(240,236,228,0.45); line-height: 1.4; }
        .ctl-block-time { font-family: 'Playfair Display', serif; font-size: 1.1rem; color: #d4af70; font-weight: 700; margin-top: 8px; }

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
        </div>

        <div className="t2-timeline-section">
          {/* 7. Program title */}
          <h2 className="program-title anim scale-in">برنامج الأفراح</h2>
          <div className="program-underline anim" />

          {/* 8. Timeline — center line, alternating left/right */}
          <div className="ctl-wrapper" ref={blocksRef}>
            {events.map((evt, i) => (
              <div
                key={i}
                data-index={i}
                className={`ctl-block ${i % 2 === 0 ? "tl-left" : "tl-right"}${activated[i] ? " active" : ""}`}
              >
                <span className="ctl-circle" />
                <div className="ctl-block-inner">
                  <p className="ctl-block-name">{evt.name}</p>
                  <p className="ctl-block-date">{evt.date}</p>
                  <p className="ctl-block-venue">{evt.venue}</p>
                  <p className="ctl-block-time">{evt.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="t2-content">
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

      {/* Lottie doves */}
      <script src="https://unpkg.com/@lottiefiles/dotlottie-wc@0.9.3/dist/dotlottie-wc.js" type="module" async />
      <style>{`
        .dove-lottie-wrap {
          position: fixed;
          pointer-events: none;
          z-index: 50;
        }
        .dove-1-wrap { top: 8vh; left: -80px; animation: doveFlyR 18s linear 0s infinite; }
        .dove-2-wrap { top: 35vh; right: -80px; animation: doveFlyL 22s linear 5s infinite; }
        .dove-3-wrap { top: 65vh; left: -80px; animation: doveFlyR 26s linear 10s infinite; }
        @keyframes doveFlyR {
          0%   { transform: translateX(0); opacity: 0; }
          5%   { opacity: 0.8; }
          95%  { opacity: 0.8; }
          100% { transform: translateX(110vw); opacity: 0; }
        }
        @keyframes doveFlyL {
          0%   { transform: translateX(0); opacity: 0; }
          5%   { opacity: 0.8; }
          95%  { opacity: 0.8; }
          100% { transform: translateX(calc(-110vw)); opacity: 0; }
        }
      `}</style>
      <div className="dove-lottie-wrap dove-1-wrap">
        {/* @ts-ignore */}
        <dotlottie-wc src="https://lottie.host/fd22777d-03ed-4c47-9438-4d11970d8ab2/KoVMWyCQ7S.lottie" style={{width:'80px',height:'80px'}} autoplay loop />
      </div>
      <div className="dove-lottie-wrap dove-2-wrap" style={{transform:'scaleX(-1)'}}>
        {/* @ts-ignore */}
        <dotlottie-wc src="https://lottie.host/fd22777d-03ed-4c47-9438-4d11970d8ab2/KoVMWyCQ7S.lottie" style={{width:'70px',height:'70px'}} autoplay loop />
      </div>
      <div className="dove-lottie-wrap dove-3-wrap">
        {/* @ts-ignore */}
        <dotlottie-wc src="https://lottie.host/fd22777d-03ed-4c47-9438-4d11970d8ab2/KoVMWyCQ7S.lottie" style={{width:'60px',height:'60px'}} autoplay loop />
      </div>
    </>
  );
}

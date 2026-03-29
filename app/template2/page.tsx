"use client";

import { useEffect, useRef, useState } from "react";

export default function Template2Page() {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [mandalaPos, setMandalaPos] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!timelineRef.current) return;
      const rect = timelineRef.current.getBoundingClientRect();
      const windowH = window.innerHeight;
      const progress = Math.max(0, Math.min(1, (windowH - rect.top) / (windowH + rect.height)));
      setMandalaPos(progress * 100);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

        /* --- Timeline --- */
        .timeline {
          position: relative;
          direction: ltr;
          padding: 20px 0;
        }

        .timeline-line {
          position: absolute;
          left: 50%;
          top: 0;
          width: 2px;
          height: 100%;
          background: var(--gold);
          transform: translateX(-50%);
        }

        .timeline-event {
          display: flex;
          align-items: center;
          position: relative;
          margin-bottom: 36px;
        }

        .timeline-event:last-child {
          margin-bottom: 0;
        }

        .timeline-half {
          flex: 1;
          min-width: 0;
        }

        .tl-content-left {
          text-align: right;
          padding-right: 20px;
          direction: rtl;
        }

        .tl-content-right {
          text-align: left;
          padding-left: 20px;
          direction: rtl;
        }

        .timeline-dot {
          width: 10px;
          height: 10px;
          background: var(--gold);
          transform: rotate(45deg) scale(0);
          flex-shrink: 0;
          transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          z-index: 1;
        }


        @keyframes t2MandalaSpin { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(360deg); } }
        @keyframes dotPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(212,175,112,0.4); }
          50% { box-shadow: 0 0 0 6px rgba(212,175,112,0); }
        }


        .tl-event-name {
          font-family: 'Noto Naskh Arabic', serif;
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--gold);
          margin-bottom: 4px;
        }

        .tl-event-venue {
          font-size: 0.85rem;
          color: var(--pearl);
          opacity: 0.8;
          margin-bottom: 2px;
        }

        .tl-event-time {
          font-family: 'Playfair Display', serif;
          font-size: 0.9rem;
          color: var(--gold);
          opacity: 0.7;
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

          {/* 8. Timeline */}
          <div className="timeline" ref={timelineRef}>
            <div className="timeline-line" />
            {/* Scroll-following mandala — moves along timeline line */}
            <img
              src="/mandala.png"
              alt=""
              style={{
                position: "absolute",
                left: "50%",
                top: `${mandalaPos}%`,
                transform: "translate(-50%, -50%)",
                width: 40,
                height: 40,
                mixBlendMode: "normal",
                opacity: 1,
                pointerEvents: "none",
                zIndex: 10,
                animation: "t2MandalaSpin 12s linear infinite",
                transition: "top 0.15s linear",
                filter: "drop-shadow(0 0 8px #d4af70) drop-shadow(0 0 16px rgba(212,175,112,0.6))",
              }}
            />

            {/* Event 1 — LEFT: عقد القران */}
            <div className="timeline-event">
              <div
                className="timeline-half tl-content-left"
                style={{
                  opacity: mandalaPos >= 12 ? 1 : 0,
                  transform: mandalaPos >= 12 ? "translateX(0)" : "translateX(-40px)",
                  transition: "opacity 0.6s ease, transform 0.6s ease",
                }}
              >
                <p className="tl-event-name">عقد القران</p>
                <p className="tl-event-venue">جامع الزيتونة، تونس</p>
                <p className="tl-event-time">يوم الجمعة 12 جوان 2026 — 16:00</p>
              </div>
              <div
                className="timeline-dot"
                style={{
                  transform: mandalaPos >= 12 ? "rotate(45deg) scale(1)" : "rotate(45deg) scale(0)",
                  transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  animation: mandalaPos >= 12 ? "dotPulse 2.5s ease-in-out 0.5s infinite" : "none",
                }}
              />
              <div className="timeline-half" />
            </div>

            {/* Event 2 — RIGHT: العشاء */}
            <div className="timeline-event">
              <div className="timeline-half" />
              <div
                className="timeline-dot"
                style={{
                  transform: mandalaPos >= 37 ? "rotate(45deg) scale(1)" : "rotate(45deg) scale(0)",
                  transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  animation: mandalaPos >= 37 ? "dotPulse 2.5s ease-in-out 0.5s infinite" : "none",
                }}
              />
              <div
                className="timeline-half tl-content-right"
                style={{
                  opacity: mandalaPos >= 37 ? 1 : 0,
                  transform: mandalaPos >= 37 ? "translateX(0)" : "translateX(40px)",
                  transition: "opacity 0.6s ease, transform 0.6s ease",
                }}
              >
                <p className="tl-event-name">العشاء</p>
                <p className="tl-event-venue">
                  قاعة الأفراح &ldquo;ليالي قرطاج&rdquo;
                </p>
                <p className="tl-event-time">يوم السبت 13 جوان 2026 — 20:00</p>
              </div>
            </div>

            {/* Event 3 — LEFT: الحفل */}
            <div className="timeline-event">
              <div
                className="timeline-half tl-content-left"
                style={{
                  opacity: mandalaPos >= 62 ? 1 : 0,
                  transform: mandalaPos >= 62 ? "translateX(0)" : "translateX(-40px)",
                  transition: "opacity 0.6s ease, transform 0.6s ease",
                }}
              >
                <p className="tl-event-name">الحفل (العرس)</p>
                <p className="tl-event-venue">
                  نزل &ldquo;المرادي قمرت&rdquo;
                </p>
                <p className="tl-event-time">يوم الأحد 14 جوان 2026 — 19:00</p>
              </div>
              <div
                className="timeline-dot"
                style={{
                  transform: mandalaPos >= 62 ? "rotate(45deg) scale(1)" : "rotate(45deg) scale(0)",
                  transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  animation: mandalaPos >= 62 ? "dotPulse 2.5s ease-in-out 0.5s infinite" : "none",
                }}
              />
              <div className="timeline-half" />
            </div>

            {/* Event 4 — RIGHT: ليلة الزفاف */}
            <div className="timeline-event">
              <div className="timeline-half" />
              <div
                className="timeline-dot"
                style={{
                  transform: mandalaPos >= 87 ? "rotate(45deg) scale(1)" : "rotate(45deg) scale(0)",
                  transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  animation: mandalaPos >= 87 ? "dotPulse 2.5s ease-in-out 0.5s infinite" : "none",
                }}
              />
              <div
                className="timeline-half tl-content-right"
                style={{
                  opacity: mandalaPos >= 87 ? 1 : 0,
                  transform: mandalaPos >= 87 ? "translateX(0)" : "translateX(40px)",
                  transition: "opacity 0.6s ease, transform 0.6s ease",
                }}
              >
                <p className="tl-event-name">ليلة الزفاف</p>
                <p className="tl-event-venue">
                  نزل &ldquo;المرادي قمرت&rdquo;
                </p>
                <p className="tl-event-time">يوم الأحد 14 جوان 2026 — 23:30</p>
              </div>
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

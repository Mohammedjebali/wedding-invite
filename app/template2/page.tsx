"use client";
import { useState, useEffect, useRef, useCallback } from "react";

// ── Word-by-word scroll reveal ───────────────────────────────
function WordReveal({
  text,
  delay = 0,
  className = "",
  style = {},
}: {
  text: string;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const words = text.split(" ");
  const [visible, setVisible] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setStarted(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const timer = setTimeout(() => {
      const id = setInterval(() => {
        i++;
        setVisible(i);
        if (i >= words.length) clearInterval(id);
      }, 200);
      return () => clearInterval(id);
    }, delay);
    return () => clearTimeout(timer);
  }, [started, words.length, delay]);

  return (
    <span
      ref={ref}
      className={className}
      style={{ direction: "rtl", display: "block", ...style }}
    >
      {words.map((word, i) => (
        <span
          key={i}
          style={{
            opacity: i < visible ? 1 : 0,
            transform: i < visible ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 0.4s ease, transform 0.4s ease",
            display: "inline-block",
            marginLeft: "0.25em",
          }}
        >
          {word}
        </span>
      ))}
    </span>
  );
}

// ── Confetti burst ───────────────────────────────────────────
function Confetti({ active }: { active: boolean }) {
  const pieces = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: 5 + ((i * 2.3) % 90),
    color: ["#c9a84c", "#e8c547", "#8B1A1A", "#d4956a", "#f5e6d0", "#fff3da"][
      i % 6
    ],
    size: 6 + (i % 5),
    delay: (i * 0.08) % 1.2,
    dur: 1.8 + (i % 4) * 0.3,
    rotate: (i * 47) % 360,
  }));
  if (!active) return null;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 100,
        overflow: "hidden",
      }}
    >
      {pieces.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: "-20px",
            width: p.size,
            height: p.size * 0.6,
            background: p.color,
            borderRadius: "2px",
            animation: `t2confettiFall ${p.dur}s ease-in ${p.delay}s both`,
            transform: `rotate(${p.rotate}deg)`,
          }}
        />
      ))}
    </div>
  );
}

// ── Gold sparkle particles (20) ──────────────────────────────
function Sparkles({ active }: { active: boolean }) {
  const sparks = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: 8 + ((i * 4.7) % 84),
    delay: (i * 0.35) % 5,
    dur: 3 + (i % 4) * 0.6,
    size: 2 + (i % 4),
  }));
  if (!active) return null;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 15,
        overflow: "hidden",
      }}
    >
      {sparks.map((s) => (
        <div
          key={s.id}
          style={{
            position: "absolute",
            left: `${s.x}%`,
            bottom: "0",
            width: s.size,
            height: s.size,
            borderRadius: "50%",
            background: "#c9a84c",
            boxShadow: "0 0 4px #c9a84c",
            animation: `t2sparkFloat ${s.dur}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

// ── Config ────────────────────────────────────────────────────
const CONFIG = {
  groom_ar: "محمد أمين",
  bride_ar: "نور الهدى",
  groom_fr: "Mohamed Amine Ben Salem",
  bride_fr: "Nour El Hoda Jlel",
  date: "2026-08-08",
  time_ar: "على الساعة التاسعة ليلاً",
  groomDad: "السيّد فوزي بن سالم",
  groomMom: "السيّدة سماح بن سالم",
  brideDad: "السيّد نور الدين جلال",
  brideMom: "السيّدة فاطيمة جلال",
  bgMusic: "/music.mp3",
  bgMusicStart: 147,
};

// ── Countdown hook ────────────────────────────────────────────
function useCountdown(d: string) {
  const [t, setT] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = new Date(d).getTime() - Date.now();
      if (diff <= 0) return;
      setT({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [d]);
  return t;
}

// ── Scroll reveal hook ────────────────────────────────────────
function useScrollReveal(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const run = () => {
      document
        .querySelectorAll(".t2-reveal:not(.t2-visible)")
        .forEach((el) => {
          if (el.getBoundingClientRect().top < window.innerHeight - 40)
            el.classList.add("t2-visible");
        });
    };
    run();
    window.addEventListener("scroll", run, { passive: true });
    return () => window.removeEventListener("scroll", run);
  }, [active]);
}

// ── Thin gold divider ────────────────────────────────────────
function GoldDivider({ width = 120 }: { width?: number }) {
  return (
    <div
      style={{
        width,
        height: 1,
        background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.5), transparent)",
        margin: "16px auto",
      }}
    />
  );
}

// ── Star divider ─────────────────────────────────────────────
function StarDivider() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        padding: "0 40px",
      }}
    >
      <span
        style={{
          flex: 1,
          height: 1,
          background: "rgba(201,168,76,0.35)",
          maxWidth: 120,
        }}
      />
      <span style={{ color: "#C9A84C", fontSize: 14, opacity: 0.7 }}>
        &#10022;
      </span>
      <span
        style={{
          flex: 1,
          height: 1,
          background: "rgba(201,168,76,0.35)",
          maxWidth: 120,
        }}
      />
    </div>
  );
}

// ── Text shadow for readability ──────────────────────────────
const txtShadow = "0 2px 8px rgba(0,0,0,0.8)";

// ════════════════════════════════════════════════════════════════
// ── MAIN COMPONENT ─────────────────────────────────────────────
// ════════════════════════════════════════════════════════════════
export default function Template2Page() {
  const [opening, setOpening] = useState(false);
  const [gone, setGone] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [rsvp, setRsvp] = useState({ name: "", attending: "oui" });
  const [rsvpSent, setRsvpSent] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const countdown = useCountdown(CONFIG.date);
  const pad = (n: number) => String(n).padStart(2, "0");
  useScrollReveal(showContent);

  const handleOpen = useCallback(() => {
    if (opening) return;
    setOpening(true);
    if (audioRef.current && CONFIG.bgMusic) {
      audioRef.current.currentTime = CONFIG.bgMusicStart;
      audioRef.current.play().catch(() => {});
    }
    setTimeout(() => setShowContent(true), 2500);
    setTimeout(() => setGone(true), 3700);
  }, [opening]);

  const handleRsvp = (e: React.FormEvent) => {
    e.preventDefault();
    setRsvpSent(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3500);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Scheherazade+New:wght@400;700&family=Aref+Ruqaa:wght@400;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');

        @keyframes t2sparkFloat {
          0%   { opacity:0; transform:translateY(0) scale(0.5); }
          20%  { opacity:0.9; }
          80%  { opacity:0.5; }
          100% { opacity:0; transform:translateY(-80vh) scale(0.2) rotate(180deg); }
        }
        @keyframes t2confettiFall {
          0%   { opacity:1; transform:translateY(0) rotate(0deg) scaleX(1); }
          50%  { transform:translateY(50vh) rotate(360deg) scaleX(-1); }
          100% { opacity:0; transform:translateY(100vh) rotate(720deg) scaleX(-1); }
        }
        @keyframes t2btnPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(201,168,76,0.4); }
          50%     { box-shadow: 0 0 0 12px rgba(201,168,76,0); }
        }
        @keyframes t2fadeIn {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0); }
        }

        .t2-splash {
          position: fixed; inset: 0; z-index: 300;
          display: flex; align-items: center; justify-content: center;
          flex-direction: column; gap: 32px;
          transition: opacity 0.9s ease 0.4s, visibility 0.9s ease 0.4s;
        }
        .t2-splash.gone { opacity: 0; visibility: hidden; pointer-events: none; }

        .t2-reveal {
          opacity: 0; transform: translateY(24px);
          transition: opacity 0.9s ease, transform 0.9s ease;
        }
        .t2-reveal.t2-visible { opacity: 1; transform: translateY(0); }
        .t2-reveal-d1 { transition-delay: 0.1s; }
        .t2-reveal-d2 { transition-delay: 0.22s; }
        .t2-reveal-d3 { transition-delay: 0.38s; }
        .t2-reveal-d4 { transition-delay: 0.55s; }

        .t2-invitation {
          opacity: 0; transform: translateY(24px);
          transition: opacity 1.4s ease 0.5s, transform 1.4s ease 0.5s;
          pointer-events: none; position: relative;
        }
        .t2-invitation.t2-inv-visible { opacity: 1; transform: translateY(0); pointer-events: all; }

        .t2-page {
          min-height: 100svh;
          background-size: cover;
          background-repeat: no-repeat;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          direction: rtl;
        }

        .t2-input {
          width: 100%;
          background: rgba(0,0,0,0.5);
          border: 1px solid #C9A84C;
          border-radius: 8px;
          padding: 14px 16px;
          color: #f5e6d0;
          font-size: 15px;
          font-family: 'Aref Ruqaa', serif;
          outline: none;
          direction: rtl;
          transition: border-color 0.2s;
        }
        .t2-input:focus { border-color: #e8c547; }
        .t2-input::placeholder { color: rgba(201,168,76,0.4); }

        .t2-select {
          width: 100%;
          background: rgba(0,0,0,0.5);
          border: 1px solid #C9A84C;
          border-radius: 8px;
          padding: 14px 16px;
          color: #f5e6d0;
          font-size: 15px;
          font-family: 'Aref Ruqaa', serif;
          outline: none;
          -webkit-appearance: none;
          direction: rtl;
        }
        .t2-select option {
          background: #1a0505;
          color: #f5e6d0;
        }
      `}</style>

      {CONFIG.bgMusic && <audio ref={audioRef} src={CONFIG.bgMusic} loop />}

      {/* ══ SPLASH SCREEN ══ */}
      <div
        className={`t2-splash${gone ? " gone" : ""}`}
        style={{ cursor: opening ? "default" : "pointer" }}
        onClick={!opening ? handleOpen : undefined}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            pointerEvents: "none",
          }}
        >
          <source src="/splash-t2.mp4" type="video/mp4" />
        </video>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
          }}
        >
          {!opening && (
            <button
              onClick={handleOpen}
              style={{
                background: "transparent",
                color: "#C9A84C",
                border: "1px solid #C9A84C",
                padding: "14px 40px",
                borderRadius: 2,
                fontFamily: "'Scheherazade New', serif",
                fontSize: "clamp(1.6rem, 7vw, 2.4rem)",
                fontWeight: 700,
                cursor: "pointer",
                letterSpacing: "0.15em",
                animation: "t2btnPulse 2.5s ease-in-out infinite",
                transition: "background 0.3s, color 0.3s",
              }}
            >
              افتح الدعوة
            </button>
          )}
        </div>
      </div>

      {/* ══ CONFETTI & SPARKLES ══ */}
      <Confetti active={showConfetti} />
      <Sparkles active={showContent} />

      {/* ══ INVITATION (5 pages) ══ */}
      <div
        className={`t2-invitation${showContent ? " t2-inv-visible" : ""}`}
      >
        {/* ═══════════════════════════════════════════════════════
            PAGE 1 — BISMILLAH + NAMES (t2-bg1.png)
            Ganesha at top, text in lower 60%
            ═══════════════════════════════════════════════════════ */}
        <section
          className="t2-page"
          style={{
            backgroundImage: "url(/t2-bg1.png)",
            backgroundPosition: "top center",
            justifyContent: "flex-end",
            paddingTop: "45vh",
            paddingBottom: "8vh",
            paddingLeft: 24,
            paddingRight: 24,
          }}
        >
          <div
            className="t2-reveal"
            style={{
              fontFamily: "'Scheherazade New', serif",
              fontSize: "1.8rem",
              fontWeight: 700,
              color: "#C9A84C",
              textShadow: txtShadow,
              letterSpacing: "0.04em",
              lineHeight: 1.8,
            }}
          >
            بسم الله الرحمن الرحيم
          </div>

          <GoldDivider />

          <div
            className="t2-reveal t2-reveal-d1"
            style={{
              fontFamily: "'Aref Ruqaa', serif",
              fontSize: "1rem",
              color: "#f5e6d0",
              textShadow: txtShadow,
              lineHeight: 2,
              marginTop: 8,
              marginBottom: 12,
            }}
          >
            يسرّنا دعوتكم لحضور حفل زفاف
          </div>

          <GoldDivider />

          <div
            className="t2-reveal t2-reveal-d2"
            style={{ margin: "16px 0 10px" }}
          >
            <div
              style={{
                fontFamily: "'Scheherazade New', serif",
                fontWeight: 700,
                color: "#C9A84C",
                textShadow: txtShadow,
                lineHeight: 1.4,
              }}
            >
              <WordReveal
                text={CONFIG.groom_ar}
                delay={300}
                style={{ fontSize: "clamp(2.6rem, 11vw, 4.8rem)" }}
              />
              <span
                style={{
                  display: "block",
                  fontSize: "1.2rem",
                  color: "rgba(201,168,76,0.7)",
                  fontWeight: 400,
                  margin: "6px 0",
                  fontFamily: "'Aref Ruqaa', serif",
                  textShadow: txtShadow,
                }}
              >
                و
              </span>
              <WordReveal
                text={CONFIG.bride_ar}
                delay={800}
                style={{ fontSize: "clamp(2.6rem, 11vw, 4.8rem)" }}
              />
            </div>
          </div>

          <div
            className="t2-reveal t2-reveal-d3"
            style={{
              fontFamily: "'Aref Ruqaa', serif",
              fontSize: "0.95rem",
              color: "#f5e6d0",
              textShadow: txtShadow,
              marginTop: 12,
              opacity: 0.8,
            }}
          >
            وذلك بمشيئة الله تعالى
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            PAGE 2 — DATE + COUNTDOWN (t2-bg2.png)
            4 horizontal line guides in center
            ═══════════════════════════════════════════════════════ */}
        <section
          className="t2-page"
          style={{
            backgroundImage: "url(/t2-bg2.png)",
            backgroundPosition: "center",
            justifyContent: "center",
            padding: "30vh 20px",
          }}
        >
          <div
            className="t2-reveal"
            style={{
              color: "#C9A84C",
              fontSize: 14,
              letterSpacing: "0.4em",
              textShadow: txtShadow,
              marginBottom: 20,
            }}
          >
            &#9670; &#9670; &#9670;
          </div>

          <div
            className="t2-reveal t2-reveal-d1"
            style={{
              fontFamily: "'Scheherazade New', serif",
              fontSize: "clamp(1.6rem, 7vw, 2.4rem)",
              fontWeight: 700,
              color: "#C9A84C",
              textShadow: txtShadow,
              marginBottom: 8,
            }}
          >
            يوم السبت
          </div>

          <div
            className="t2-reveal t2-reveal-d1"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2.4rem, 10vw, 4rem)",
              fontWeight: 300,
              color: "#C9A84C",
              textShadow: txtShadow,
              lineHeight: 1.2,
              marginBottom: 4,
            }}
          >
            ٨ أوت ٢٠٢٦
          </div>

          <div
            className="t2-reveal t2-reveal-d2"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "0.9rem",
              letterSpacing: "0.18em",
              color: "#f5e6d0",
              textShadow: txtShadow,
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            Samedi 8 Ao&ucirc;t 2026
          </div>

          <div className="t2-reveal t2-reveal-d2" style={{ marginBottom: 28 }}>
            <StarDivider />
          </div>

          {/* Countdown */}
          <div
            className="t2-reveal t2-reveal-d3"
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 10,
            }}
          >
            {[
              { n: countdown.days, l: "يوم" },
              { n: countdown.hours, l: "ساعة" },
              { n: countdown.minutes, l: "دقيقة" },
              { n: countdown.seconds, l: "ثانية" },
            ].map(({ n, l }) => (
              <div
                key={l}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                  minWidth: 58,
                  padding: "12px 6px 10px",
                  background: "rgba(0,0,0,0.4)",
                  border: "1px solid rgba(201,168,76,0.4)",
                  borderRadius: 8,
                }}
              >
                <span
                  style={{
                    fontSize: "1.8rem",
                    fontWeight: 300,
                    color: "#C9A84C",
                    lineHeight: 1,
                    fontFamily: "'Cormorant Garamond', serif",
                    textShadow: txtShadow,
                  }}
                >
                  {pad(n)}
                </span>
                <span
                  style={{
                    fontFamily: "'Aref Ruqaa', serif",
                    fontSize: 12,
                    color: "#C9A84C",
                    textShadow: txtShadow,
                  }}
                >
                  {l}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            PAGE 3 — FAMILIES (t2-bg3.png)
            Darker oval arch in center
            ═══════════════════════════════════════════════════════ */}
        <section
          className="t2-page"
          style={{
            backgroundImage: "url(/t2-bg3.png)",
            backgroundPosition: "center",
            justifyContent: "center",
            padding: "25vh 30px",
          }}
        >
          <div
            className="t2-reveal"
            style={{
              fontFamily: "'Scheherazade New', serif",
              fontSize: "clamp(1.5rem, 6vw, 2.2rem)",
              fontWeight: 700,
              color: "#C9A84C",
              textShadow: txtShadow,
              marginBottom: 8,
            }}
          >
            العائلتان الكريمتان
          </div>

          <GoldDivider />

          {/* Groom family */}
          <div className="t2-reveal t2-reveal-d1" style={{ marginTop: 20, marginBottom: 20 }}>
            <div
              style={{
                fontFamily: "'Aref Ruqaa', serif",
                fontSize: "1.1rem",
                color: "#f5e6d0",
                lineHeight: 2.2,
                textShadow: txtShadow,
              }}
            >
              {CONFIG.groomDad}
              <br />
              {CONFIG.groomMom}
            </div>
          </div>

          <div
            className="t2-reveal t2-reveal-d2"
            style={{
              color: "#C9A84C",
              fontSize: 14,
              textShadow: txtShadow,
              margin: "4px 0",
            }}
          >
            &#10022;
          </div>

          {/* Bride family */}
          <div className="t2-reveal t2-reveal-d3" style={{ marginTop: 20 }}>
            <div
              style={{
                fontFamily: "'Aref Ruqaa', serif",
                fontSize: "1.1rem",
                color: "#f5e6d0",
                lineHeight: 2.2,
                textShadow: txtShadow,
              }}
            >
              {CONFIG.brideDad}
              <br />
              {CONFIG.brideMom}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            PAGE 4 — CEREMONY DETAILS (t2-bg4.png)
            Small Ganesha top ~20%, divider bottom ~80%
            ═══════════════════════════════════════════════════════ */}
        <section
          className="t2-page"
          style={{
            backgroundImage: "url(/t2-bg4.png)",
            backgroundPosition: "center",
            justifyContent: "center",
            padding: "20vh 24px",
          }}
        >
          <div
            className="t2-reveal"
            style={{
              fontFamily: "'Scheherazade New', serif",
              fontSize: "clamp(1.5rem, 6vw, 2.2rem)",
              fontWeight: 700,
              color: "#C9A84C",
              textShadow: txtShadow,
              marginBottom: 16,
            }}
          >
            تفاصيل الحفل
          </div>

          <div
            className="t2-reveal t2-reveal-d1"
            style={{
              fontFamily: "'Aref Ruqaa', serif",
              fontSize: "1rem",
              color: "#f5e6d0",
              textShadow: txtShadow,
              marginBottom: 8,
            }}
          >
            {CONFIG.time_ar}
          </div>

          <div
            className="t2-reveal t2-reveal-d1"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(3rem, 12vw, 5rem)",
              fontWeight: 300,
              color: "#C9A84C",
              textShadow: txtShadow,
              lineHeight: 1,
              marginBottom: 24,
              direction: "ltr",
            }}
          >
            21<span style={{ fontSize: "0.55em", opacity: 0.5 }}>h</span>00
          </div>

          {/* Date card */}
          <div
            className="t2-reveal t2-reveal-d2"
            style={{
              display: "flex",
              border: "1px solid rgba(201,168,76,0.35)",
              borderRadius: 8,
              overflow: "hidden",
              background: "rgba(0,0,0,0.35)",
              maxWidth: 360,
              width: "100%",
            }}
          >
            {[
              { top: "08", bottom: "Jour" },
              { top: "Ao\u00fbt", bottom: "Mois" },
              { top: "Samedi", bottom: "Jour" },
              { top: "2026", bottom: "Ann\u00e9e" },
            ].map((cell, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  padding: "14px 4px",
                  textAlign: "center",
                  borderRight:
                    i < 3 ? "1px solid rgba(201,168,76,0.15)" : "none",
                }}
              >
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: i === 2 ? "1rem" : "1.6rem",
                    fontWeight: 300,
                    color: "#C9A84C",
                    lineHeight: 1.2,
                    textShadow: txtShadow,
                  }}
                >
                  {cell.top}
                </div>
                <div
                  style={{
                    fontSize: 8,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "rgba(201,168,76,0.5)",
                    marginTop: 4,
                    fontFamily: "sans-serif",
                  }}
                >
                  {cell.bottom}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            PAGE 5 — RSVP + CLOSING DUA (t2-bg5.png)
            Star divider slightly below center
            ═══════════════════════════════════════════════════════ */}
        <section
          className="t2-page"
          style={{
            backgroundImage: "url(/t2-bg5.png)",
            backgroundPosition: "center",
            paddingTop: "15vh",
            paddingBottom: "10vh",
            paddingLeft: 24,
            paddingRight: 24,
            justifyContent: "flex-start",
          }}
        >
          {/* RSVP heading */}
          <div
            className="t2-reveal"
            style={{
              fontFamily: "'Scheherazade New', serif",
              fontSize: "clamp(1.5rem, 6vw, 2.2rem)",
              fontWeight: 700,
              color: "#C9A84C",
              textShadow: txtShadow,
              marginBottom: 8,
            }}
          >
            تأكيد الحضور
          </div>

          <div
            className="t2-reveal t2-reveal-d1"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              fontSize: "0.85rem",
              letterSpacing: "0.12em",
              color: "#f5e6d0",
              textShadow: txtShadow,
              marginBottom: 24,
            }}
          >
            Confirmer votre pr&eacute;sence avant le 1er Ao&ucirc;t
          </div>

          {/* RSVP form or success */}
          {rsvpSent ? (
            <div
              className="t2-reveal"
              style={{ textAlign: "center", padding: "20px 0" }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  border: "1px solid rgba(201,168,76,0.38)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 18px",
                  color: "#C9A84C",
                  fontSize: 20,
                }}
              >
                &#10022;
              </div>
              <div
                style={{
                  fontFamily: "'Scheherazade New', serif",
                  fontSize: "1.7rem",
                  fontWeight: 700,
                  color: "#C9A84C",
                  textShadow: txtShadow,
                  marginBottom: 10,
                }}
              >
                شكراً جزيلاً
              </div>
              <div
                style={{
                  fontFamily: "'Aref Ruqaa', serif",
                  fontSize: "1rem",
                  color: "#f5e6d0",
                  textShadow: txtShadow,
                  lineHeight: 2.2,
                  opacity: 0.8,
                }}
              >
                تم استلام ردّكم بنجاح
              </div>
            </div>
          ) : (
            <div
              className="t2-reveal t2-reveal-d2"
              style={{ maxWidth: 380, width: "100%" }}
            >
              <form
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
                onSubmit={handleRsvp}
              >
                <input
                  className="t2-input"
                  type="text"
                  placeholder="الاسم الكامل"
                  required
                  value={rsvp.name}
                  onChange={(e) =>
                    setRsvp({ ...rsvp, name: e.target.value })
                  }
                />
                <select
                  className="t2-select"
                  value={rsvp.attending}
                  onChange={(e) =>
                    setRsvp({ ...rsvp, attending: e.target.value })
                  }
                >
                  <option value="oui">سأحضر بكل سرور</option>
                  <option value="non">لن أتمكن من الحضور</option>
                </select>
                <button
                  type="submit"
                  style={{
                    width: "100%",
                    background:
                      "linear-gradient(135deg, #c9a84c 0%, #9a6e14 50%, #c9a84c 100%)",
                    backgroundSize: "200% auto",
                    color: "#fff8f0",
                    border: "none",
                    padding: 16,
                    borderRadius: 8,
                    fontSize: 17,
                    fontFamily: "'Aref Ruqaa', serif",
                    cursor: "pointer",
                    textShadow: txtShadow,
                    transition: "background-position 0.4s, transform 0.2s",
                  }}
                >
                  تأكيد الحضور
                </button>
              </form>
            </div>
          )}

          {/* Spacer to push closing dua down past the star divider */}
          <div style={{ flex: 1, minHeight: 60 }} />

          {/* Below star divider */}
          <div
            className="t2-reveal t2-reveal-d3"
            style={{
              color: "#C9A84C",
              fontSize: 14,
              letterSpacing: "0.4em",
              textShadow: txtShadow,
              marginBottom: 20,
            }}
          >
            &#9670; &#9670; &#9670;
          </div>

          <div
            className="t2-reveal t2-reveal-d4"
            style={{
              fontFamily: "'Aref Ruqaa', serif",
              fontSize: "clamp(0.95rem, 4vw, 1.15rem)",
              color: "#f5e6d0",
              textShadow: txtShadow,
              fontStyle: "italic",
              lineHeight: 2.4,
              maxWidth: 400,
            }}
          >
            نسأل الله أن يجمعهما على خير
            <br />
            ويبارك لهما في حياتهما المشتركة
          </div>
        </section>
      </div>
    </>
  );
}

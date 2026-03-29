"use client";
import { useState, useEffect, useRef, useCallback } from "react";

// ── Word-by-word reveal (Arabic-safe) ──────────────────────────
function TypeReveal({
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

// ── Confetti burst ─────────────────────────────────────────────
function Confetti({ active }: { active: boolean }) {
  const pieces = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: 5 + ((i * 2.3) % 90),
    color: ["#c9a84c", "#e8c547", "#8B1A1A", "#d4956a", "#f5e6d0", "#fff3da"][
      i % 6
    ],
    size: 6 + (i % 5),
    delay: ((i * 0.08) % 1.2),
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

// ── Gold sparkle particles ─────────────────────────────────────
function Sparkles({ active }: { active: boolean }) {
  const sparks = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    x: 10 + ((i * 5.5) % 80),
    delay: ((i * 0.3) % 4),
    dur: 2.5 + (i % 4) * 0.5,
    size: 3 + (i % 4),
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
            animation: `t2sparkFloat ${s.dur}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

// ── Config ──────────────────────────────────────────────────────
const CONFIG = {
  groom_ar: "محمد أمين بن سالم",
  bride_ar: "نور الهدى جلال",
  groom_fr: "Mohamed Amine Ben Salem",
  bride_fr: "Nour El Hoda Jlel",
  date: "2026-08-08",
  dateDisplay_ar: "يوم السبت ٨ أوت ٢٠٢٦",
  dateDisplay_fr: "Samedi 8 Août 2026",
  time_ar: "على الساعة التاسعة ليلاً",
  venue_name: "BOUARGOUB",
  venue_region: "Gouvernorat de Nabeul",
  mapsUrl: "https://maps.google.com/?q=Bouargoub+Nabeul+Tunisia",
  groomDad: "السيّد فوزي بن سالم",
  groomMom: "السيّدة سماح بن سالم",
  brideDad: "السيّد نور الدين جلال",
  brideMom: "السيّدة فاطيمة جلال",
  bgMusic: "/music.mp3",
  bgMusicStart: 147,
};

// ── Countdown hook ─────────────────────────────────────────────
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

// ── Scroll reveal hook ─────────────────────────────────────────
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

// ── Wax seal SVG ───────────────────────────────────────────────
function WaxSeal({ pulsing }: { pulsing: boolean }) {
  return (
    <svg
      width="140"
      height="140"
      viewBox="0 0 140 140"
      style={{
        filter: "drop-shadow(0 6px 32px rgba(201,168,76,0.45)) drop-shadow(0 2px 8px rgba(0,0,0,0.7))",
        animation: pulsing ? "t2sealPulse 2.5s ease-in-out forwards" : undefined,
      }}
    >
      <defs>
        <radialGradient id="sealGrad" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#C9A84C" />
          <stop offset="35%" stopColor="#9a6e14" />
          <stop offset="100%" stopColor="#5a3e00" />
        </radialGradient>
        <radialGradient id="sealShine" cx="38%" cy="30%" r="50%">
          <stop offset="0%" stopColor="rgba(255,240,180,0.25)" />
          <stop offset="100%" stopColor="rgba(255,240,180,0)" />
        </radialGradient>
      </defs>
      {/* Star/sunburst outer edge — classic wax seal shape */}
      <path
        d="M70,4 L76,16 L89,10 L89,24 L103,22 L97,35 L111,38 L100,48 L111,55 L98,61 L105,74 L91,74 L92,89 L79,84 L76,98 L65,90 L54,98 L51,84 L38,89 L39,74 L25,74 L32,61 L19,55 L30,48 L19,38 L33,35 L27,22 L41,24 L41,10 L54,16 Z"
        fill="url(#sealGrad)"
      />
      {/* Outer ring */}
      <circle cx="70" cy="70" r="44" fill="none" stroke="rgba(255,240,150,0.4)" strokeWidth="1.5" />
      {/* Inner filled circle */}
      <circle cx="70" cy="70" r="40" fill="url(#sealGrad)" />
      {/* Inner ring */}
      <circle cx="70" cy="70" r="35" fill="none" stroke="rgba(255,240,150,0.3)" strokeWidth="0.8" />
      {/* Initials */}
      <text
        x="70"
        y="80"
        textAnchor="middle"
        fontFamily="Rakkas, serif"
        fontSize="26"
        fontWeight="bold"
        fill="#1a0a00"
        direction="rtl"
        letterSpacing="2"
      >
        م &amp; ن
      </text>
      {/* Shine overlay */}
      <circle cx="70" cy="70" r="40" fill="url(#sealShine)" />
    </svg>
  );
}

// ── Gold divider line ──────────────────────────────────────────
function GoldDivider({ style = {} }: { style?: React.CSSProperties }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        justifyContent: "center",
        margin: "12px auto",
        color: "#C9A84C",
        fontSize: 10,
        maxWidth: 220,
        ...style,
      }}
    >
      <span
        style={{
          flex: 1,
          height: 1,
          background:
            "linear-gradient(90deg, transparent, rgba(201,168,76,0.5), transparent)",
        }}
      />
      <span>&#9670; &#9670; &#9670;</span>
      <span
        style={{
          flex: 1,
          height: 1,
          background:
            "linear-gradient(90deg, transparent, rgba(201,168,76,0.5), transparent)",
        }}
      />
    </div>
  );
}

// ── Section heading ────────────────────────────────────────────
function SectionHeading({
  children,
  sub,
}: {
  children: React.ReactNode;
  sub?: string;
}) {
  return (
    <>
      <div
        className="t2-reveal"
        style={{
          fontFamily: "'Rakkas', serif",
          fontSize: "clamp(1.6rem, 7vw, 2.2rem)",
          color: "#C9A84C",
          direction: "rtl",
          fontWeight: 400,
          marginBottom: 4,
          textAlign: "center",
        }}
      >
        {children}
      </div>
      {sub && (
        <div
          className="t2-reveal t2-reveal-d1"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            fontSize: 13,
            letterSpacing: "0.14em",
            color: "rgba(201,168,76,0.6)",
            marginBottom: 28,
            textAlign: "center",
          }}
        >
          {sub}
        </div>
      )}
    </>
  );
}

// ── Glass card ─────────────────────────────────────────────────
function GlassCard({
  children,
  style = {},
  className = "",
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{
        background: "rgba(10, 0, 0, 0.5)",
        border: "1px solid rgba(201,168,76,0.3)",
        borderRadius: 16,
        padding: "26px 20px",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// ── MAIN COMPONENT ─────────────────────────────────────────────
// ════════════════════════════════════════════════════════════════
export default function Template2Page() {
  const [opening, setOpening] = useState(false);
  const [gone, setGone] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [rsvp, setRsvp] = useState({
    name: "",
    phone: "",
    attending: "oui",
    guests: "1",
  });
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
        /* ══ T2 KEYFRAMES ══ */
        @keyframes t2sealPulse {
          0% { transform: scale(1); }
          40% { transform: scale(1.2); }
          100% { transform: scale(1.2); opacity: 0; }
        }
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
        @keyframes t2countPulse {
          0%,100% { transform:scale(1); }
          50%     { transform:scale(1.04); }
        }

        /* ══ T2 SPLASH ══ */
        .t2-splash {
          position: fixed; inset: 0; z-index: 300;
          display: flex; align-items: center; justify-content: center;
          flex-direction: column; gap: 32px;
          transition: opacity 0.9s ease 0.4s, visibility 0.9s ease 0.4s;
        }
        .t2-splash.gone { opacity: 0; visibility: hidden; pointer-events: none; }

        /* ══ T2 REVEAL ══ */
        .t2-reveal {
          opacity: 0; transform: translateY(24px);
          transition: opacity 0.9s ease, transform 0.9s ease;
        }
        .t2-reveal.t2-visible { opacity: 1; transform: translateY(0); }
        .t2-reveal-d1 { transition-delay: 0.1s; }
        .t2-reveal-d2 { transition-delay: 0.22s; }
        .t2-reveal-d3 { transition-delay: 0.38s; }
        .t2-reveal-d4 { transition-delay: 0.55s; }

        /* ══ T2 INVITATION ══ */
        .t2-invitation {
          min-height: 100vh;
          opacity: 0; transform: translateY(24px);
          transition: opacity 1.4s ease 0.5s, transform 1.4s ease 0.5s;
          pointer-events: none; position: relative;
        }
        .t2-invitation.t2-inv-visible { opacity: 1; transform: translateY(0); pointer-events: all; }

        /* ══ T2 INPUTS ══ */
        .t2-input {
          width: 100%;
          background: rgba(10, 0, 0, 0.5);
          border: 1px solid rgba(201,168,76,0.3);
          border-radius: 10px;
          padding: 14px 16px;
          color: #f5e6d0;
          font-size: 15px;
          font-family: 'Aref Ruqaa', serif;
          outline: none;
          direction: rtl;
          transition: border-color 0.2s;
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
        }
        .t2-input:focus { border-color: rgba(201,168,76,0.6); }
        .t2-input::placeholder { color: rgba(201,168,76,0.4); }

        .t2-select {
          width: 100%;
          background: rgba(10, 0, 0, 0.6);
          border: 1px solid rgba(201,168,76,0.3);
          border-radius: 10px;
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

        /* ══ T2 GOLD LINE ══ */
        .t2-gold-line {
          width: 60%; max-width: 280px; height: 1px;
          background: linear-gradient(90deg, transparent, #C9A84C, transparent);
          margin: 0 auto;
        }
      `}</style>

      {/* ══ AUDIO ══ */}
      {CONFIG.bgMusic && <audio ref={audioRef} src={CONFIG.bgMusic} loop />}

      {/* ══ SPLASH SCREEN ══ */}
      <div
        className={`t2-splash${gone ? " gone" : ""}`}
        style={{ cursor: opening ? "default" : "pointer" }}
        onClick={!opening ? handleOpen : undefined}
      >
        {/* Background video */}
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

        {/* Dark overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            pointerEvents: "none",
          }}
        />

        {/* Center content */}
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
          {/* Wax seal */}
          <WaxSeal pulsing={opening} />

          {/* Open button */}
          {!opening && (
            <button
              onClick={handleOpen}
              style={{
                background: "transparent",
                color: "#C9A84C",
                border: "1px solid #C9A84C",
                padding: "14px 40px",
                borderRadius: 40,
                fontFamily: "'Rakkas', serif",
                fontSize: 18,
                cursor: "pointer",
                letterSpacing: "0.06em",
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

      {/* ══ INVITATION ══ */}
      <div
        className={`t2-invitation${showContent ? " t2-inv-visible" : ""}`}
        style={{
          backgroundImage: "url(/bg-t2.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        {/* Semi-transparent dark overlay */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 5, 5, 0.35)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 2,
            padding: "0 24px",
          }}
        >
          {/* ── HERO ── */}
          <section
            style={{
              minHeight: "100svh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "80px 16px 110px",
              position: "relative",
            }}
          >
            <div className="t2-gold-line t2-reveal" style={{ marginBottom: 28 }} />

            <div
              className="t2-reveal t2-reveal-d1"
              style={{
                fontFamily: "'Rakkas', serif",
                fontSize: "clamp(1.6rem, 7vw, 2.6rem)",
                color: "#C9A84C",
                direction: "rtl",
                letterSpacing: "0.04em",
                lineHeight: 1.8,
                marginBottom: 20,
              }}
            >
              بسم الله الرحمن الرحيم
            </div>

            <GoldDivider />

            <div
              className="t2-reveal t2-reveal-d2"
              style={{
                fontFamily: "'Aref Ruqaa', serif",
                fontSize: "clamp(1.05rem, 4.2vw, 1.3rem)",
                color: "#f5e6d0",
                direction: "rtl",
                lineHeight: 2.3,
                marginBottom: 24,
              }}
            >
              بعد اهدائكم عاطر التحية وأزكى السلام
              <br />
              يسرّنا دعوتكم لحضور حفل زفاف
            </div>

            <div
              className="t2-reveal t2-reveal-d2"
              style={{ margin: "20px 0 14px" }}
            >
              <div
                style={{
                  fontFamily: "'Rakkas', serif",
                  fontSize: "clamp(2.8rem, 12vw, 5.2rem)",
                  fontWeight: 400,
                  color: "#C9A84C",
                  direction: "rtl",
                  lineHeight: 1.4,
                }}
              >
                <TypeReveal text={CONFIG.groom_ar} delay={300} />
                <span
                  style={{
                    display: "block",
                    fontSize: "0.35em",
                    color: "rgba(201,168,76,0.7)",
                    letterSpacing: "0.25em",
                    fontWeight: 400,
                    margin: "8px 0",
                    fontFamily: "'Cormorant Garamond', serif",
                    fontStyle: "italic",
                    direction: "ltr",
                  }}
                >
                  &#8212; &#10022; &#8212;
                </span>
                <TypeReveal text={CONFIG.bride_ar} delay={800} />
              </div>
            </div>

            <div
              className="t2-reveal t2-reveal-d3"
              style={{
                fontFamily: "'Aref Ruqaa', serif",
                fontSize: "clamp(1rem, 4vw, 1.2rem)",
                color: "#f5e6d0",
                direction: "rtl",
                marginTop: 16,
                opacity: 0.8,
                lineHeight: 2,
              }}
            >
              وذلك بمشيئة الله تعالى
            </div>

            <GoldDivider style={{ marginTop: 18 }} />

            {/* Date */}
            <div className="t2-reveal t2-reveal-d4" style={{ marginTop: 24 }}>
              <div
                style={{
                  fontFamily: "'Scheherazade New', serif",
                  fontSize: "clamp(1rem, 4.5vw, 1.3rem)",
                  color: "#C9A84C",
                  direction: "rtl",
                  lineHeight: 1.8,
                  fontWeight: 700,
                }}
              >
                {CONFIG.dateDisplay_ar}
              </div>
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontStyle: "italic",
                  fontSize: 13,
                  letterSpacing: "0.12em",
                  color: "rgba(201,168,76,0.6)",
                  marginTop: 3,
                }}
              >
                {CONFIG.dateDisplay_fr}
              </div>
            </div>

            {/* Countdown */}
            <div
              className="t2-reveal t2-reveal-d4"
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 8,
                marginTop: 28,
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
                    gap: 3,
                    minWidth: 58,
                    padding: "12px 6px 9px",
                    background: "rgba(10, 0, 0, 0.5)",
                    border: "1px solid rgba(201,168,76,0.3)",
                    borderRadius: 10,
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                  }}
                >
                  <span
                    style={{
                      fontSize: "1.8rem",
                      fontWeight: 300,
                      color: "#C9A84C",
                      lineHeight: 1,
                      fontFamily: "'Cormorant Garamond', serif",
                    }}
                  >
                    {pad(n)}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Aref Ruqaa', serif",
                      fontSize: 13,
                      color: "#f5e6d0",
                      direction: "rtl",
                      opacity: 0.7,
                    }}
                  >
                    {l}
                  </span>
                </div>
              ))}
            </div>

            <div className="t2-gold-line t2-reveal t2-reveal-d4" style={{ marginTop: 28 }} />

            {/* Scroll hint */}
            <div
              style={{
                position: "absolute",
                bottom: 28,
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 5,
                opacity: 0.3,
                color: "#C9A84C",
                animation: "t2fadeIn 1.5s ease forwards",
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <line x1="12" y1="4" x2="12" y2="20" />
                <polyline points="18 14 12 20 6 14" />
              </svg>
            </div>
          </section>

          {/* ── FAMILIES ── */}
          <section style={{ padding: "52px 16px", textAlign: "center" }}>
            <SectionHeading sub="Les familles">
              العائلتان الكريمتان
            </SectionHeading>

            <GlassCard
              className="t2-reveal t2-reveal-d2"
              style={{ marginBottom: 12 }}
            >
              <div
                style={{
                  fontFamily: "sans-serif",
                  fontSize: 9,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase" as const,
                  color: "#C9A84C",
                  marginBottom: 10,
                  opacity: 0.7,
                }}
              >
                عائلة العريس
              </div>
              <div
                style={{
                  fontFamily: "'Aref Ruqaa', serif",
                  fontSize: "1.05rem",
                  color: "#f5e6d0",
                  lineHeight: 2.1,
                  direction: "rtl",
                }}
              >
                {CONFIG.groomDad}
                <br />
                {CONFIG.groomMom}
              </div>
            </GlassCard>

            <GlassCard
              className="t2-reveal t2-reveal-d3"
              style={{ marginBottom: 12 }}
            >
              <div
                style={{
                  fontFamily: "sans-serif",
                  fontSize: 9,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase" as const,
                  color: "#C9A84C",
                  marginBottom: 10,
                  opacity: 0.7,
                }}
              >
                عائلة العروس
              </div>
              <div
                style={{
                  fontFamily: "'Aref Ruqaa', serif",
                  fontSize: "1.05rem",
                  color: "#f5e6d0",
                  lineHeight: 2.1,
                  direction: "rtl",
                }}
              >
                {CONFIG.brideDad}
                <br />
                {CONFIG.brideMom}
              </div>
            </GlassCard>

            <GoldDivider style={{ marginTop: 28 }} />
          </section>

          {/* ── CEREMONY DETAILS ── */}
          <section style={{ padding: "52px 16px", textAlign: "center" }}>
            <SectionHeading sub="D&#233;tails de la c&#233;r&#233;monie">
              تفاصيل الحفل
            </SectionHeading>

            <GlassCard
              className="t2-reveal t2-reveal-d2"
              style={{ borderRadius: 18, overflow: "hidden", padding: 0 }}
            >
              <div
                style={{
                  padding: "28px 20px 20px",
                  borderBottom: "1px solid rgba(201,168,76,0.15)",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: 9,
                    letterSpacing: "0.25em",
                    textTransform: "uppercase" as const,
                    color: "rgba(201,168,76,0.65)",
                    fontFamily: "sans-serif",
                    marginBottom: 16,
                  }}
                >
                  موعد الحفل
                </div>
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "4rem",
                    fontWeight: 300,
                    color: "#C9A84C",
                    lineHeight: 1,
                  }}
                >
                  21
                  <span style={{ fontSize: "2.2rem", opacity: 0.5 }}>h</span>
                  00
                </div>
                <div
                  style={{
                    fontFamily: "'Aref Ruqaa', serif",
                    fontSize: "1rem",
                    color: "#f5e6d0",
                    direction: "rtl",
                    margin: "8px 0 0",
                    opacity: 0.8,
                  }}
                >
                  {CONFIG.time_ar}
                </div>
              </div>
              <div style={{ padding: "22px 20px 26px", textAlign: "center" }}>
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "1.8rem",
                    fontWeight: 300,
                    color: "#C9A84C",
                    letterSpacing: "0.06em",
                    marginBottom: 6,
                  }}
                >
                  {CONFIG.venue_name}
                </div>
                <div
                  style={{
                    fontFamily: "sans-serif",
                    fontSize: 11,
                    color: "rgba(201,168,76,0.6)",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase" as const,
                    marginBottom: 22,
                  }}
                >
                  {CONFIG.venue_region}
                </div>
                <a
                  href={CONFIG.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 7,
                    border: "1px solid rgba(201,168,76,0.3)",
                    color: "#C9A84C",
                    padding: "11px 24px",
                    borderRadius: 30,
                    fontSize: 11,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase" as const,
                    textDecoration: "none",
                    fontFamily: "sans-serif",
                    background: "rgba(201,168,76,0.05)",
                    transition: "background 0.25s",
                  }}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  عرض الخريطة
                </a>
              </div>
            </GlassCard>

            {/* Date strip */}
            <div
              className="t2-reveal t2-reveal-d3"
              style={{
                display: "flex",
                border: "1px solid rgba(201,168,76,0.3)",
                borderRadius: 10,
                overflow: "hidden",
                marginTop: 14,
                background: "rgba(10, 0, 0, 0.5)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
              }}
            >
              {[
                { num: "08", label: "Ao\u00fbt" },
                {
                  num: "السبت",
                  label: "Samedi",
                  numStyle: {
                    fontFamily: "'Aref Ruqaa', serif",
                    fontSize: "1.3rem",
                    paddingTop: 6,
                  },
                },
                { num: "2026", label: "السنة" },
              ].map((cell, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    padding: "14px 6px",
                    textAlign: "center",
                    borderRight:
                      i < 2
                        ? "1px solid rgba(201,168,76,0.15)"
                        : "none",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "2.1rem",
                      fontWeight: 300,
                      color: "#C9A84C",
                      lineHeight: 1,
                      ...((cell as { numStyle?: React.CSSProperties }).numStyle || {}),
                    }}
                  >
                    {cell.num}
                  </div>
                  <div
                    style={{
                      fontSize: 8,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase" as const,
                      color: "rgba(201,168,76,0.5)",
                      marginTop: 4,
                      fontFamily: "sans-serif",
                    }}
                  >
                    {cell.label}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── RSVP ── */}
          <section style={{ padding: "52px 16px", textAlign: "center" }}>
            <SectionHeading sub="Confirmer votre pr&#233;sence avant le 1er Ao&#251;t">
              تأكيد الحضور
            </SectionHeading>

            {rsvpSent ? (
              <GlassCard
                className="t2-reveal"
                style={{ textAlign: "center", padding: "40px 20px" }}
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
                    color: "#C9A84C",
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
                    direction: "rtl",
                    lineHeight: 2.2,
                    opacity: 0.8,
                  }}
                >
                  تم استلام ردّكم بنجاح
                  <br />
                  يسعدنا استقبالكم في هذه المناسبة السعيدة
                </div>
              </GlassCard>
            ) : (
              <GlassCard className="t2-reveal t2-reveal-d1">
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
                  <input
                    className="t2-input"
                    type="tel"
                    placeholder="رقم الهاتف"
                    value={rsvp.phone}
                    onChange={(e) =>
                      setRsvp({ ...rsvp, phone: e.target.value })
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
                  {rsvp.attending === "oui" && (
                    <select
                      className="t2-select"
                      value={rsvp.guests}
                      onChange={(e) =>
                        setRsvp({ ...rsvp, guests: e.target.value })
                      }
                    >
                      {["1", "2", "3", "4", "5"].map((n) => (
                        <option key={n} value={n}>
                          {n} {parseInt(n) > 1 ? "أشخاص" : "شخص"}
                        </option>
                      ))}
                    </select>
                  )}
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
                      borderRadius: 10,
                      fontSize: 17,
                      fontFamily: "'Aref Ruqaa', serif",
                      cursor: "pointer",
                      transition:
                        "background-position 0.4s, transform 0.2s",
                    }}
                  >
                    تأكيد الحضور
                  </button>
                </form>
              </GlassCard>
            )}
          </section>

          {/* ── CLOSING DUA ── */}
          <section
            style={{
              padding: "52px 16px 60px",
              textAlign: "center",
            }}
          >
            <GoldDivider />
            <div
              className="t2-reveal t2-reveal-d1"
              style={{
                marginTop: 24,
                fontFamily: "'Aref Ruqaa', serif",
                fontSize: "1.1rem",
                color: "#f5e6d0",
                direction: "rtl",
                lineHeight: 2,
                opacity: 0.85,
              }}
            >
              نسأل الله أن يجمعهما على خير
              <br />
              ويبارك لهما في حياتهما المشتركة
            </div>
            <GoldDivider style={{ marginTop: 24 }} />
          </section>

          {/* ── FOOTER ── */}
          <footer
            style={{
              textAlign: "center",
              padding: "36px 16px 56px",
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              fontSize: 13,
              letterSpacing: "0.12em",
              color: "rgba(201,168,76,0.6)",
              borderTop: "1px solid rgba(201,168,76,0.15)",
            }}
          >
            {CONFIG.groom_fr} &amp; {CONFIG.bride_fr}
            <br />
            <span style={{ opacity: 0.45, display: "block", marginTop: 4 }}>
              {CONFIG.dateDisplay_fr} &#183; BOUARGOUB
            </span>
          </footer>
        </div>
      </div>
    </>
  );
}

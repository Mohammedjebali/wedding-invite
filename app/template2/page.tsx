"use client";
import { useState, useEffect, useRef, useCallback } from "react";

/* ── Ink Drop Name Reveal ──────────────────────────────────── */
function InkReveal({
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

  return (
    <span ref={ref} className={className} style={{ display: "inline", ...style }}>
      {words.map((w, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            marginInlineEnd: "0.3em",
            opacity: started ? 1 : 0,
            transform: started ? "translateY(0) scale(1)" : "translateY(-30px) scale(1.15)",
            transition: `opacity 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay + i * 200}ms, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay + i * 200}ms`,
          }}
        >
          {w}
        </span>
      ))}
    </span>
  );
}

/* ── Global Gold Dust Particles (fixed overlay) ───────────── */
function GlobalGoldDust() {
  const [particles, setParticles] = useState<
    { id: number; left: number; delay: number; duration: number; opacity: number; size: number }[]
  >([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 20,
        duration: 8 + Math.random() * 17,
        opacity: 0.2 + Math.random() * 0.3,
        size: 1 + Math.random(),
      }))
    );
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.left}%`,
            bottom: "-5%",
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: "#c69874",
            opacity: 0,
            animation: `t2DustFloat ${p.duration}s linear ${p.delay}s infinite`,
            ["--t2-dust-opacity" as string]: `${p.opacity}`,
          }}
        />
      ))}
    </div>
  );
}

/* ── Floating gold particles (per-section, existing) ──────── */
function GoldParticles() {
  const [particles, setParticles] = useState<
    { id: number; left: number; delay: number; duration: number; drift: number }[]
  >([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 15 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 8,
        duration: 6 + Math.random() * 6,
        drift: (Math.random() - 0.5) * 40,
      }))
    );
  }, []);

  return (
    <>
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.left}%`,
            bottom: 0,
            width: 2,
            height: 2,
            borderRadius: "50%",
            background: "#c69874",
            zIndex: 1,
            pointerEvents: "none" as const,
            ["--t2-drift" as string]: `${p.drift}px`,
            animation: `t2ParticleFloat ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </>
  );
}

/* ── Gold Shimmer Divider ──────────────────────────────────── */
function ShimmerDivider() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ display: "flex", alignItems: "center", justifyContent: "center", margin: "16px auto", position: "relative" }}>
      <div
        style={{
          height: 1,
          background: "linear-gradient(90deg, transparent, #c69874, #fff8e7, #c69874, transparent)",
          transition: "width 1s ease",
          width: visible ? "100%" : "0%",
          maxWidth: 200,
        }}
      />
      <span
        style={{
          position: "absolute",
          color: "#c69874",
          fontSize: "0.8rem",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.5s ease 1s",
        }}
      >
        ✦
      </span>
    </div>
  );
}

/* ── Image background section wrapper ───────────────────── */
function VideoSection({
  children,
  overlayOpacity = 0.55,
  flowerSrc,
  flowerRotation = "0deg",
}: {
  children: React.ReactNode;
  overlayOpacity?: number;
  flowerSrc?: string;
  flowerRotation?: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEntered(true);
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(section);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="t2-glow-section"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center", direction: "ltr" as const,
        overflow: "hidden",
        opacity: entered ? 1 : 0,
        transform: entered ? "translateY(0)" : "translateY(40px)",
        transition: "opacity 1s ease, transform 1s ease",
        backgroundImage: 'url("/t2-bg-section.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `rgba(0,0,0,${overlayOpacity})`,
          zIndex: 0,
        }}
      />
      {/* Curtain reveal overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(10,10,10,0.95)",
          zIndex: 4,
          transformOrigin: "top",
          transform: entered ? "scaleY(0)" : "scaleY(1)",
          transition: "transform 1.2s ease-out",
        }}
      />
      <GoldParticles />
      {flowerSrc && (
        <>
          {/* Bottom-left flower */}
          <img
            src={flowerSrc}
            alt=""
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: 120,
              opacity: 0.55,
              mixBlendMode: "screen",
              pointerEvents: "none",
              zIndex: 2,
              transform: `rotate(${flowerRotation})`,
            }}
          />
          {/* Top-right flower (mirrored) */}
          <img
            src={flowerSrc}
            alt=""
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: 80,
              opacity: 0.35,
              mixBlendMode: "screen",
              pointerEvents: "none",
              zIndex: 2,
              transform: `scaleX(-1) rotate(${flowerRotation})`,
            }}
          />
        </>
      )}
      <div
        className={`t2-section-content${entered ? " t2-section-entered" : ""}`}
        style={{
          position: "relative",
          zIndex: 5,
          textAlign: "center",
          direction: "rtl",
          padding: "80px 24px",
          width: "100%",
          maxWidth: 700,
        }}
      >
        {children}
      </div>
    </section>
  );
}

/* ── Confetti particle ───────────────────────────────────── */
interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  angle: number;
  velocity: number;
  spin: number;
}

function createParticles(count: number): Particle[] {
  const colors = ["#c69874", "#f5e6d0", "#e8c97a", "#fff", "#d4a843", "#f0d68a"];
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 50 + (Math.random() - 0.5) * 10,
    y: 50,
    color: colors[Math.floor(Math.random() * colors.length)],
    size: Math.random() * 8 + 4,
    angle: Math.random() * 360,
    velocity: Math.random() * 300 + 150,
    spin: (Math.random() - 0.5) * 720,
  }));
}

/* ── Countdown digit with pulse animation ──────────────────── */
function CountdownDigit({
  value,
  style,
}: {
  value: number;
  style: React.CSSProperties;
}) {
  const [pulse, setPulse] = useState(false);
  const prevRef = useRef(value);

  useEffect(() => {
    if (prevRef.current !== value) {
      prevRef.current = value;
      setPulse(true);
      const timer = setTimeout(() => setPulse(false), 300);
      return () => clearTimeout(timer);
    }
  }, [value]);

  return (
    <div className={pulse ? "t2-count-pulse" : ""} style={style}>
      {value}
    </div>
  );
}

/* ── Countdown hook ──────────────────────────────────────── */
function useCountdown(target: Date) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target.getTime() - now.getTime());
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { days, hours, minutes, seconds };
}

/* ── RSVP Burst rays ─────────────────────────────────────── */
function RsvpBurst({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        zIndex: 10,
      }}
    >
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: 2,
            height: 40,
            background: "linear-gradient(to top, #c69874, transparent)",
            transformOrigin: "bottom center",
            transform: `rotate(${i * 45}deg)`,
            animation: `t2BurstRay 0.8s ease-out forwards`,
            opacity: 0,
          }}
        />
      ))}
    </div>
  );
}

/* ── Main page ───────────────────────────────────────────── */
export default function Template2Page() {
  const [opened, setOpened] = useState(false);
  const [splitDone, setSplitDone] = useState(false);
  const [confetti, setConfetti] = useState<Particle[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [submitBurst, setSubmitBurst] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [attending, setAttending] = useState("نعم");

  const weddingDate = new Date("2026-08-08T21:00:00");
  const { days, hours, minutes, seconds } = useCountdown(weddingDate);

  const handleOpen = useCallback(() => {
    setOpened(true);
    setTimeout(() => setSplitDone(true), 1400);
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!guestName.trim()) return;
      setSubmitBurst(true);
      setTimeout(() => {
        setSubmitted(true);
        setConfetti(createParticles(60));
        setTimeout(() => setConfetti([]), 3000);
        setTimeout(() => setSubmitBurst(false), 1000);
      }, 400);
    },
    [guestName]
  );

  const gold = "#c69874";
  const cream = "#f5e6d0";

  const headingStyle: React.CSSProperties = {
    fontFamily: '"Reem Kufi", serif',
    color: gold,
    textShadow: "0 2px 8px rgba(0,0,0,0.8)",
    margin: 0,
  };

  const bodyStyle: React.CSSProperties = {
    color: cream,
    fontFamily: '"Reem Kufi", serif',
    margin: 0,
  };

  const diamondDivider = (
    <p style={{ color: gold, fontSize: "1rem", margin: "20px 0", letterSpacing: "0.5em" }}>
      ◆ ◆ ◆
    </p>
  );

  const starDivider = (
    <p style={{ color: gold, fontSize: "1.2rem", margin: "16px 0" }}>✦</p>
  );

  const countdownCardStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minWidth: 50,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Reem+Kufi:wght@400..700&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a0a; overflow-x: hidden; }

        @keyframes confetti-fall {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) rotate(var(--rot)); opacity: 0; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes t2FadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes t2Shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes t2CountPulse {
          0% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        @keyframes t2ParticleFloat {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 0.7; }
          90% { opacity: 0.7; }
          100% { transform: translateY(-100vh) translateX(var(--t2-drift)); opacity: 0; }
        }

        /* Letter unfold split */
        @keyframes t2SplitUp {
          from { transform: translateY(0); }
          to { transform: translateY(-100%); }
        }
        @keyframes t2SplitDown {
          from { transform: translateY(0); }
          to { transform: translateY(100%); }
        }

        /* Global gold dust */
        @keyframes t2DustFloat {
          0% { transform: translateY(0); opacity: 0; }
          5% { opacity: var(--t2-dust-opacity); }
          90% { opacity: var(--t2-dust-opacity); }
          100% { transform: translateY(-110vh); opacity: 0; }
        }

        /* RSVP burst */
        @keyframes t2BurstRay {
          0% { opacity: 0.9; height: 0; }
          50% { opacity: 0.7; height: 60px; }
          100% { opacity: 0; height: 80px; }
        }
        @keyframes t2ButtonPop {
          0% { transform: scale(1); }
          40% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }

        /* Ambient glow pulse */
        .t2-glow-section::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle, rgba(198,152,116,0.12), transparent 70%);
          animation: t2GlowPulse 4s ease-in-out infinite;
          pointer-events: none;
          z-index: 1;
        }
        @keyframes t2GlowPulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        .t2-section-content > * { opacity: 0; transform: translateY(20px); }
        .t2-section-entered > * { animation: t2FadeUp 0.7s ease forwards; }
        .t2-section-entered > *:nth-child(1) { animation-delay: 0s; }
        .t2-section-entered > *:nth-child(2) { animation-delay: 0.15s; }
        .t2-section-entered > *:nth-child(3) { animation-delay: 0.3s; }
        .t2-section-entered > *:nth-child(4) { animation-delay: 0.45s; }
        .t2-section-entered > *:nth-child(5) { animation-delay: 0.6s; }
        .t2-section-entered > *:nth-child(6) { animation-delay: 0.75s; }
        .t2-section-entered > *:nth-child(7) { animation-delay: 0.9s; }
        .t2-section-entered > *:nth-child(8) { animation-delay: 1.05s; }
        .t2-section-entered > *:nth-child(9) { animation-delay: 1.2s; }
        .t2-section-entered > *:nth-child(10) { animation-delay: 1.35s; }
        .t2-section-entered > *:nth-child(11) { animation-delay: 1.5s; }
        .t2-section-entered > *:nth-child(12) { animation-delay: 1.65s; }
        .t2-shimmer-heading {
          background: linear-gradient(90deg, #c69874 0%, #f5e6d0 40%, #c69874 60%, #8B6914 100%) !important;
          background-size: 200% auto !important;
          -webkit-background-clip: text !important;
          -webkit-text-fill-color: transparent !important;
          background-position: -200% center;
          text-shadow: none !important;
        }
        .t2-section-entered .t2-shimmer-heading {
          animation: t2FadeUp 0.7s ease forwards, t2Shimmer 2.5s ease 0.5s both !important;
        }
        .t2-count-pulse { animation: t2CountPulse 0.3s ease; }
        input:focus, select:focus { outline: none; border-color: ${gold} !important; }
      `}</style>

      {/* ── Global Gold Dust Particles ─────────────────────── */}
      <GlobalGoldDust />

      {/* ── Splash Screen ──────────────────────────────────── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center", direction: "ltr" as const,
          opacity: opened ? 0 : 1,
          pointerEvents: opened ? "none" : "auto",
          transition: "opacity 0.8s ease",
        }}
      >
        <video
          autoPlay
          muted
          playsInline
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        >
          <source src="/splash-t2.mp4" type="video/mp4" />
        </video>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
          }}
        />
        <button
          onClick={handleOpen}
          style={{
            position: "relative",
            zIndex: 1,
            fontSize: "clamp(1.6rem, 7vw, 2.4rem)",
            fontFamily: '"Reem Kufi", serif',
            color: gold,
            border: `1.5px solid ${gold}`,
            padding: "16px 48px",
            background: "transparent",
            letterSpacing: "0.15em",
            cursor: "pointer",
          }}
        >
          افتح الدعوة
        </button>
      </div>

      {/* ── Letter Unfold Split Overlay ────────────────────── */}
      {opened && !splitDone && (
        <>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              height: "50%",
              background: "rgba(10,10,10,0.92)",
              zIndex: 90,
              animation: "t2SplitUp 1.2s cubic-bezier(0.77, 0, 0.175, 1) forwards",
            }}
          />
          <div
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              height: "50%",
              background: "rgba(10,10,10,0.92)",
              zIndex: 90,
              animation: "t2SplitDown 1.2s cubic-bezier(0.77, 0, 0.175, 1) forwards",
            }}
          />
        </>
      )}

      {/* ── Invitation Content ─────────────────────────────── */}
      <div
        style={{
          opacity: splitDone ? 1 : 0,
          transform: splitDone ? "translateY(0)" : "translateY(40px)",
          transition: "opacity 0.8s ease 0.1s, transform 0.8s ease 0.1s",
        }}
      >
        {/* ── Section 1: Bismillah + Names ─────────────────── */}
        <VideoSection flowerSrc="/flower1.png" flowerRotation="-15deg">
          <p className="t2-shimmer-heading" style={{ ...headingStyle, fontSize: "1.8rem" }}>
            بسم الله الرحمن الرحيم
          </p>
          <ShimmerDivider />
          <p style={{ ...bodyStyle, fontSize: "1rem" }}>
            يسرّنا دعوتكم لحضور حفل زفاف
          </p>
          <p style={{ color: gold, fontSize: "1rem", margin: "20px 0" }}>
            — ✦ —
          </p>
          <div style={{ margin: "24px 0" }}>
            <InkReveal
              text="محمد أمين"
              style={{ ...headingStyle, fontSize: "2.8rem", fontWeight: 700 }}
            />
            <p
              style={{
                ...bodyStyle,
                fontSize: "1.2rem",
                color: gold,
                margin: "12px 0",
              }}
            >
              و
            </p>
            <InkReveal
              text="نور الهدى"
              delay={600}
              style={{ ...headingStyle, fontSize: "2.8rem", fontWeight: 700 }}
            />
          </div>
          <p style={{ ...bodyStyle, fontSize: "0.9rem" }}>
            وذلك بمشيئة الله تعالى
          </p>
        </VideoSection>

        {/* ── Section 2: Date + Countdown + Families ────────── */}
        <VideoSection flowerSrc="/flower2.png" flowerRotation="10deg">
          {diamondDivider}
          <p className="t2-shimmer-heading" style={{ ...headingStyle, fontSize: "1.8rem" }}>
            يوم السبت ٨ أوت ٢٠٢٦
          </p>
          <p
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: "1rem",
              color: cream,
              fontStyle: "italic",
              margin: "8px 0 0",
            }}
          >
            Samedi 8 Août 2026
          </p>
          {starDivider}

          {/* Countdown */}
          <div
            style={{
              display: "flex",
              justifyContent: "center", direction: "ltr" as const,
              gap: 12,
              flexWrap: "wrap",
              margin: "20px 0",
            }}
          >
            {[
              { value: days, label: "يوم" },
            ].map((item) => (
              <div key={item.label} style={countdownCardStyle}>
                <CountdownDigit
                  value={item.value}
                  style={{
                    fontFamily: '"Cormorant Garamond", serif',
                    fontSize: "2rem",
                    color: gold,
                    lineHeight: 1,
                  }}
                />
                <div style={{ fontSize: "0.75rem", color: cream, marginTop: 4 }}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>

          {starDivider}

          {/* Families */}
          <p className="t2-shimmer-heading" style={{ ...headingStyle, fontSize: "1.4rem", marginBottom: 20 }}>
            العائلتان الكريمتان
          </p>

          <div style={{ marginBottom: 20 }}>
            <p style={{ ...bodyStyle, fontSize: "0.85rem", color: gold, marginBottom: 6 }}>
              عائلة العريس
            </p>
            <p style={{ ...bodyStyle, fontSize: "1rem" }}>
              السيّد فوزي بن سالم / السيّدة سماح بن سالم
            </p>
          </div>

          <ShimmerDivider />

          <div>
            <p style={{ ...bodyStyle, fontSize: "0.85rem", color: gold, marginBottom: 6 }}>
              عائلة العروس
            </p>
            <p style={{ ...bodyStyle, fontSize: "1rem" }}>
              السيّد نور الدين جلال / السيّدة فاطيمة جلال
            </p>
          </div>
        </VideoSection>

        {/* ── Section 3: Details + RSVP ─────────────────────── */}
        <VideoSection flowerSrc="/flower3.png" flowerRotation="-8deg">
          <p className="t2-shimmer-heading" style={{ ...headingStyle, fontSize: "1.6rem" }}>تفاصيل الحفل</p>
          <p
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: "0.9rem",
              color: cream,
              margin: "4px 0 0",
            }}
          >
            Détails de la cérémonie
          </p>
          <ShimmerDivider />

          <p
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: "5rem",
              color: gold,
              lineHeight: 1,
              margin: "20px 0 8px",
            }}
          >
            21h00
          </p>
          <p style={{ ...bodyStyle, fontSize: "1rem" }}>
            على الساعة التاسعة ليلاً
          </p>

          {/* Date strip */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              direction: "ltr" as const,
              gap: 0,
              margin: "24px 0",
            }}
          >
            {["08", "Août", "Samedi"].map((txt, i) => (
              <div
                key={i}
                style={{
                  background: "rgba(0,0,0,0.5)",
                  border: `1px solid rgba(201,168,76,0.4)`,
                  padding: "12px 20px",
                  fontFamily: '"Cormorant Garamond", serif',
                  color: gold,
                  fontSize: i === 0 ? "1.4rem" : "1rem",
                  fontWeight: i === 0 ? 600 : 400,
                }}
              >
                {txt}
              </div>
            ))}
          </div>

          {diamondDivider}

          {/* RSVP */}
          <div style={{ marginTop: 20 }}>
            <p className="t2-shimmer-heading" style={{ ...headingStyle, fontSize: "1.4rem", marginBottom: 8 }}>
              تأكيد الحضور
            </p>
            <p
              style={{
                fontFamily: '"Cormorant Garamond", serif',
                fontSize: "0.85rem",
                color: cream,
                marginBottom: 24,
              }}
            >
              Confirmer votre présence avant le 1er Août
            </p>

            {!submitted ? (
              <form
                onSubmit={handleSubmit}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                  maxWidth: 340,
                  margin: "0 auto",
                }}
              >
                <input
                  type="text"
                  placeholder="الاسم الكامل"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  style={{
                    background: "rgba(0,0,0,0.4)",
                    border: `1px solid rgba(201,168,76,0.4)`,
                    color: cream,
                    padding: "14px 16px",
                    borderRadius: 4,
                    fontFamily: '"Reem Kufi", serif',
                    fontSize: "1rem",
                    direction: "rtl",
                  }}
                />
                <select
                  value={attending}
                  onChange={(e) => setAttending(e.target.value)}
                  style={{
                    background: "rgba(0,0,0,0.4)",
                    border: `1px solid rgba(201,168,76,0.4)`,
                    color: cream,
                    padding: "14px 16px",
                    borderRadius: 4,
                    fontFamily: '"Reem Kufi", serif',
                    fontSize: "1rem",
                    direction: "rtl",
                    appearance: "none",
                  }}
                >
                  <option value="نعم">نعم، سأحضر</option>
                  <option value="لا">لا، لن أتمكن</option>
                </select>
                <div style={{ position: "relative" }}>
                  <button
                    type="submit"
                    style={{
                      width: "100%",
                      background: gold,
                      color: "#1a1a1a",
                      border: "none",
                      padding: "14px 32px",
                      fontFamily: '"Reem Kufi", serif',
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      borderRadius: 4,
                      cursor: "pointer",
                      letterSpacing: "0.05em",
                      animation: submitBurst ? "t2ButtonPop 0.5s ease" : "none",
                    }}
                  >
                    إرسال
                  </button>
                  <RsvpBurst active={submitBurst} />
                </div>
              </form>
            ) : (
              <p
                style={{
                  ...bodyStyle,
                  fontSize: "1.1rem",
                  color: gold,
                  animation: "fadeInUp 0.6s ease",
                }}
              >
                شكراً لتأكيد حضوركم ✦
              </p>
            )}
          </div>

          <ShimmerDivider />

          {/* Closing dua */}
          <p
            style={{
              ...bodyStyle,
              fontSize: "0.95rem",
              fontStyle: "italic",
              marginTop: 20,
              lineHeight: 1.8,
            }}
          >
            نسأل الله أن يجمعهما على خير ويبارك لهما في حياتهما المشتركة
          </p>
        </VideoSection>
      </div>

      {/* ── Confetti overlay ───────────────────────────────── */}
      {confetti.length > 0 && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            zIndex: 200,
          }}
        >
          {confetti.map((p) => {
            const rad = (p.angle * Math.PI) / 180;
            const tx = Math.cos(rad) * p.velocity;
            const ty = Math.sin(rad) * p.velocity - 200;
            return (
              <div
                key={p.id}
                style={{
                  position: "absolute",
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  width: p.size,
                  height: p.size,
                  background: p.color,
                  borderRadius: Math.random() > 0.5 ? "50%" : "0",
                  ["--tx" as string]: `${tx}px`,
                  ["--ty" as string]: `${ty}px`,
                  ["--rot" as string]: `${p.spin}deg`,
                  animation: "confetti-fall 2.5s ease-out forwards",
                }}
              />
            );
          })}
        </div>
      )}
    </>
  );
}

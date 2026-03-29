"use client";
import { useState, useEffect, useRef, useCallback } from "react";

/* ── Word-by-word IntersectionObserver reveal ─────────────── */
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
    const interval = setInterval(() => {
      i++;
      setVisible(i);
      if (i >= words.length) clearInterval(interval);
    }, 200);
    const timer = setTimeout(() => {}, delay);
    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [started, words.length, delay]);

  return (
    <span ref={ref} className={className} style={{ display: "inline", ...style }}>
      {words.map((w, i) => (
        <span
          key={i}
          style={{
            opacity: i < visible ? 1 : 0,
            transform: i < visible ? "translateY(0)" : "translateY(18px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
            display: "inline-block",
            marginInlineEnd: "0.3em",
          }}
        >
          {w}
        </span>
      ))}
    </span>
  );
}

/* ── Video background section wrapper ────────────────────── */
function VideoSection({
  src,
  children,
  overlayOpacity = 0.55,
}: {
  src: string;
  children: React.ReactNode;
  overlayOpacity?: number;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play();
        } else {
          video.pause();
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
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <video
        ref={videoRef}
        muted
        playsInline
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
          willChange: "transform",
          transform: "translateZ(0)",
        }}
      >
        <source src={src} type="video/mp4" />
      </video>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `rgba(0,0,0,${overlayOpacity})`,
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "relative",
          zIndex: 1,
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

/* ── Main page ───────────────────────────────────────────── */
export default function Template2Page() {
  const [opened, setOpened] = useState(false);
  const [confetti, setConfetti] = useState<Particle[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [attending, setAttending] = useState("نعم");

  const weddingDate = new Date("2026-08-08T21:00:00");
  const { days, hours, minutes, seconds } = useCountdown(weddingDate);

  const handleOpen = useCallback(() => setOpened(true), []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!guestName.trim()) return;
      setSubmitted(true);
      setConfetti(createParticles(60));
      setTimeout(() => setConfetti([]), 3000);
    },
    [guestName]
  );

  const gold = "#c69874";
  const cream = "#f5e6d0";

  const headingStyle: React.CSSProperties = {
    fontFamily: '"Amiri", serif',
    color: gold,
    textShadow: "0 2px 8px rgba(0,0,0,0.8)",
    margin: 0,
  };

  const bodyStyle: React.CSSProperties = {
    color: cream,
    fontFamily: '"Amiri", serif',
    margin: 0,
  };

  const goldDivider = (
    <div style={{ width: 60, height: 1, background: gold, margin: "16px auto" }} />
  );

  const diamondDivider = (
    <p style={{ color: gold, fontSize: "1rem", margin: "20px 0", letterSpacing: "0.5em" }}>
      ◆ ◆ ◆
    </p>
  );

  const starDivider = (
    <p style={{ color: gold, fontSize: "1.2rem", margin: "16px 0" }}>✦</p>
  );

  const countdownCardStyle: React.CSSProperties = {
    background: "rgba(0,0,0,0.4)",
    border: "1px solid rgba(201,168,76,0.3)",
    padding: 16,
    borderRadius: 4,
    minWidth: 70,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&display=swap');
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
        input:focus, select:focus { outline: none; border-color: ${gold} !important; }
      `}</style>

      {/* ── Splash Screen ──────────────────────────────────── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
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
            fontFamily: '"Amiri", serif',
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

      {/* ── Invitation Content ─────────────────────────────── */}
      <div
        style={{
          opacity: opened ? 1 : 0,
          transform: opened ? "translateY(0)" : "translateY(40px)",
          transition: "opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s",
        }}
      >
        {/* ── Section 1: Bismillah + Names ─────────────────── */}
        <VideoSection src="/t2-vid1.mp4">
          <p style={{ ...headingStyle, fontSize: "1.8rem" }}>
            بسم الله الرحمن الرحيم
          </p>
          {goldDivider}
          <p style={{ ...bodyStyle, fontSize: "1rem" }}>
            يسرّنا دعوتكم لحضور حفل زفاف
          </p>
          <p style={{ color: gold, fontSize: "1rem", margin: "20px 0" }}>
            — ✦ —
          </p>
          <div style={{ margin: "24px 0" }}>
            <WordReveal
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
            <WordReveal
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
        <VideoSection src="/t2-vid2.mp4">
          {diamondDivider}
          <p style={{ ...headingStyle, fontSize: "1.8rem" }}>
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
              justifyContent: "center",
              gap: 12,
              flexWrap: "wrap",
              margin: "20px 0",
            }}
          >
            {[
              { value: days, label: "يوم" },
              { value: hours, label: "ساعة" },
              { value: minutes, label: "دقيقة" },
              { value: seconds, label: "ثانية" },
            ].map((item) => (
              <div key={item.label} style={countdownCardStyle}>
                <div
                  style={{
                    fontFamily: '"Cormorant Garamond", serif',
                    fontSize: "3rem",
                    color: gold,
                    lineHeight: 1,
                  }}
                >
                  {item.value}
                </div>
                <div style={{ fontSize: "0.75rem", color: cream, marginTop: 4 }}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>

          {starDivider}

          {/* Families */}
          <p style={{ ...headingStyle, fontSize: "1.4rem", marginBottom: 20 }}>
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

          <div style={{ width: 40, height: 1, background: gold, margin: "0 auto 20px" }} />

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
        <VideoSection src="/t2-vid3.mp4">
          <p style={{ ...headingStyle, fontSize: "1.6rem" }}>تفاصيل الحفل</p>
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
          {goldDivider}

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
              gap: 0,
              margin: "24px 0",
              direction: "ltr",
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
            <p style={{ ...headingStyle, fontSize: "1.4rem", marginBottom: 8 }}>
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
                    fontFamily: '"Amiri", serif',
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
                    fontFamily: '"Amiri", serif',
                    fontSize: "1rem",
                    direction: "rtl",
                    appearance: "none",
                  }}
                >
                  <option value="نعم">نعم، سأحضر</option>
                  <option value="لا">لا، لن أتمكن</option>
                </select>
                <button
                  type="submit"
                  style={{
                    background: gold,
                    color: "#1a1a1a",
                    border: "none",
                    padding: "14px 32px",
                    fontFamily: '"Amiri", serif',
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    borderRadius: 4,
                    cursor: "pointer",
                    letterSpacing: "0.05em",
                  }}
                >
                  إرسال
                </button>
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

          {goldDivider}

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

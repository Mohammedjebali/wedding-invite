"use client";
import { useState, useEffect, useRef } from "react";
import styles from "./template2.module.css";

/* ── Config (same content as T1) ────────────────────────────────── */
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
};

/* ── Starfield data (80 CSS-only stars) ─────────────────────────── */
const STARS = Array.from({ length: 80 }, (_, i) => ({
  id: i,
  x: ((i * 37 + 13) % 97) + 1,
  y: ((i * 53 + 7) % 100),
  size: 1 + (i % 3) * 0.5,
  opacity: 0.3 + ((i * 13) % 6) * 0.1,
  color: i % 5 === 0 ? "#C9A84C" : "#ffffff",
  delay: +((i * 0.19) % 15).toFixed(1),
  duration: 8 + (i % 13),
}));

function Starfield() {
  return (
    <div className={styles.starfield}>
      {STARS.map((s) => (
        <div
          key={s.id}
          className={styles.star}
          style={
            {
              "--x": `${s.x}%`,
              "--y": `${s.y}%`,
              "--size": `${s.size}px`,
              "--opacity": s.opacity,
              "--color": s.color,
              "--dur": `${s.duration}s`,
              "--delay": `${s.delay}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

/* ── Word-by-word reveal (Arabic-safe — keeps letters connected) ─ */
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, text, delay]);
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

/* ── Confetti burst ─────────────────────────────────────────────── */
function Confetti({ active }: { active: boolean }) {
  const pieces = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: 5 + ((i * 2.3) % 90),
    color: ["#C9A84C", "#e8c547", "#f0e6d0", "#1a3a5c", "#C9A84C", "#fff3da"][
      i % 6
    ],
    size: 6 + (i % 5),
    delay: (i * 0.08) % 1.2,
    dur: 1.8 + (i % 4) * 0.3,
    rotate: (i * 47) % 360,
  }));
  if (!active) return null;
  return (
    <div className={styles.confettiContainer}>
      {pieces.map((p) => (
        <div
          key={p.id}
          className={styles.confettiPiece}
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size * 0.6,
            background: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`,
            transform: `rotate(${p.rotate}deg)`,
          }}
        />
      ))}
    </div>
  );
}

/* ── Countdown hook ─────────────────────────────────────────────── */
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

/* ── Scroll reveal hook ─────────────────────────────────────────── */
function useScrollReveal(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const visCls = styles.visible;
    const revCls = styles.reveal;
    const run = () => {
      document
        .querySelectorAll(`.${revCls}:not(.${visCls})`)
        .forEach((el) => {
          if (el.getBoundingClientRect().top < window.innerHeight - 40)
            el.classList.add(visCls);
        });
    };
    run();
    window.addEventListener("scroll", run, { passive: true });
    return () => window.removeEventListener("scroll", run);
  }, [active]);
}

/* ══════════════════════════════════════════════════════════════════
   TEMPLATE 2 — الليلة الذهبية (The Golden Night)
   ══════════════════════════════════════════════════════════════════ */
export default function Template2() {
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
  const countdown = useCountdown(CONFIG.date);
  const pad = (n: number) => String(n).padStart(2, "0");
  useScrollReveal(showContent);

  const handleOpen = () => {
    if (opening) return;
    setOpening(true);
    setTimeout(() => setShowContent(true), 2500);
    setTimeout(() => setGone(true), 3500);
  };

  const handleRsvp = (e: React.FormEvent) => {
    e.preventDefault();
    setRsvpSent(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3500);
  };

  return (
    <div className={styles.t2Root}>
      {/* ══ STARFIELD (always visible) ══ */}
      <Starfield />

      {/* ══ SPLASH SCREEN ══ */}
      <div
        className={`${styles.splash} ${gone ? styles.splashGone : ""}`}
      >
        {/* Wax seal */}
        <div
          className={`${styles.seal} ${opening ? styles.sealPulse : ""}`}
        >
          <div className={styles.sealInner}>
            <span className={styles.sealText}>م &amp; ن</span>
          </div>
        </div>

        {/* Shimmer overlay on open */}
        {opening && <div className={styles.shimmer} />}

        {/* Open button */}
        {!opening && (
          <button className={styles.openBtn} onClick={handleOpen}>
            افتح الدعوة
          </button>
        )}

        {/* Opening text */}
        {opening && <div className={styles.openingText}>يُفتح...</div>}
      </div>

      {/* ══ CONFETTI ══ */}
      <Confetti active={showConfetti} />

      {/* ══ INVITATION CONTENT ══ */}
      <div
        className={`${styles.invitation} ${showContent ? styles.invitationVisible : ""}`}
      >
        {/* ── HERO ── */}
        <section className={styles.section}>
          <div className={styles.goldLine} />

          <div
            className={`${styles.bismillah} ${styles.reveal} ${styles.revealD1}`}
          >
            بسم الله الرحمن الرحيم
          </div>

          <div
            className={`${styles.goldDivider} ${styles.reveal} ${styles.revealD1}`}
          >
            ◆ ◆ ◆
          </div>

          <div
            className={`${styles.greeting} ${styles.reveal} ${styles.revealD2}`}
          >
            بعد اهدائكم عاطر التحية وأزكى السلام
            <br />
            يسرّنا دعوتكم لحضور حفل زفاف
          </div>

          <div
            className={`${styles.reveal} ${styles.revealD2}`}
            style={{ margin: "20px 0 14px" }}
          >
            <div className={styles.coupleNames}>
              <TypeReveal
                text={CONFIG.groom_ar}
                delay={300}
                className={styles.coupleName}
              />
              <span className={styles.nameSep}>— ✦ —</span>
              <TypeReveal
                text={CONFIG.bride_ar}
                delay={800}
                className={styles.coupleName}
              />
            </div>
          </div>

          <div
            className={`${styles.tagline} ${styles.reveal} ${styles.revealD3}`}
          >
            وذلك بمشيئة الله تعالى
          </div>

          <div
            className={`${styles.goldDivider} ${styles.reveal} ${styles.revealD3}`}
            style={{ marginTop: 18 }}
          >
            ◆ ◆ ◆
          </div>
        </section>

        <div className={styles.sectionSeparator} />

        {/* ── DATE ── */}
        <section className={styles.section}>
          <div
            className={`${styles.dateCard} ${styles.reveal} ${styles.revealD1}`}
          >
            <div className={styles.dateAr}>{CONFIG.dateDisplay_ar}</div>
            <div className={styles.dateFr}>{CONFIG.dateDisplay_fr}</div>
          </div>
        </section>

        <div className={styles.sectionSeparator} />

        {/* ── COUNTDOWN ── */}
        <section className={styles.section}>
          <div
            className={`${styles.countdown} ${styles.reveal} ${styles.revealD1}`}
          >
            {[
              { n: countdown.days, l: "يوم" },
              { n: countdown.hours, l: "ساعة" },
              { n: countdown.minutes, l: "دقيقة" },
              { n: countdown.seconds, l: "ثانية" },
            ].map(({ n, l }) => (
              <div key={l} className={styles.countBlock}>
                <span className={styles.countNum}>{pad(n)}</span>
                <span className={styles.countLabel}>{l}</span>
              </div>
            ))}
          </div>
        </section>

        <div className={styles.sectionSeparator} />

        {/* ── FAMILIES ── */}
        <section className={styles.section}>
          <div className={`${styles.sectionHeading} ${styles.reveal}`}>
            العائلتان الكريمتان
          </div>
          <div
            className={`${styles.sectionSub} ${styles.reveal} ${styles.revealD1}`}
          >
            Les familles
          </div>
          <div
            className={`${styles.familyRow} ${styles.reveal} ${styles.revealD2}`}
          >
            <div className={styles.familyRole}>عائلة العريس</div>
            <div className={styles.familyNames}>
              {CONFIG.groomDad}
              <br />
              {CONFIG.groomMom}
            </div>
          </div>
          <div
            className={`${styles.familyRow} ${styles.reveal} ${styles.revealD3}`}
          >
            <div className={styles.familyRole}>عائلة العروس</div>
            <div className={styles.familyNames}>
              {CONFIG.brideDad}
              <br />
              {CONFIG.brideMom}
            </div>
          </div>
        </section>

        <div className={styles.sectionSeparator} />

        {/* ── CEREMONY DETAILS ── */}
        <section className={styles.section}>
          <div className={`${styles.sectionHeading} ${styles.reveal}`}>
            تفاصيل الحفل
          </div>
          <div
            className={`${styles.sectionSub} ${styles.reveal} ${styles.revealD1}`}
          >
            D&eacute;tails de la c&eacute;r&eacute;monie
          </div>
          <div
            className={`${styles.ceremonyCard} ${styles.reveal} ${styles.revealD2}`}
          >
            <div className={styles.ceremonyTimeLabel}>
              موعد الحفل &middot; Heure de la c&eacute;r&eacute;monie
            </div>
            <div className={styles.ceremonyTime}>
              21
              <span style={{ fontSize: "2.2rem", opacity: 0.5 }}>h</span>
              00
            </div>
            <div className={styles.ceremonyTimeAr}>{CONFIG.time_ar}</div>
            <div className={styles.ceremonyVenue}>{CONFIG.venue_name}</div>
            <div className={styles.ceremonyRegion}>{CONFIG.venue_region}</div>
            <a
              href={CONFIG.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className={styles.mapBtn}
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
              عرض الخريطة &middot; Itin&eacute;raire
            </a>
          </div>
        </section>

        <div className={styles.sectionSeparator} />

        {/* ── RSVP ── */}
        <section className={styles.section}>
          <div className={`${styles.sectionHeading} ${styles.reveal}`}>
            تأكيد الحضور
          </div>
          <div
            className={`${styles.sectionSub} ${styles.reveal} ${styles.revealD1}`}
          >
            Confirmer votre pr&eacute;sence
          </div>

          {rsvpSent ? (
            <div
              className={`${styles.glassCard} ${styles.reveal}`}
              style={{ textAlign: "center", padding: "40px 20px" }}
            >
              <div className={styles.thankYouIcon}>✦</div>
              <div className={styles.thankYouTitle}>شكراً جزيلاً</div>
              <div className={styles.thankYouText}>
                تم استلام ردّكم بنجاح
                <br />
                يسعدنا استقبالكم في هذه المناسبة السعيدة
              </div>
            </div>
          ) : (
            <div
              className={`${styles.glassCard} ${styles.reveal} ${styles.revealD1}`}
            >
              <form className={styles.rsvpForm} onSubmit={handleRsvp}>
                <input
                  className={styles.rsvpInput}
                  type="text"
                  placeholder="الاسم الكامل"
                  required
                  value={rsvp.name}
                  onChange={(e) =>
                    setRsvp({ ...rsvp, name: e.target.value })
                  }
                />
                <input
                  className={styles.rsvpInput}
                  type="tel"
                  placeholder="رقم الهاتف"
                  value={rsvp.phone}
                  onChange={(e) =>
                    setRsvp({ ...rsvp, phone: e.target.value })
                  }
                />
                <select
                  className={styles.rsvpSelect}
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
                    className={styles.rsvpSelect}
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
                <button type="submit" className={styles.rsvpBtn}>
                  تأكيد الحضور
                </button>
              </form>
            </div>
          )}
        </section>

        <div className={styles.sectionSeparator} />

        {/* ── CLOSING ── */}
        <section className={styles.section} style={{ paddingBottom: 60 }}>
          <div className={`${styles.goldDivider} ${styles.reveal}`}>
            ◆ ◆ ◆
          </div>
          <div
            className={`${styles.closingText} ${styles.reveal} ${styles.revealD1}`}
          >
            نسأل الله أن يجمعهما على خير
            <br />
            ويبارك لهما في حياتهما المشتركة
          </div>
          <div
            className={`${styles.goldDivider} ${styles.reveal} ${styles.revealD2}`}
          >
            ◆ ◆ ◆
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className={styles.footer}>
          {CONFIG.groom_fr} &amp; {CONFIG.bride_fr}
          <br />
          <span style={{ opacity: 0.4, display: "block", marginTop: 4 }}>
            {CONFIG.dateDisplay_fr} &middot; BOUARGOUB
          </span>
        </footer>
      </div>
    </div>
  );
}

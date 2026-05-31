"use client";
import { useState, useEffect, useRef, useCallback } from "react";

// ── Word-by-word reveal (Arabic-safe — keeps letters connected) ─
function TypeReveal({ text, delay = 0, className = "", style = {} }: {
  text: string; delay?: number; className?: string; style?: React.CSSProperties;
}) {
  const words = text.split(" ");
  const [visible, setVisible] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setStarted(true); obs.disconnect(); }
    }, { threshold: 0.3 });
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
  }, [started, text, delay]);
  return (
    <span ref={ref} className={className} style={{ direction:"rtl", display:"block", whiteSpace:"nowrap", ...style }}>
      {words.map((word, i) => (
        <span key={i} style={{
          opacity: i < visible ? 1 : 0,
          transform: i < visible ? "translateY(0)" : "translateY(10px)",
          transition: "opacity 0.4s ease, transform 0.4s ease",
          display: "inline-block",
          marginLeft: "0.25em",
        }}>{word}</span>
      ))}
    </span>
  );
}

// ── Gold sparkle particles ─────────────────────────────────────
function Sparkles({ active }: { active: boolean }) {
  const sparks = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    x: 10 + (i * 5.5) % 80,
    delay: (i * 0.3) % 4,
    dur: 2.5 + (i % 4) * 0.5,
    size: 3 + (i % 4),
  }));
  if (!active) return null;
  return (
    <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:15, overflow:"hidden" }}>
      {sparks.map(s => (
        <div key={s.id} style={{
          position:"absolute", left:`${s.x}%`, bottom:"0",
          width:s.size, height:s.size, borderRadius:"50%",
          background:"#c9a84c",
          animation:`sparkFloat ${s.dur}s ease-in-out ${s.delay}s infinite`,
        }} />
      ))}
    </div>
  );
}

// ── Confetti burst ─────────────────────────────────────────────
function Confetti({ active }: { active: boolean }) {
  const pieces = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: 5 + (i * 2.3) % 90,
    color: ["#c9a84c","#e8c547","#f5ede0","#d4956a","#c9a84c","#fff3da"][i % 6],
    size: 6 + (i % 5),
    delay: (i * 0.08) % 1.2,
    dur: 1.8 + (i % 4) * 0.3,
    rotate: (i * 47) % 360,
  }));
  if (!active) return null;
  return (
    <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:100, overflow:"hidden" }}>
      {pieces.map(p => (
        <div key={p.id} style={{
          position:"absolute", left:`${p.x}%`, top:"-20px",
          width:p.size, height:p.size * 0.6,
          background:p.color, borderRadius:"2px",
          animation:`confettiFall ${p.dur}s ease-in ${p.delay}s both`,
          transform:`rotate(${p.rotate}deg)`,
        }} />
      ))}
    </div>
  );
}

const CONFIG = {
  groom_ar: "محمد امين",
  bride_ar: "نور الهدى",
  groom_fr: "Mohamed Amine Ben Salem",
  bride_fr: "Nour El Hoda Jlel",
  date: "2026-08-08",
  dateDisplay_ar: "السبت 8 أوت 2026",
  dateDisplay_fr: "Samedi 8 Août 2026",
  time_ar: "من الساعة 21:00 إلى 00:00",
  venue_name: "Les Chalets d'Alba",
  venue_region: "Bouargoub, Nabeul",
  mapsUrl: "https://maps.app.goo.gl/2S15smtxwb5858mKA?g_st=iw",
  groomDad: "السيّد فوزي بن سالم",
  groomMom: "السيّدة سماح اللوني",
  brideDad: "السيّد نور الدين جلال",
  brideMom: "السيّدة فاطمة امكون",
  bgMusic: "/song.mp3",
  bgMusicStart: 0,
};

function useCountdown(d: string) {
  const [t, setT] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = new Date(d).getTime() - Date.now();
      if (diff <= 0) return;
      setT({ days: Math.floor(diff/86400000), hours: Math.floor((diff%86400000)/3600000), minutes: Math.floor((diff%3600000)/60000), seconds: Math.floor((diff%60000)/1000) });
    };
    tick(); const id = setInterval(tick,1000); return () => clearInterval(id);
  }, [d]);
  return t;
}

function useScrollReveal(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const run = () => {
      document.querySelectorAll(".reveal:not(.visible)").forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight - 40) el.classList.add("visible");
      });
    };
    run();
    window.addEventListener("scroll", run, { passive: true });
    return () => window.removeEventListener("scroll", run);
  }, [active]);
}

const PETAL_SVG = [
  "M10,2 C10,2 18,8 18,14 C18,20 14,24 10,24 C6,24 2,20 2,14 C2,8 10,2 10,2Z",
  "M12,1 C12,1 22,9 20,16 C18,23 12,26 8,22 C4,18 2,10 7,5 C9,3 12,1 12,1Z",
  "M10,3 C14,0 20,6 19,12 C18,18 12,22 7,20 C2,18 1,11 4,7 C6,4 10,3 10,3Z",
];

const PETALS = [
  {id:0,left:"8%", size:16,delay:0,   dur:7, color:"rgba(220,140,140,0.6)", path:0},
  {id:1,left:"18%",size:12,delay:0.9, dur:8, color:"rgba(235,170,160,0.5)", path:1},
  {id:2,left:"28%",size:20,delay:1.8, dur:9, color:"rgba(215,130,130,0.55)",path:2},
  {id:3,left:"38%",size:14,delay:0.4, dur:7, color:"rgba(240,185,165,0.45)",path:0},
  {id:4,left:"48%",size:18,delay:2.3, dur:8, color:"rgba(220,150,150,0.55)",path:1},
  {id:5,left:"58%",size:11,delay:1.1, dur:9, color:"rgba(200,120,120,0.5)", path:2},
  {id:6,left:"68%",size:17,delay:3.0, dur:8, color:"rgba(235,165,155,0.5)", path:0},
  {id:7,left:"78%",size:13,delay:0.6, dur:7, color:"rgba(210,135,135,0.55)",path:1},
  {id:8,left:"88%",size:19,delay:2.0, dur:9, color:"rgba(225,155,145,0.5)", path:2},
  {id:9,left:"22%",size:15,delay:3.8, dur:8, color:"rgba(215,138,138,0.55)",path:0},
  {id:10,left:"52%",size:22,delay:4.2,dur:10,color:"rgba(200,125,125,0.5)", path:1},
  {id:11,left:"72%",size:12,delay:5.0,dur:7, color:"rgba(230,158,148,0.45)",path:2},
];

export default function Home() {
  const [opening, setOpening] = useState(false);
  const [gone, setGone] = useState(false);
  const [showPoster, setShowPoster] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [posterScrolled, setPosterScrolled] = useState(false);
  const [rsvp, setRsvp] = useState({ name:"", phone:"", attending:"oui", guests:"1" });
  const [rsvpSent, setRsvpSent] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const introVideoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const countdown = useCountdown(CONFIG.date);
  const pad = (n: number) => String(n).padStart(2,"0");
  useScrollReveal(showContent);

  const handleOpen = useCallback(() => {
    if (opening) return;
    // Play the song instantly on click
    if (audioRef.current) {
      audioRef.current.currentTime = CONFIG.bgMusicStart;
      audioRef.current.play().catch(() => {});
      setPlaying(true);
    }
    // Play the intro video
    const vid = introVideoRef.current;
    if (vid) {
      vid.currentTime = 0;
      vid.play().catch(() => {});
    }
    // After 5 seconds, show the poster
    setTimeout(() => {
      setOpening(true);
      setShowPoster(true);
    }, 5000);
    setTimeout(() => setGone(true), 5500);
    // After poster fades in, allow scroll to reveal invitation
    setTimeout(() => setShowContent(true), 6500);
  }, [opening]);

  const [rsvpSending, setRsvpSending] = useState(false);

  const handleRsvp = async (e: React.FormEvent) => {
    e.preventDefault();
    setRsvpSending(true);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rsvp),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert("Error: " + (err.error || res.status));
        return;
      }
      setRsvpSent(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3500);
    } catch {
      alert("Network error, please try again.");
    } finally {
      setRsvpSending(false);
    }
  };

  return (
    <>
      {/* ══ VIDEO INTRO ══ */}
      <div className={`env-screen${gone ? " gone" : ""}`}>
        <video
          ref={introVideoRef}
          muted playsInline
          preload="auto"
          autoPlay={false}
          poster="/poster.jpg"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            cursor: opening ? "default" : "pointer",
          }}
          onClick={!opening ? handleOpen : undefined}
        >
          <source src="/intro.mp4" type="video/mp4" />
        </video>
        {!opening && !gone && (
          <div className="envelope-tap-hint">
            اضغط هنا · Tap to open
          </div>
        )}
      </div>

      {/* ══ INVITATION ══ */}
      {CONFIG.bgMusic && <audio ref={audioRef} src={CONFIG.bgMusic} loop />}

      {/* ══ FULL-SCREEN POSTER ══ */}
      {showPoster && (
        <section
          className="poster-screen"
          onTouchStart={(e) => {
            const startY = e.touches[0].clientY;
            const onMove = (ev: TouchEvent) => {
              if (startY - ev.touches[0].clientY > 60 && !posterScrolled) setPosterScrolled(true);
              document.removeEventListener("touchmove", onMove);
            };
            const onEnd = () => {
              document.removeEventListener("touchmove", onMove);
              document.removeEventListener("touchend", onEnd);
            };
            document.addEventListener("touchmove", onMove);
            document.addEventListener("touchend", onEnd, { once: true });
          }}
          onWheel={(e) => {
            if (e.deltaY > 30 && !posterScrolled) setPosterScrolled(true);
          }}
        >
          <div className="poster-img-wrap">
            <img src="/wedding-poster.png" alt="Amine & Nour" />
          </div>
          <div className="poster-scroll-hint">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
          </div>
        </section>
      )}

      <Sparkles active={showContent} />
      <Confetti active={showConfetti} />

      {showContent && (
        <>

        </>
      )}

      <div className={`invitation${showContent ? " visible" : ""}`}>
        <div className="page-bg">
          <div className="page-content">



            {/* ── HERO ── */}
            <section className="hero">
              <div className="gold-line-top reveal" />

              <div className="bismillah reveal reveal-d1">
                بسم الله الرحمن الرحيم
              </div>

              <div className="gold-divider reveal reveal-d1">◆ ◆ ◆</div>

              <div className="invite-greeting reveal reveal-d2">
                بدعوة كريمة من العائلتين
              </div>

              {/* Families invitation block */}
              <div className="reveal reveal-d2" style={{ direction:"rtl", textAlign:"center", marginTop:"22px", marginBottom:"6px", fontFamily:"'Rakkas',serif", fontSize:"1.05rem", color:"#5a3810", letterSpacing:"0.04em" }}>
                يتشرّف كلّ من
              </div>

              <div className="reveal reveal-d2" style={{
                direction:"rtl",
                margin:"10px auto 0",
                maxWidth:"420px",
                border:"1.5px solid #c9a84c",
                borderRadius:"2px",
                padding:"18px 22px 14px",
                background:"linear-gradient(160deg,rgba(201,168,76,0.07) 0%,rgba(255,248,230,0.18) 100%)",
                boxShadow:"0 2px 18px rgba(122,80,32,0.08)",
                position:"relative",
                display:"flex",
                alignItems:"center",
              }}>
                {/* Corner ornaments */}
                <span style={{ position:"absolute", top:"6px", right:"8px", color:"#c9a84c", fontSize:"0.75rem", lineHeight:1 }}>✦</span>
                <span style={{ position:"absolute", top:"6px", left:"8px", color:"#c9a84c", fontSize:"0.75rem", lineHeight:1 }}>✦</span>
                <span style={{ position:"absolute", bottom:"6px", right:"8px", color:"#c9a84c", fontSize:"0.75rem", lineHeight:1 }}>✦</span>
                <span style={{ position:"absolute", bottom:"6px", left:"8px", color:"#c9a84c", fontSize:"0.75rem", lineHeight:1 }}>✦</span>

                {/* Groom's family */}
                <div style={{ flex:1, fontFamily:"'Aref Ruqaa',serif", fontSize:"1.13rem", color:"#3a1e06", lineHeight:2.1, textAlign:"center" }}>
                  {CONFIG.groomDad}
                  <br/>
                  <span style={{ color:"#5a3810", fontSize:"0.85em" }}>و</span>{CONFIG.groomMom}
                </div>

                {/* Ornamental divider */}
                <div style={{ color:"#c9a84c", fontSize:"0.8rem", padding:"0 12px", letterSpacing:"0.3em", opacity:0.85 }}>
                  ❧ ◆ ❧
                </div>

                {/* Bride's family */}
                <div style={{ flex:1, fontFamily:"'Aref Ruqaa',serif", fontSize:"1.13rem", color:"#3a1e06", lineHeight:2.1, textAlign:"center" }}>
                  {CONFIG.brideDad}
                  <br/>
                  <span style={{ color:"#5a3810", fontSize:"0.85em" }}>و</span>{CONFIG.brideMom}
                </div>
              </div>

              <div className="reveal reveal-d3" style={{ direction:"rtl", fontFamily:"'Aref Ruqaa',serif", fontSize:"1.12rem", color:"#5a3810", textAlign:"center", lineHeight:2.2, marginTop:"18px", fontStyle:"italic", letterSpacing:"0.02em" }}>
                بدعوتكم لحضور حفل زفاف ابنيهما
              </div>

              <div className="reveal reveal-d3" style={{ margin:"20px 0 14px" }}>
                <div className="couple-names">
                  <TypeReveal text={CONFIG.groom_ar} delay={300} />
                  <span style={{ fontFamily:"'Aref Ruqaa',serif", fontSize:"1.2rem", color:"#5a3810" }}>على</span>
                  <TypeReveal text={CONFIG.bride_ar} delay={800} />
                </div>
              </div>

              <div className="tagline reveal reveal-d4">وذلك بمشيئة الله تعالى</div>

              <div className="gold-divider reveal reveal-d3" style={{ marginTop:"18px" }}>◆ ◆ ◆</div>

              <div className="date-block reveal reveal-d4">
                <div className="date-ar">{CONFIG.dateDisplay_ar}</div>
                <div className="date-fr">{CONFIG.dateDisplay_fr}</div>
              </div>

              <div className="countdown reveal reveal-d4">
                {[{n:countdown.days,l:"يوم"},{n:countdown.hours,l:"ساعة"},{n:countdown.minutes,l:"دقيقة"},{n:countdown.seconds,l:"ثانية"}].map(({n,l}) => (
                  <div key={l} className="count-block">
                    <span className="count-num">{pad(n)}</span>
                    <span className="count-label">{l}</span>
                  </div>
                ))}
              </div>

              <div className="gold-line-bottom reveal reveal-d4" />

            </section>

            {/* ── VENUE ── */}
            <section className="section" style={{ paddingTop: "0px", paddingBottom: "0px" }}>
              <div className="section-heading reveal gold-sweep">تفاصيل الحفل</div>
              <div className="section-sub reveal reveal-d1">Détails de la cérémonie</div>
              <div className="venue-card reveal reveal-d2">
                <div className="venue-top">
                  <div style={{ fontSize:"9px", letterSpacing:"0.25em", textTransform:"uppercase", color:"#b8922a", fontFamily:"sans-serif", marginBottom:"16px", opacity:0.65 }}>
                    موعد الحفل · Heure de la cérémonie
                  </div>
                  <div className="venue-time">21<span style={{ fontSize:"2.2rem", opacity:0.5 }}>h</span>00</div>
                  <div className="venue-time-ar">{CONFIG.time_ar}</div>
                </div>
                <div className="venue-bottom">
                  <div className="venue-name">{CONFIG.venue_name}</div>
                  <div className="venue-region">{CONFIG.venue_region}</div>
                  <div style={{ width:"100%", marginTop:"12px", textAlign:"center", position:"relative" }}>
                    <a href={CONFIG.mapsUrl} target="_blank" rel="noreferrer" style={{ display:"block", position:"relative", textDecoration:"none" }}>
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d800!2d10.5066707!3d36.5278536!2m3!1f0!2f0!3f0!3m2!1i400!2i300!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzbCsDMxJzQwLjMiTiAxMMKwMzAnMjQuMCJF!5e0!3m2!1sar!2stn!4v1&markers=36.5278536,10.5066707"
                        width="260"
                        height="150"
                        style={{ border:"1px solid rgba(184,146,42,0.25)", borderRadius:"8px", display:"inline-block" }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Venue Location"
                      />
                    </a>
                    <a href={CONFIG.mapsUrl} target="_blank" rel="noreferrer" className="map-btn" style={{ display:"block", textAlign:"center", marginTop:"6px", fontSize:"0.7rem", textDecoration:"none", color:"#b8922a", opacity:0.7 }}>
                      فتح في خرائط جوجل · Open in Google Maps
                    </a>
                  </div>
                </div>
              </div>
              {/* Venue video - autoplay on scroll */}
              <div style={{ maxWidth:"400px", margin:"16px auto", borderRadius:"8px", overflow:"hidden" }} className="reveal">
                <video
                  muted playsInline loop
                  src="/venue.mp4"
                  ref={(el) => {
                    if (!el) return;
                    const obs = new IntersectionObserver(([e]) => {
                      if (e.isIntersecting) { el.play().catch(() => {}); } else { el.pause(); }
                    }, { threshold: 0.3 });
                    obs.observe(el);
                  }}
                  style={{ width:"100%", display:"block", borderRadius:"8px" }}
                />
              </div>
              <div className="date-strip reveal reveal-d3">
                <div className="date-cell">
                  <div className="date-cell-num">08</div>
                  <div className="date-cell-label">Août</div>
                </div>
                <div className="date-cell">
                  <div className="date-cell-num" style={{ fontFamily:"Aref Ruqaa,serif", fontSize:"1.3rem", paddingTop:"6px" }}>السبت</div>
                  <div className="date-cell-label">Samedi</div>
                </div>
                <div className="date-cell">
                  <div className="date-cell-num">2026</div>
                  <div className="date-cell-label">السنة</div>
                </div>
              </div>
            </section>

            {/* ── GUESTS ILLUSTRATION ── */}
            <div style={{ textAlign:"center", padding:"8px 0 0", overflow:"hidden" }}>
              <img
                src="/guests2-nobg.png"
                alt=""
                style={{ width:"100%", maxWidth:"480px", height:"auto", display:"block", margin:"0 auto" }}
              />
            </div>

            {/* ── CLOSING ── */}
            <section className="section" style={{ paddingBottom:"0", textAlign:"center" }}>
              <div className="gold-divider reveal">◆ ◆ ◆</div>
              <div className="reveal reveal-d1" style={{ marginTop:"24px", fontFamily:"Aref Ruqaa,serif", fontSize:"1.1rem", color:"#5a3810", direction:"rtl", lineHeight:2, opacity:0.85 }}>
                أحلامًا هنيئة لصغاركم، وتشريفكم يسعدنا
              </div>
              <div className="reveal reveal-d1" style={{ marginTop:"16px", fontFamily:"Aref Ruqaa,serif", fontSize:"1.1rem", color:"#5a3810", direction:"rtl", lineHeight:2, opacity:0.85 }}>
                نسأل الله أن يجمعهما على خير<br/>
                ويبارك لهما في حياتهما المشتركة
              </div>
              <div className="gold-divider reveal reveal-d2" style={{ marginTop:"24px" }}>◆ ◆ ◆</div>
            </section>

            {/* ── RSVP ── */}
            <section className="section" style={{ paddingBottom:"60px" }}>
              <div className="section-heading reveal gold-sweep">تأكيد الحضور</div>
              <div className="section-sub reveal reveal-d1">Confirmer votre présence avant le 1er Août</div>
              {rsvpSent ? (
                <div className="rsvp-card reveal" style={{ textAlign:"center", padding:"40px 20px" }}>
                  <div style={{ width:"56px", height:"56px", borderRadius:"50%", border:"1px solid rgba(184,146,42,0.38)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 18px", color:"#b8922a", fontSize:"20px" }}>✦</div>
                  <div style={{ fontFamily:"Scheherazade New,serif", fontSize:"1.7rem", color:"#3a1e06", marginBottom:"10px" }}>شكراً جزيلاً</div>
                  <div style={{ fontFamily:"Aref Ruqaa,serif", fontSize:"1rem", color:"#5a3810", direction:"rtl", lineHeight:2.2 }}>
                    تم استلام ردّكم بنجاح<br/>يسعدنا استقبالكم في هذه المناسبة السعيدة
                  </div>
                </div>
              ) : (
                <div className="rsvp-card reveal reveal-d1">
                  <form className="rsvp-form" onSubmit={handleRsvp}>
                    <input className="rsvp-input" type="text" placeholder="الاسم الكامل" required value={rsvp.name} onChange={e => setRsvp({...rsvp,name:e.target.value})} />
                    <input className="rsvp-input" type="tel" placeholder="رقم الهاتف" value={rsvp.phone} onChange={e => setRsvp({...rsvp,phone:e.target.value})} />
                    <select className="rsvp-select" value={rsvp.attending} onChange={e => setRsvp({...rsvp,attending:e.target.value})}>
                      <option value="oui">سأحضر بكل سرور</option>
                      <option value="non">لن أتمكن من الحضور</option>
                    </select>
                    {rsvp.attending === "oui" && (
                      <select className="rsvp-select" value={rsvp.guests} onChange={e => setRsvp({...rsvp,guests:e.target.value})}>
                        {["1","2","3","4","5"].map(n => <option key={n} value={n}>{n} {parseInt(n)>1?"أشخاص":"شخص"}</option>)}
                      </select>
                    )}
                    <button type="submit" className="rsvp-btn" disabled={rsvpSending}>{rsvpSending ? "..." : "تأكيد الحضور"}</button>
                  </form>
                </div>
              )}
            </section>



            <footer>
              {CONFIG.groom_fr} &amp; {CONFIG.bride_fr}<br/>
              <span style={{ opacity:0.45, display:"block", marginTop:"4px" }}>{CONFIG.dateDisplay_fr} · Les Chalets d'Alba</span>
            </footer>
          </div>
        </div>
      </div>

      {/* music plays automatically, no button */}
    </>
  );
}

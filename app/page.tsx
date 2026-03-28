"use client";
import { useState, useEffect, useRef } from "react";

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
  bgMusicStart: 147, // 2:27
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
  const [showContent, setShowContent] = useState(false);
  const [rsvp, setRsvp] = useState({ name:"", phone:"", attending:"oui", guests:"1" });
  const [rsvpSent, setRsvpSent] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const countdown = useCountdown(CONFIG.date);
  const pad = (n: number) => String(n).padStart(2,"0");
  useScrollReveal(showContent);

  const handleOpen = () => {
    if (opening) return;
    setOpening(true);
    // Start music immediately on tap
    if (audioRef.current && CONFIG.bgMusic) {
      audioRef.current.currentTime = CONFIG.bgMusicStart;
      audioRef.current.play().catch(() => {});
      setPlaying(true);
    }
    // Let music play for 4 seconds on video page before transitioning
    setTimeout(() => setShowContent(true), 3000);
    setTimeout(() => setGone(true), 4200);
  };

  const handleRsvp = (e: React.FormEvent) => { e.preventDefault(); setRsvpSent(true); };

  return (
    <>
      {/* ══ VIDEO INTRO ══ */}
      <div className={`env-screen${gone ? " gone" : ""}`}
        style={{ cursor: opening ? "default" : "pointer", padding: 0 }}
        onClick={!opening ? handleOpen : undefined}
      >
        {/* fullscreen video */}
        <video
          autoPlay muted loop playsInline
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover",
            pointerEvents: "none",
          }}
        >
          <source src="/intro.mp4" type="video/mp4" />
        </video>

        {/* dark overlay so button is readable */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.5) 100%)",
          pointerEvents: "none",
        }} />

        {/* center tap button */}
        {!opening && (
          <div style={{
            position: "relative", zIndex: 10,
            display: "flex", flexDirection: "column",
            alignItems: "center", gap: "24px",
          }}>
            <div style={{
              fontFamily: "'Rakkas', serif",
              fontSize: "clamp(1.6rem, 7vw, 2.4rem)",
              color: "#f5efe0",
              direction: "rtl",
              textShadow: "0 2px 20px rgba(0,0,0,0.6)",
              textAlign: "center",
              lineHeight: 1.6,
            }}>
              {CONFIG.groom_ar}<br/>
              <span style={{ fontSize: "0.5em", color: "#e8c57a", letterSpacing: "0.15em", fontFamily: "Cormorant Garamond, serif", fontStyle: "italic" }}>— ✦ —</span><br/>
              {CONFIG.bride_ar}
            </div>

            <button
              onClick={handleOpen}
              style={{
                background: "linear-gradient(135deg, rgba(201,168,76,0.95), rgba(160,120,20,0.95))",
                color: "#fff8f0",
                border: "none",
                padding: "16px 44px",
                borderRadius: "40px",
                fontFamily: "'Rakkas', serif",
                fontSize: "18px",
                cursor: "pointer",
                boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
                animation: "openBtnPulse 2.5s ease-in-out infinite",
                letterSpacing: "0.04em",
              }}
            >
              افتح الدعوة
            </button>

            <div style={{
              fontFamily: "sans-serif",
              fontSize: "11px",
              letterSpacing: "0.18em",
              color: "rgba(255,248,224,0.5)",
              textTransform: "uppercase",
            }}>
              {CONFIG.dateDisplay_fr}
            </div>
          </div>
        )}

        {/* loading spinner when opening */}
        {opening && (
          <div style={{ position: "relative", zIndex: 10, color: "rgba(255,248,224,0.6)", fontFamily: "'Rakkas',serif", fontSize: "20px" }}>
            ...
          </div>
        )}
      </div>

      {/* ══ INVITATION ══ */}
      {CONFIG.bgMusic && <audio ref={audioRef} src={CONFIG.bgMusic} loop />}

      {showContent && (
        <>
          {/* Falling petals */}
          <div className="petal-container">
            {PETALS.map(p => (
              <svg key={p.id} className="petal" viewBox="0 0 24 28"
                style={{ left:p.left, width:p.size, height:p.size, fill:p.color, animationDelay:`${p.delay}s`, animationDuration:`${p.dur}s` }}
              >
                <path d={PETAL_SVG[p.path]} />
              </svg>
            ))}
          </div>
        </>
      )}

      <div className={`invitation${showContent ? " visible" : ""}`}>
        <div className="page-bg">
          <div className="page-content">

            {/* top bouquet */}
            <img src="/bouquet-sm.png" className="bouquet-top" alt="" />

            {/* ── HERO ── */}
            <section className="hero">
              <div className="gold-line-top reveal" />

              <div className="bismillah reveal reveal-d1">
                بسم الله الرحمن الرحيم
              </div>

              <div className="gold-divider reveal reveal-d1">◆ ◆ ◆</div>

              <div className="invite-greeting reveal reveal-d2">
                بعد اهدائكم عاطر التحية وأزكى السلام<br/>
                يسرّنا دعوتكم لحضور حفل زفاف
              </div>

              <div className="reveal reveal-d2" style={{ margin:"20px 0 14px" }}>
                <div className="couple-names">
                  {CONFIG.groom_ar}
                  <span className="name-sep">— ✦ —</span>
                  {CONFIG.bride_ar}
                </div>
              </div>

              <div className="tagline reveal reveal-d3">وذلك بمشيئة الله تعالى</div>

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

              <div className="scroll-hint">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="12" y1="4" x2="12" y2="20"/><polyline points="18 14 12 20 6 14"/>
                </svg>
              </div>
            </section>

            {/* ── FAMILIES ── */}
            <section className="section">
              <div className="section-heading reveal">العائلتان الكريمتان</div>
              <div className="section-sub reveal reveal-d1">Les familles</div>
              <div className="family-row reveal reveal-d2">
                <div className="family-role">عائلة العريس</div>
                <div className="family-names">{CONFIG.groomDad}<br/>{CONFIG.groomMom}</div>
              </div>
              <div className="family-row reveal reveal-d3">
                <div className="family-role">عائلة العروس</div>
                <div className="family-names">{CONFIG.brideDad}<br/>{CONFIG.brideMom}</div>
              </div>
              <div className="gold-divider reveal reveal-d4" style={{ marginTop:"28px" }}>◆ ◆ ◆</div>
            </section>

            {/* ── VENUE ── */}
            <section className="section">
              <div className="section-heading reveal">تفاصيل الحفل</div>
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
                  <a href={CONFIG.mapsUrl} target="_blank" rel="noreferrer" className="map-btn">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    عرض الخريطة · Itinéraire
                  </a>
                </div>
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

            {/* ── RSVP ── */}
            <section className="section">
              <div className="section-heading reveal">تأكيد الحضور</div>
              <div className="section-sub reveal reveal-d1">Confirmer votre présence avant le 1er Août</div>
              {rsvpSent ? (
                <div className="rsvp-card reveal" style={{ textAlign:"center", padding:"40px 20px" }}>
                  <div style={{ width:"56px", height:"56px", borderRadius:"50%", border:"1px solid rgba(184,146,42,0.38)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 18px", color:"#b8922a", fontSize:"20px" }}>✦</div>
                  <div style={{ fontFamily:"Scheherazade New,serif", fontSize:"1.7rem", color:"#4a2a08", marginBottom:"10px" }}>شكراً جزيلاً</div>
                  <div style={{ fontFamily:"Aref Ruqaa,serif", fontSize:"1rem", color:"#7a5020", direction:"rtl", lineHeight:2.2 }}>
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
                    <button type="submit" className="rsvp-btn">تأكيد الحضور</button>
                  </form>
                </div>
              )}
            </section>

            {/* ── CLOSING ── */}
            <section className="section" style={{ paddingBottom:"80px" }}>
              <div className="gold-divider reveal">◆ ◆ ◆</div>
              <div className="reveal reveal-d1" style={{ marginTop:"30px" }}>
                <div className="closing-names">
                  {CONFIG.groom_ar}<br/>
                  <span style={{ fontSize:"0.5em", color:"#c9a84c", fontWeight:400, fontFamily:"Cormorant Garamond,serif", display:"block", margin:"6px 0" }}>◆</span>
                  {CONFIG.bride_ar}
                </div>
                <div style={{ fontFamily:"Aref Ruqaa,serif", fontSize:"1rem", color:"#7a5020", direction:"rtl", marginTop:"18px", opacity:0.8 }}>
                  وذلك بمشيئة الله
                </div>
              </div>
              <div className="gold-divider reveal reveal-d2" style={{ marginTop:"30px" }}>◆ ◆ ◆</div>
            </section>

            {/* bottom bouquet */}
            <img src="/bouquet-sm.png" className="bouquet-bottom" alt="" style={{ transform:"scaleY(-1)" }} />

            <footer>
              {CONFIG.groom_fr} &amp; {CONFIG.bride_fr}<br/>
              <span style={{ opacity:0.45, display:"block", marginTop:"4px" }}>{CONFIG.dateDisplay_fr} · BOUARGOUB</span>
            </footer>
          </div>
        </div>
      </div>

      {CONFIG.bgMusic && showContent && (
        <button className="music-btn" onClick={() => {
          if (!audioRef.current) return;
          if (playing) { audioRef.current.pause(); setPlaying(false); }
          else {
            if (audioRef.current.currentTime < CONFIG.bgMusicStart) {
              audioRef.current.currentTime = CONFIG.bgMusicStart;
            }
            audioRef.current.play().catch(()=>{});
            setPlaying(true);
          }
        }}>{playing ? "⏸" : "♪"}</button>
      )}
    </>
  );
}

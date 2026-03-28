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
  bgMusic: "",
};

function useCountdown(d: string) {
  const [t, setT] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = new Date(d).getTime() - Date.now();
      if (diff <= 0) return;
      setT({ days: Math.floor(diff/86400000), hours: Math.floor((diff%86400000)/3600000), minutes: Math.floor((diff%3600000)/60000), seconds: Math.floor((diff%60000)/1000) });
    };
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id);
  }, [d]);
  return t;
}

function useScrollReveal(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const run = () => {
      document.querySelectorAll(".reveal:not(.visible)").forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight - 50) el.classList.add("visible");
      });
    };
    run();
    window.addEventListener("scroll", run, { passive: true });
    return () => window.removeEventListener("scroll", run);
  }, [active]);
}

export default function Home() {
  const [opening, setOpening] = useState(false);
  const [gone, setGone] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [rsvp, setRsvp] = useState({ name: "", phone: "", attending: "oui", guests: "1" });
  const [rsvpSent, setRsvpSent] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const countdown = useCountdown(CONFIG.date);
  const pad = (n: number) => String(n).padStart(2,"0");
  useScrollReveal(showContent);

  const handleOpen = () => {
    if (opening) return;
    setOpening(true);
    setTimeout(() => setShowContent(true), 1100);
    setTimeout(() => setGone(true), 2400);
  };

  const handleRsvp = (e: React.FormEvent) => { e.preventDefault(); setRsvpSent(true); };

  return (
    <>
      {/* ══ ENVELOPE ══ */}
      <div className={`env-screen${gone ? " gone" : ""}`}
        style={{ cursor: opening ? "default" : "pointer" }}
        onClick={!opening ? handleOpen : undefined}
      >
        <div className="env-glow" />
        {[...Array(8)].map((_, i) => (
          <div key={i} className="env-particle" style={{ left:`${8+i*12}%`, bottom:"0", animationDelay:`${i*0.8}s`, animationDuration:`${6+i}s` }} />
        ))}
        <div className={`env-3d${opening ? " open" : ""}`}>
          <div className="env-letter">
            <div className="env-letter-line" style={{ width:"55%" }} />
            <div className="env-letter-names">{CONFIG.groom_ar} & {CONFIG.bride_ar}</div>
            <div className="env-letter-line" style={{ width:"35%" }} />
            <div className="env-letter-date">{CONFIG.dateDisplay_ar}</div>
            <div className="env-letter-line" style={{ width:"55%" }} />
          </div>
          <div className="env-body">
            <div className="env-body-bg" />
            <div className="env-bottom-folds" />
            <div className="env-inner-border" />
          </div>
          <div className="env-flap-wrap">
            <div className="env-flap-front"><div className="env-flap-triangle" /></div>
          </div>
          <div className="wax-seal">
            <span className="wax-seal-text" style={{ fontSize:"min(1.2rem,3.5vw)" }}>✦</span>
          </div>
          <div className="env-hint"><div className="env-hint-text">المسّ لفتح الدعوة</div></div>
        </div>
      </div>

      {/* ══ INVITATION ══ */}
      {CONFIG.bgMusic && <audio ref={audioRef} src={CONFIG.bgMusic} loop />}

      <div className={`invitation${showContent ? " visible" : ""}`}>
        <div className="page-bg">
          <div className="page-content">

            {/* ── HERO ── */}
            <section className="hero">

              <div className="bismillah reveal">
                بسم الله الرحمن الرحيم
              </div>

              <div className="gold-divider reveal reveal-d1">✦ ✦ ✦</div>

              <div className="invite-greeting reveal reveal-d1">
                بعد اهدائكم عاطر التحية وأزكى السلام<br/>
                يسرّنا دعوتكم لحضور حفل زفاف
              </div>

              <div className="couple-wrap reveal reveal-d2">
                <div className="couple-names">
                  {CONFIG.groom_ar}
                  <span className="name-and">— ✦ —</span>
                  {CONFIG.bride_ar}
                </div>
              </div>

              <div className="tagline reveal reveal-d3">
                وذلك بمشيئة الله تعالى
              </div>

              <div className="gold-divider reveal reveal-d3" style={{ marginTop:"24px" }}>✦ ✦ ✦</div>

              <div className="date-display reveal reveal-d4">
                <div className="date-ar">{CONFIG.dateDisplay_ar}</div>
                <div className="date-fr">{CONFIG.dateDisplay_fr}</div>
              </div>

              <div className="countdown reveal reveal-d4">
                {[
                  { n: countdown.days, l: "يوم" },
                  { n: countdown.hours, l: "ساعة" },
                  { n: countdown.minutes, l: "دقيقة" },
                  { n: countdown.seconds, l: "ثانية" },
                ].map(({ n, l }) => (
                  <div key={l} className="count-block">
                    <span className="count-num">{pad(n)}</span>
                    <span className="count-label">{l}</span>
                  </div>
                ))}
              </div>

              <div className="scroll-hint">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="12" y1="4" x2="12" y2="20"/><polyline points="18 14 12 20 6 14"/></svg>
              </div>
            </section>

            {/* ── FAMILIES ── */}
            <section className="section">
              <div className="section-heading reveal">العائلتان الكريمتان</div>
              <div className="section-sub reveal reveal-d1">Les familles</div>

              <div className="families-wrap">
                <div className="family-row reveal reveal-d2">
                  <div className="family-role">عائلة العريس</div>
                  <div className="family-names">
                    {CONFIG.groomDad}<br/>{CONFIG.groomMom}
                  </div>
                </div>
                <div className="family-row reveal reveal-d3">
                  <div className="family-role">عائلة العروس</div>
                  <div className="family-names">
                    {CONFIG.brideDad}<br/>{CONFIG.brideMom}
                  </div>
                </div>
              </div>

              <div className="gold-divider reveal reveal-d4" style={{ marginTop:"32px" }}>✦ ✦ ✦</div>
            </section>

            {/* ── VENUE ── */}
            <section className="section">
              <div className="section-heading reveal">تفاصيل الحفل</div>
              <div className="section-sub reveal reveal-d1">Détails de la cérémonie</div>

              <div className="inv-card reveal reveal-d2">
                <div style={{ fontSize:"9px", letterSpacing:"0.24em", textTransform:"uppercase", color:"#b8922a", fontFamily:"sans-serif", marginBottom:"18px", opacity:0.7 }}>
                  موعد الحفل · Heure de la cérémonie
                </div>
                <div className="venue-time">21<span style={{ fontSize:"2rem", opacity:0.55 }}>h</span>00</div>
                <div className="venue-time-ar">{CONFIG.time_ar}</div>
                <div className="venue-divider" />
                <div className="venue-name">{CONFIG.venue_name}</div>
                <div className="venue-region">{CONFIG.venue_region}</div>
                <a href={CONFIG.mapsUrl} target="_blank" rel="noreferrer" className="map-btn">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  عرض الخريطة · Itinéraire
                </a>
              </div>

              <div className="date-strip reveal reveal-d3">
                <div className="date-cell">
                  <div className="date-cell-num">08</div>
                  <div className="date-cell-label">Août</div>
                </div>
                <div className="date-cell">
                  <div className="date-cell-num" style={{ fontFamily:"Amiri,serif", fontSize:"1.4rem", paddingTop:"6px" }}>السبت</div>
                  <div className="date-cell-label">Samedi</div>
                </div>
                <div className="date-cell">
                  <div className="date-cell-num">2026</div>
                  <div className="date-cell-label">السنة</div>
                </div>
              </div>
            </section>

            {/* ── RSVP ── */}
            <section className="section">
              <div className="section-heading reveal">تأكيد الحضور</div>
              <div className="section-sub reveal reveal-d1">Confirmer votre présence</div>

              {rsvpSent ? (
                <div className="inv-card reveal" style={{ textAlign:"center", padding:"40px 22px" }}>
                  <div style={{ fontSize:"36px", color:"#b8922a", marginBottom:"16px" }}>✦</div>
                  <div style={{ fontFamily:"Scheherazade New,serif", fontSize:"1.6rem", color:"#5a3810", marginBottom:"10px" }}>شكراً جزيلاً</div>
                  <div style={{ fontFamily:"Amiri,serif", fontSize:"1rem", color:"#8a6030", direction:"rtl", lineHeight:2 }}>
                    تم استلام ردّكم بنجاح<br/>يسعدنا استقبالكم في هذه المناسبة السعيدة
                  </div>
                </div>
              ) : (
                <div className="inv-card reveal reveal-d1">
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
              <div className="gold-divider reveal">✦ ✦ ✦</div>
              <div className="reveal reveal-d1" style={{ marginTop:"28px" }}>
                <div className="closing-names">
                  {CONFIG.groom_ar}<br/>
                  <span style={{ fontSize:"0.6em", color:"#b8922a", fontWeight:400, fontFamily:"Amiri,serif" }}>✦</span><br/>
                  {CONFIG.bride_ar}
                </div>
                <div className="closing-masha">وذلك بمشيئة الله</div>
              </div>
              <div className="gold-divider reveal reveal-d2" style={{ marginTop:"28px" }}>✦ ✦ ✦</div>
            </section>

            <footer>
              {CONFIG.groom_fr} &amp; {CONFIG.bride_fr}<br/>
              <span style={{ opacity:0.5, display:"block", marginTop:"4px" }}>{CONFIG.dateDisplay_fr} · BOUARGOUB</span>
            </footer>

          </div>
        </div>
      </div>

      {CONFIG.bgMusic && (
        <button className="music-btn" onClick={() => {
          if (!audioRef.current) return;
          if (playing) { audioRef.current.pause(); setPlaying(false); }
          else { audioRef.current.play().catch(()=>{}); setPlaying(true); }
        }}>{playing ? "⏸" : "♪"}</button>
      )}
    </>
  );
}

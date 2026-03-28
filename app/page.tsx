"use client";
import { useState, useEffect, useRef } from "react";

// ══ REAL INVITATION DATA ══════════════════════════════════════
const CONFIG = {
  groom_ar: "محمد أمين بن سالم",
  bride_ar: "نور الهدى جلال",
  groom_fr: "Mohamed Amine",
  bride_fr: "Nour El Hoda",
  initials: "م & ن",
  date: "2026-08-08",
  dateDisplay_ar: "يوم السبت 8 أوت 2026",
  dateDisplay_fr: "Samedi 8 Août 2026",
  time_ar: "على الساعة التاسعة ليلاً",
  time_fr: "21h00",
  venue: "BOUARGOUB, NABEUL",
  mapsUrl: "https://maps.google.com/?q=Bouargoub+Nabeul+Tunisia",
  groomDad: "السيّد فوزي بن سالم",
  groomMom: "والسيّدة سماح بن سالم",
  brideDad: "السيّد نور الدين جلال",
  brideMom: "والسيّدة فاطيمة جلال",
  bgMusic: "",
};
// ════════════════════════════════════════════════════════════

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
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 60) el.classList.add("visible");
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
    setTimeout(() => setGone(true), 2200);
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
          <div key={i} className="env-particle" style={{ left:`${10+i*12}%`, bottom:"0", animationDelay:`${i*0.7}s`, animationDuration:`${5+i}s` }} />
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
          <div className="wax-seal"><span className="wax-seal-text">♡</span></div>
          <div className="env-hint"><div className="env-hint-text">✦ المسّ لفتح الدعوة ✦</div></div>
        </div>
      </div>

      {/* ══ INVITATION ══ */}
      {CONFIG.bgMusic && <audio ref={audioRef} src={CONFIG.bgMusic} loop />}

      {showContent && (
        <div className="inv-frame">
          <div className="inv-frame-corner tl" /><div className="inv-frame-corner tr" />
          <div className="inv-frame-corner bl" /><div className="inv-frame-corner br" />
        </div>
      )}

      {/* falling rose petals */}
      {showContent && [..."🌸🌹✿🌷❀🌺"].split("").map((p, i) => (
        <div key={i} className="petal" style={{ left:`${5+i*16}%`, top:"-20px", fontSize:`${12+i%6}px`, opacity:0.2+(i%4)*0.05, animationDelay:`${i*0.6}s`, animationDuration:`${7+i}s` }}>{p}</div>
      ))}

      <div className={`invitation${showContent ? " visible" : ""}`}>

        {/* ── HERO ── */}
        <section className="hero">
          {/* bismillah */}
          <div className="reveal" style={{ fontSize:"24px", color:"#c9a84c", marginBottom:"24px", letterSpacing:"0.05em", textShadow:"0 0 40px rgba(201,168,76,0.4)", direction:"rtl" }}>
            بسم الله الرحمن الرحيم
          </div>

          {/* families greeting */}
          <div className="reveal reveal-delay-1" style={{ direction:"rtl", textAlign:"center", fontSize:"13px", color:"#9a8050", lineHeight:2, marginBottom:"28px", maxWidth:"300px", fontFamily:"Georgia, serif" }}>
            بعد اهدائكم عاطر التحية وأزكى السلام<br/>تتشرف عائلتنا
          </div>

          {/* couple names — big beautiful */}
          <div className="couple-wrap reveal reveal-delay-2">
            <div className="couple-frame" />
            <div className="couple-names" style={{ direction:"rtl" }}>
              <span>{CONFIG.groom_ar}</span>
              <em>❤ &amp; ❤</em>
              <span>{CONFIG.bride_ar}</span>
            </div>
          </div>

          <div className="ornament reveal reveal-delay-3">✦ ✦ ✦</div>

          {/* وذلك بمشيئة الله */}
          <div className="reveal reveal-delay-3" style={{ direction:"rtl", fontSize:"14px", color:"#8a7040", fontFamily:"Georgia, serif", marginTop:"4px", opacity:0.8 }}>
            وذلك بمشيئة الله
          </div>

          {/* date */}
          <div className="reveal reveal-delay-4" style={{ marginTop:"28px", textAlign:"center" }}>
            <div style={{ fontSize:"11px", letterSpacing:"0.2em", textTransform:"uppercase", color:"#c9a84c", opacity:0.6, fontFamily:"sans-serif", marginBottom:"6px" }}>
              Cérémonie de mariage
            </div>
            <div style={{ fontSize:"22px", color:"#f0e8d8", fontFamily:"Georgia, serif", direction:"rtl" }}>
              {CONFIG.dateDisplay_ar}
            </div>
            <div style={{ fontSize:"12px", color:"#c9a84c", letterSpacing:"0.12em", fontFamily:"sans-serif", marginTop:"4px", opacity:0.7 }}>
              {CONFIG.dateDisplay_fr}
            </div>
          </div>

          {/* countdown */}
          <div className="countdown reveal reveal-delay-4">
            {[{n:countdown.days,l:"يوم"},{n:countdown.hours,l:"ساعة"},{n:countdown.minutes,l:"دقيقة"},{n:countdown.seconds,l:"ثانية"}].map(({n,l}) => (
              <div key={l} className="count-block">
                <span className="count-num">{pad(n)}</span>
                <span className="count-label">{l}</span>
              </div>
            ))}
          </div>

          <div className="scroll-hint">
            <span style={{ fontSize:"18px" }}>↓</span>
            <span>اكتشف</span>
          </div>
        </section>

        {/* ── FAMILIES SECTION ── */}
        <section className="section section-alt" style={{ textAlign:"center" }}>
          <div className="ornament reveal">✦ ✦ ✦</div>
          <div className="reveal reveal-delay-1" style={{ direction:"rtl", fontSize:"14px", color:"#9a8050", lineHeight:2.6, marginTop:"24px", fontFamily:"Georgia, serif" }}>
            <div style={{ fontSize:"10px", letterSpacing:"0.2em", color:"#c9a84c", fontFamily:"sans-serif", textTransform:"uppercase", opacity:0.6, marginBottom:"18px", direction:"ltr" }}>
              عائلتا العروسَين
            </div>
            <div style={{ marginBottom:"20px" }}>
              <div style={{ color:"#d4b87a", fontSize:"16px", marginBottom:"4px" }}>{CONFIG.groomDad}</div>
              <div style={{ color:"#9a8050" }}>{CONFIG.groomMom}</div>
            </div>
            <div style={{ color:"#c9a84c", fontSize:"20px", margin:"8px 0" }}>✦</div>
            <div>
              <div style={{ color:"#d4b87a", fontSize:"16px", marginBottom:"4px" }}>{CONFIG.brideDad}</div>
              <div style={{ color:"#9a8050" }}>{CONFIG.brideMom}</div>
            </div>
          </div>
          <div className="ornament reveal reveal-delay-2" style={{ marginTop:"24px" }}>✦ ✦ ✦</div>
        </section>

        {/* ── CEREMONY DETAILS ── */}
        <section className="section">
          <div className="section-heading reveal">تفاصيل حفل الزفاف</div>
          <div className="section-sub reveal reveal-delay-1">Détails de la cérémonie</div>

          {/* big venue card */}
          <div className="detail-card reveal reveal-delay-2" style={{ position:"relative", overflow:"hidden" }}>
            {/* decorative background pattern */}
            <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle at 80% 20%, rgba(201,168,76,0.06) 0%, transparent 60%)", pointerEvents:"none" }} />

            <div style={{ fontSize:"32px", marginBottom:"16px" }}>💍</div>

            <div style={{ fontSize:"10px", letterSpacing:"0.25em", textTransform:"uppercase", color:"#c9a84c", fontFamily:"sans-serif", opacity:0.6, marginBottom:"16px" }}>
              Cérémonie de mariage
            </div>

            {/* time — big */}
            <div style={{ fontSize:"3rem", color:"#e8c547", fontFamily:"Georgia, serif", fontWeight:300, lineHeight:1, marginBottom:"8px", textShadow:"0 0 30px rgba(232,197,71,0.3)" }}>
              {CONFIG.time_fr}
            </div>
            <div style={{ direction:"rtl", fontSize:"15px", color:"#9a8050", fontFamily:"Georgia, serif", marginBottom:"20px" }}>
              {CONFIG.time_ar}
            </div>

            {/* divider */}
            <div style={{ height:"1px", background:"linear-gradient(90deg, transparent, rgba(201,168,76,0.3), transparent)", margin:"20px 0" }} />

            {/* venue */}
            <div style={{ fontSize:"1.6rem", color:"#f5efe6", fontFamily:"Georgia, serif", letterSpacing:"0.05em", marginBottom:"8px" }}>
              {CONFIG.venue}
            </div>
            <div style={{ fontSize:"12px", color:"#7a6030", fontFamily:"sans-serif", letterSpacing:"0.1em", marginBottom:"20px" }}>
              Bouargoub, Gouvernorat de Nabeul
            </div>

            <a href={CONFIG.mapsUrl} target="_blank" rel="noreferrer" className="map-btn">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              الاتجاهات · Itinéraire
            </a>
          </div>

          {/* date card */}
          <div className="reveal reveal-delay-3" style={{ background:"rgba(201,168,76,0.06)", border:"1px solid rgba(201,168,76,0.15)", borderRadius:"14px", padding:"22px 20px", marginTop:"14px", textAlign:"center" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"24px" }}>
              <div style={{ textAlign:"center" }}>
                <div style={{ fontSize:"3rem", color:"#c9a84c", fontFamily:"Georgia, serif", lineHeight:1 }}>08</div>
                <div style={{ fontSize:"10px", letterSpacing:"0.18em", color:"#7a6030", fontFamily:"sans-serif", textTransform:"uppercase", marginTop:"4px" }}>Août</div>
              </div>
              <div style={{ width:"1px", height:"50px", background:"rgba(201,168,76,0.2)" }} />
              <div style={{ textAlign:"center" }}>
                <div style={{ fontSize:"3rem", color:"#c9a84c", fontFamily:"Georgia, serif", lineHeight:1 }}>2026</div>
                <div style={{ fontSize:"10px", letterSpacing:"0.18em", color:"#7a6030", fontFamily:"sans-serif", textTransform:"uppercase", marginTop:"4px" }}>السنة</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── RSVP ── */}
        <section className="section section-alt">
          <div className="section-heading reveal">تأكيد الحضور</div>
          <div className="section-sub reveal reveal-delay-1">Merci de confirmer votre présence</div>

          {rsvpSent ? (
            <div className="reveal" style={{ textAlign:"center", padding:"36px 0" }}>
              <div style={{ fontSize:"52px", color:"#c9a84c", marginBottom:"18px", textShadow:"0 0 40px rgba(201,168,76,0.5)" }}>✦</div>
              <div style={{ color:"#c9a84c", fontSize:"1.4rem", marginBottom:"10px", fontFamily:"Georgia, serif" }}>شكراً جزيلاً</div>
              <div style={{ color:"#7a6030", fontSize:"13px", fontFamily:"sans-serif", lineHeight:2, direction:"rtl" }}>
                تم استلام ردّكم بنجاح<br/>يسعدنا استقبالكم في هذه المناسبة السعيدة
              </div>
            </div>
          ) : (
            <form className="rsvp-form reveal reveal-delay-1" onSubmit={handleRsvp}>
              <input className="rsvp-input" type="text" placeholder="الاسم الكامل / Votre nom" required
                value={rsvp.name} onChange={e => setRsvp({...rsvp, name:e.target.value})} />
              <input className="rsvp-input" type="tel" placeholder="رقم الهاتف / Téléphone"
                value={rsvp.phone} onChange={e => setRsvp({...rsvp, phone:e.target.value})} />
              <select className="rsvp-select" value={rsvp.attending}
                onChange={e => setRsvp({...rsvp, attending:e.target.value})}>
                <option value="oui">✓  سأحضر — Je confirme ma présence</option>
                <option value="non">✗  لن أتمكن من الحضور — Je ne pourrai pas venir</option>
              </select>
              {rsvp.attending === "oui" && (
                <select className="rsvp-select" value={rsvp.guests}
                  onChange={e => setRsvp({...rsvp, guests:e.target.value})}>
                  {["1","2","3","4","5"].map(n => (
                    <option key={n} value={n}>{n} personne{parseInt(n)>1?"s":""}</option>
                  ))}
                </select>
              )}
              <button type="submit" className="rsvp-btn">تأكيد الحضور · Confirmer</button>
            </form>
          )}
        </section>

        {/* ── CLOSING ── */}
        <section className="section" style={{ textAlign:"center" }}>
          <div className="ornament reveal">✦ ✦ ✦</div>
          <div className="reveal reveal-delay-1" style={{ direction:"rtl", fontSize:"22px", color:"#c9a84c", fontFamily:"Georgia, serif", margin:"24px 0 8px", opacity:0.85 }}>
            {CONFIG.groom_ar}
          </div>
          <div className="reveal reveal-delay-1" style={{ fontSize:"16px", color:"#c9a84c", margin:"4px 0", opacity:0.5 }}>❤ ❤</div>
          <div className="reveal reveal-delay-2" style={{ direction:"rtl", fontSize:"22px", color:"#c9a84c", fontFamily:"Georgia, serif", margin:"0 0 24px", opacity:0.85 }}>
            {CONFIG.bride_ar}
          </div>
          <div className="ornament reveal reveal-delay-3">✦ ✦ ✦</div>
          <div className="reveal reveal-delay-3" style={{ direction:"rtl", fontSize:"13px", color:"#5a4a20", fontFamily:"Georgia, serif", marginTop:"20px", opacity:0.7 }}>
            وذلك بمشيئة الله
          </div>
        </section>

        <footer style={{ textAlign:"center", padding:"40px 24px", borderTop:"1px solid rgba(201,168,76,0.07)", fontFamily:"sans-serif", fontSize:"10px", letterSpacing:"0.12em", color:"#2a1f08" }}>
          ✦ &nbsp; {CONFIG.groom_fr} &amp; {CONFIG.bride_fr} &nbsp; ✦<br/>
          <span style={{ opacity:0.3, marginTop:"6px", display:"block" }}>{CONFIG.dateDisplay_fr} · BOUARGOUB</span>
        </footer>
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

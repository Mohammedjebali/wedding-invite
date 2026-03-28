"use client";
import { useState, useEffect, useRef } from "react";

const CONFIG = {
  groom_ar: "محمد أمين بن سالم",
  bride_ar: "نور الهدى جلال",
  groom_fr: "Mohamed Amine Ben Salem",
  bride_fr: "Nour El Hoda Jlel",
  initials: "م.أ & ن.ه",
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

const PETALS = ["✦","◆","◇","✧","✦","◆"];

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
            <div className="env-letter-names" style={{ direction:"rtl", fontSize:"min(0.85rem, 2.8vw)" }}>
              {CONFIG.groom_ar} & {CONFIG.bride_ar}
            </div>
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
            <span className="wax-seal-text" style={{ fontFamily:"sans-serif", fontSize:"min(0.75rem,2.5vw)", letterSpacing:"0.05em" }}>✦</span>
          </div>
          <div className="env-hint"><div className="env-hint-text">المسّ لفتح الدعوة</div></div>
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

      {/* geometric petals (no emojis) */}
      {showContent && PETALS.map((p, i) => (
        <div key={i} className="petal" style={{
          left:`${6+i*16}%`, top:"-30px",
          fontSize:`${10+i%5}px`, color:`rgba(201,168,76,${0.12+i%4*0.04})`,
          animationDelay:`${i*0.9}s`, animationDuration:`${8+i*1.2}s`,
          fontFamily:"sans-serif",
        }}>{p}</div>
      ))}

      <div className={`invitation${showContent ? " visible" : ""}`}>

        {/* ── HERO ── */}
        <section className="hero">
          <div className="bismillah-band" />

          <div className="reveal" style={{ fontSize:"22px", color:"#c9a84c", letterSpacing:"0.07em", opacity:0.75, direction:"rtl", textShadow:"0 0 36px rgba(201,168,76,0.25)", marginBottom:"20px" }}>
            بسم الله الرحمن الرحيم
          </div>

          <span className="gold-rule reveal reveal-d1" style={{ marginBottom:"28px", display:"block" }} />

          <div className="reveal reveal-d1" style={{ direction:"rtl", fontSize:"13px", color:"#8a7040", fontStyle:"italic", lineHeight:1.9, marginBottom:"8px", opacity:0.8 }}>
            بعد اهدائكم عاطر التحية وأزكى السلام
          </div>
          <div className="reveal reveal-d1" style={{ direction:"rtl", fontSize:"13px", color:"#7a6030", lineHeight:1.9, marginBottom:"28px" }}>
            يسرّنا دعوتكم لحضور حفل زفاف
          </div>

          <div className="couple-wrap reveal reveal-d2">
            <div className="couple-frame" />
            <div className="couple-names">
              <span className="name-shimmer">{CONFIG.groom_ar}</span>
              <span className="sep">── ✦ ──</span>
              <span className="name-shimmer">{CONFIG.bride_ar}</span>
            </div>
          </div>

          <div className="reveal reveal-d3" style={{ direction:"rtl", fontSize:"1rem", fontStyle:"italic", color:"#9a8050", marginTop:"16px" }}>
            وذلك بمشيئة الله تعالى
          </div>

          <span className="gold-rule reveal reveal-d3" style={{ marginTop:"28px", display:"block" }} />

          <div className="wedding-date-block reveal reveal-d4">
            <div className="wedding-date-label">تاريخ حفل الزفاف</div>
            <div className="wedding-date-main">{CONFIG.dateDisplay_ar}</div>
            <div className="wedding-date-sub">{CONFIG.dateDisplay_fr}</div>
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
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
            <span>تمرير للأسفل</span>
          </div>
        </section>

        {/* ── FAMILIES ── */}
        <section className="section section-alt">
          <div className="section-heading reveal">العائلتان الكريمتان</div>
          <div className="section-sub reveal reveal-d1">Les familles</div>

          <div className="families-grid reveal reveal-d2">
            <div className="family-cell">
              <div className="family-role">عائلة العريس</div>
              <div className="family-name">{CONFIG.groomDad}<br />{CONFIG.groomMom}</div>
            </div>
            <div className="family-cell">
              <div className="family-role">عائلة العروس</div>
              <div className="family-name">{CONFIG.brideDad}<br />{CONFIG.brideMom}</div>
            </div>
          </div>

          <div className="ornament reveal reveal-d3" style={{ marginTop:"28px" }}>◆ ◆ ◆</div>
        </section>

        {/* ── CEREMONY ── */}
        <section className="section">
          <div className="section-heading reveal">تفاصيل الحفل</div>
          <div className="section-sub reveal reveal-d1">Détails de la cérémonie</div>

          <div className="venue-card reveal reveal-d2">
            <div className="venue-card-top">
              <div style={{ fontSize:"9px", letterSpacing:"0.26em", textTransform:"uppercase", color:"#c9a84c", fontFamily:"sans-serif", opacity:0.55, marginBottom:"20px" }}>
                موعد الحفل · Heure de la cérémonie
              </div>
              <div className="venue-time">21<span style={{ fontSize:"2rem", opacity:0.6 }}>h</span>00</div>
              <div className="venue-time-sub">{CONFIG.time_ar}</div>
            </div>
            <div className="venue-card-bottom">
              <div className="venue-name">{CONFIG.venue_name}</div>
              <div className="venue-location">{CONFIG.venue_region}</div>
              <a href={CONFIG.mapsUrl} target="_blank" rel="noreferrer" className="map-btn">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                عرض على الخريطة · Voir sur la carte
              </a>
            </div>
          </div>

          <div className="date-strip reveal reveal-d3">
            <div className="date-cell">
              <div className="date-cell-num">08</div>
              <div className="date-cell-label">Août</div>
            </div>
            <div className="date-cell">
              <div className="date-cell-num">السبت</div>
              <div className="date-cell-label">Samedi</div>
            </div>
            <div className="date-cell">
              <div className="date-cell-num">2026</div>
              <div className="date-cell-label">السنة</div>
            </div>
          </div>
        </section>

        {/* ── RSVP ── */}
        <section className="section section-alt">
          <div className="section-heading reveal">تأكيد الحضور</div>
          <div className="section-sub reveal reveal-d1">Confirmez votre présence avant le 1er Août</div>

          {rsvpSent ? (
            <div className="reveal" style={{ textAlign:"center", padding:"40px 0" }}>
              <div style={{ width:"60px", height:"60px", borderRadius:"50%", border:"1px solid rgba(201,168,76,0.35)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px", fontSize:"22px", color:"#c9a84c" }}>✦</div>
              <div style={{ color:"#c9a84c", fontSize:"1.5rem", fontFamily:"Cormorant Garamond,serif", marginBottom:"10px", direction:"rtl" }}>شكراً جزيلاً</div>
              <div style={{ color:"#7a6030", fontSize:"13px", fontFamily:"sans-serif", lineHeight:2, direction:"rtl" }}>
                تم استلام ردّكم بنجاح<br/>يسعدنا استقبالكم في هذه المناسبة السعيدة
              </div>
            </div>
          ) : (
            <form className="rsvp-form reveal reveal-d1" onSubmit={handleRsvp}>
              <input className="rsvp-input" type="text" placeholder="الاسم الكامل" required value={rsvp.name} onChange={e => setRsvp({...rsvp, name:e.target.value})} />
              <input className="rsvp-input" type="tel" placeholder="رقم الهاتف" value={rsvp.phone} onChange={e => setRsvp({...rsvp, phone:e.target.value})} />
              <select className="rsvp-select" value={rsvp.attending} onChange={e => setRsvp({...rsvp, attending:e.target.value})}>
                <option value="oui">سأحضر بكل سرور</option>
                <option value="non">لن أتمكن من الحضور</option>
              </select>
              {rsvp.attending === "oui" && (
                <select className="rsvp-select" value={rsvp.guests} onChange={e => setRsvp({...rsvp, guests:e.target.value})}>
                  {["1","2","3","4","5"].map(n => <option key={n} value={n}>{n} {parseInt(n)>1?"أشخاص":"شخص"}</option>)}
                </select>
              )}
              <button type="submit" className="rsvp-btn">تأكيد الحضور</button>
            </form>
          )}
        </section>

        {/* ── CLOSING ── */}
        <section className="section" style={{ textAlign:"center" }}>
          <span className="gold-rule reveal" style={{ display:"block", marginBottom:"32px" }} />
          <div className="reveal reveal-d1" style={{ direction:"rtl", fontFamily:"Cormorant Garamond,serif", fontSize:"1.5rem", color:"#c9a84c", fontWeight:300, lineHeight:2, marginBottom:"24px" }}>
            {CONFIG.groom_ar}<br />
            <span style={{ fontSize:"0.8rem", color:"#5a4420", letterSpacing:"0.15em", fontStyle:"italic" }}>◆ ◆ ◆</span><br />
            {CONFIG.bride_ar}
          </div>
          <div className="reveal reveal-d2" style={{ direction:"rtl", fontSize:"12px", color:"#4a3a14", fontStyle:"italic", marginBottom:"16px" }}>
            وذلك بمشيئة الله
          </div>
          <span className="gold-rule reveal reveal-d3" style={{ display:"block" }} />
        </section>

        <footer style={{ textAlign:"center", padding:"40px 24px", borderTop:"1px solid rgba(201,168,76,0.06)", fontFamily:"sans-serif", fontSize:"10px", letterSpacing:"0.14em", color:"#2a1f08" }}>
          {CONFIG.groom_fr} &amp; {CONFIG.bride_fr}<br/>
          <span style={{ opacity:0.3, marginTop:"5px", display:"block" }}>{CONFIG.dateDisplay_fr} · BOUARGOUB</span>
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

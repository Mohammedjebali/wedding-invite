"use client";
import { useState, useEffect, useRef } from "react";

const CONFIG = {
  groom: "Ahmed", bride: "Yasmine", initials: "A & Y",
  date: "2026-09-12", dateDisplay: "Samedi 12 Septembre 2026",
  ceremonyTime: "18h00", ceremonyVenue: "Salle des Fêtes El Menzah",
  ceremonyAddress: "Rue du Lac, El Menzah, Tunis",
  ceremonyMaps: "https://maps.google.com/?q=El+Menzah+Tunis",
  receptionTime: "19h30", receptionVenue: "Dar Zitoun",
  receptionAddress: "Avenue Habib Bourguiba, La Marsa, Tunis",
  receptionMaps: "https://maps.google.com/?q=La+Marsa+Tunis",
  dresscode: "Tenue de soirée",
  groomFamily: "Famille Ben Ali", brideFamily: "Famille Chebbi",
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

// Scroll reveal hook
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); });
    }, { threshold: 0.15 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

const PETALS = ["🌸","✿","❋","✾","❀"];

export default function Home() {
  const [opening, setOpening] = useState(false);
  const [gone, setGone] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [showPetals, setShowPetals] = useState(false);
  const [rsvp, setRsvp] = useState({ name: "", phone: "", attending: "oui", guests: "1" });
  const [rsvpSent, setRsvpSent] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const countdown = useCountdown(CONFIG.date);
  const pad = (n: number) => String(n).padStart(2,"0");
  useScrollReveal();

  const handleOpen = () => {
    if (opening) return;
    setOpening(true);
    setTimeout(() => { setShowContent(true); setShowPetals(true); }, 1200);
    setTimeout(() => setGone(true), 2400);
  };

  const handleRsvp = (e: React.FormEvent) => { e.preventDefault(); setRsvpSent(true); };

  // Generate deterministic petal positions
  const petals = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    symbol: PETALS[i % PETALS.length],
    left: `${(i * 8.33) % 100}%`,
    delay: `${(i * 0.7) % 5}s`,
    duration: `${6 + (i % 4)}s`,
    size: `${10 + (i % 8)}px`,
    opacity: 0.15 + (i % 5) * 0.05,
  }));

  return (
    <>
      {/* ══ ENVELOPE ══ */}
      <div className={`env-screen${gone ? " gone" : ""}`}
        style={{ cursor: opening ? "default" : "pointer" }}
        onClick={!opening ? handleOpen : undefined}
      >
        <div className="env-glow" />

        {/* ambient floating particles */}
        {[...Array(8)].map((_, i) => (
          <div key={i} className="env-particle" style={{
            left: `${10 + i * 12}%`, bottom: "0",
            animationDelay: `${i * 0.7}s`, animationDuration: `${5 + i}s`,
            opacity: 0,
          }} />
        ))}

        {/* envelope */}
        <div className={`env-3d${opening ? " open" : ""}`}>
          {/* letter inside */}
          <div className="env-letter">
            <div className="env-letter-line" style={{ width: "60%" }} />
            <div className="env-letter-names">{CONFIG.groom} &amp; {CONFIG.bride}</div>
            <div className="env-letter-line" style={{ width: "40%" }} />
            <div className="env-letter-date">{CONFIG.dateDisplay}</div>
            <div className="env-letter-line" style={{ width: "60%" }} />
          </div>

          {/* body */}
          <div className="env-body">
            <div className="env-body-bg" />
            <div className="env-bottom-folds" />
            <div className="env-inner-border" />
          </div>

          {/* flap */}
          <div className="env-flap-wrap">
            <div className="env-flap-front">
              <div className="env-flap-triangle" />
            </div>
          </div>

          {/* wax seal */}
          <div className="wax-seal">
            <span className="wax-seal-text">{CONFIG.initials}</span>
          </div>

          {/* hint */}
          <div className="env-hint">
            <div className="env-hint-text">✦ Toucher pour ouvrir ✦</div>
          </div>
        </div>
      </div>

      {/* ══ INVITATION CONTENT ══ */}
      {CONFIG.bgMusic && <audio ref={audioRef} src={CONFIG.bgMusic} loop />}

      {/* corner frame */}
      {showContent && (
        <div className="inv-frame">
          <div className="inv-frame-corner tl" />
          <div className="inv-frame-corner tr" />
          <div className="inv-frame-corner bl" />
          <div className="inv-frame-corner br" />
        </div>
      )}

      {/* falling petals */}
      {showPetals && petals.map(p => (
        <div key={p.id} className="petal" style={{
          left: p.left, top: "-20px",
          fontSize: p.size, opacity: p.opacity,
          animationDelay: p.delay, animationDuration: p.duration,
        }}>{p.symbol}</div>
      ))}

      <div className={`invitation${showContent ? " visible" : ""}`}>

        {/* ── HERO ── */}
        <section className="hero">
          <div className="bismillah reveal">بسم الله الرحمن الرحيم</div>
          <div className="invite-label reveal reveal-delay-1">
            {CONFIG.groomFamily} &amp; {CONFIG.brideFamily} · vous invitent à célébrer
          </div>

          <div className="couple-wrap reveal reveal-delay-2">
            <div className="couple-frame" />
            <div className="couple-names">
              <span>{CONFIG.groom}</span>
              <em>✦ &amp; ✦</em>
              <span>{CONFIG.bride}</span>
            </div>
          </div>

          <div className="ornament reveal reveal-delay-3">✦ ✦ ✦</div>
          <div className="wedding-date reveal reveal-delay-3">✦ &nbsp; {CONFIG.dateDisplay} &nbsp; ✦</div>

          <div className="countdown reveal reveal-delay-4">
            {[
              { n: countdown.days, l: "Jours" },
              { n: countdown.hours, l: "Heures" },
              { n: countdown.minutes, l: "Min" },
              { n: countdown.seconds, l: "Sec" },
            ].map(({ n, l }) => (
              <div key={l} className="count-block">
                <span className="count-num">{pad(n)}</span>
                <span className="count-label">{l}</span>
              </div>
            ))}
          </div>

          <div className="scroll-hint">
            <span style={{ fontSize: "18px" }}>↓</span>
            <span>Découvrir</span>
          </div>
        </section>

        {/* ── QUOTE ── */}
        <section className="section" style={{ textAlign: "center" }}>
          <div className="ornament reveal">✦ ✦ ✦</div>
          <p className="reveal reveal-delay-1" style={{
            color: "#9a8050", fontSize: "15px", fontStyle: "italic",
            lineHeight: 2.2, maxWidth: "300px", margin: "16px auto 0"
          }}>
            « Et parmi Ses signes, Il a créé de vous des épouses afin que vous trouviez en elles la quiétude. »
          </p>
          <div className="reveal reveal-delay-2" style={{ fontSize: "10px", color: "#5a4a20", fontFamily: "sans-serif", letterSpacing: "0.15em", marginTop: "12px" }}>
            Coran — Sourate Ar-Rum, 30:21
          </div>
          <div className="ornament reveal reveal-delay-3" style={{ marginTop: "24px" }}>✦ ✦ ✦</div>
        </section>

        {/* ── PROGRAMME ── */}
        <section className="section section-alt">
          <div className="section-heading reveal">Programme</div>
          <div className="section-sub reveal reveal-delay-1">Détails de la soirée</div>

          <div className="detail-card reveal reveal-delay-1">
            <div className="detail-card-icon">💍</div>
            <div className="detail-tag">Cérémonie de mariage</div>
            <div className="detail-time">{CONFIG.ceremonyTime}</div>
            <div className="detail-title">{CONFIG.ceremonyVenue}</div>
            <div className="detail-info">{CONFIG.ceremonyAddress}</div>
            <a href={CONFIG.ceremonyMaps} target="_blank" rel="noreferrer" className="map-btn">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              Voir sur la carte
            </a>
          </div>

          <div className="detail-card reveal reveal-delay-2">
            <div className="detail-card-icon">🥂</div>
            <div className="detail-tag">Réception &amp; Dîner</div>
            <div className="detail-time">{CONFIG.receptionTime}</div>
            <div className="detail-title">{CONFIG.receptionVenue}</div>
            <div className="detail-info">{CONFIG.receptionAddress}</div>
            <a href={CONFIG.receptionMaps} target="_blank" rel="noreferrer" className="map-btn">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              Voir sur la carte
            </a>
          </div>

          {CONFIG.dresscode && (
            <div className="reveal reveal-delay-3" style={{ textAlign: "center", marginTop: "28px", fontSize: "11px", color: "#7a6030", fontFamily: "sans-serif", letterSpacing: "0.18em" }}>
              ✦ &nbsp; Dress code : <span style={{ color: "#c9a84c" }}>{CONFIG.dresscode}</span> &nbsp; ✦
            </div>
          )}
        </section>

        {/* ── RSVP ── */}
        <section className="section">
          <div className="section-heading reveal">Votre présence</div>
          <div className="section-sub reveal reveal-delay-1">Confirmez avant le 1er Septembre 2026</div>

          {rsvpSent ? (
            <div style={{ textAlign: "center", padding: "40px 0" }} className="reveal">
              <div style={{ fontSize: "48px", color: "#c9a84c", marginBottom: "16px", textShadow: "0 0 30px rgba(201,168,76,0.4)" }}>✦</div>
              <div style={{ color: "#c9a84c", fontSize: "1.3rem", marginBottom: "10px" }}>Merci !</div>
              <div style={{ color: "#7a6030", fontSize: "13px", fontFamily: "sans-serif", lineHeight: 1.8 }}>
                Votre réponse a bien été reçue.<br />Nous avons hâte de vous accueillir.
              </div>
            </div>
          ) : (
            <form className="rsvp-form reveal reveal-delay-1" onSubmit={handleRsvp}>
              <input className="rsvp-input" type="text" placeholder="Votre nom complet" required
                value={rsvp.name} onChange={e => setRsvp({ ...rsvp, name: e.target.value })} />
              <input className="rsvp-input" type="tel" placeholder="Numéro de téléphone"
                value={rsvp.phone} onChange={e => setRsvp({ ...rsvp, phone: e.target.value })} />
              <select className="rsvp-select" value={rsvp.attending}
                onChange={e => setRsvp({ ...rsvp, attending: e.target.value })}>
                <option value="oui">✓  Je confirme ma présence</option>
                <option value="non">✗  Je ne pourrai pas venir</option>
              </select>
              {rsvp.attending === "oui" && (
                <select className="rsvp-select" value={rsvp.guests}
                  onChange={e => setRsvp({ ...rsvp, guests: e.target.value })}>
                  {["1","2","3","4","5"].map(n => (
                    <option key={n} value={n}>{n} personne{parseInt(n)>1?"s":""}</option>
                  ))}
                </select>
              )}
              <button type="submit" className="rsvp-btn">Confirmer ma présence</button>
            </form>
          )}
        </section>

        {/* ── FAMILIES ── */}
        <section className="section section-alt" style={{ textAlign: "center" }}>
          <div className="ornament reveal">✦</div>
          <p className="reveal reveal-delay-1" style={{ color: "#7a6030", fontSize: "14px", fontFamily: "sans-serif", lineHeight: 2.4, marginTop: "20px" }}>
            <span style={{ color: "#c9a84c", display: "block", fontSize: "9px", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "14px" }}>
              Avec les heureux parents
            </span>
            <span style={{ color: "#a09060" }}>{CONFIG.groomFamily}</span><br />
            <span style={{ color: "#a09060" }}>{CONFIG.brideFamily}</span>
          </p>
          <div className="ornament reveal reveal-delay-2" style={{ marginTop: "20px" }}>✦ ✦ ✦</div>
        </section>

        <footer className="inv-footer">
          ✦ &nbsp; {CONFIG.groom} &amp; {CONFIG.bride} &nbsp; ✦<br />
          <span style={{ opacity: 0.3, marginTop: "6px", display: "block" }}>{CONFIG.dateDisplay}</span>
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

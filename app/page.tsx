"use client";
import { useState, useEffect, useRef } from "react";

// ── CONFIG ──────────────────────────────────────────────────
const CONFIG = {
  groom: "Ahmed",
  bride: "Yasmine",
  initials: "A & Y",
  date: "2026-09-12",
  dateDisplay: "Samedi 12 Septembre 2026",
  ceremonyTime: "18h00",
  ceremonyVenue: "Salle des Fêtes El Menzah",
  ceremonyAddress: "Rue du Lac, El Menzah, Tunis",
  ceremonyMaps: "https://maps.google.com/?q=El+Menzah+Tunis",
  receptionTime: "19h30",
  receptionVenue: "Dar Zitoun",
  receptionAddress: "Avenue Habib Bourguiba, La Marsa, Tunis",
  receptionMaps: "https://maps.google.com/?q=La+Marsa+Tunis",
  dresscode: "Tenue de soirée",
  groomFamily: "Famille Ben Ali",
  brideFamily: "Famille Chebbi",
  bgMusic: "",
};
// ────────────────────────────────────────────────────────────

function useCountdown(targetDate: string) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) return;
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  return time;
}

export default function Home() {
  const [opening, setOpening] = useState(false);
  const [gone, setGone] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [rsvp, setRsvp] = useState({ name: "", phone: "", attending: "oui", guests: "1" });
  const [rsvpSent, setRsvpSent] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const countdown = useCountdown(CONFIG.date);
  const pad = (n: number) => String(n).padStart(2, "0");

  const handleOpen = () => {
    if (opening) return;
    setOpening(true);
    // Start revealing content slightly before envelope fully gone
    setTimeout(() => setShowContent(true), 1200);
    setTimeout(() => setGone(true), 2000);
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (playing) { audioRef.current.pause(); setPlaying(false); }
    else { audioRef.current.play().catch(() => {}); setPlaying(true); }
  };

  const handleRsvp = (e: React.FormEvent) => {
    e.preventDefault();
    setRsvpSent(true);
  };

  return (
    <>
      {/* ══ FULL-SCREEN ENVELOPE ══ */}
      <div className={`env-screen${opening ? " opening" : ""}${gone ? " gone" : ""}`}
        onClick={!opening ? handleOpen : undefined}
        style={{ cursor: opening ? "default" : "pointer" }}
      >
        {/* paper background */}
        <div className="env-bg" />
        <div className="env-emboss" />

        {/* envelope fold lines */}
        <div className="env-fold-left" />
        <div className="env-fold-right" />

        {/* top flap */}
        <div className="env-flap-top">
          <div className="env-flap-top-inner" />
        </div>

        {/* center seal + text */}
        <div className="wax-seal-wrap">
          <div className="wax-seal" onClick={handleOpen}>
            <span className="seal-initials">{CONFIG.initials}</span>
          </div>
          <div className="seal-text">
            <div className="seal-text-line1">
              Cette invitation<br />est pour vous
            </div>
            <div className="seal-text-line2" onClick={handleOpen}>
              Toucher pour ouvrir ✦
            </div>
          </div>
        </div>
      </div>

      {/* ══ INVITATION CONTENT ══ */}
      {CONFIG.bgMusic && <audio ref={audioRef} src={CONFIG.bgMusic} loop />}

      <div className={`invitation${showContent ? " visible" : ""}`}>

        {/* HERO */}
        <section className="hero">
          <div className="bismillah">بسم الله الرحمن الرحيم</div>
          <div className="invite-label">{CONFIG.groomFamily} &amp; {CONFIG.brideFamily}</div>
          <div className="ornament">✦</div>
          <div className="couple-names">
            {CONFIG.groom}
            <em>✦ &amp; ✦</em>
            {CONFIG.bride}
          </div>
          <div className="ornament" style={{ marginTop: "20px" }}>✦ ✦ ✦</div>
          <div className="wedding-date">{CONFIG.dateDisplay}</div>

          <div className="countdown">
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
            <span style={{ fontSize: "16px" }}>↓</span>
            <span>Découvrir</span>
          </div>
        </section>

        {/* MESSAGE */}
        <section className="section" style={{ textAlign: "center" }}>
          <p style={{
            color: "#a08850", fontSize: "14px", fontStyle: "italic",
            lineHeight: 2, maxWidth: "320px", margin: "0 auto"
          }}>
            C'est avec une immense joie que nous vous convions à partager ce moment unique et inoubliable.
          </p>
          <div className="ornament" style={{ maxWidth: "200px", margin: "24px auto 0" }}>✦ ✦ ✦</div>
        </section>

        {/* CÉRÉMONIE */}
        <section className="section section-alt">
          <div className="section-heading">Programme</div>
          <div className="section-sub">Détails de la soirée</div>

          <div className="detail-card">
            <div className="detail-tag">Cérémonie</div>
            <div className="detail-title">{CONFIG.ceremonyVenue}</div>
            <div className="detail-info">
              {CONFIG.ceremonyAddress}<br />
              <span style={{ color: "#c9a84c", fontWeight: 600 }}>{CONFIG.ceremonyTime}</span>
            </div>
            <a href={CONFIG.ceremonyMaps} target="_blank" rel="noreferrer" className="map-btn">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              Voir sur la carte
            </a>
          </div>

          <div className="detail-card" style={{ marginTop: "14px" }}>
            <div className="detail-tag">Réception</div>
            <div className="detail-title">{CONFIG.receptionVenue}</div>
            <div className="detail-info">
              {CONFIG.receptionAddress}<br />
              <span style={{ color: "#c9a84c", fontWeight: 600 }}>{CONFIG.receptionTime}</span>
            </div>
            <a href={CONFIG.receptionMaps} target="_blank" rel="noreferrer" className="map-btn">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              Voir sur la carte
            </a>
          </div>

          {CONFIG.dresscode && (
            <div style={{ textAlign: "center", marginTop: "28px", fontSize: "11px", color: "#7a6a4a", fontFamily: "sans-serif", letterSpacing: "0.15em" }}>
              ✦ &nbsp; Dress code : <span style={{ color: "#c9a84c" }}>{CONFIG.dresscode}</span> &nbsp; ✦
            </div>
          )}
        </section>

        {/* RSVP */}
        <section className="section">
          <div className="section-heading">Votre réponse</div>
          <div className="section-sub">Merci de confirmer avant le 1er Septembre</div>

          {rsvpSent ? (
            <div style={{ textAlign: "center", padding: "32px 0" }}>
              <div style={{ fontSize: "36px", color: "#c9a84c", marginBottom: "14px" }}>✦</div>
              <div style={{ color: "#c9a84c", fontSize: "1.2rem", marginBottom: "8px" }}>Merci !</div>
              <div style={{ color: "#7a6a4a", fontSize: "13px", fontFamily: "sans-serif" }}>Votre réponse a bien été reçue.</div>
            </div>
          ) : (
            <form className="rsvp-form" onSubmit={handleRsvp}>
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
                    <option key={n} value={n}>{n} personne{parseInt(n) > 1 ? "s" : ""}</option>
                  ))}
                </select>
              )}
              <button type="submit" className="rsvp-btn">Confirmer ma présence</button>
            </form>
          )}
        </section>

        {/* FAMILIES */}
        <section className="section section-alt" style={{ textAlign: "center" }}>
          <div className="ornament">✦ ✦ ✦</div>
          <p style={{ color: "#7a6a4a", fontSize: "13px", fontFamily: "sans-serif", lineHeight: 2.2, marginTop: "20px" }}>
            <span style={{ color: "#c9a84c", display: "block", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "10px", fontFamily: "sans-serif" }}>
              Avec les heureux parents
            </span>
            {CONFIG.groomFamily}<br />{CONFIG.brideFamily}
          </p>
          <div className="ornament" style={{ marginTop: "20px" }}>✦</div>
        </section>

        <footer className="inv-footer">
          ✦ &nbsp; {CONFIG.groom} &amp; {CONFIG.bride} &nbsp; ✦<br />
          <span style={{ opacity: 0.4 }}>{CONFIG.dateDisplay}</span>
        </footer>
      </div>

      {CONFIG.bgMusic && (
        <button className="music-btn" onClick={toggleMusic}>{playing ? "⏸" : "♪"}</button>
      )}
    </>
  );
}

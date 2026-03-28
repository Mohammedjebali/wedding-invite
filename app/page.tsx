"use client";
import { useState, useEffect, useRef } from "react";

// ── CONFIG — change these for each wedding ──────────────────────────────────
const CONFIG = {
  groom: "Ahmed",
  bride: "Yasmine",
  date: "2026-09-12", // YYYY-MM-DD
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
  bgMusic: "", // optional: URL to audio file
};
// ────────────────────────────────────────────────────────────────────────────

function useCountdown(targetDate: string) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) { setTime({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return; }
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
  const [opened, setOpened] = useState(false);
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [rsvp, setRsvp] = useState({ name: "", phone: "", attending: "oui", guests: "1" });
  const [rsvpSent, setRsvpSent] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const countdown = useCountdown(CONFIG.date);

  const handleOpen = () => {
    setEnvelopeOpen(true);
    setTimeout(() => {
      setOpened(true);
      setTimeout(() => setShowContent(true), 300);
    }, 900);
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (playing) { audioRef.current.pause(); setPlaying(false); }
    else { audioRef.current.play(); setPlaying(true); }
  };

  const handleRsvp = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you'd POST to Supabase or a form endpoint
    console.log("RSVP:", rsvp);
    setRsvpSent(true);
  };

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <>
      {/* ── ENVELOPE SCENE ── */}
      <div className={`scene${opened ? " hidden" : ""}`}>
        <div className="envelope-wrap">
          {/* families */}
          <div style={{ textAlign: "center", marginBottom: "8px" }}>
            <div style={{ fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#c9a84c", opacity: 0.6, fontFamily: "sans-serif" }}>
              {CONFIG.groomFamily} &amp; {CONFIG.brideFamily}
            </div>
            <div style={{ fontSize: "11px", letterSpacing: "0.15em", color: "#8a7a5a", fontFamily: "sans-serif", marginTop: "4px" }}>
              vous invitent à célébrer
            </div>
          </div>

          {/* envelope */}
          <div className={`envelope${envelopeOpen ? " open" : ""}`} onClick={!envelopeOpen ? handleOpen : undefined}>
            <div className="env-body" />
            {/* letter inside */}
            <div className="env-letter">
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "11px", color: "#8b6914", letterSpacing: "0.12em", fontFamily: "sans-serif", textTransform: "uppercase", marginBottom: "6px" }}>Invitation</div>
                <div style={{ fontSize: "16px", color: "#2a1f0e", fontFamily: "Georgia, serif" }}>{CONFIG.groom} &amp; {CONFIG.bride}</div>
                <div className="env-letter-line" style={{ width: "80px", margin: "8px auto" }} />
                <div style={{ fontSize: "10px", color: "#8b6914", fontFamily: "sans-serif", letterSpacing: "0.1em" }}>{CONFIG.dateDisplay}</div>
              </div>
            </div>
            {/* seal */}
            <div className="env-seal">✦</div>
            {/* flap */}
            <div className="env-flap">
              <div className="env-flap-inner" />
              <div className="env-flap-border" />
            </div>
          </div>

          {!envelopeOpen ? (
            <>
              <button className="open-btn" onClick={handleOpen}>Ouvrir l'invitation</button>
              <div className="tap-hint">Appuyez pour ouvrir ✦</div>
            </>
          ) : (
            <div className="tap-hint" style={{ opacity: 0.5 }}>Chargement...</div>
          )}
        </div>
      </div>

      {/* ── INVITATION CONTENT ── */}
      {CONFIG.bgMusic && <audio ref={audioRef} src={CONFIG.bgMusic} loop />}

      <div className={`invitation${showContent ? " visible" : ""}`}>

        {/* ── HERO ── */}
        <section className="hero">
          <div className="bismillah">بسم الله الرحمن الرحيم</div>
          <div className="invite-label">Nous avons l'honneur de vous inviter</div>

          <div className="couple-names">
            {CONFIG.groom}
            <em>✦ &amp; ✦</em>
            {CONFIG.bride}
          </div>

          <div className="ornament">✦</div>

          <div className="wedding-date">✦ &nbsp; {CONFIG.dateDisplay} &nbsp; ✦</div>

          {/* countdown */}
          <div className="countdown" style={{ marginTop: "32px" }}>
            <div className="count-block">
              <span className="count-num">{pad(countdown.days)}</span>
              <span className="count-label">Jours</span>
            </div>
            <span className="count-sep">:</span>
            <div className="count-block">
              <span className="count-num">{pad(countdown.hours)}</span>
              <span className="count-label">Heures</span>
            </div>
            <span className="count-sep">:</span>
            <div className="count-block">
              <span className="count-num">{pad(countdown.minutes)}</span>
              <span className="count-label">Minutes</span>
            </div>
            <span className="count-sep">:</span>
            <div className="count-block">
              <span className="count-num">{pad(countdown.seconds)}</span>
              <span className="count-label">Secondes</span>
            </div>
          </div>

          <div className="scroll-hint">
            <span>↓</span>
            <span>Découvrir</span>
          </div>
        </section>

        {/* ── MESSAGE ── */}
        <section className="section" style={{ textAlign: "center" }}>
          <p style={{ color: "#c9a84c", fontSize: "13px", letterSpacing: "0.1em", lineHeight: 1.9, fontFamily: "sans-serif", maxWidth: "340px", margin: "0 auto", opacity: 0.85 }}>
            C'est avec une immense joie que nous vous convions à partager ce moment unique et inoubliable.
          </p>
          <div className="ornament" style={{ maxWidth: "280px", margin: "24px auto 0" }}>✦ ✦ ✦</div>
        </section>

        {/* ── CÉRÉMONIE ── */}
        <section className="section section-alt">
          <div className="section-heading">Cérémonie</div>
          <div className="section-sub">Programme de la soirée</div>

          <div className="detail-card">
            <div className="detail-tag">Cérémonie de mariage</div>
            <div className="detail-title">{CONFIG.ceremonyVenue}</div>
            <div className="detail-info">
              {CONFIG.ceremonyAddress}<br />
              <span style={{ color: "#c9a84c" }}>{CONFIG.ceremonyTime}</span>
            </div>
            <a href={CONFIG.ceremonyMaps} target="_blank" rel="noreferrer" className="map-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              Voir sur la carte
            </a>
          </div>

          <div className="detail-card" style={{ marginTop: "16px" }}>
            <div className="detail-tag">Réception & Dîner</div>
            <div className="detail-title">{CONFIG.receptionVenue}</div>
            <div className="detail-info">
              {CONFIG.receptionAddress}<br />
              <span style={{ color: "#c9a84c" }}>{CONFIG.receptionTime}</span>
            </div>
            <a href={CONFIG.receptionMaps} target="_blank" rel="noreferrer" className="map-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              Voir sur la carte
            </a>
          </div>

          {CONFIG.dresscode && (
            <div style={{ textAlign: "center", marginTop: "24px", fontSize: "12px", color: "#8a7a5a", fontFamily: "sans-serif", letterSpacing: "0.12em" }}>
              ✦ &nbsp; Dress code : <span style={{ color: "#c9a84c" }}>{CONFIG.dresscode}</span> &nbsp; ✦
            </div>
          )}
        </section>

        {/* ── RSVP ── */}
        <section className="section" id="rsvp">
          <div className="section-heading">Confirmez votre présence</div>
          <div className="section-sub">Répondre avant le 1er Septembre 2026</div>

          {rsvpSent ? (
            <div style={{ textAlign: "center", padding: "32px 0" }}>
              <div style={{ fontSize: "32px", marginBottom: "12px" }}>✦</div>
              <div style={{ color: "#c9a84c", fontSize: "18px", marginBottom: "8px" }}>Merci !</div>
              <div style={{ color: "#8a7a5a", fontSize: "13px", fontFamily: "sans-serif" }}>Votre réponse a bien été reçue.</div>
            </div>
          ) : (
            <form className="rsvp-form" onSubmit={handleRsvp}>
              <input
                className="rsvp-input"
                type="text"
                placeholder="Votre nom complet"
                required
                value={rsvp.name}
                onChange={e => setRsvp({ ...rsvp, name: e.target.value })}
              />
              <input
                className="rsvp-input"
                type="tel"
                placeholder="Numéro de téléphone"
                value={rsvp.phone}
                onChange={e => setRsvp({ ...rsvp, phone: e.target.value })}
              />
              <select
                className="rsvp-select"
                value={rsvp.attending}
                onChange={e => setRsvp({ ...rsvp, attending: e.target.value })}
              >
                <option value="oui">✓ Je confirme ma présence</option>
                <option value="non">✗ Je ne pourrai pas venir</option>
              </select>
              {rsvp.attending === "oui" && (
                <select
                  className="rsvp-select"
                  value={rsvp.guests}
                  onChange={e => setRsvp({ ...rsvp, guests: e.target.value })}
                >
                  {["1","2","3","4","5"].map(n => (
                    <option key={n} value={n}>{n} personne{parseInt(n) > 1 ? "s" : ""}</option>
                  ))}
                </select>
              )}
              <button type="submit" className="rsvp-btn">Confirmer</button>
            </form>
          )}
        </section>

        {/* ── FAMILIES ── */}
        <section className="section section-alt" style={{ textAlign: "center" }}>
          <div className="ornament">✦ ✦ ✦</div>
          <p style={{ color: "#8a7a5a", fontSize: "13px", fontFamily: "sans-serif", lineHeight: 2, marginTop: "20px" }}>
            <span style={{ color: "#c9a84c", display: "block", fontSize: "12px", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "8px" }}>Avec les heureux parents</span>
            {CONFIG.groomFamily}<br />
            {CONFIG.brideFamily}
          </p>
          <div className="ornament" style={{ marginTop: "20px" }}>✦</div>
        </section>

        <footer className="inv-footer">
          ✦ &nbsp; {CONFIG.groom} &amp; {CONFIG.bride} &nbsp; ✦<br />
          <span style={{ color: "#2a1f0e" }}>{CONFIG.dateDisplay}</span>
        </footer>
      </div>

      {/* Music toggle (only if bgMusic set) */}
      {CONFIG.bgMusic && (
        <button className="music-btn" onClick={toggleMusic} title="Musique">
          {playing ? "⏸" : "♪"}
        </button>
      )}
    </>
  );
}

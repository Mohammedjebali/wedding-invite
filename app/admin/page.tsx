"use client";
import { useState, useEffect } from "react";

interface RSVP {
  id: string;
  name: string;
  phone: string;
  attending: string;
  guests: string;
  createdAt: string;
}

export default function AdminPage() {
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRSVPs();
  }, []);

  async function fetchRSVPs() {
    setLoading(true);
    try {
      const res = await fetch("/api/rsvp");
      const data = await res.json();
      setRsvps(data);
    } catch {
      alert("Failed to fetch RSVPs");
    } finally {
      setLoading(false);
    }
  }

  const totalAttending = rsvps.filter(r => r.attending === "oui").reduce((sum, r) => sum + parseInt(r.guests || "1"), 0);
  const totalDeclined = rsvps.filter(r => r.attending === "non").length;

  return (
    <div style={{ minHeight: "100vh", background: "#1a1a2e", color: "#e6e8ee", fontFamily: "sans-serif", padding: "40px 20px" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <h1 style={{ color: "#e8c547", fontSize: "24px" }}>💌 Wedding RSVP Dashboard</h1>
          <button onClick={fetchRSVPs} style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #e8c547", background: "transparent", color: "#e8c547", cursor: "pointer" }}>🔄 Refresh</button>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "30px" }}>
          <div style={{ background: "#16213e", padding: "20px", borderRadius: "10px", textAlign: "center" }}>
            <div style={{ fontSize: "28px", fontWeight: "bold", color: "#4ade80" }}>{rsvps.filter(r => r.attending === "oui").length}</div>
            <div style={{ fontSize: "12px", color: "#a0a4ae", marginTop: "4px" }}>Attending</div>
          </div>
          <div style={{ background: "#16213e", padding: "20px", borderRadius: "10px", textAlign: "center" }}>
            <div style={{ fontSize: "28px", fontWeight: "bold", color: "#e8c547" }}>{totalAttending}</div>
            <div style={{ fontSize: "12px", color: "#a0a4ae", marginTop: "4px" }}>Total Guests</div>
          </div>
          <div style={{ background: "#16213e", padding: "20px", borderRadius: "10px", textAlign: "center" }}>
            <div style={{ fontSize: "28px", fontWeight: "bold", color: "#f87171" }}>{totalDeclined}</div>
            <div style={{ fontSize: "12px", color: "#a0a4ae", marginTop: "4px" }}>Declined</div>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", color: "#a0a4ae" }}>Loading...</div>
        ) : rsvps.length === 0 ? (
          <div style={{ textAlign: "center", color: "#a0a4ae", padding: "40px" }}>No RSVPs yet</div>
        ) : (
          <div style={{ background: "#16213e", borderRadius: "10px", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#0f3460" }}>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#e8c547", textTransform: "uppercase", letterSpacing: "0.05em" }}>Name</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#e8c547", textTransform: "uppercase", letterSpacing: "0.05em" }}>Phone</th>
                  <th style={{ padding: "12px 16px", textAlign: "center", fontSize: "12px", color: "#e8c547", textTransform: "uppercase", letterSpacing: "0.05em" }}>Status</th>
                  <th style={{ padding: "12px 16px", textAlign: "center", fontSize: "12px", color: "#e8c547", textTransform: "uppercase", letterSpacing: "0.05em" }}>Guests</th>
                  <th style={{ padding: "12px 16px", textAlign: "right", fontSize: "12px", color: "#e8c547", textTransform: "uppercase", letterSpacing: "0.05em" }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {rsvps.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((r) => (
                  <tr key={r.id} style={{ borderBottom: "1px solid #1a1a2e" }}>
                    <td style={{ padding: "12px 16px", fontSize: "14px" }}>{r.name}</td>
                    <td style={{ padding: "12px 16px", fontSize: "14px", color: "#a0a4ae" }}>{r.phone || "—"}</td>
                    <td style={{ padding: "12px 16px", textAlign: "center" }}>
                      <span style={{ padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold", background: r.attending === "oui" ? "rgba(74,222,128,0.15)" : "rgba(248,113,113,0.15)", color: r.attending === "oui" ? "#4ade80" : "#f87171" }}>
                        {r.attending === "oui" ? "✓ Yes" : "✗ No"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", textAlign: "center", fontSize: "14px" }}>{r.attending === "oui" ? r.guests : "—"}</td>
                    <td style={{ padding: "12px 16px", textAlign: "right", fontSize: "12px", color: "#a0a4ae" }}>{new Date(r.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

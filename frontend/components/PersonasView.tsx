"use client";
import { useState } from "react";
import { Persona } from "@/lib/api";

const COLORS = ["#4c6ef5","#0f8a6e","#c9503a","#7c3aed"];

export default function PersonasView({ data }: { data: Persona[] }) {
  const [active, setActive] = useState(0);
  const p = data[active];
  if (!p) return null;

  return (
    <div className="step-card" style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 500, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>Step 3 — Buyer personas</div>

      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        {data.map((persona, i) => (
          <button key={i} onClick={() => setActive(i)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", border: `1.5px solid ${active === i ? COLORS[i] : "#e8eaf0"}`, borderRadius: 10, background: active === i ? "#f8f9ff" : "white", cursor: "pointer", flex: 1 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: COLORS[i], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, color: "white", flexShrink: 0 }}>
              {persona.avatar_initials || persona.persona_name?.slice(0,2).toUpperCase()}
            </div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#1a1a2e" }}>{persona.persona_name}</div>
              <div style={{ fontSize: 11, color: "#9ca3af" }}>{persona.role?.titles?.[0]}</div>
            </div>
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <Block title="Day in their life">
            <p style={{ fontSize: 13, color: "#4b5563", lineHeight: 1.7 }}>{p.day_in_their_life}</p>
          </Block>
          <Block title="Goals + KPIs" style={{ marginTop: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: "#1a1a2e", marginBottom: 6 }}>{p.goals?.primary}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 6 }}>
              {p.kpis?.map((k, i) => <span key={i} style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20, background: "#f1f3f5", color: "#374151" }}>{k}</span>)}
            </div>
          </Block>
          <Block title="What they actually want" style={{ marginTop: 12 }}>
            <div style={{ fontSize: 13, color: "#4b5563", marginBottom: 4 }}><strong style={{ color: "#1a1a2e" }}>Now:</strong> {p.desires?.immediate}</div>
            <div style={{ fontSize: 13, color: "#4b5563" }}><strong style={{ color: "#1a1a2e" }}>In 3 years:</strong> {p.desires?.aspirational}</div>
          </Block>
        </div>

        <div>
          <Block title="Pain points">
            <div style={{ fontSize: 12, fontWeight: 500, color: "#b91c1c", marginBottom: 4 }}>Emotional</div>
            {p.pain_points?.emotional?.map((p2, i) => <div key={i} style={{ fontSize: 13, color: "#4b5563", padding: "4px 0", borderBottom: "1px solid #f3f4f6" }}>{p2}</div>)}
            <div style={{ fontSize: 12, fontWeight: 500, color: "#374151", margin: "10px 0 4px" }}>Operational</div>
            {p.pain_points?.operational?.map((p2, i) => <div key={i} style={{ fontSize: 13, color: "#4b5563", padding: "4px 0", borderBottom: "1px solid #f3f4f6" }}>{p2}</div>)}
          </Block>
          <Block title="Objections" style={{ marginTop: 12 }}>
            {p.objections?.map((o, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 13, color: "#1a1a2e", fontStyle: "italic" }}>"{o.objection}"</div>
                <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>Really means: {o.real_reason}</div>
              </div>
            ))}
          </Block>
          <Block title="Buying trigger" style={{ marginTop: 12, background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
            <p style={{ fontSize: 13, color: "#166534", lineHeight: 1.6 }}>{p.buying_trigger}</p>
          </Block>
        </div>
      </div>

      <div style={{ marginTop: 16, background: "#f8f9fc", borderRadius: 8, padding: "12px 14px" }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Language that resonates</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {p.language?.resonant_phrases?.map((ph, i) => (
            <span key={i} style={{ fontSize: 12, padding: "4px 12px", borderRadius: 20, background: "#dbe4ff", color: "#2f4ac2" }}>"{ph}"</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Block({ title, children, style }: { title: string; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: "white", border: "1px solid #e8eaf0", borderRadius: 10, padding: "12px 14px", ...style }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 8 }}>{title}</div>
      {children}
    </div>
  );
}

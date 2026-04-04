"use client";
import { Research } from "@/lib/api";

const severityColor = (s: string) =>
  s === "high" ? "badge-coral" : s === "medium" ? "badge-amber" : "badge-gray";

export default function ResearchView({ data }: { data: Research }) {
  return (
    <div className="step-card" style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 500, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Step 1 — Market research</div>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: "#1a1a2e" }}>{data.industry_overview?.summary?.split(" ").slice(0, 6).join(" ")}…</h2>
        </div>
        <span className={`badge badge-${data.industry_overview?.maturity_stage === "growing" ? "green" : data.industry_overview?.maturity_stage === "mature" ? "blue" : "amber"}`}>
          {data.industry_overview?.maturity_stage}
        </span>
      </div>

      <p style={{ fontSize: 14, color: "#4b5563", lineHeight: 1.7, marginBottom: 20 }}>{data.industry_overview?.summary}</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Section title="Key pain points">
          {data.pain_points?.slice(0, 5).map((p, i) => (
            <div key={i} style={{ padding: "10px 0", borderBottom: "1px solid #f3f4f6" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                <span className={`badge ${severityColor(p.severity)}`} style={{ marginTop: 2, flexShrink: 0 }}>{p.severity}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "#1a1a2e", marginBottom: 2 }}>{p.pain}</div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>{p.emotional_weight}</div>
                </div>
              </div>
            </div>
          ))}
        </Section>

        <Section title="Buying triggers">
          {data.buying_triggers?.map((t, i) => (
            <div key={i} style={{ padding: "10px 0", borderBottom: "1px solid #f3f4f6" }}>
              <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <span className={`badge ${t.urgency === "high" ? "badge-coral" : "badge-gray"}`} style={{ marginTop: 2, flexShrink: 0 }}>{t.urgency}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "#1a1a2e" }}>{t.trigger}</div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>{t.example}</div>
                </div>
              </div>
            </div>
          ))}
        </Section>

        <Section title="Market trends">
          {data.trends?.map((t, i) => (
            <div key={i} style={{ padding: "8px 0", borderBottom: "1px solid #f3f4f6" }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#1a1a2e", marginBottom: 2 }}>{t.trend}</div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>{t.sales_relevance}</div>
            </div>
          ))}
        </Section>

        <Section title="Common objections">
          {data.objections?.map((o, i) => (
            <div key={i} style={{ padding: "8px 0", borderBottom: "1px solid #f3f4f6" }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#1a1a2e", marginBottom: 2 }}>"{o.objection}"</div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>Counter: {o.counter}</div>
            </div>
          ))}
        </Section>
      </div>

      <div style={{ marginTop: 16, background: "#f8f9fc", borderRadius: 8, padding: "12px 14px" }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: "#374151", marginBottom: 8 }}>Market opportunities</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
          {data.market_opportunities?.map((o, i) => (
            <div key={i} style={{ background: "white", border: "1px solid #e8eaf0", borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#1a1a2e", marginBottom: 4 }}>{o.opportunity}</div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>{o.reasoning}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>{title}</div>
      {children}
    </div>
  );
}

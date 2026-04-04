"use client";
import { Campaign, CampaignAngle } from "@/lib/api";

const ANGLE_COLORS: Record<string, string> = {
  "pain-based": "#fee2e2",
  "opportunity-based": "#d3f9d8",
  "competitor-based": "#dbe4ff",
  "data-driven": "#fff3cd",
  "curiosity-based": "#f3e8ff",
  "authority-based": "#e0f2fe",
};
const ANGLE_TEXT: Record<string, string> = {
  "pain-based": "#991b1b",
  "opportunity-based": "#1a7431",
  "competitor-based": "#2f4ac2",
  "data-driven": "#7c5a00",
  "curiosity-based": "#6b21a8",
  "authority-based": "#0c4a6e",
};

export default function CampaignView({ data, onAngleSelect, selectedAngle }: { data: Campaign; onAngleSelect: (a: string) => void; selectedAngle: string }) {
  const sorted = [...(data.recommended_angles || [])].sort((a, b) => a.performance_rank - b.performance_rank);

  return (
    <div className="step-card" style={{ marginBottom: 16 }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Step 4 — Campaign strategy</div>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: "#1a1a2e" }}>Recommended approach</h2>
        <p style={{ fontSize: 14, color: "#4b5563", marginTop: 6 }}>{data.top_recommendation?.reasoning}</p>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 10 }}>Campaign angles — ranked by expected performance</div>
        <div style={{ display: "grid", gap: 8 }}>
          {sorted.map((angle, i) => (
            <AngleCard key={i} angle={angle} rank={i + 1} selected={selectedAngle === angle.angle_type} onSelect={() => onAngleSelect(angle.angle_type)} />
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 8 }}>Offer suggestions</div>
          {data.offer_suggestions?.map((o, i) => (
            <div key={i} style={{ padding: "10px 12px", border: "1px solid #e8eaf0", borderRadius: 8, marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: "#1a1a2e" }}>{o.offer_name}</div>
                <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 10, background: o.friction_level === "low" ? "#d3f9d8" : "#fff3cd", color: o.friction_level === "low" ? "#1a7431" : "#7c5a00" }}>{o.friction_level} friction</span>
              </div>
              <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>{o.description}</div>
              <div style={{ fontSize: 12, color: "#4c6ef5", fontWeight: 500 }}>CTA: "{o.cta_text}"</div>
            </div>
          ))}
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 8 }}>Lead magnets</div>
          {data.lead_magnets?.map((lm, i) => (
            <div key={i} style={{ padding: "10px 12px", border: "1px solid #e8eaf0", borderRadius: 8, marginBottom: 8 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 10, background: "#dbe4ff", color: "#2f4ac2" }}>{lm.format}</span>
                <div style={{ fontSize: 13, fontWeight: 500, color: "#1a1a2e" }}>{lm.name}</div>
              </div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>{lm.why_they_want_it}</div>
            </div>
          ))}
          <div style={{ background: "#f8f9fc", borderRadius: 8, padding: "10px 12px", marginTop: 4 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: "#374151", marginBottom: 4 }}>Best send days</div>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              {data.campaign_calendar?.best_send_days?.map((d, i) => (
                <span key={i} style={{ fontSize: 12, padding: "2px 10px", borderRadius: 20, background: "white", border: "1px solid #e8eaf0", color: "#374151" }}>{d}</span>
              ))}
            </div>
            <div style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>{data.campaign_calendar?.best_send_times}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AngleCard({ angle, rank, selected, onSelect }: { angle: CampaignAngle; rank: number; selected: boolean; onSelect: () => void }) {
  const bg = ANGLE_COLORS[angle.angle_type] || "#f1f3f5";
  const tc = ANGLE_TEXT[angle.angle_type] || "#374151";
  return (
    <div onClick={onSelect} style={{ border: `1.5px solid ${selected ? "#4c6ef5" : "#e8eaf0"}`, borderRadius: 10, padding: "12px 14px", cursor: "pointer", background: selected ? "#f0f4ff" : "white", transition: "all 0.15s" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <div style={{ width: 24, height: 24, borderRadius: "50%", background: rank <= 2 ? "#4c6ef5" : "#e8eaf0", color: rank <= 2 ? "white" : "#6b7280", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
          {rank}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: "#1a1a2e" }}>{angle.angle_name}</span>
            <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 10, background: bg, color: tc }}>{angle.angle_type}</span>
            {selected && <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 10, background: "#dbe4ff", color: "#2f4ac2" }}>selected</span>}
          </div>
        </div>
        <div style={{ fontSize: 12, fontWeight: 500, color: "#059669" }}>{angle.expected_reply_rate}</div>
      </div>
      <div style={{ fontSize: 12, color: "#4b5563", marginBottom: 6 }}>{angle.core_premise}</div>
      <div style={{ fontSize: 12, color: "#6b7280", background: "#f8f9fc", borderRadius: 6, padding: "8px 10px", fontStyle: "italic" }}>
        Hook: "{angle.hook_example}"
      </div>
    </div>
  );
}

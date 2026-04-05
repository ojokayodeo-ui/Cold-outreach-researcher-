"use client";
import { ICP } from "@/lib/api";

export default function ICPView({ data }: { data: ICP }) {
  const f = data.firmographics || {};
  return (
    <div className="step-card" style={{ marginBottom: 16 }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Step 2 — Ideal customer profile</div>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: "var(--text-primary)" }}>{data.segment_name}</h2>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 6, lineHeight: 1.6 }}>{data.segment_description}</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 20 }}>
        <Metric label="Employees" value={`${f.employee_range?.min}–${f.employee_range?.max}`} />
        <Metric label="Revenue" value={`${f.revenue_range?.min} – ${f.revenue_range?.max}`} />
        <Metric label="Geographies" value={f.geographies?.join(", ")} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <div>
          <Label>Industries targeted</Label>
          <TagList items={f.industries} color="blue" />
        </div>
        <div>
          <Label>Business models</Label>
          <TagList items={f.business_models} color="gray" />
        </div>
        <div>
          <Label>Ownership types</Label>
          <TagList items={f.ownership} color="gray" />
        </div>
        <div>
          <Label>Buying readiness signals</Label>
          {data.buying_readiness_signals?.map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 6, alignItems: "flex-start", marginBottom: 6 }}>
              <span style={{ fontSize: 11, padding: "2px 7px", borderRadius: 10, background: s.strength === "strong" ? "var(--green-bg)" : "var(--gray-bg)", color: s.strength === "strong" ? "var(--green-text)" : "var(--text-muted)", flexShrink: 0, marginTop: 1 }}>{s.strength}</span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-primary)" }}>{s.signal}</div>
                <div style={{ fontSize: 11, color: "var(--text-faint)" }}>Find on: {s.where_to_find}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "var(--red-subtle)", border: "1px solid var(--red-border)", borderRadius: 10, padding: "12px 16px" }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--red-strong)", marginBottom: 8 }}>Who NOT to target</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
          {data.exclusions?.who_not_to_target?.map((e, i) => (
            <span key={i} style={{ fontSize: 12, padding: "3px 10px", borderRadius: 20, background: "var(--red-tag-bg)", color: "var(--red-tag-text)" }}>{e}</span>
          ))}
        </div>
        <div style={{ fontSize: 12, color: "var(--red-dark)" }}>{data.exclusions?.reasoning}</div>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value?: string }) {
  return (
    <div style={{ background: "var(--surface-muted)", borderRadius: 8, padding: "10px 12px" }}>
      <div style={{ fontSize: 11, color: "var(--text-faint)", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text-primary)" }}>{value || "—"}</div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-label)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 8 }}>{children}</div>;
}

function TagList({ items, color }: { items?: string[]; color: "blue" | "gray" }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 8 }}>
      {items?.map((item, i) => (
        <span key={i} style={{ fontSize: 12, padding: "3px 10px", borderRadius: 20, background: color === "blue" ? "var(--brand-100)" : "var(--gray-bg)", color: color === "blue" ? "var(--brand-text)" : "var(--gray-text)" }}>{item}</span>
      ))}
    </div>
  );
}

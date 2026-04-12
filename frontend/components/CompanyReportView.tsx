"use client";
import { ProspectReport } from "@/lib/api";

interface Props {
  data: ProspectReport;
  url: string;
}

function downloadReport(data: ProspectReport, url: string) {
  const { company_snapshot: cs, outreach_intelligence: oi, personalized_emails, linkedin_messages: li, research_notes: rn } = data;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>Prospect Report — ${cs.company_name}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1a1a2e; background: #fff; padding: 40px; font-size: 13px; line-height: 1.6; }
  h1 { font-size: 22px; font-weight: 700; color: #1a1a2e; margin-bottom: 4px; }
  h2 { font-size: 14px; font-weight: 600; color: #4c6ef5; text-transform: uppercase; letter-spacing: 0.5px; margin: 28px 0 10px; border-bottom: 1px solid #e8eaf0; padding-bottom: 6px; }
  h3 { font-size: 13px; font-weight: 600; color: #1a1a2e; margin: 12px 0 4px; }
  p { margin-bottom: 6px; }
  .meta { color: #6b7280; font-size: 12px; margin-bottom: 24px; }
  .tag { display: inline-block; background: #f0f4ff; color: #3b5bdb; border-radius: 4px; padding: 2px 8px; font-size: 11px; font-weight: 500; margin: 2px; }
  .card { background: #f8f9fc; border: 1px solid #e8eaf0; border-radius: 8px; padding: 14px 16px; margin-bottom: 10px; }
  .email-card { border: 1px solid #e8eaf0; border-radius: 8px; padding: 16px; margin-bottom: 12px; }
  .email-subject { font-weight: 600; font-size: 14px; color: #1a1a2e; margin-bottom: 2px; }
  .email-meta { font-size: 11px; color: #9ca3af; margin-bottom: 10px; }
  .email-body { background: #f8f9fc; border-radius: 6px; padding: 12px; font-size: 13px; white-space: pre-wrap; line-height: 1.7; }
  .email-note { font-size: 11px; color: #6b7280; margin-top: 8px; font-style: italic; }
  .cta-badge { display: inline-block; background: #dcfce7; color: #15803d; border-radius: 4px; padding: 2px 8px; font-size: 11px; margin-top: 8px; }
  .avoid { color: #b91c1c; background: #fff5f5; border: 1px solid #fecaca; border-radius: 6px; padding: 8px 12px; margin-bottom: 6px; font-size: 12px; }
  .hook-card { border-left: 3px solid #4c6ef5; padding: 8px 12px; margin-bottom: 8px; background: #f0f4ff; border-radius: 0 6px 6px 0; }
  .pain-card { border-left: 3px solid #f59e0b; padding: 8px 12px; margin-bottom: 8px; background: #fffbeb; border-radius: 0 6px 6px 0; }
  .li-card { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 14px; margin-bottom: 10px; }
  .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e8eaf0; font-size: 11px; color: #9ca3af; }
  @media print {
    body { padding: 20px; }
    @page { margin: 1.5cm; size: A4; }
    .email-card, .card { break-inside: avoid; }
  }
</style>
</head>
<body>
<h1>Prospect Report: ${cs.company_name}</h1>
<p class="meta">Source: ${url} &nbsp;·&nbsp; ${cs.industry} &nbsp;·&nbsp; ${cs.company_stage}</p>

<h2>Company Snapshot</h2>
<div class="card">
  <p><strong>What they do:</strong> ${cs.what_they_do}</p>
  <p style="margin-top:8px;"><strong>Positioning:</strong> ${cs.positioning_statement}</p>
  <p style="margin-top:10px;"><strong>Key offerings:</strong></p>
  <div style="margin-top:4px;">${cs.key_offerings.map(o => `<span class="tag">${o}</span>`).join('')}</div>
</div>

<h2>Outreach Intelligence</h2>

<h3>Inferred Pain Points</h3>
${oi.inferred_pain_points.map(pp => `
<div class="pain-card">
  <p><strong>${pp.pain}</strong></p>
  <p style="font-size:12px;color:#78350f;margin-top:4px;">Evidence: ${pp.evidence}</p>
  <p style="font-size:12px;color:#92400e;margin-top:2px;">How to use: ${pp.how_to_use}</p>
</div>`).join('')}

<h3>Personalised Hooks</h3>
${oi.personalized_hooks.map(h => `
<div class="hook-card">
  <p style="font-style:italic;">"${h.hook}"</p>
  <p style="font-size:11px;color:#3730a3;margin-top:4px;">Source: ${h.source}</p>
</div>`).join('')}

<h3>Best Angle</h3>
<div class="card"><p>${oi.best_angle}</p></div>

<h3>Things to Avoid</h3>
${oi.avoid_these.map(a => `<div class="avoid">${a}</div>`).join('')}

<h2>Personalised Email Sequence</h2>
${personalized_emails.map(e => `
<div class="email-card">
  <div class="email-subject">Email ${e.email_number} — ${e.subject_line}</div>
  <div class="email-meta">Day ${e.send_day} &nbsp;·&nbsp; Preview: ${e.preview_text}</div>
  <div class="email-body">${e.body}</div>
  <div class="cta-badge">CTA: ${e.cta}</div>
  <div class="email-note">Personalisation: ${e.personalization_note}</div>
</div>`).join('')}

<h2>LinkedIn Messages</h2>
<div class="li-card">
  <h3>Connection Request</h3>
  <p style="margin-top:6px;font-style:italic;">"${li.connection_request}"</p>
</div>
<div class="li-card">
  <h3>Follow-up DM</h3>
  <p style="margin-top:6px;font-style:italic;">"${li.follow_up_dm}"</p>
</div>

<h2>Research Notes</h2>
<div class="card">
  <p><strong>Estimated research time:</strong> ${rn.estimated_research_time}</p>
  ${rn.key_facts_found.length > 0 ? `
  <p style="margin-top:10px;"><strong>Key facts from website:</strong></p>
  <ul style="margin-top:4px;padding-left:18px;">
    ${rn.key_facts_found.map(f => `<li style="margin-bottom:3px;">${f}</li>`).join('')}
  </ul>` : ''}
  ${rn.additional_research_to_do.length > 0 ? `
  <p style="margin-top:10px;"><strong>Additional research to do:</strong></p>
  <ul style="margin-top:4px;padding-left:18px;">
    ${rn.additional_research_to_do.map(r => `<li style="margin-bottom:3px;">${r}</li>`).join('')}
  </ul>` : ''}
</div>

<div class="footer">Generated by Outreach Intelligence · ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
</body>
</html>`;

  const w = window.open('', '_blank');
  if (!w) return;
  w.document.write(html);
  w.document.close();
  w.focus();
  setTimeout(() => w.print(), 400);
}

const S = {
  card: {
    background: "white",
    border: "1px solid #e8eaf0",
    borderRadius: 12,
    padding: "20px 24px",
    marginBottom: 16,
  } as React.CSSProperties,
  sectionTitle: {
    fontSize: 11,
    fontWeight: 600,
    color: "#4c6ef5",
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
    marginBottom: 12,
  },
  tag: {
    display: "inline-block",
    background: "#f0f4ff",
    color: "#3b5bdb",
    borderRadius: 5,
    padding: "2px 10px",
    fontSize: 12,
    fontWeight: 500,
    margin: "2px 3px 2px 0",
  },
};

export default function CompanyReportView({ data, url }: Props) {
  const { company_snapshot: cs, outreach_intelligence: oi, personalized_emails, linkedin_messages: li, research_notes: rn } = data;

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1a1a2e", marginBottom: 4 }}>
            Prospect Report: {cs.company_name}
          </h2>
          <p style={{ fontSize: 13, color: "#6b7280" }}>
            {cs.industry} · {cs.company_stage} · <span style={{ color: "#9ca3af" }}>{url}</span>
          </p>
        </div>
        <button
          onClick={() => downloadReport(data, url)}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "10px 20px", background: "#4c6ef5", color: "white",
            border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600,
            cursor: "pointer", whiteSpace: "nowrap",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 2v8M5 7l3 3 3-3M2 12h12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Download Report
        </button>
      </div>

      {/* Company Snapshot */}
      <div style={S.card}>
        <div style={S.sectionTitle}>Company Snapshot</div>
        <p style={{ fontSize: 14, color: "#374151", marginBottom: 8 }}>{cs.what_they_do}</p>
        <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 12 }}>{cs.positioning_statement}</p>
        <div>{cs.key_offerings.map((o, i) => <span key={i} style={S.tag}>{o}</span>)}</div>
      </div>

      {/* Outreach Intelligence */}
      <div style={S.card}>
        <div style={S.sectionTitle}>Outreach Intelligence</div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a2e", marginBottom: 8 }}>Inferred Pain Points</div>
          {oi.inferred_pain_points.map((pp, i) => (
            <div key={i} style={{ borderLeft: "3px solid #f59e0b", background: "#fffbeb", borderRadius: "0 8px 8px 0", padding: "10px 14px", marginBottom: 8 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#92400e", marginBottom: 3 }}>{pp.pain}</div>
              <div style={{ fontSize: 12, color: "#78350f", marginBottom: 2 }}>Evidence: {pp.evidence}</div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>How to use: {pp.how_to_use}</div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a2e", marginBottom: 8 }}>Personalised Hooks</div>
          {oi.personalized_hooks.map((h, i) => (
            <div key={i} style={{ borderLeft: "3px solid #4c6ef5", background: "#f0f4ff", borderRadius: "0 8px 8px 0", padding: "10px 14px", marginBottom: 8 }}>
              <div style={{ fontSize: 13, fontStyle: "italic", color: "#1a1a2e", marginBottom: 4 }}>"{h.hook}"</div>
              <div style={{ fontSize: 11, color: "#3730a3" }}>Source: {h.source}</div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a2e", marginBottom: 8 }}>Best Angle for This Prospect</div>
          <div style={{ background: "#f8f9fc", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#374151" }}>{oi.best_angle}</div>
        </div>

        {oi.avoid_these.length > 0 && (
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a2e", marginBottom: 8 }}>Things to Avoid</div>
            {oi.avoid_these.map((a, i) => (
              <div key={i} style={{ background: "#fff5f5", border: "1px solid #fecaca", borderRadius: 6, padding: "7px 12px", fontSize: 12, color: "#b91c1c", marginBottom: 5 }}>{a}</div>
            ))}
          </div>
        )}
      </div>

      {/* Emails */}
      <div style={S.card}>
        <div style={S.sectionTitle}>Personalised Email Sequence</div>
        {personalized_emails.map((email, i) => (
          <div key={i} style={{ border: "1px solid #e8eaf0", borderRadius: 10, padding: "16px", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4, flexWrap: "wrap", gap: 6 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#1a1a2e" }}>Email {email.email_number} — {email.subject_line}</span>
              <span style={{ fontSize: 11, color: "#9ca3af" }}>Day {email.send_day}</span>
            </div>
            <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 10 }}>Preview: {email.preview_text}</div>
            <div style={{ background: "#f8f9fc", borderRadius: 8, padding: "12px 14px", fontSize: 13, color: "#374151", whiteSpace: "pre-wrap", lineHeight: 1.7, marginBottom: 10 }}>
              {email.body}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ background: "#dcfce7", color: "#15803d", borderRadius: 5, padding: "3px 10px", fontSize: 11, fontWeight: 500 }}>CTA: {email.cta}</span>
              <span style={{ fontSize: 11, color: "#6b7280", fontStyle: "italic" }}>Personalisation: {email.personalization_note}</span>
            </div>
          </div>
        ))}
      </div>

      {/* LinkedIn */}
      <div style={S.card}>
        <div style={S.sectionTitle}>LinkedIn Messages</div>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a2e", marginBottom: 6 }}>Connection Request</div>
          <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "12px 14px", fontSize: 13, color: "#374151", fontStyle: "italic" }}>"{li.connection_request}"</div>
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a2e", marginBottom: 6 }}>Follow-up DM</div>
          <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "12px 14px", fontSize: 13, color: "#374151", fontStyle: "italic" }}>"{li.follow_up_dm}"</div>
        </div>
      </div>

      {/* Research Notes */}
      <div style={S.card}>
        <div style={S.sectionTitle}>Research Notes</div>
        <div style={{ fontSize: 13, color: "#374151", marginBottom: 12 }}>
          Estimated research time: <strong>{rn.estimated_research_time}</strong>
        </div>
        {rn.key_facts_found.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a2e", marginBottom: 6 }}>Key facts found</div>
            {rn.key_facts_found.map((f, i) => (
              <div key={i} style={{ fontSize: 13, color: "#374151", padding: "4px 0", borderBottom: "1px solid #f3f4f6" }}>· {f}</div>
            ))}
          </div>
        )}
        {rn.additional_research_to_do.length > 0 && (
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a2e", marginBottom: 6 }}>Additional research to do</div>
            {rn.additional_research_to_do.map((r, i) => (
              <div key={i} style={{ fontSize: 13, color: "#6b7280", padding: "4px 0", borderBottom: "1px solid #f3f4f6" }}>· {r}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

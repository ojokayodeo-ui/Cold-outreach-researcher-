"use client";
import { useState } from "react";
import { Messages, Email } from "@/lib/api";

export default function MessagesView({ data }: { data: Messages }) {
  const [activeEmail, setActiveEmail] = useState(0);
  const [copied, setCopied] = useState<string | null>(null);
  const [tab, setTab] = useState<"email" | "linkedin">("email");

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  const email = data.email_sequence?.[activeEmail];

  return (
    <div className="step-card" style={{ marginBottom: 16 }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Step 5 — Outreach messages</div>
        <div style={{ display: "flex", gap: 8 }}>
          <TabBtn active={tab === "email"} onClick={() => setTab("email")}>Email sequence ({data.email_sequence?.length})</TabBtn>
          <TabBtn active={tab === "linkedin"} onClick={() => setTab("linkedin")}>LinkedIn ({data.linkedin_messages?.length})</TabBtn>
        </div>
      </div>

      {tab === "email" && (
        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {data.email_sequence?.map((e, i) => (
              <button key={i} onClick={() => setActiveEmail(i)} style={{ flex: 1, padding: "10px", border: `1.5px solid ${activeEmail === i ? "#4c6ef5" : "#e8eaf0"}`, borderRadius: 10, background: activeEmail === i ? "#f0f4ff" : "white", cursor: "pointer", textAlign: "left" }}>
                <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 2 }}>Email {i + 1} · Day {e.send_day}</div>
                <div style={{ fontSize: 12, fontWeight: 500, color: "#1a1a2e" }}>{e.email_type}</div>
              </button>
            ))}
          </div>

          {email && (
            <div style={{ border: "1px solid #e8eaf0", borderRadius: 10, overflow: "hidden" }}>
              <div style={{ background: "#f8f9fc", borderBottom: "1px solid #e8eaf0", padding: "12px 16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 4 }}>Subject line</div>
                    <div style={{ fontSize: 15, fontWeight: 500, color: "#1a1a2e" }}>{email.subject_line}</div>
                    <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>Preview: {email.preview_text}</div>
                  </div>
                  <CopyBtn text={`Subject: ${email.subject_line}\n\n${email.body}`} copied={copied === `email-${activeEmail}`} onCopy={() => copy(`Subject: ${email.subject_line}\n\n${email.body}`, `email-${activeEmail}`)} />
                </div>
              </div>

              <div style={{ padding: "16px 20px" }}>
                <div className="prose-email">{email.body}</div>
              </div>

              <div style={{ background: "#f8f9fc", borderTop: "1px solid #e8eaf0", padding: "12px 16px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                <InfoChip label="CTA" value={email.cta} />
                <InfoChip label="Personalise" value={email.personalisation_hook} />
                <InfoChip label="Tone" value={email.tone_notes} />
              </div>
            </div>
          )}

          <div style={{ marginTop: 16, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "12px 16px" }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: "#166534", marginBottom: 8 }}>Personalisation guide</div>
            <div style={{ fontSize: 12, color: "#14532d", marginBottom: 8 }}>Research time per prospect: <strong>{data.personalisation_guide?.research_time_per_prospect}</strong></div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {data.personalisation_guide?.key_signals_to_find?.map((s, i) => (
                <span key={i} style={{ fontSize: 12, padding: "3px 10px", borderRadius: 20, background: "white", border: "1px solid #bbf7d0", color: "#166534" }}>{s}</span>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 10, background: "#f8f9fc", borderRadius: 10, padding: "12px 16px" }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: "#374151", marginBottom: 6 }}>Spam check — {data.spam_check?.estimated_spam_score} risk</div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>{data.spam_check?.deliverability_notes}</div>
          </div>
        </div>
      )}

      {tab === "linkedin" && (
        <div style={{ display: "grid", gap: 12 }}>
          {data.linkedin_messages?.map((msg, i) => (
            <div key={i} style={{ border: "1px solid #e8eaf0", borderRadius: 10, overflow: "hidden" }}>
              <div style={{ background: "#f8f9fc", borderBottom: "1px solid #e8eaf0", padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ fontSize: 12, fontWeight: 500, color: "#1a1a2e" }}>{msg.type}</span>
                  <span style={{ fontSize: 12, color: "#9ca3af", marginLeft: 8 }}>· {msg.when_to_send}</span>
                </div>
                <CopyBtn text={msg.body} copied={copied === `li-${i}`} onCopy={() => copy(msg.body, `li-${i}`)} />
              </div>
              <div style={{ padding: "14px 16px" }}>
                <div className="prose-email">{msg.body}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 20, padding: "14px 16px", background: "#1a1a2e", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 500, color: "white" }}>Ready to launch</div>
          <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>Copy emails to Instantly.ai · Connect the sequence · Set send schedule</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => {
            const allEmails = data.email_sequence?.map(e => `---\nEmail ${e.position} (Day ${e.send_day}) — ${e.email_type}\nSubject: ${e.subject_line}\n\n${e.body}`).join("\n\n");
            copy(allEmails, "all");
          }} style={{ padding: "8px 16px", background: "white", color: "#1a1a2e", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
            {copied === "all" ? "Copied!" : "Copy all emails"}
          </button>
        </div>
      </div>
    </div>
  );
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} style={{ padding: "7px 14px", border: `1.5px solid ${active ? "#4c6ef5" : "#e8eaf0"}`, borderRadius: 8, background: active ? "#f0f4ff" : "white", color: active ? "#3b5bdb" : "#6b7280", fontSize: 13, fontWeight: active ? 500 : 400, cursor: "pointer" }}>
      {children}
    </button>
  );
}

function CopyBtn({ text, copied, onCopy }: { text: string; copied: boolean; onCopy: () => void }) {
  return (
    <button onClick={onCopy} style={{ padding: "6px 12px", border: "1px solid #e8eaf0", borderRadius: 7, background: "white", fontSize: 12, color: copied ? "#059669" : "#6b7280", cursor: "pointer", flexShrink: 0 }}>
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

function InfoChip({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 12, color: "#374151" }}>{value}</div>
    </div>
  );
}

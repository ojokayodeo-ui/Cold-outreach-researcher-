"use client";
import { useState } from "react";
import { streamPipeline, PipelineResult, Research, ICP, Persona, Campaign, Messages } from "@/lib/api";
import ResearchView from "@/components/ResearchView";
import ICPView from "@/components/ICPView";
import PersonasView from "@/components/PersonasView";
import CampaignView from "@/components/CampaignView";
import MessagesView from "@/components/MessagesView";

const STEPS = ["Input", "Research", "ICP", "Personas", "Campaign", "Messages"];

const INDUSTRIES = [
  "Healthcare consulting",
  "Management consulting",
  "Digital transformation consulting",
  "Financial services consulting",
  "HR & organisational consulting",
  "Legal & compliance consulting",
  "Marketing & growth agency",
  "IT & technology consulting",
  "Supply chain consulting",
  "Environmental & ESG consulting",
];

export default function Home() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const [industry, setIndustry] = useState("");
  const [geography, setGeography] = useState("United Kingdom");
  const [companySize, setCompanySize] = useState("5–50 employees");
  const [selectedAngle, setSelectedAngle] = useState("pain-based");

  const [research, setResearch] = useState<Research | null>(null);
  const [icp, setIcp] = useState<ICP | null>(null);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [messages, setMessages] = useState<Messages | null>(null);

  async function handleRun() {
    if (!industry.trim()) { setError("Please enter a target industry."); return; }
    setError("");
    setLoading(true);
    setStep(1);
    setProgress(0);

    try {
      const stream = streamPipeline({ industry, geography, company_size: companySize, selected_angle: selectedAngle });
      for await (const event of stream) {
        if (event.step === "status") {
          setStatus(event.data.message);
          setProgress(Math.round((event.data.step / event.data.total) * 100));
        } else if (event.step === "research") {
          setResearch(event.data);
          setStep(2);
        } else if (event.step === "icp") {
          setIcp(event.data);
          setStep(3);
        } else if (event.step === "personas") {
          setPersonas(event.data.personas);
          setStep(4);
        } else if (event.step === "campaign") {
          setCampaign(event.data);
          setStep(5);
        } else if (event.step === "messages") {
          setMessages(event.data);
          setStep(6);
          setProgress(100);
        } else if (event.step === "error") {
          setError(event.data.message);
        }
      }
    } catch (e: any) {
      setError(e.message || "Something went wrong.");
    } finally {
      setLoading(false);
      setStatus("");
    }
  }

  function reset() {
    setStep(0); setResearch(null); setIcp(null);
    setPersonas([]); setCampaign(null); setMessages(null);
    setError(""); setProgress(0);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fc" }}>
      <nav style={{ background: "white", borderBottom: "1px solid #e8eaf0", padding: "0 2rem", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "#4c6ef5", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 8L6 12L14 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <span style={{ fontWeight: 600, fontSize: 15, color: "#1a1a2e" }}>Outreach Intelligence</span>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {step > 0 && (
            <button onClick={reset} style={{ fontSize: 13, color: "#6b7280", background: "none", border: "1px solid #e8eaf0", borderRadius: 8, padding: "5px 14px", cursor: "pointer" }}>
              New campaign
            </button>
          )}
        </div>
      </nav>

      {step > 0 && (
        <div style={{ background: "white", borderBottom: "1px solid #e8eaf0", padding: "0 2rem" }}>
          <div style={{ display: "flex", gap: 0, overflowX: "auto" }}>
            {STEPS.slice(1).map((s, i) => (
              <div key={s} style={{ padding: "12px 16px", fontSize: 13, fontWeight: step === i + 1 ? 500 : 400, color: step > i ? "#4c6ef5" : step === i + 1 ? "#1a1a2e" : "#9ca3af", borderBottom: step === i + 1 ? "2px solid #4c6ef5" : "2px solid transparent", whiteSpace: "nowrap", cursor: "default" }}>
                {i + 1}. {s}
              </div>
            ))}
          </div>
          {loading && (
            <div style={{ padding: "8px 0 12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#6b7280", marginBottom: 6 }}>
                <span>{status}</span>
                <span>{progress}%</span>
              </div>
              <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
            </div>
          )}
        </div>
      )}

      <main style={{ maxWidth: 860, margin: "0 auto", padding: "2rem 1.5rem" }}>
        {error && (
          <div style={{ background: "#fff5f5", border: "1px solid #fecaca", borderRadius: 10, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: "#b91c1c" }}>
            {error}
          </div>
        )}

        {step === 0 && <InputForm {...{ industry, setIndustry, geography, setGeography, companySize, setCompanySize, selectedAngle, setSelectedAngle, handleRun, loading, error }} />}
        {step >= 2 && research && <ResearchView data={research} />}
        {step >= 3 && icp && <ICPView data={icp} />}
        {step >= 4 && personas.length > 0 && <PersonasView data={personas} />}
        {step >= 5 && campaign && <CampaignView data={campaign} onAngleSelect={setSelectedAngle} selectedAngle={selectedAngle} />}
        {step >= 6 && messages && <MessagesView data={messages} />}

        {loading && step >= 2 && (
          <div className="step-card" style={{ opacity: 0.5 }}>
            <div className="skeleton" style={{ height: 16, width: "40%", marginBottom: 12 }} />
            <div className="skeleton" style={{ height: 12, width: "80%", marginBottom: 8 }} />
            <div className="skeleton" style={{ height: 12, width: "60%" }} />
          </div>
        )}
      </main>
    </div>
  );
}

function InputForm({ industry, setIndustry, geography, setGeography, companySize, setCompanySize, selectedAngle, setSelectedAngle, handleRun, loading, error }: any) {
  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: "2.5rem", paddingTop: "1rem" }}>
        <h1 style={{ fontSize: 28, fontWeight: 600, color: "#1a1a2e", marginBottom: 10 }}>Cold Outreach Intelligence</h1>
        <p style={{ fontSize: 15, color: "#6b7280", maxWidth: 480, margin: "0 auto" }}>
          Enter a target market. Get a complete campaign — research, ICP, personas, angles, and ready-to-send emails.
        </p>
      </div>

      <div className="step-card" style={{ maxWidth: 560, margin: "0 auto" }}>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 6 }}>Target industry</label>
          <input
            list="industries"
            value={industry}
            onChange={e => setIndustry(e.target.value)}
            placeholder="e.g. Healthcare consulting, UK, 5–20 employees"
            style={{ width: "100%", padding: "10px 14px", border: "1px solid #e8eaf0", borderRadius: 8, fontSize: 14, outline: "none", background: "white" }}
            onKeyDown={e => e.key === "Enter" && handleRun()}
          />
          <datalist id="industries">{INDUSTRIES.map(i => <option key={i} value={i} />)}</datalist>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 6 }}>Geography</label>
            <select value={geography} onChange={e => setGeography(e.target.value)} style={{ width: "100%", padding: "10px 14px", border: "1px solid #e8eaf0", borderRadius: 8, fontSize: 14, background: "white" }}>
              <option>United Kingdom</option>
              <option>United States</option>
              <option>Canada</option>
              <option>Australia</option>
              <option>Europe (broad)</option>
              <option>Global</option>
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 6 }}>Company size</label>
            <select value={companySize} onChange={e => setCompanySize(e.target.value)} style={{ width: "100%", padding: "10px 14px", border: "1px solid #e8eaf0", borderRadius: 8, fontSize: 14, background: "white" }}>
              <option>1–10 employees</option>
              <option>5–50 employees</option>
              <option>10–100 employees</option>
              <option>50–500 employees</option>
              <option>500+ employees</option>
            </select>
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 8 }}>Primary campaign angle</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {["pain-based","opportunity-based","competitor-based","data-driven","curiosity-based","authority-based"].map(a => (
              <button key={a} onClick={() => setSelectedAngle(a)} style={{ padding: "8px 10px", border: `1.5px solid ${selectedAngle === a ? "#4c6ef5" : "#e8eaf0"}`, borderRadius: 8, fontSize: 12, cursor: "pointer", background: selectedAngle === a ? "#f0f4ff" : "white", color: selectedAngle === a ? "#3b5bdb" : "#6b7280", fontWeight: selectedAngle === a ? 500 : 400, textTransform: "capitalize" }}>
                {a.replace("-", " ")}
              </button>
            ))}
          </div>
        </div>

        <button onClick={handleRun} disabled={loading || !industry.trim()} style={{ width: "100%", padding: "12px", background: loading || !industry.trim() ? "#c7d2fe" : "#4c6ef5", color: "white", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: loading || !industry.trim() ? "not-allowed" : "pointer", transition: "background 0.15s" }}>
          {loading ? "Generating campaign…" : "Generate campaign →"}
        </button>

        <p style={{ textAlign: "center", fontSize: 12, color: "#9ca3af", marginTop: 12 }}>
          Takes 60–90 seconds · All 5 steps run automatically
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, maxWidth: 560, margin: "2rem auto 0" }}>
        {[["Research", "Market trends, pain points, buying triggers"], ["ICP + Personas", "Ideal customer profile and decision-maker archetypes"], ["Outreach", "Email sequences and LinkedIn messages, ready to send"]].map(([t, d]) => (
          <div key={t} style={{ background: "white", border: "1px solid #e8eaf0", borderRadius: 10, padding: "14px" }}>
            <div style={{ fontWeight: 500, fontSize: 13, color: "#1a1a2e", marginBottom: 4 }}>{t}</div>
            <div style={{ fontSize: 12, color: "#9ca3af", lineHeight: 1.5 }}>{d}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

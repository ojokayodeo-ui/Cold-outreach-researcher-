const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface PipelineInput {
  industry: string;
  geography: string;
  company_size: string;
  selected_angle?: string;
}

export interface PipelineResult {
  industry: string;
  geography: string;
  company_size: string;
  research: Research;
  icp: ICP;
  personas: Persona[];
  campaign: Campaign;
  messages: Messages;
}

export interface Research {
  industry_overview: { summary: string; maturity_stage: string; market_size_estimate: string };
  trends: { trend: string; description: string; sales_relevance: string }[];
  pain_points: { pain: string; severity: string; emotional_weight: string; trigger: string }[];
  buying_triggers: { trigger: string; example: string; urgency: string }[];
  competitors: { name: string; positioning: string; weakness: string }[];
  objections: { objection: string; root_cause: string; counter: string }[];
  market_opportunities: { opportunity: string; reasoning: string; target_profile: string }[];
}

export interface ICP {
  segment_name: string;
  segment_description: string;
  firmographics: {
    industries: string[];
    employee_range: { min: number; max: number };
    revenue_range: { min: string; max: string; currency: string };
    geographies: string[];
    business_models: string[];
    ownership: string[];
  };
  buying_readiness_signals: { signal: string; where_to_find: string; strength: string }[];
  exclusions: { who_not_to_target: string[]; red_flags: string[]; reasoning: string };
  fit_score_criteria: { criterion: string; weight: string; how_to_assess: string }[];
}

export interface Persona {
  persona_name: string;
  avatar_initials: string;
  role: { titles: string[]; seniority: string };
  day_in_their_life: string;
  goals: { primary: string; secondary: string[]; career_ambition: string };
  kpis: string[];
  pain_points: { operational: string[]; emotional: string[] };
  desires: { immediate: string; aspirational: string };
  objections: { objection: string; real_reason: string }[];
  decision_making: { style: string; process: string };
  language: { words_they_use: string[]; resonant_phrases: string[] };
  buying_trigger: string;
}

export interface CampaignAngle {
  angle_type: string;
  angle_name: string;
  core_premise: string;
  why_it_works: string;
  when_to_use: string;
  expected_reply_rate: string;
  performance_rank: number;
  hook_example: string;
  risk: string;
}

export interface Campaign {
  recommended_angles: CampaignAngle[];
  top_recommendation: { primary_angle: string; secondary_angle: string; reasoning: string };
  offer_suggestions: { offer_name: string; offer_type: string; description: string; friction_level: string; cta_text: string }[];
  lead_magnets: { name: string; format: string; topic: string; why_they_want_it: string }[];
  campaign_calendar: { best_send_days: string[]; best_send_times: string; sequence_spacing: string };
}

export interface Email {
  position: number;
  send_day: number;
  email_type: string;
  subject_line: string;
  preview_text: string;
  body: string;
  personalisation_hook: string;
  cta: string;
  word_count: number;
  tone_notes: string;
}

export interface Messages {
  email_sequence: Email[];
  linkedin_messages: { type: string; body: string; when_to_send: string }[];
  personalisation_guide: { research_time_per_prospect: string; key_signals_to_find: string[]; hook_templates: { trigger: string; hook: string }[] };
  spam_check: { spam_trigger_words_avoided: string[]; estimated_spam_score: string; deliverability_notes: string };
}

export async function runPipeline(input: PipelineInput): Promise<PipelineResult> {
  const res = await fetch(`${API}/api/pipeline/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(err.detail || "Pipeline failed");
  }
  return res.json();
}

export type StreamStep =
  | { step: "status"; data: { message: string; step: number; total: number } }
  | { step: "research"; data: Research }
  | { step: "icp"; data: ICP }
  | { step: "personas"; data: { personas: Persona[] } }
  | { step: "campaign"; data: Campaign }
  | { step: "messages"; data: Messages }
  | { step: "complete"; data: { message: string } }
  | { step: "error"; data: { message: string } };

export async function* streamPipeline(input: PipelineInput): AsyncGenerator<StreamStep> {
  const res = await fetch(`${API}/api/pipeline/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Stream failed to start");
  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n\n");
    buffer = lines.pop() || "";
    for (const line of lines) {
      if (line.startsWith("data: ")) {
        try {
          yield JSON.parse(line.slice(6)) as StreamStep;
        } catch {}
      }
    }
  }
}

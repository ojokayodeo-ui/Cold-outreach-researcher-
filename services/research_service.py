from services.claude_service import call_claude_json

SYSTEM = """You are a world-class B2B market research analyst specialising in identifying
sales opportunities. You produce structured, actionable intelligence reports used by
outbound sales teams to craft high-converting cold outreach campaigns.

Always respond with deeply specific, realistic insights — never generic filler.
Prioritise emotional and operational pain points over surface-level observations."""

def generate_research(industry: str, geography: str, company_size: str) -> dict:
    prompt = f"""Conduct a deep market intelligence analysis for the following target:

Industry: {industry}
Geography: {geography}
Company size: {company_size}

Return a JSON object with exactly this structure:
{{
  "industry_overview": {{
    "summary": "2-3 sentence overview of the industry right now",
    "maturity_stage": "emerging | growing | mature | declining",
    "market_size_estimate": "rough estimate with context"
  }},
  "trends": [
    {{"trend": "trend name", "description": "2 sentences", "sales_relevance": "why this matters for outreach"}}
  ],
  "pain_points": [
    {{"pain": "specific pain point", "severity": "high|medium|low", "emotional_weight": "what it feels like to experience this", "trigger": "what causes or worsens this"}}
  ],
  "buying_triggers": [
    {{"trigger": "observable signal", "example": "concrete example", "urgency": "high|medium|low"}}
  ],
  "competitors": [
    {{"name": "competitor or category", "positioning": "how they position", "weakness": "exploitable gap"}}
  ],
  "objections": [
    {{"objection": "common objection", "root_cause": "why they really say this", "counter": "most effective response"}}
  ],
  "market_opportunities": [
    {{"opportunity": "specific angle", "reasoning": "why now", "target_profile": "who to go after"}}
  ]
}}

Include 5 trends, 8 pain points, 5 buying triggers, 4 competitors, 5 objections, 3 opportunities."""

    return call_claude_json(SYSTEM, prompt, max_tokens=6000)

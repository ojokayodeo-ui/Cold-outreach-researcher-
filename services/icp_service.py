from services.claude_service import call_claude_json
import json

SYSTEM = """You are a precision ICP (Ideal Customer Profile) strategist for B2B outbound sales.
You build ICPs that are specific enough to filter a prospect list down to the top 5%
most likely to buy. Vague ICPs waste everyone's time — yours are razor-sharp."""

def generate_icp(research: dict, industry: str, geography: str, company_size: str) -> dict:
    prompt = f"""Based on this market research, generate a precise Ideal Customer Profile.

Research context:
{json.dumps(research, indent=2)}

Original inputs: {industry} | {geography} | {company_size}

Return a JSON object with exactly this structure:
{{
  "segment_name": "short memorable name for this ICP segment",
  "segment_description": "2 sentences describing who these companies are",
  "firmographics": {{
    "industries": ["list", "of", "specific", "sub-industries"],
    "employee_range": {{"min": 0, "max": 0}},
    "revenue_range": {{"min": "£Xk", "max": "£Xm", "currency": "GBP"}},
    "company_age_years": {{"min": 0, "max": 0}},
    "geographies": ["list"],
    "business_models": ["consulting", "agency", "SaaS", etc],
    "ownership": ["founder-led", "PE-backed", etc]
  }},
  "technographics": {{
    "likely_tools": ["tools they probably use"],
    "tech_maturity": "low|medium|high",
    "tech_signals": ["observable signals they use certain tech"]
  }},
  "buying_readiness_signals": [
    {{"signal": "observable signal", "where_to_find": "LinkedIn|job boards|news|etc", "strength": "strong|medium|weak"}}
  ],
  "ideal_timing": "when in their business cycle they are most receptive",
  "exclusions": {{
    "who_not_to_target": ["specific exclusion criteria"],
    "red_flags": ["signals that indicate bad fit"],
    "reasoning": "why these exclusions matter"
  }},
  "fit_score_criteria": [
    {{"criterion": "criterion name", "weight": "high|medium|low", "how_to_assess": "how to check this"}}
  ]
}}"""

    return call_claude_json(SYSTEM, prompt, max_tokens=4000)

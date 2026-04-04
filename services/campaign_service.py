from services.claude_service import call_claude_json
import json

SYSTEM = """You are a direct-response copywriting strategist who specialises in cold outreach
campaign architecture. You understand that campaign angle selection is the highest-leverage
decision in outbound sales — the wrong angle produces 0% reply rate, the right one 8%+.

You rank angles ruthlessly based on expected performance, not creativity points."""

def generate_campaign(research: dict, icp: dict, personas: list) -> dict:
    prompt = f"""Design a complete campaign strategy for this target market.

Research summary: {json.dumps(research.get('pain_points', [])[:4], indent=2)}
ICP: {json.dumps(icp.get('firmographics', {}), indent=2)}
Primary persona: {json.dumps(personas[0] if personas else {{}}, indent=2)}

Return a JSON object with exactly this structure:
{{
  "recommended_angles": [
    {{
      "angle_type": "pain-based|opportunity-based|competitor-based|data-driven|curiosity-based|authority-based",
      "angle_name": "memorable name for this angle",
      "core_premise": "the single idea this angle is built on",
      "why_it_works": "specific reasoning for this audience",
      "when_to_use": "timing and context",
      "expected_reply_rate": "X-Y% with brief justification",
      "performance_rank": 1,
      "hook_example": "example opening line using this angle",
      "risk": "what could go wrong with this angle"
    }}
  ],
  "top_recommendation": {{
    "primary_angle": "angle_type",
    "secondary_angle": "angle_type",
    "reasoning": "why these two in combination"
  }},
  "offer_suggestions": [
    {{
      "offer_name": "name",
      "offer_type": "audit|report|call|tool|workshop",
      "description": "what exactly you're offering",
      "friction_level": "low|medium|high",
      "cta_text": "exact CTA wording",
      "best_for": "which persona this works best for"
    }}
  ],
  "lead_magnets": [
    {{
      "name": "lead magnet name",
      "format": "PDF|tool|report|checklist|benchmark",
      "topic": "specific topic",
      "why_they_want_it": "the desire this fulfils"
    }}
  ],
  "campaign_calendar": {{
    "best_send_days": ["Tuesday", "Wednesday", "Thursday"],
    "best_send_times": "suggested time windows",
    "sequence_spacing": "recommended days between emails",
    "follow_up_count": 3
  }}
}}

Include all 6 angle types, ranked 1-6 by expected performance for this specific ICP."""

    return call_claude_json(SYSTEM, prompt, max_tokens=5000)

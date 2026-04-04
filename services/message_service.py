from services.claude_service import call_claude_json
import json

SYSTEM = """You are a cold outreach copywriter whose emails get 8-15% reply rates.
Your writing style is: concise, human, specific, never salesy. You write like a consultant
reaching out to a peer — not a salesperson reaching out to a prospect.

Rules you never break:
- No subject lines with exclamation marks
- No "I hope this finds you well"
- No "I wanted to reach out"
- First email under 100 words body
- Every email has exactly one clear CTA
- Personalisation hooks feel researched, not templated"""

def generate_messages(research: dict, icp: dict, personas: list, campaign: dict, selected_angle: str) -> dict:
    primary_persona = personas[0] if personas else {}
    top_angle = next(
        (a for a in campaign.get("recommended_angles", []) if a["angle_type"] == selected_angle),
        campaign.get("recommended_angles", [{}])[0]
    )
    offer = campaign.get("offer_suggestions", [{}])[0]

    prompt = f"""Write a complete outreach sequence for this campaign.

Target persona: {json.dumps(primary_persona, indent=2)}
Selected angle: {json.dumps(top_angle, indent=2)}
Offer: {json.dumps(offer, indent=2)}
Key pain points: {json.dumps(research.get('pain_points', [])[:3], indent=2)}

Return a JSON object with exactly this structure:
{{
  "email_sequence": [
    {{
      "position": 1,
      "send_day": 1,
      "email_type": "cold open",
      "subject_line": "subject line — no caps spam, under 8 words",
      "preview_text": "preview text that complements subject",
      "body": "full email body — use \\n for line breaks",
      "personalisation_hook": "the specific detail to research per prospect",
      "cta": "exact call to action",
      "word_count": 0,
      "tone_notes": "brief note on the tone/approach of this email"
    }},
    {{
      "position": 2,
      "send_day": 4,
      "email_type": "value add follow-up",
      ...same structure...
    }},
    {{
      "position": 3,
      "send_day": 10,
      "email_type": "soft close",
      ...same structure...
    }},
    {{
      "position": 4,
      "send_day": 18,
      "email_type": "breakup",
      ...same structure...
    }}
  ],
  "linkedin_messages": [
    {{
      "type": "connection request",
      "body": "under 300 characters, no pitch",
      "when_to_send": "before or after email sequence"
    }},
    {{
      "type": "follow-up DM",
      "body": "under 500 characters, references connection",
      "when_to_send": "after connection accepted"
    }}
  ],
  "personalisation_guide": {{
    "research_time_per_prospect": "X minutes",
    "key_signals_to_find": ["list of things to research per prospect"],
    "hook_templates": [
      {{"trigger": "if you find X", "hook": "use this opening"}}
    ]
  }},
  "spam_check": {{
    "spam_trigger_words_avoided": ["list"],
    "estimated_spam_score": "low|medium",
    "deliverability_notes": "any notes"
  }}
}}"""

    return call_claude_json(SYSTEM, prompt, max_tokens=6000)

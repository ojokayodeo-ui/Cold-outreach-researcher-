from services.claude_service import call_claude_json
import json

SYSTEM = """You are a buyer psychology expert who creates deeply realistic B2B buyer personas.
Your personas go beyond demographics — they capture the emotional reality of being this person,
the pressures they face, and the exact language that resonates with them.
Sales teams use your personas to write messages that feel like they were written by someone
who has met the prospect in person."""

def generate_personas(research: dict, icp: dict) -> list:
    prompt = f"""Create 3 detailed buyer personas based on this ICP and research.

ICP:
{json.dumps(icp, indent=2)}

Research:
{json.dumps(research, indent=2)}

Return a JSON array of exactly 3 persona objects, each with this structure:
{{
  "persona_name": "memorable archetype name e.g. 'The Stretched Founder'",
  "avatar_initials": "2 letters for avatar display",
  "role": {{
    "titles": ["CEO", "Managing Director", "Founder", etc],
    "seniority": "C-suite|VP|Director|Manager",
    "reports_to": "board|investors|self",
    "manages": "describe their team"
  }},
  "demographics": {{
    "career_background": "where they came from professionally",
    "years_experience": "range",
    "education": "typical background"
  }},
  "day_in_their_life": "3-4 sentences describing their actual daily reality — specific and vivid",
  "goals": {{
    "primary": "the one thing they need to achieve this year",
    "secondary": ["other goals"],
    "career_ambition": "what they ultimately want"
  }},
  "kpis": ["the metrics they are judged on"],
  "pain_points": {{
    "operational": ["day-to-day friction points"],
    "emotional": ["what keeps them up at night — specific and honest"],
    "status": ["how they want to be perceived vs reality"]
  }},
  "desires": {{
    "immediate": "what they want right now",
    "aspirational": "what success looks like in 3 years"
  }},
  "objections": [
    {{"objection": "exact words they might say", "real_reason": "what's actually behind it"}}
  ],
  "decision_making": {{
    "style": "fast and intuitive|slow and analytical|consensus-driven|etc",
    "process": "how they actually make purchase decisions",
    "blockers": ["what slows decisions down"],
    "champions": ["who else is involved"]
  }},
  "media_consumption": {{
    "platforms": ["where they spend time online"],
    "content_types": ["what content they actually consume"],
    "influencers": ["who they trust"],
    "communities": ["groups or forums they're part of"]
  }},
  "language": {{
    "words_they_use": ["their actual vocabulary"],
    "words_they_hate": ["language that repels them"],
    "resonant_phrases": ["phrases that will land with them"]
  }},
  "buying_trigger": "the specific situation that would make them pick up the phone today"
}}"""

    return call_claude_json(SYSTEM, prompt, max_tokens=6000)

from services.claude_service import call_claude_json
from services.scraper_service import scrape_company_website
import json

SYSTEM = """You are a senior B2B cold outreach strategist. You study a prospect company's website and
produce a hyper-personalized cold outreach report that gives a sales rep everything they need to reach
out to that specific company.

Your reports are precise and specific. Every line references a real detail found on the prospect's
website — never generic filler. You write emails that sound researched, not templated."""


def generate_prospect_report(url: str, pipeline_data: dict = None) -> dict:
    """Scrape a company website and return a personalized cold outreach report."""
    company_data = scrape_company_website(url)

    pipeline_context = ""
    if pipeline_data:
        pain_points = pipeline_data.get('research', {}).get('pain_points', [])[:3]
        angles = [
            a.get('angle_name', '')
            for a in pipeline_data.get('campaign', {}).get('recommended_angles', [])[:3]
        ]
        persona = (pipeline_data.get('personas') or [{}])[0]
        pipeline_context = f"""
You also have access to a pre-built campaign for this target market:
- Top pain points from market research: {json.dumps(pain_points, indent=2)}
- Recommended campaign angles: {json.dumps(angles)}
- Primary buyer persona: {json.dumps(persona, indent=2)}

Cross-reference these with what you find on the company's website to make the outreach even sharper.
"""

    prompt = f"""Generate a fully personalized cold outreach report for this prospect company.

=== SCRAPED WEBSITE DATA ===
URL: {company_data['url']}
Page title: {company_data['title']}
Meta description: {company_data['meta_description']}
H1 headings: {json.dumps(company_data['h1_headings'])}
H2 headings: {json.dumps(company_data['h2_headings'])}
H3 headings: {json.dumps(company_data['h3_headings'])}
Key list items: {json.dumps(company_data['list_items'][:12])}
Main content excerpt: {company_data['main_content'][:2500]}
{pipeline_context}

Return a JSON object with exactly this structure:
{{
  "company_snapshot": {{
    "company_name": "inferred name from title or content",
    "industry": "specific industry they operate in",
    "what_they_do": "2-sentence plain-English summary of their business",
    "company_stage": "early-stage / growth / established / enterprise — best guess",
    "key_offerings": ["list of main products or services mentioned on site"],
    "positioning_statement": "how they position themselves based on their messaging"
  }},
  "outreach_intelligence": {{
    "inferred_pain_points": [
      {{
        "pain": "specific pain point this company likely has",
        "evidence": "exact wording or signal from their website that suggests this",
        "how_to_use": "how to weave this into an email opener or subject line"
      }}
    ],
    "personalized_hooks": [
      {{
        "hook": "specific, non-generic opening line referencing something real on their site",
        "source": "what on their website inspired this hook"
      }}
    ],
    "avoid_these": ["things NOT to say — based on their brand tone, positioning, or values"],
    "best_angle": "which outreach angle would work best for this company and a short explanation why"
  }},
  "personalized_emails": [
    {{
      "email_number": 1,
      "send_day": 1,
      "subject_line": "subject line under 8 words, no exclamation marks, specific to them",
      "preview_text": "preview text that complements the subject",
      "body": "cold open email under 100 words — use \\n for line breaks, references something real from their site",
      "cta": "single clear call to action",
      "personalization_note": "what specific detail makes this uniquely about them"
    }},
    {{
      "email_number": 2,
      "send_day": 4,
      "subject_line": "follow-up subject line",
      "preview_text": "preview text",
      "body": "value-add follow-up under 120 words — adds new insight relevant to their specific context",
      "cta": "single clear call to action",
      "personalization_note": "what specific detail makes this uniquely about them"
    }},
    {{
      "email_number": 3,
      "send_day": 12,
      "subject_line": "soft close subject line",
      "preview_text": "preview text",
      "body": "soft close email under 80 words — references their specific situation, makes it easy to reply",
      "cta": "single clear call to action",
      "personalization_note": "what specific detail makes this uniquely about them"
    }}
  ],
  "linkedin_messages": {{
    "connection_request": "personalised connection note under 300 chars — no pitch, references something specific",
    "follow_up_dm": "follow-up DM under 500 chars for if emails go unanswered — references their work"
  }},
  "research_notes": {{
    "estimated_research_time": "X minutes",
    "additional_research_to_do": [
      "additional things to look up before reaching out — e.g. LinkedIn, news, funding"
    ],
    "key_facts_found": [
      "important facts extracted from their website useful for outreach"
    ]
  }}
}}"""

    return call_claude_json(SYSTEM, prompt, max_tokens=5000)

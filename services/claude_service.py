import anthropic
import json
import os
from typing import Any

client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])
MODEL = "claude-sonnet-4-20250514"

def call_claude(system: str, user: str, max_tokens: int = 4096) -> str:
    message = client.messages.create(
        model=MODEL,
        max_tokens=max_tokens,
        system=system,
        messages=[{"role": "user", "content": user}],
    )
    return message.content[0].text

def call_claude_json(system: str, user: str, max_tokens: int = 4096) -> Any:
    system_with_json = system + "\n\nCRITICAL: Respond ONLY with valid JSON. No markdown, no backticks, no preamble."
    raw = call_claude(system_with_json, user, max_tokens)
    raw = raw.strip()
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    return json.loads(raw.strip())

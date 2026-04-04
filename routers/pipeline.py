from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from services.research_service import generate_research
from services.icp_service import generate_icp
from services.persona_service import generate_personas
from services.campaign_service import generate_campaign
from services.message_service import generate_messages
import json
import asyncio

router = APIRouter()

class PipelineInput(BaseModel):
    industry: str
    geography: str = "United Kingdom"
    company_size: str = "5-50 employees"
    selected_angle: str = "pain-based"

class PipelineResult(BaseModel):
    industry: str
    geography: str
    company_size: str
    research: dict
    icp: dict
    personas: list
    campaign: dict
    messages: dict

@router.post("/run")
async def run_pipeline(input: PipelineInput):
    """Run the full 5-step pipeline. Returns complete campaign package."""
    try:
        research = generate_research(input.industry, input.geography, input.company_size)
        icp = generate_icp(research, input.industry, input.geography, input.company_size)
        personas = generate_personas(research, icp)
        campaign = generate_campaign(research, icp, personas)
        msgs = generate_messages(research, icp, personas, campaign, input.selected_angle)

        return PipelineResult(
            industry=input.industry,
            geography=input.geography,
            company_size=input.company_size,
            research=research,
            icp=icp,
            personas=personas,
            campaign=campaign,
            messages=msgs,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def _stream_pipeline(input: PipelineInput):
    """Generator for SSE streaming — sends each step as it completes."""
    def event(step: str, data: dict):
        return f"data: {json.dumps({'step': step, 'data': data})}\n\n"

    try:
        yield event("status", {"message": "Researching market...", "step": 1, "total": 5})
        research = generate_research(input.industry, input.geography, input.company_size)
        yield event("research", research)

        yield event("status", {"message": "Building ICP...", "step": 2, "total": 5})
        icp = generate_icp(research, input.industry, input.geography, input.company_size)
        yield event("icp", icp)

        yield event("status", {"message": "Creating buyer personas...", "step": 3, "total": 5})
        personas = generate_personas(research, icp)
        yield event("personas", {"personas": personas})

        yield event("status", {"message": "Designing campaign strategy...", "step": 4, "total": 5})
        campaign = generate_campaign(research, icp, personas)
        yield event("campaign", campaign)

        yield event("status", {"message": "Writing outreach messages...", "step": 5, "total": 5})
        msgs = generate_messages(research, icp, personas, campaign, input.selected_angle)
        yield event("messages", msgs)

        yield event("complete", {"message": "Pipeline complete!"})
    except Exception as e:
        yield event("error", {"message": str(e)})

@router.post("/stream")
async def stream_pipeline(input: PipelineInput):
    """Streaming version — frontend receives results step-by-step."""
    return StreamingResponse(
        _stream_pipeline(input),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )

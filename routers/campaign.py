from fastapi import APIRouter
from pydantic import BaseModel
from services.campaign_service import generate_campaign

router = APIRouter()

class CampaignInput(BaseModel):
    research: dict
    icp: dict
    personas: list

@router.post("/generate")
async def campaign(input: CampaignInput):
    return generate_campaign(input.research, input.icp, input.personas)

from fastapi import APIRouter
from pydantic import BaseModel
from services.message_service import generate_messages

router = APIRouter()

class MessagesInput(BaseModel):
    research: dict
    icp: dict
    personas: list
    campaign: dict
    selected_angle: str = "pain-based"

@router.post("/generate")
async def messages(input: MessagesInput):
    return generate_messages(input.research, input.icp, input.personas, input.campaign, input.selected_angle)

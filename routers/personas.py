from fastapi import APIRouter
from pydantic import BaseModel
from services.persona_service import generate_personas

router = APIRouter()

class PersonaInput(BaseModel):
    research: dict
    icp: dict

@router.post("/generate")
async def personas(input: PersonaInput):
    return {"personas": generate_personas(input.research, input.icp)}

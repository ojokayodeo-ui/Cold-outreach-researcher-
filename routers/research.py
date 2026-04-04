from fastapi import APIRouter
from pydantic import BaseModel
from services.research_service import generate_research

router = APIRouter()

class ResearchInput(BaseModel):
    industry: str
    geography: str = "United Kingdom"
    company_size: str = "5-50 employees"

@router.post("/generate")
async def research(input: ResearchInput):
    return generate_research(input.industry, input.geography, input.company_size)

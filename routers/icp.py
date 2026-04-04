from fastapi import APIRouter
from pydantic import BaseModel
from services.icp_service import generate_icp

router = APIRouter()

class ICPInput(BaseModel):
    research: dict
    industry: str
    geography: str
    company_size: str

@router.post("/generate")
async def icp(input: ICPInput):
    return generate_icp(input.research, input.industry, input.geography, input.company_size)

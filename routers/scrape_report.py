from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from services.report_service import generate_prospect_report

router = APIRouter()


class ReportRequest(BaseModel):
    url: str
    pipeline_data: Optional[dict] = None


@router.post("/generate")
async def generate_report(req: ReportRequest):
    """Scrape a prospect's website and return a personalised cold outreach report."""
    try:
        report = generate_prospect_report(req.url, req.pipeline_data)
        return report
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

from uuid import UUID

from fastapi import APIRouter, HTTPException

from app.application.services.report_service import ReportService
from app.core.deps import CurrentUser

router = APIRouter()


@router.get("/client/{interview_id}")
async def generate_client_report(interview_id: UUID, _: CurrentUser):
    service = ReportService()
    markdown = await service.generate_client_report(interview_id)
    if not markdown:
        raise HTTPException(status_code=404, detail="Interview not found")
    return {"markdown": markdown}


@router.get("/agent/{interview_id}")
async def generate_agent_report(interview_id: UUID, _: CurrentUser):
    service = ReportService()
    markdown = await service.generate_agent_report(interview_id)
    if not markdown:
        raise HTTPException(status_code=404, detail="Interview not found")
    return {"markdown": markdown}


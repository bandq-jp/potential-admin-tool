from uuid import UUID

from fastapi import APIRouter, HTTPException

from app.application.dto.job_position import (
    JobPositionCreate,
    JobPositionResponse,
    JobPositionUpdate,
)
from app.application.services.job_position_service import JobPositionService
from app.core.deps import AdminUser, InternalUser

router = APIRouter()


@router.get("", response_model=list[JobPositionResponse])
async def list_job_positions(company_id: UUID | None = None, _: InternalUser = None):
    service = JobPositionService()
    if company_id:
        return await service.get_by_company_id(company_id)
    return await service.get_all()


@router.get("/{position_id}", response_model=JobPositionResponse)
async def get_job_position(position_id: UUID, _: InternalUser):
    service = JobPositionService()
    position = await service.get_by_id(position_id)
    if not position:
        raise HTTPException(status_code=404, detail="Job position not found")
    return position


@router.post("", response_model=JobPositionResponse)
async def create_job_position(data: JobPositionCreate, _: AdminUser):
    service = JobPositionService()
    return await service.create(data)


@router.patch("/{position_id}", response_model=JobPositionResponse)
async def update_job_position(position_id: UUID, data: JobPositionUpdate, _: AdminUser):
    service = JobPositionService()
    position = await service.update(position_id, data)
    if not position:
        raise HTTPException(status_code=404, detail="Job position not found")
    return position

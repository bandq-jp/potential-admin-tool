from uuid import UUID

from fastapi import APIRouter, HTTPException

from app.application.dto.candidate import (
    CandidateCreate,
    CandidateResponse,
    CandidateUpdate,
    CandidateWithRelations,
    FunnelStats,
)
from app.application.services.candidate_service import CandidateService
from app.core.deps import CurrentUser
from app.domain.entities.user import UserRole

router = APIRouter()


@router.get("", response_model=list[CandidateWithRelations])
async def list_candidates(
    company_id: UUID | None = None,
    job_position_id: UUID | None = None,
    agent_id: UUID | None = None,
    owner_user_id: UUID | None = None,
    _: CurrentUser = None,
):
    service = CandidateService()
    return await service.get_all(
        company_id=company_id,
        job_position_id=job_position_id,
        agent_id=agent_id,
        owner_user_id=owner_user_id,
    )


@router.get("/funnel", response_model=FunnelStats)
async def get_funnel_stats(company_id: UUID | None = None, _: CurrentUser = None):
    service = CandidateService()
    return await service.get_funnel_stats(company_id)


@router.get("/{candidate_id}", response_model=CandidateWithRelations)
async def get_candidate(candidate_id: UUID, _: CurrentUser):
    service = CandidateService()
    candidate = await service.get_by_id(candidate_id)
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return candidate


@router.post("", response_model=CandidateResponse)
async def create_candidate(data: CandidateCreate, current_user: CurrentUser):
    service = CandidateService()
    return await service.create(data)


@router.patch("/{candidate_id}", response_model=CandidateResponse)
async def update_candidate(candidate_id: UUID, data: CandidateUpdate, current_user: CurrentUser):
    service = CandidateService()
    candidate = await service.get_by_id(candidate_id)
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")

    if current_user.role != UserRole.ADMIN and candidate.owner_user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to edit this candidate")

    updated = await service.update(candidate_id, data)
    return updated


@router.delete("/{candidate_id}")
async def delete_candidate(candidate_id: UUID, current_user: CurrentUser):
    service = CandidateService()
    candidate = await service.get_by_id(candidate_id)
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")

    if current_user.role != UserRole.ADMIN and candidate.owner_user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this candidate")

    result = await service.delete(candidate_id)
    if not result:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return {"message": "Candidate deleted"}


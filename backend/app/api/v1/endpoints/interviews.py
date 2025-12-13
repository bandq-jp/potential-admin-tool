from uuid import UUID

from fastapi import APIRouter, HTTPException

from app.application.dto.interview import (
    InterviewCreate,
    InterviewDetailCreate,
    InterviewDetailResponse,
    InterviewQuestionResponseCreate,
    InterviewQuestionResponseDTO,
    InterviewQuestionResponseUpdate,
    InterviewResponse,
    InterviewUpdate,
    InterviewWithDetails,
)
from app.application.services.candidate_service import CandidateService
from app.application.services.interview_service import InterviewService
from app.core.deps import InternalUser
from app.domain.entities.user import UserRole

router = APIRouter()


async def check_candidate_access(candidate_id: UUID, current_user: InternalUser):
    service = CandidateService()
    candidate = await service.get_by_id(candidate_id)
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    if current_user.role != UserRole.ADMIN and candidate.owner_user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    return candidate


@router.get("/by-candidate/{candidate_id}", response_model=InterviewWithDetails | None)
async def get_interview_by_candidate(candidate_id: UUID, _: InternalUser):
    service = InterviewService()
    return await service.get_by_candidate_id(candidate_id)


@router.get("/{interview_id}", response_model=InterviewWithDetails)
async def get_interview(interview_id: UUID, _: InternalUser):
    service = InterviewService()
    interview = await service.get_by_id(interview_id)
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")
    return interview


@router.post("", response_model=InterviewResponse)
async def create_interview(data: InterviewCreate, current_user: InternalUser):
    await check_candidate_access(data.candidate_id, current_user)
    service = InterviewService()
    return await service.create(data)


@router.patch("/{interview_id}", response_model=InterviewResponse)
async def update_interview(interview_id: UUID, data: InterviewUpdate, current_user: InternalUser):
    service = InterviewService()
    interview = await service.get_by_id(interview_id)
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")

    await check_candidate_access(interview.candidate_id, current_user)
    updated = await service.update(interview_id, data)
    return updated


@router.post("/{interview_id}/details", response_model=list[InterviewDetailResponse])
async def save_interview_details(
    interview_id: UUID,
    details: list[InterviewDetailCreate],
    current_user: InternalUser,
):
    service = InterviewService()
    interview = await service.get_by_id(interview_id)
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")

    await check_candidate_access(interview.candidate_id, current_user)
    return await service.save_details(interview_id, details)


@router.post("/{interview_id}/questions", response_model=InterviewQuestionResponseDTO)
async def add_question_response(
    interview_id: UUID,
    data: InterviewQuestionResponseCreate,
    current_user: InternalUser,
):
    service = InterviewService()
    interview = await service.get_by_id(interview_id)
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")

    await check_candidate_access(interview.candidate_id, current_user)
    return await service.add_question_response(interview_id, data)


@router.patch("/questions/{question_id}", response_model=InterviewQuestionResponseDTO)
async def update_question_response(
    question_id: UUID,
    data: InterviewQuestionResponseUpdate,
    _: InternalUser,
):
    service = InterviewService()
    updated = await service.update_question_response(question_id, data)
    if not updated:
        raise HTTPException(status_code=404, detail="Question response not found")
    return updated


@router.delete("/questions/{question_id}")
async def delete_question_response(question_id: UUID, _: InternalUser):
    service = InterviewService()
    result = await service.delete_question_response(question_id)
    if not result:
        raise HTTPException(status_code=404, detail="Question response not found")
    return {"message": "Question response deleted"}

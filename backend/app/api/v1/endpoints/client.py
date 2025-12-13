from uuid import UUID

from fastapi import APIRouter, HTTPException

from app.application.dto.candidate import ClientCandidateWithRelations
from app.application.dto.criteria import CriteriaGroupWithItems
from app.application.dto.interview import (
    ClientInterviewDetailResponse,
    ClientInterviewQuestionResponseDTO,
    ClientInterviewWithDetails,
)
from app.application.dto.job_position import JobPositionResponse
from app.application.services.candidate_service import CandidateService
from app.application.services.criteria_service import CriteriaService
from app.application.services.interview_service import InterviewService
from app.application.services.job_position_service import JobPositionService
from app.application.services.report_service import ReportService
from app.core.deps import CurrentUser
from app.domain.entities.user import UserRole
from app.infrastructure.repositories.company_repository import CompanyRepository

router = APIRouter()


def require_client(current_user: CurrentUser) -> UUID:
    if current_user.role != UserRole.CLIENT:
        raise HTTPException(status_code=403, detail="Client access required")
    if current_user.company_id is None:
        raise HTTPException(status_code=403, detail="Client user is not associated with a company")
    return current_user.company_id


@router.get("/me")
async def get_client_me(current_user: CurrentUser):
    company_id = require_client(current_user)
    company_repo = CompanyRepository()
    company = await company_repo.find_by_id(company_id)
    return {
        "company_id": company_id,
        "company_name": company.name if company else "-",
        "user_name": company.name if company else current_user.name,
        "email": current_user.email,
    }


@router.get("/candidates", response_model=list[ClientCandidateWithRelations])
async def list_client_candidates(current_user: CurrentUser):
    company_id = require_client(current_user)
    service = CandidateService()
    candidates = await service.get_all(company_id=company_id)
    return [ClientCandidateWithRelations(**c.model_dump()) for c in candidates]


@router.get("/candidates/{candidate_id}", response_model=ClientCandidateWithRelations)
async def get_client_candidate(candidate_id: UUID, current_user: CurrentUser):
    company_id = require_client(current_user)
    service = CandidateService()
    candidate = await service.get_by_id(candidate_id)
    if not candidate or candidate.company_id != company_id:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return ClientCandidateWithRelations(**candidate.model_dump())


@router.get("/job-positions", response_model=list[JobPositionResponse])
async def list_client_job_positions(current_user: CurrentUser):
    company_id = require_client(current_user)
    service = JobPositionService()
    return await service.get_by_company_id(company_id)


@router.get("/criteria/groups/with-items", response_model=list[CriteriaGroupWithItems])
async def list_client_criteria_groups_with_items(job_position_id: UUID, current_user: CurrentUser):
    company_id = require_client(current_user)
    position_service = JobPositionService()
    position = await position_service.get_by_id(job_position_id)
    if not position or position.company_id != company_id:
        raise HTTPException(status_code=404, detail="Job position not found")

    service = CriteriaService()
    return await service.get_groups_with_items(job_position_id)


@router.get(
    "/interviews/by-candidate/{candidate_id}",
    response_model=ClientInterviewWithDetails | None,
)
async def get_client_interview_by_candidate(candidate_id: UUID, current_user: CurrentUser):
    company_id = require_client(current_user)

    candidate_service = CandidateService()
    candidate = await candidate_service.get_by_id(candidate_id)
    if not candidate or candidate.company_id != company_id:
        raise HTTPException(status_code=404, detail="Candidate not found")

    service = InterviewService()
    interview = await service.get_by_candidate_id(candidate_id)
    if not interview:
        return None

    details = [ClientInterviewDetailResponse(**d.model_dump()) for d in interview.details]
    highlighted_qrs = [
        ClientInterviewQuestionResponseDTO(**q.model_dump())
        for q in interview.question_responses
        if q.is_highlight
    ]

    base = interview.model_dump(exclude={"details", "question_responses"})
    return ClientInterviewWithDetails(
        **base,
        details=details,
        question_responses=highlighted_qrs,
    )


@router.get("/reports/{interview_id}")
async def get_client_report(interview_id: UUID, current_user: CurrentUser):
    company_id = require_client(current_user)

    interview_service = InterviewService()
    interview = await interview_service.get_by_id(interview_id)
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")

    candidate_service = CandidateService()
    candidate = await candidate_service.get_by_id(interview.candidate_id)
    if not candidate or candidate.company_id != company_id:
        raise HTTPException(status_code=404, detail="Interview not found")

    report_service = ReportService()
    markdown = await report_service.generate_client_report(interview_id)
    if not markdown:
        raise HTTPException(status_code=404, detail="Interview not found")
    return {"markdown": markdown}

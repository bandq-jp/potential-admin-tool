from datetime import datetime, timezone
from uuid import UUID, uuid4

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
from app.domain.entities.interview import Interview, InterviewDetail, InterviewQuestionResponse
from app.infrastructure.repositories.interview_repository import (
    InterviewDetailRepository,
    InterviewQuestionResponseRepository,
    InterviewRepository,
)


class InterviewService:
    def __init__(self):
        self.repository = InterviewRepository()
        self.detail_repository = InterviewDetailRepository()
        self.qr_repository = InterviewQuestionResponseRepository()

    async def get_by_id(self, id: UUID) -> InterviewWithDetails | None:
        interview = await self.repository.find_by_id(id)
        if not interview:
            return None

        details = await self.detail_repository.find_by_interview_id(id)
        qrs = await self.qr_repository.find_by_interview_id(id)

        return InterviewWithDetails(
            **interview.model_dump(),
            details=[InterviewDetailResponse.model_validate(d.model_dump()) for d in details],
            question_responses=[InterviewQuestionResponseDTO.model_validate(q.model_dump()) for q in qrs],
        )

    async def get_by_candidate_id(self, candidate_id: UUID) -> InterviewWithDetails | None:
        interview = await self.repository.find_by_candidate_id(candidate_id)
        if not interview:
            return None

        details = await self.detail_repository.find_by_interview_id(interview.id)
        qrs = await self.qr_repository.find_by_interview_id(interview.id)

        return InterviewWithDetails(
            **interview.model_dump(),
            details=[InterviewDetailResponse.model_validate(d.model_dump()) for d in details],
            question_responses=[InterviewQuestionResponseDTO.model_validate(q.model_dump()) for q in qrs],
        )

    async def create(self, data: InterviewCreate) -> InterviewResponse:
        now = datetime.now(timezone.utc)
        interview = Interview(
            id=uuid4(),
            candidate_id=data.candidate_id,
            interviewer_id=data.interviewer_id,
            interview_date=data.interview_date,
            created_at=now,
            updated_at=now,
        )
        created = await self.repository.create(interview)
        return InterviewResponse.model_validate(created.model_dump())

    async def update(self, id: UUID, data: InterviewUpdate) -> InterviewResponse | None:
        interview = await self.repository.find_by_id(id)
        if not interview:
            return None

        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(interview, key, value)
        interview.updated_at = datetime.now(timezone.utc)

        updated = await self.repository.update(interview)
        return InterviewResponse.model_validate(updated.model_dump())

    async def save_details(
        self, interview_id: UUID, details: list[InterviewDetailCreate]
    ) -> list[InterviewDetailResponse]:
        now = datetime.now(timezone.utc)
        entities = []
        for d in details:
            entities.append(
                InterviewDetail(
                    id=uuid4(),
                    interview_id=interview_id,
                    criteria_item_id=d.criteria_item_id,
                    score_value=d.score_value,
                    comment_external=d.comment_external,
                    comment_internal=d.comment_internal,
                    created_at=now,
                    updated_at=now,
                )
            )
        saved = await self.detail_repository.bulk_upsert(entities)
        return [InterviewDetailResponse.model_validate(s.model_dump()) for s in saved]

    async def add_question_response(
        self, interview_id: UUID, data: InterviewQuestionResponseCreate
    ) -> InterviewQuestionResponseDTO:
        now = datetime.now(timezone.utc)
        qr = InterviewQuestionResponse(
            id=uuid4(),
            interview_id=interview_id,
            criteria_item_id=data.criteria_item_id,
            question_text=data.question_text,
            answer_summary=data.answer_summary,
            hypothesis_text=data.hypothesis_text,
            transcript_reference=data.transcript_reference,
            is_highlight=data.is_highlight,
            created_at=now,
            updated_at=now,
        )
        created = await self.qr_repository.create(qr)
        return InterviewQuestionResponseDTO.model_validate(created.model_dump())

    async def update_question_response(
        self, id: UUID, data: InterviewQuestionResponseUpdate
    ) -> InterviewQuestionResponseDTO | None:
        existing = await self.qr_repository.find_by_interview_id(id)
        qr = next((q for q in existing if q.id == id), None)
        if not qr:
            return None

        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(qr, key, value)
        qr.updated_at = datetime.now(timezone.utc)

        updated = await self.qr_repository.update(qr)
        return InterviewQuestionResponseDTO.model_validate(updated.model_dump())

    async def delete_question_response(self, id: UUID) -> bool:
        return await self.qr_repository.delete(id)


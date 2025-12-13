from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class InterviewCreate(BaseModel):
    candidate_id: UUID
    interviewer_id: UUID
    interview_date: date


class InterviewUpdate(BaseModel):
    interview_date: date | None = None
    overall_comment_external: str | None = None
    overall_comment_internal: str | None = None
    will_text_external: str | None = None
    will_text_internal: str | None = None
    attract_text_external: str | None = None
    attract_text_internal: str | None = None
    transcript_raw_text: str | None = None
    transcript_source: str | None = None
    transcript_url: str | None = None


class InterviewResponse(BaseModel):
    id: UUID
    candidate_id: UUID
    interviewer_id: UUID
    interview_date: date
    overall_comment_external: str | None
    overall_comment_internal: str | None
    will_text_external: str | None
    will_text_internal: str | None
    attract_text_external: str | None
    attract_text_internal: str | None
    transcript_raw_text: str | None
    transcript_source: str | None
    transcript_url: str | None
    client_report_markdown: str | None
    agent_report_markdown: str | None
    created_at: datetime
    updated_at: datetime


class InterviewDetailCreate(BaseModel):
    criteria_item_id: UUID
    score_value: int
    comment_external: str | None = None
    comment_internal: str | None = None


class InterviewDetailResponse(BaseModel):
    id: UUID
    interview_id: UUID
    criteria_item_id: UUID
    score_value: int
    comment_external: str | None
    comment_internal: str | None
    created_at: datetime
    updated_at: datetime


class InterviewQuestionResponseCreate(BaseModel):
    criteria_item_id: UUID | None = None
    question_text: str
    answer_summary: str | None = None
    hypothesis_text: str | None = None
    transcript_reference: str | None = None
    is_highlight: bool = False


class InterviewQuestionResponseUpdate(BaseModel):
    criteria_item_id: UUID | None = None
    question_text: str | None = None
    answer_summary: str | None = None
    hypothesis_text: str | None = None
    transcript_reference: str | None = None
    is_highlight: bool | None = None


class InterviewQuestionResponseDTO(BaseModel):
    id: UUID
    interview_id: UUID
    criteria_item_id: UUID | None
    question_text: str
    answer_summary: str | None
    hypothesis_text: str | None
    transcript_reference: str | None
    is_highlight: bool
    created_at: datetime
    updated_at: datetime


class InterviewWithDetails(InterviewResponse):
    details: list[InterviewDetailResponse]
    question_responses: list[InterviewQuestionResponseDTO]


# Client-facing (external) DTOs
class ClientInterviewDetailResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: UUID
    interview_id: UUID
    criteria_item_id: UUID
    score_value: int
    comment_external: str | None
    created_at: datetime
    updated_at: datetime


class ClientInterviewQuestionResponseDTO(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: UUID
    interview_id: UUID
    criteria_item_id: UUID | None
    question_text: str
    answer_summary: str | None
    transcript_reference: str | None
    is_highlight: bool
    created_at: datetime
    updated_at: datetime


class ClientInterviewResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: UUID
    candidate_id: UUID
    interview_date: date
    overall_comment_external: str | None
    will_text_external: str | None
    attract_text_external: str | None
    transcript_raw_text: str | None
    transcript_source: str | None
    transcript_url: str | None
    client_report_markdown: str | None
    created_at: datetime
    updated_at: datetime


class ClientInterviewWithDetails(ClientInterviewResponse):
    details: list[ClientInterviewDetailResponse]
    question_responses: list[ClientInterviewQuestionResponseDTO]


class ReportGenerateRequest(BaseModel):
    report_type: str  # "client" or "agent"

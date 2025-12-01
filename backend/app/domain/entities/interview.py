from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel


class Interview(BaseModel):
    id: UUID
    candidate_id: UUID
    interviewer_id: UUID
    interview_date: date

    overall_comment_external: str | None = None
    overall_comment_internal: str | None = None

    will_text_external: str | None = None
    will_text_internal: str | None = None
    attract_text_external: str | None = None
    attract_text_internal: str | None = None

    transcript_raw_text: str | None = None
    transcript_source: str | None = None
    transcript_url: str | None = None

    client_report_markdown: str | None = None
    agent_report_markdown: str | None = None

    created_at: datetime
    updated_at: datetime


class InterviewDetail(BaseModel):
    id: UUID
    interview_id: UUID
    criteria_item_id: UUID
    score_value: int  # 1-4 (× = 1, △ = 2, ◯ = 3, ◎ = 4)
    comment_external: str | None = None
    comment_internal: str | None = None
    created_at: datetime
    updated_at: datetime


class InterviewQuestionResponse(BaseModel):
    id: UUID
    interview_id: UUID
    criteria_item_id: UUID | None = None
    question_text: str
    answer_summary: str | None = None
    hypothesis_text: str | None = None
    transcript_reference: str | None = None
    is_highlight: bool = False
    created_at: datetime
    updated_at: datetime


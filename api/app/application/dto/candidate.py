from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel

from app.domain.entities.candidate import FinalStageResult, HireStatus, StageResult


class CandidateCreate(BaseModel):
    company_id: UUID
    job_position_id: UUID
    agent_id: UUID | None = None
    name: str
    resume_url: str | None = None
    owner_user_id: UUID
    note: str | None = None


class CandidateUpdate(BaseModel):
    job_position_id: UUID | None = None
    agent_id: UUID | None = None
    name: str | None = None
    resume_url: str | None = None
    owner_user_id: UUID | None = None
    note: str | None = None
    stage_0_5_result: StageResult | None = None
    stage_first_result: StageResult | None = None
    stage_second_result: StageResult | None = None
    stage_final_result: FinalStageResult | None = None
    hire_status: HireStatus | None = None
    mismatch_flag: bool | None = None
    stage_0_5_date: date | None = None
    stage_first_date: date | None = None
    stage_final_decision_date: date | None = None


class CandidateResponse(BaseModel):
    id: UUID
    company_id: UUID
    job_position_id: UUID
    agent_id: UUID | None
    name: str
    resume_url: str | None
    owner_user_id: UUID
    note: str | None
    stage_0_5_result: StageResult
    stage_first_result: StageResult
    stage_second_result: StageResult
    stage_final_result: FinalStageResult
    hire_status: HireStatus
    mismatch_flag: bool
    stage_0_5_date: date | None
    stage_first_date: date | None
    stage_final_decision_date: date | None
    created_at: datetime
    updated_at: datetime


class CandidateWithRelations(CandidateResponse):
    company_name: str | None = None
    job_position_name: str | None = None
    agent_company_name: str | None = None
    agent_contact_name: str | None = None
    owner_user_name: str | None = None


class CandidateFilter(BaseModel):
    company_id: UUID | None = None
    job_position_id: UUID | None = None
    agent_id: UUID | None = None
    owner_user_id: UUID | None = None
    stage_0_5_result: StageResult | None = None
    stage_final_result: FinalStageResult | None = None


class FunnelStats(BaseModel):
    total: int
    stage_0_5_done: int
    stage_0_5_passed: int
    stage_first_done: int
    stage_first_passed: int
    stage_second_done: int
    stage_second_passed: int
    stage_final_done: int
    stage_final_offer: int
    hired: int
    mismatch: int


class MonthlyStats(BaseModel):
    active_candidates: int
    hired: int
    mismatch: int
    stage_0_5_done: int
    stage_0_5_passed: int


class DashboardStats(BaseModel):
    active_candidates: int
    pending_interviews: int
    hired_this_month: int
    mismatch_count: int
    stage_0_5_pass_rate: float
    stage_0_5_done_count: int
    current_month: MonthlyStats
    previous_month: MonthlyStats
    active_trend_percent: float | None
    hired_trend_percent: float | None


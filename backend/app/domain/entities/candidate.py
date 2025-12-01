from datetime import date, datetime
from enum import Enum
from uuid import UUID

from pydantic import BaseModel


class StageResult(str, Enum):
    NOT_DONE = "not_done"
    PASSED = "passed"
    REJECTED = "rejected"


class FinalStageResult(str, Enum):
    NOT_DONE = "not_done"
    OFFER = "offer"
    REJECTED = "rejected"
    DECLINED = "declined"


class HireStatus(str, Enum):
    UNDECIDED = "undecided"
    HIRED = "hired"
    OFFER_DECLINED = "offer_declined"


class Candidate(BaseModel):
    id: UUID
    company_id: UUID
    job_position_id: UUID
    agent_id: UUID | None = None
    name: str
    resume_url: str | None = None
    owner_user_id: UUID
    note: str | None = None

    stage_0_5_result: StageResult = StageResult.NOT_DONE
    stage_first_result: StageResult = StageResult.NOT_DONE
    stage_second_result: StageResult = StageResult.NOT_DONE
    stage_final_result: FinalStageResult = FinalStageResult.NOT_DONE
    hire_status: HireStatus = HireStatus.UNDECIDED
    mismatch_flag: bool = False

    stage_0_5_date: date | None = None
    stage_first_date: date | None = None
    stage_final_decision_date: date | None = None

    created_at: datetime
    updated_at: datetime
    deleted_flag: bool = False


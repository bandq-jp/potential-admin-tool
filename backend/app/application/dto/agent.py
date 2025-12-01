from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr


class AgentCreate(BaseModel):
    company_name: str
    contact_name: str
    contact_email: EmailStr | None = None
    note: str | None = None


class AgentUpdate(BaseModel):
    company_name: str | None = None
    contact_name: str | None = None
    contact_email: EmailStr | None = None
    note: str | None = None


class AgentResponse(BaseModel):
    id: UUID
    company_name: str
    contact_name: str
    contact_email: EmailStr | None
    note: str | None
    created_at: datetime
    updated_at: datetime


class AgentStats(BaseModel):
    id: UUID
    company_name: str
    contact_name: str
    referral_count: int
    stage_0_5_pass_rate: float
    final_offer_rate: float
    mismatch_rate: float


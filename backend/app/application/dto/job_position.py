from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class JobPositionCreate(BaseModel):
    company_id: UUID
    name: str
    description: str | None = None
    is_active: bool = True


class JobPositionUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    is_active: bool | None = None


class JobPositionResponse(BaseModel):
    id: UUID
    company_id: UUID
    name: str
    description: str | None
    is_active: bool
    created_at: datetime
    updated_at: datetime


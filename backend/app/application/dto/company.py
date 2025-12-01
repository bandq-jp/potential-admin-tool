from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class CompanyCreate(BaseModel):
    name: str
    note: str | None = None


class CompanyUpdate(BaseModel):
    name: str | None = None
    note: str | None = None


class CompanyResponse(BaseModel):
    id: UUID
    name: str
    note: str | None
    created_at: datetime
    updated_at: datetime


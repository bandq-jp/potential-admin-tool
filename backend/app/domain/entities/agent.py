from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr


class Agent(BaseModel):
    id: UUID
    company_name: str
    contact_name: str
    contact_email: EmailStr | None = None
    note: str | None = None
    created_at: datetime
    updated_at: datetime
    deleted_flag: bool = False


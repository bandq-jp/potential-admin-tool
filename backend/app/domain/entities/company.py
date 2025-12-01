from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class Company(BaseModel):
    id: UUID
    name: str
    note: str | None = None
    created_at: datetime
    updated_at: datetime
    deleted_flag: bool = False


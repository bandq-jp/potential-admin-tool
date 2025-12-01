from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class CriteriaGroup(BaseModel):
    id: UUID
    job_position_id: UUID
    label: str
    description: str | None = None
    sort_order: int = 0
    created_at: datetime
    updated_at: datetime
    deleted_flag: bool = False


class CriteriaItem(BaseModel):
    id: UUID
    criteria_group_id: UUID
    label: str
    description: str | None = None
    behavior_examples_text: str | None = None
    sort_order: int = 0
    is_active: bool = True
    created_at: datetime
    updated_at: datetime


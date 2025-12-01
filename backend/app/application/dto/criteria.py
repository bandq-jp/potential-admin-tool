from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class CriteriaGroupCreate(BaseModel):
    job_position_id: UUID
    label: str
    description: str | None = None
    sort_order: int = 0


class CriteriaGroupUpdate(BaseModel):
    label: str | None = None
    description: str | None = None
    sort_order: int | None = None


class CriteriaGroupResponse(BaseModel):
    id: UUID
    job_position_id: UUID
    label: str
    description: str | None
    sort_order: int
    created_at: datetime
    updated_at: datetime


class CriteriaItemCreate(BaseModel):
    criteria_group_id: UUID
    label: str
    description: str | None = None
    behavior_examples_text: str | None = None
    sort_order: int = 0
    is_active: bool = True


class CriteriaItemUpdate(BaseModel):
    label: str | None = None
    description: str | None = None
    behavior_examples_text: str | None = None
    sort_order: int | None = None
    is_active: bool | None = None


class CriteriaItemResponse(BaseModel):
    id: UUID
    criteria_group_id: UUID
    label: str
    description: str | None
    behavior_examples_text: str | None
    sort_order: int
    is_active: bool
    created_at: datetime
    updated_at: datetime


class CriteriaGroupWithItems(BaseModel):
    id: UUID
    job_position_id: UUID
    label: str
    description: str | None
    sort_order: int
    items: list[CriteriaItemResponse]


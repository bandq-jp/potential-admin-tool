from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr

from app.domain.entities.user import UserRole


class UserCreate(BaseModel):
    clerk_id: str
    name: str
    email: EmailStr
    role: UserRole = UserRole.INTERVIEWER
    company_id: UUID | None = None


class UserUpdate(BaseModel):
    name: str | None = None
    role: UserRole | None = None
    company_id: UUID | None = None


class UserResponse(BaseModel):
    id: UUID
    clerk_id: str
    name: str
    email: EmailStr
    role: UserRole
    company_id: UUID | None = None
    created_at: datetime
    updated_at: datetime

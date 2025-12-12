from datetime import datetime
from enum import Enum
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, EmailStr


class UserRole(str, Enum):
    ADMIN = "admin"
    INTERVIEWER = "interviewer"
    CLIENT = "client"


class User(BaseModel):
    id: UUID
    clerk_id: str
    name: str
    email: EmailStr
    role: UserRole
    company_id: Optional[UUID] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class UserCreate(BaseModel):
    clerk_id: str
    name: str
    email: EmailStr
    role: UserRole = UserRole.INTERVIEWER
    company_id: Optional[UUID] = None

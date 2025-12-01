from datetime import datetime
from enum import Enum
from uuid import UUID

from pydantic import BaseModel, EmailStr


class UserRole(str, Enum):
    ADMIN = "admin"
    INTERVIEWER = "interviewer"


class User(BaseModel):
    id: UUID
    clerk_id: str
    name: str
    email: EmailStr
    role: UserRole
    created_at: datetime
    updated_at: datetime


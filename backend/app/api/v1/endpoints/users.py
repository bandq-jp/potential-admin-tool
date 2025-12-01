from uuid import UUID

from fastapi import APIRouter, HTTPException

from app.application.dto.user import UserCreate, UserResponse, UserUpdate
from app.core.deps import AdminUser, CurrentUser
from app.domain.entities.user import User
from app.infrastructure.repositories.user_repository import UserRepository

router = APIRouter()


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: CurrentUser):
    return UserResponse.model_validate(current_user.model_dump())


@router.get("", response_model=list[UserResponse])
async def list_users(_: AdminUser):
    repo = UserRepository()
    users = await repo.find_all()
    return [UserResponse.model_validate(u.model_dump()) for u in users]


@router.post("", response_model=UserResponse)
async def create_user(data: UserCreate, _: AdminUser):
    from datetime import datetime, timezone
    from uuid import uuid4

    repo = UserRepository()
    now = datetime.now(timezone.utc)
    user = User(
        id=uuid4(),
        clerk_id=data.clerk_id,
        name=data.name,
        email=data.email,
        role=data.role,
        created_at=now,
        updated_at=now,
    )
    created = await repo.create(user)
    return UserResponse.model_validate(created.model_dump())


@router.patch("/{user_id}", response_model=UserResponse)
async def update_user(user_id: UUID, data: UserUpdate, _: AdminUser):
    from datetime import datetime, timezone

    repo = UserRepository()
    user = await repo.find_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(user, key, value)
    user.updated_at = datetime.now(timezone.utc)

    updated = await repo.update(user)
    return UserResponse.model_validate(updated.model_dump())


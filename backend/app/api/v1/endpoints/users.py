from uuid import UUID

from fastapi import APIRouter, HTTPException

from app.application.dto.user import UserCreate, UserResponse, UserUpdate
from app.core.deps import AdminUser, CurrentUser
from app.domain.entities.user import User
from app.core.deps import is_allowed_email_domain
from app.domain.entities.user import UserRole
from app.infrastructure.repositories.company_repository import CompanyRepository
from app.infrastructure.repositories.user_repository import UserRepository

router = APIRouter()


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: CurrentUser):
    return UserResponse.model_validate(current_user.model_dump())


@router.get("", response_model=list[UserResponse])
async def list_users(_: AdminUser):
    repo = UserRepository()
    users = await repo.find_all()
    company_repo = CompanyRepository()
    company_cache: dict[str, str] = {}

    result: list[UserResponse] = []
    for u in users:
        if u.role == UserRole.CLIENT and u.company_id:
            company_id = str(u.company_id)
            if company_id not in company_cache:
                company = await company_repo.find_by_id(u.company_id)
                company_cache[company_id] = company.name if company else u.name
            u.name = company_cache[company_id]
        result.append(UserResponse.model_validate(u.model_dump()))
    return result


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
        company_id=data.company_id,
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

    # Safeguards: internal roles must be @bandq.jp, client role must have company_id.
    if user.role in (UserRole.ADMIN, UserRole.INTERVIEWER) and not is_allowed_email_domain(user.email):
        raise HTTPException(
            status_code=400,
            detail="Only @bandq.jp users can be admin/interviewer.",
        )
    if user.role == UserRole.CLIENT and user.company_id is None:
        raise HTTPException(
            status_code=400,
            detail="Client users must be associated with a company.",
        )
    if user.role == UserRole.CLIENT and user.company_id is not None:
        company_repo = CompanyRepository()
        company = await company_repo.find_by_id(user.company_id)
        if not company:
            raise HTTPException(status_code=400, detail="Company not found for client user.")
        user.name = company.name

    updated = await repo.update(user)
    return UserResponse.model_validate(updated.model_dump())

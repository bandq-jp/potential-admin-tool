from uuid import UUID, uuid4

from fastapi import APIRouter, Depends, HTTPException
import httpx
from pydantic import BaseModel, EmailStr

from app.application.dto.company import CompanyCreate, CompanyResponse, CompanyUpdate
from app.application.services.company_service import CompanyService
from app.core.deps import AdminUser, InternalUser
from app.core.config import Settings, get_settings
from app.domain.entities.user import User, UserRole
from app.infrastructure.repositories.user_repository import UserRepository

router = APIRouter()


class CompanyInviteRequest(BaseModel):
    email: EmailStr


@router.get("", response_model=list[CompanyResponse])
async def list_companies(_: InternalUser):
    service = CompanyService()
    return await service.get_all()


@router.get("/{company_id}", response_model=CompanyResponse)
async def get_company(company_id: UUID, _: InternalUser):
    service = CompanyService()
    company = await service.get_by_id(company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return company


@router.post("", response_model=CompanyResponse)
async def create_company(data: CompanyCreate, _: AdminUser):
    service = CompanyService()
    return await service.create(data)


@router.patch("/{company_id}", response_model=CompanyResponse)
async def update_company(company_id: UUID, data: CompanyUpdate, _: AdminUser):
    service = CompanyService()
    company = await service.update(company_id, data)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return company


@router.delete("/{company_id}")
async def delete_company(company_id: UUID, _: AdminUser):
    service = CompanyService()
    result = await service.delete(company_id)
    if not result:
        raise HTTPException(status_code=404, detail="Company not found")
    return {"message": "Company deleted"}


@router.post("/{company_id}/invite")
async def invite_company_user(
    company_id: UUID,
    data: CompanyInviteRequest,
    _: AdminUser,
    settings: Settings = Depends(get_settings),
):
    invited_email = data.email.lower()
    service = CompanyService()
    company = await service.get_by_id(company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    if not settings.clerk_secret_key:
        raise HTTPException(status_code=500, detail="CLERK_SECRET_KEY is not configured")

    # When a redirect URL is set for an invitation, Clerk will send the user there to accept it.
    # We point to our SignUp page which contains the Clerk <SignUp /> component.
    redirect_url = f"{settings.frontend_base_url.rstrip('/')}/sign-up"

    payload = {
        "email_address": invited_email,
        "redirect_url": redirect_url,
        "public_metadata": {"role": "client", "company_id": str(company_id)},
        "notify": True,
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://api.clerk.com/v1/invitations",
            headers={"Authorization": f"Bearer {settings.clerk_secret_key}"},
            json=payload,
        )

    if response.status_code >= 400:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to create invitation: {response.text}",
        )

    invitation = response.json()

    # Pre-provision an invite-only client user in Supabase so the app can link the Clerk account by email later.
    user_repo = UserRepository()
    existing = await user_repo.find_by_email(invited_email)
    if existing:
        if existing.role != UserRole.CLIENT:
            raise HTTPException(status_code=400, detail="This email is already used by a non-client user.")
        if existing.company_id and existing.company_id != company_id:
            raise HTTPException(status_code=400, detail="This client user is already associated with another company.")
        if existing.company_id is None:
            existing.company_id = company_id
        if existing.name != company.name:
            existing.name = company.name
        await user_repo.update(existing)
    else:
        invitation_id = invitation.get("id") or uuid4()
        placeholder_clerk_id = f"invitation:{invitation_id}"
        invited_user = User(
            id=uuid4(),
            clerk_id=placeholder_clerk_id,
            name=company.name,
            email=invited_email,
            role=UserRole.CLIENT,
            company_id=company_id,
        )
        await user_repo.create(invited_user)

    return invitation

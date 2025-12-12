from uuid import UUID

from fastapi import APIRouter, HTTPException

from app.application.dto.company import CompanyCreate, CompanyResponse, CompanyUpdate
from app.application.services.company_service import CompanyService
from app.core.deps import AdminUser, InternalUser

router = APIRouter()


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
